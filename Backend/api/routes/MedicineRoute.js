import express from 'express';
import {
  getAllMedicines,
  getMedicineById,
  createMedicine,
  updateMedicine,
  deleteMedicine,
  searchMedicines
} from '../controllers/MedicineController.js';
import { protect, authorize } from '../middleware/authMiddleware.js';
const router = express.Router();

// Protected routes - All require authentication
router.use(protect);

// Get all medicines
router.get('/', getAllMedicines);

// Search medicines
router.get('/search', searchMedicines);

// Get medicine by ID
router.get('/:id', getMedicineById);

// Create new medicine - Admin only
router.post('/', authorize('admin'), createMedicine);

// Update medicine - Admin only
router.put('/:id', authorize('admin'), updateMedicine);

// Delete medicine - Admin only
router.delete('/:id', authorize('admin'), deleteMedicine);

export default router; 