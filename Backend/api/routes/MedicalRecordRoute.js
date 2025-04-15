import express from 'express';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import {
  getAllMedicalRecords,
  getMedicalRecordById,
  getPatientMedicalRecords,
  getDoctorMedicalRecords,
  createMedicalRecord,
  updateMedicalRecord,
  deleteMedicalRecord,
  addAttachment,
  getMedicalRecordsStats
} from '../controllers/MedicalRecordController.js';
import { protect, authorize } from '../middleware/authMiddleware.js';

const router = express.Router();

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    // Ensure directory exists
    const dir = path.join(process.cwd(), 'uploads', 'medical-records');
    fs.mkdirSync(dir, { recursive: true });
    cb(null, dir);
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const safeFilename = file.originalname.replace(/[^a-zA-Z0-9.]/g, '_');
    cb(null, `${path.parse(safeFilename).name}-${uniqueSuffix}${path.extname(safeFilename)}`);
  }
});

const fileFilter = (req, file, cb) => {
  const allowedTypes = ['image/jpeg', 'image/png', 'application/pdf', 'image/jpg'];
  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error(`Invalid file type. Allowed types: ${allowedTypes.join(', ')}`));
  }
};

const upload = multer({
  storage: storage,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB
    files: 5 // Maximum 5 files
  },
  fileFilter: fileFilter
});

// Create new medical record - Doctors and admins only
router.post('/', 
  protect,
  authorize('admin', 'doctor'),
  upload.array('attachments', 5),
  (req, res, next) => {
    // Add uploaded files info to the request body
    if (req.files) {
      req.body.attachments = req.files.map(file => ({
        filename: file.originalname,
        path: file.path,
        type: file.mimetype
      }));
    }
    next();
  },
  createMedicalRecord
);

// Update medical record - Doctors and admins only
router.put('/:id',
  protect,
  authorize('admin', 'doctor'),
  upload.array('attachments', 5),
  (req, res, next) => {
    if (req.files) {
      req.body.attachments = req.files.map(file => ({
        filename: file.originalname,
        path: file.path,
        type: file.mimetype
      }));
    }
    next();
  },
  updateMedicalRecord
);

// Delete medical record - Admin only
router.delete('/:id', authorize('admin'), deleteMedicalRecord);

// Add attachment to medical record
router.post('/:id/attachments', 
  upload.single('attachment'),
  addAttachment
);

// Error handling middleware for multer
router.use((error, req, res, next) => {
  if (error instanceof multer.MulterError) {
    return res.status(400).json({
      success: false,
      message: 'File upload error',
      error: error.message
    });
  } else if (error) {
    return res.status(500).json({
      success: false,
      message: 'Server error during file upload',
      error: error.message
    });
  }
  next();
});

export default router;