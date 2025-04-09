import express from 'express';
import { 
  register, 
  login, 
  getUserProfile, 
  updateUserProfile, 
  forgotPassword, 
  resetPassword,
  loginWithGoogle,
  getProfile,
  updateProfile,
  refreshToken,
  logout,
  verifyToken,
  me
} from '../controllers/AuthController.js';
import { protect } from '../middleware/authMiddleware.js';
import { validateRequest, schemas } from '../middleware/validateRequest.js';
import bcrypt from 'bcrypt';

const router = express.Router();

// Authentication routes
router.post('/register', validateRequest(schemas.register), register);
router.post('/login', validateRequest(schemas.login), login);
router.get('/profile', protect, getUserProfile);
router.put('/profile', protect, updateUserProfile);
router.post('/forgotpassword', forgotPassword);
router.put('/resetpassword/:resetToken', resetPassword);

// Google authentication
router.post('/google', loginWithGoogle);

// Google OAuth routes
router.get('/google', (req, res) => {
  res.redirect('/api/auth/google/callback');
});

router.get('/google/callback', async (req, res) => {
  try {
    const { code } = req.query;
    const { tokens } = await oauth2Client.getToken(code);
    oauth2Client.setCredentials(tokens);

    const { data } = await google.oauth2('v2').userinfo.get();
    const { email, name, picture } = data;

    // Check if user exists
    let user = await User.findOne({ email });
    let patientCreated = true;

    if (!user) {
      // Create new user
      user = await User.create({
        name,
        email,
        password: crypto.randomBytes(20).toString('hex'),
        role: 'patient',
        googleId: data.id,
        avatar: picture
      });
      
      // Try to create patient record but don't fail authentication if it fails
      try {
        const patient = await Patient.create({
          user: user._id,
          bloodGroup: 'O+', // Default blood group
          height: 170, // Default height in cm
          weight: 70, // Default weight in kg
          allergies: [],
          chronicDiseases: []
        });
      } catch (patientError) {
        console.error('Error creating patient record during Google OAuth callback:', patientError);
        patientCreated = false;
      }
    }

    // Generate token
    const token = generateToken(user._id);
    
    // If patient record creation failed, redirect with additional parameter
    if (!patientCreated) {
      return res.redirect(`${process.env.FRONTEND_URL}/auth/google/callback?token=${token}&setupNeeded=true`);
    }

    res.redirect(`${process.env.FRONTEND_URL}/auth/google/callback?token=${token}`);
  } catch (error) {
    console.error('Google OAuth callback error:', error);
    res.redirect(`${process.env.FRONTEND_URL}/login?error=google_auth_failed`);
  }
});

// Authentication routes
router.get('/profile', protect, getUserProfile);
router.put('/profile', protect, updateUserProfile);
router.post('/auth/google', loginWithGoogle);
router.post('/refresh', protect, refreshToken);
router.post('/logout', logout);
router.get('/verify-token', protect, verifyToken);
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