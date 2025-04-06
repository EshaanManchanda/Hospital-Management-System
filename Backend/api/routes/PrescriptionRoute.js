import express from 'express';
import { 
  getAllPrescriptions,
  getPrescriptionById,
  getPrescriptionsByPatient,
  getPrescriptionsByDoctor,
  createPrescription,
  updatePrescription,
  deletePrescription
} from '../controllers/PrescriptionController.js';
import { protect, authorize } from '../middleware/authMiddleware.js';

const router = express.Router();

// Protected routes - All require authentication
router.use(protect);

// Get all prescriptions - Admin only
router.get('/', authorize('admin'), getAllPrescriptions);

// Get prescription by ID
router.get('/:id', getPrescriptionById);

// Get prescriptions by patient ID
router.get('/patient/:patientId', getPrescriptionsByPatient);

// Get prescriptions by doctor ID
router.get('/doctor/:doctorId', getPrescriptionsByDoctor);

// Create new prescription - Doctors and admins only
router.post('/', authorize('admin', 'doctor'), createPrescription);

// Update prescription - Doctors and admins only
router.put('/:id', authorize('admin', 'doctor'), updatePrescription);

// Delete prescription - Admin only
router.delete('/:id', authorize('admin'), deletePrescription);

export default router; 