import express from 'express';
import {
  getAllBeds,
  getBedById,
  createBed,
  updateBed,
  deleteBed,
  assignPatientToBed,
  dischargePatient,
  getBedStats
} from '../controllers/BedController.js';
import { protect, admin } from '../middleware/authMiddleware.js';

const router = express.Router();

// Apply protect middleware to all routes
router.use(protect);

// Admin only routes
router
  .route('/')
  .get(admin, getAllBeds)
  .post(admin, createBed);

router
  .route('/:id')
  .get(admin, getBedById)
  .put(admin, updateBed)
  .delete(admin, deleteBed);

router.put('/:id/assign', admin, assignPatientToBed);
router.put('/:id/discharge', admin, dischargePatient);
router.get('/stats', admin, getBedStats);

export default router; 