import express from 'express';
import {
  getAllAppointments,
  getAppointmentById,
  createAppointment,
  updateAppointment,
  deleteAppointment,
  getAvailableTimeSlots,
  getDoctorAppointments
} from '../controllers/AppointmentController.js';
import { protect, authorize } from '../middleware/authMiddleware.js';

const router = express.Router();

// Protected routes - All require authentication
router.use(protect);

// Routes for managing appointments
router.get('/', getAllAppointments);
router.get('/:id', getAppointmentById);
router.post('/', authorize('admin', 'patient'), createAppointment);
router.put('/:id', updateAppointment);
router.delete('/:id', authorize('admin'), deleteAppointment);

// Get available time slots
router.get('/timeslots/:doctorId/:date', getAvailableTimeSlots);

// Get appointments by doctor ID
router.get('/doctor/:doctorId', getDoctorAppointments);

export default router; 