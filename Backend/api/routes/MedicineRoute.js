import express from 'express';
import {
  getAllMedicines,
  getMedicineById,
  createMedicine,
  updateMedicine,
  deleteMedicine,
  searchMedicines,
  // Add these imports:
  getPrescriptionById,
  dispensePrescription,
  getLowStockItems,
  getMedicineStats,
  getMedicationsByPatient,
  requestRefill,
} from '../controllers/MedicineController.js';
import { protect, authorize } from '../middleware/authMiddleware.js';
const router = express.Router();

// Protected routes - All require authentication
router.use(protect);

// Get all medicines
router.get('/', getAllMedicines);

// Search medicines
router.get('/search', searchMedicines);

// Get low stock items
router.get('/low-stock', authorize('admin', 'pharmacist'), getLowStockItems);

// Get medicine statistics
router.get('/stats', authorize('admin'), getMedicineStats);

// Get medicine by ID
router.get('/:id', getMedicineById);

// Create new medicine - Admin only
router.post('/', authorize('admin'), createMedicine);

// Update medicine - Admin only
router.put('/:id', authorize('admin'), updateMedicine);

// Delete medicine - Admin only
router.delete('/:id', authorize('admin'), deleteMedicine);

// --- Add these routes below ---

// Get prescription by ID
router.get('/prescriptions/:id', getPrescriptionById);

// Dispense prescription
router.post('/prescriptions/:id/dispense', authorize('admin', 'pharmacist'), dispensePrescription);

// Get all medications for a patient
router.get('/patient/:patientId/medications', getMedicationsByPatient);

// Request refill
router.post('/request-refill', requestRefill);

// Get medicine by ID (keep this after all static routes)
router.get('/:id', getMedicineById);

// Create new medicine - Admin only
router.post('/', authorize('admin'), createMedicine);

// Update medicine - Admin only
router.put('/:id', authorize('admin'), updateMedicine);

// Delete medicine - Admin only
router.delete('/:id', authorize('admin'), deleteMedicine);


export default router;