import express from 'express';
import { 
  register, 
  login, 
  getUserProfile, 
  updateUserProfile, 
  forgotPassword, 
  resetPassword,
  loginWithGoogle,
  refreshToken,
  logout,
  verifyToken,
  verifyResetToken,
  googleCallback
} from '../controllers/AuthController.js';
import { protect } from '../middleware/authMiddleware.js';
import { validateRequest, schemas } from '../middleware/validateRequest.js';
import { User } from '../models/User.js';
import { Patient } from '../models/Patient.js';
import { Doctor } from '../models/Doctor.js';
import bcrypt from 'bcrypt';

const router = express.Router();

// Authentication routes
router.post('/register', validateRequest(schemas.register), register);
router.post('/login', validateRequest(schemas.login), login);
router.get('/profile', protect, getUserProfile);
router.put('/profile', protect, updateUserProfile);
router.post('/forgotpassword', forgotPassword);
router.put('/resetpassword/:resetToken', resetPassword);
router.get('/verify-reset-token/:token', verifyResetToken);

// Google authentication
router.post('/google', loginWithGoogle);

// Google OAuth routes
router.get('/google', (req, res) => {
  const redirectUrl = `${process.env.API_URL}/api/auth/google/callback`;
  res.redirect(redirectUrl);
});

router.get('/google/callback', googleCallback);

// Token management
router.post('/refresh', protect, refreshToken);
router.post('/logout', logout);
router.get('/verify-token', protect, verifyToken);

// Test endpoint
router.get('/google-test', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Google auth test endpoint',
    timestamp: new Date().toISOString()
  });
});

// Troubleshooting routes
router.post('/debug-login', async (req, res) => {
  try {
    const { email, password } = req.body;
    
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Email and password are required'
      });
    }
    
    // Find the user without selecting password
    const user = await User.findOne({ email });
    
    // Return information about the user without attempting login
    if (!user) {
      return res.status(200).json({
        success: false,
        found: false,
        message: 'User not found',
        debug: { email }
      });
    }
    
    // Now find user with password
    const userWithPassword = await User.findOne({ email }).select('+password');
    
    // Check password manually
    let passwordCorrect = false;
    try {
      passwordCorrect = await bcrypt.compare(password, userWithPassword.password);
    } catch (error) {
      console.error('Password comparison error:', error);
    }
    
    // Send debugging info
    return res.status(200).json({
      success: passwordCorrect,
      found: true,
      debug: {
        email: user.email,
        id: user._id,
        role: user.role,
        passwordStored: !!userWithPassword.password,
        passwordLength: userWithPassword.password ? userWithPassword.password.length : 0,
        passwordComparisonResult: passwordCorrect
      }
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Error in debug login',
      error: error.message
    });
  }
});

// Debug route to check password
router.post('/check-password', async (req, res) => {
  try {
    const { password, hash } = req.body;
    
    if (!password || !hash) {
      return res.status(400).json({
        success: false,
        message: 'Password and hash are required'
      });
    }
    
    const isMatch = await bcrypt.compare(password, hash);
    
    return res.status(200).json({
      success: true,
      isMatch,
      passwordProvided: !!password,
      hashProvided: !!hash
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Error checking password',
      error: error.message
    });
  }
});

// Debug route to reset password (only available in development mode)
router.post('/reset-debug-password', async (req, res) => {
  try {
    // Only allow this in development mode
    if (process.env.NODE_ENV === 'production') {
      return res.status(404).json({
        success: false,
        message: 'Endpoint not available in production'
      });
    }
    
    const { email, newPassword } = req.body;
    
    if (!email) {
      return res.status(400).json({
        success: false,
        message: 'Email is required'
      });
    }
    
    // Find the user
    const user = await User.findOne({ email });
    
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }
    
    // Set the new password
    const passwordToSet = newPassword || 'Test123!';
    
    // Update the password
    user.password = passwordToSet;
    await user.save();
    
    // Generate token for convenience
    const token = generateToken(user._id);
    
    return res.status(200).json({
      success: true,
      message: 'Password reset successful',
      email: user.email,
      role: user.role,
      token
    });
  } catch (error) {
    console.error('Debug password reset error:', error);
    return res.status(500).json({
      success: false,
      message: 'Error resetting password',
      error: error.message
    });
  }
});

export default router;