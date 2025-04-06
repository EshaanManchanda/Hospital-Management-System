import express from 'express';
import {
  createRevenue,
  getAllRevenue,
  getRevenueById,
  updateRevenue,
  deleteRevenue,
  getDailyRevenue,
  getMonthlyRevenue,
  getRevenueBySource,
  getRevenueSummary
} from '../controllers/RevenueController.js';
import { protect, admin } from '../middleware/authMiddleware.js';

const router = express.Router();

// Apply protect middleware to all routes
router.use(protect);
router.use(admin); // All revenue routes require admin access

// Get revenue summary
router.get('/summary', getRevenueSummary);

// Get daily revenue
router.get('/daily', getDailyRevenue);

// Get monthly revenue
router.get('/monthly', getMonthlyRevenue);

// Get revenue by source
router.get('/by-source', getRevenueBySource);

// CRUD routes
router
  .route('/')
  .get(getAllRevenue)
  .post(createRevenue);

router
  .route('/:id')
  .get(getRevenueById)
  .put(updateRevenue)
  .delete(deleteRevenue);

export default router; 