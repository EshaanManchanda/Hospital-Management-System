import express from 'express';
import { 
  getAdminDashboardStats, 
  getDoctorDashboardStats, 
  getPatientDashboardStats,
  getAdminDashboardStatsSummary,
  getPatientVisitsData,
  getTodayAppointments,
  getDoctorSchedule,
  getAdminProfile
} from '../controllers/DashboardController.js';
import { protect, admin } from '../middleware/authMiddleware.js';

const router = express.Router();

// Apply authentication middleware to all dashboard routes
router.use(protect);

// Admin dashboard stats
router.get('/admin', getAdminDashboardStats);

// Doctor dashboard stats
router.get('/doctor', getDoctorDashboardStats);

// Patient dashboard stats
router.get('/patient', getPatientDashboardStats);

// New routes for admin dashboard
router.get('/admin/stats', admin, getAdminDashboardStatsSummary);
router.get('/admin/patient-visits', admin, getPatientVisitsData);
router.get('/admin/appointments/today', admin, getTodayAppointments);
router.get('/admin/doctor-schedule', admin, getDoctorSchedule);
router.get('/admin/profile', admin, getAdminProfile);

export default router; 