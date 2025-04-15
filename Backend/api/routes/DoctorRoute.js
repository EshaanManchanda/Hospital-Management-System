import express from 'express';
import {
  getAllDoctors,
  getDoctorById,
  createDoctor,
  updateDoctor,
  deleteDoctor,
  addDoctorRating,
  getMyProfile,
  getDoctorPatients,
  getPatientDetails
} from '../controllers/DoctorController.js';
import { protect, authorize } from '../middleware/authMiddleware.js';

const router = express.Router();

// Public routes
router.get('/', getAllDoctors);
router.get('/:id', getDoctorById);

// Protected routes
router.post('/', protect, createDoctor);
router.put('/:id', protect, updateDoctor);
router.delete('/:id', protect, authorize('admin'), deleteDoctor);
router.post('/:id/ratings', protect, authorize('patient'), addDoctorRating);

// Doctor profile routes
router.get('/profile/me', protect, authorize('doctor'), getMyProfile);
router.get('/patients', protect, authorize('doctor'), getDoctorPatients);
router.get('/patients/:patientId', protect, authorize('doctor'), getPatientDetails);

export default router;