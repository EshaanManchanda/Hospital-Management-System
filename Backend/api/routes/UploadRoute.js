import express from 'express';
import { uploadImage, deleteImage } from '../controllers/UploadController.js';
import { protect, authorize } from '../middleware/authMiddleware.js';

const router = express.Router();

// All routes require authentication
router.use(protect);

// Upload image route
router.post('/', uploadImage);

// Delete image route (admin only)
router.delete('/:fileName', authorize('admin'), deleteImage);

export default router; 