import express from 'express';
import { 
  register, 
  login, 
  getUserProfile, 
  updateUserProfile, 
  forgotPassword, 
  resetPassword 
} from '../controllers/AuthController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

// Authentication routes
router.post('/register', register);
router.post('/login', login);
router.get('/profile', protect, getUserProfile);
router.put('/profile', protect, updateUserProfile);
router.post('/forgotpassword', forgotPassword);
router.put('/resetpassword/:resetToken', resetPassword);

export default router; 