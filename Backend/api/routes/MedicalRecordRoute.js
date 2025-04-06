import express from 'express';
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

// Protected routes - All require authentication
router.use(protect);

// Stats route
router.get('/stats', authorize('admin', 'doctor'), getMedicalRecordsStats);

// Get all medical records - Admin only
router.get('/', authorize('admin'), getAllMedicalRecords);

// Get patient's medical records
router.get('/patient/:patientId', getPatientMedicalRecords);

// Get doctor's medical records
router.get('/doctor/:doctorId', getDoctorMedicalRecords);

// Individual medical record operations
router.get('/:id', getMedicalRecordById);

// Create new medical record - Doctors and admins only
router.post('/', authorize('admin', 'doctor'), createMedicalRecord);

// Update medical record - Doctors and admins only
router.put('/:id', authorize('admin', 'doctor'), updateMedicalRecord);

// Delete medical record - Admin only
router.delete('/:id', authorize('admin'), deleteMedicalRecord);

// Add attachment to medical record
router.post('/:id/attachments', addAttachment);

export default router; 