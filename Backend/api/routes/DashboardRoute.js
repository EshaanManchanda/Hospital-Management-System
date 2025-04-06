import express from 'express';
import { 
  getAdminDashboardStats, 
  getDoctorDashboardStats, 
  getPatientDashboardStats 
} from '../controllers/DashboardController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

// Apply authentication middleware to all dashboard routes
router.use(protect);

// Admin dashboard stats
router.get('/admin', getAdminDashboardStats);

// Doctor dashboard stats
router.get('/doctor', getDoctorDashboardStats);

// Patient dashboard stats
router.get('/patient', getPatientDashboardStats);

export default router; 