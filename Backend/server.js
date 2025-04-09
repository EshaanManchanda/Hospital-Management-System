import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import fileUpload from 'express-fileupload';
import path from 'path';
import { fileURLToPath } from 'url';
import passport from 'passport';
import session from 'express-session';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import jwt from 'jsonwebtoken';
import cookieParser from 'cookie-parser';
import errorHandler from './api/middleware/errorHandler.js';
import crypto from 'crypto';

// Import models
import { User } from './api/models/User.js';
import { Patient } from './api/models/Patient.js';

// Route imports
import authRoutes from './api/routes/AuthRoute.js';
import patientRoutes from './api/routes/PatientRoute.js';
import doctorRoutes from './api/routes/DoctorRoute.js';
import appointmentRoutes from './api/routes/AppointmentRoute.js';
import uploadRoutes from './api/routes/UploadRoute.js';
import medicineRoutes from './api/routes/MedicineRoute.js';
import prescriptionRoutes from './api/routes/PrescriptionRoute.js';
import medicalRecordRoutes from './api/routes/MedicalRecordRoute.js';
import dashboardRoutes from './api/routes/DashboardRoute.js';
import bedRoutes from './api/routes/BedRoute.js';
import revenueRoutes from './api/routes/RevenueRoute.js';

// Load env variables
dotenv.config();

// Create Express app
const app = express();

// MongoDB connection
const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000,
    });

    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error('MongoDB connection error:', error);
    process.exit(1);
  }
};

// Connect to MongoDB
connectDB();

// Express middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// CORS configuration
const corsOptions = {
  origin: [
    process.env.FRONTEND_URL,
    'https://hospital-management-system-indol-one.vercel.app',
    'http://localhost:5173'
  ],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  exposedHeaders: ['Set-Cookie']
};

console.log('CORS configured with:', { 
  environment: process.env.NODE_ENV,
  frontendUrl: process.env.FRONTEND_URL,
  backendUrl: process.env.BACKEND_URL,
  origins: corsOptions.origin
});

app.use(cors(corsOptions));

// Session configuration
app.use(session({
  secret: process.env.SESSION_SECRET || 'your-secret-key',
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: process.env.NODE_ENV === 'production',
    maxAge: 24 * 60 * 60 * 1000 // 24 hours
  }
}));

// Initialize passport
app.use(passport.initialize());
app.use(passport.session());

// Configure Google OAuth Strategy
passport.use(new GoogleStrategy({
  clientID: process.env.GOOGLE_CLIENT_ID,
  clientSecret: process.env.GOOGLE_CLIENT_SECRET,
  callbackURL: `${process.env.BACKEND_URL}/auth/google/callback`,
  scope: ['profile', 'email']
},
async (accessToken, refreshToken, profile, done) => {
  try {
    console.log("Google OAuth profile:", profile);
    console.log("Access Token:", accessToken);
    
    // Check if user exists in our database
    let user = await User.findOne({ email: profile.emails[0].value });
    
    if (!user) {
      console.log("New user created from Google OAuth:", profile.emails[0].value);
      
      // Create new user
      user = await User.create({
        name: profile.displayName,
        email: profile.emails[0].value,
        googleId: profile.id,
        picture: profile.photos[0].value,
        role: 'patient', // Default role is patient
        isVerified: true, // Google users are automatically verified
        password: crypto.randomBytes(20).toString('hex'), // Generate a random password
      });
      
      // Try to create a patient record but don't fail if it doesn't work
      try {
        // Create a basic patient record
        const patient = await Patient.create({
          user: user._id,
          bloodGroup: 'O+', // Default blood group
          height: 170, // Default height in cm
          weight: 70, // Default weight in kg
          allergies: [],
          chronicDiseases: []
        });
      } catch (patientError) {
        console.warn("Error creating patient record during Google OAuth:", patientError);
        // Continue with the authentication process even if patient record creation fails
        // We'll handle this case on the frontend
      }
    } else if (!user.googleId) {
      // User exists but doesn't have googleId, update user
      user.googleId = profile.id;
      user.picture = profile.photos[0].value;
      await user.save();
    }
    
    // Return user
    return done(null, user);
  } catch (error) {
    console.error("Error in Google OAuth strategy:", error);
    return done(null, false, { message: "Unable to authenticate with Google" });
  }
}));

// Passport serialization
passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
  try {
    const { User } = await import('./api/models/User.js');
    const user = await User.findById(id);
    done(null, user);
  } catch (error) {
    done(error, null);
  }
});

// File upload middleware
app.use(fileUpload());

// Define __dirname in ES module
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Serve uploads as static files
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Google OAuth routes
app.get('/api/auth/google', (req, res, next) => {
  console.log('Google auth request received');
  console.log('Frontend URL:', process.env.FRONTEND_URL);
  console.log('Backend URL:', process.env.BACKEND_URL);
  
  // Store the redirect path if provided in query
  if (req.query.redirect) {
    req.session.redirectPath = req.query.redirect;
  }
  next();
}, passport.authenticate('google', {
  scope: ['profile', 'email'],
  prompt: 'select_account'
}));

app.get('/api/auth/google/callback', 
  passport.authenticate('google', { 
    failureRedirect: `${process.env.FRONTEND_URL}/login?error=google_auth_failed`,
    session: false
  }),
  (req, res) => {
    try {
      console.log('Google auth callback - User:', req.user?._id);
      
      if (!req.user || !req.user._id) {
        console.error('Google auth callback - No user data available');
        return res.redirect(`${process.env.FRONTEND_URL}/login?error=invalid_user_data`);
      }
      
      // Generate JWT token
      const payload = { 
        id: req.user._id,
        email: req.user.email,
        role: req.user.role,
        name: req.user.name,
        picture: req.user.picture || null
      };
      
      console.log('Generating token with payload:', JSON.stringify(payload));
      
      const token = jwt.sign(
        payload,
        process.env.JWT_SECRET,
        { expiresIn: '1d' }
      );
      
      // Log the token and its type for debugging
      console.log('Generated token type:', typeof token);
      console.log('Token length:', token.length);
      console.log('Token first 20 chars:', token.substring(0, 20) + '...');
      
      // Redirect to frontend with token
      const redirectPath = req.session.redirectPath || '';
      delete req.session.redirectPath;
      
      // Encode token for URL
      const encodedToken = encodeURIComponent(token);
      // Send to the dedicated Google OAuth callback component route
      const redirectUrl = `${process.env.FRONTEND_URL}/auth/google/callback?token=${encodedToken}${redirectPath ? `&redirect=${redirectPath}` : ''}`;
      
      console.log('Redirecting to:', redirectUrl.substring(0, 100) + '...');
      
      res.redirect(redirectUrl);
    } catch (error) {
      console.error('Error during Google callback processing:', error);
      res.redirect(`${process.env.FRONTEND_URL}/login?error=server_error`);
    }
  });

// Mount routes
app.use('/api/auth', authRoutes);
app.use('/api/patients', patientRoutes);
app.use('/api/doctors', doctorRoutes);
app.use('/api/appointments', appointmentRoutes);
app.use('/api/upload', uploadRoutes);
app.use('/api/medicines', medicineRoutes);
app.use('/api/prescriptions', prescriptionRoutes);
app.use('/api/medical-records', medicalRecordRoutes);
app.use('/api/dashboard', dashboardRoutes);
app.use('/api/beds', bedRoutes);
app.use('/api/revenue', revenueRoutes);

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.status(200).json({ status: 'ok', message: 'Server is running' });
});

// Error handling middleware
app.use(errorHandler);

// Serve static assets in production
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, '../Frontend/dist')));

  app.get('*', (req, res) => {
    res.sendFile(path.resolve(__dirname, '../Frontend', 'dist', 'index.html'));
  });
}

// Connect to MongoDB
const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/hospital-management';

mongoose
  .connect(MONGO_URI)
  .then(() => {
    console.log('Connected to MongoDB');
    app.listen(PORT, () => {
      console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`);
    });
  })
  .catch(err => {
    console.error('MongoDB connection error:', err);
    process.exit(1);
  });

export default app;