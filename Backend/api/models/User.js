import mongoose from 'mongoose';
import bcrypt from 'bcrypt';
import { v4 as uuidv4 } from 'uuid';
import crypto from 'crypto';

const userSchema = new mongoose.Schema({
  userId: {
    type: String,
    default: function() {
      return `USR-${uuidv4().substring(0, 8).toUpperCase()}`;
    },
    unique: true,
    required: true
  },
  name: {
    type: String,
    required: [true, 'Please add a name'],
    trim: true
  },
  email: {
    type: String,
    required: [true, 'Please add an email'],
    unique: true,
    match: [
      /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
      'Please add a valid email'
    ]
  },
  password: {
    type: String,
    required: function() {
      return !this.googleId; // Password is required only if not using Google OAuth
    },
    minlength: 6,
    select: false
  },
  googleId: {
    type: String,
    select: false
  },
  role: {
    type: String,
    enum: ['patient', 'doctor', 'admin', 'nurse', 'receptionist'],
    default: 'patient'
  },
  mobile: {
    type: String,
    required: function() {
      return !this.googleId; // Mobile is required only if not using Google OAuth
    },
    match: [/^\+?[0-9]{8,15}$/, 'Please enter a valid mobile number (8-15 digits, optional + prefix)']
  },
  address: {
    street: String,
    city: String,
    state: String,
    zipCode: String,
    country: String
  },
  profileImage: {
    type: String,
    default: ''
  },
  qualifications: [{
    degree: String,
    institution: String,
    year: Number
  }],
  dateOfBirth: Date,
  gender: {
    type: String,
    enum: ['male', 'female', 'other'],
    required: function() {
      return !this.googleId; // Gender is required only if not using Google OAuth
    }
  },
  isActive: {
    type: Boolean,
    default: true
  },
  isVerified: {
    type: Boolean,
    default: false
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  },
  resetPasswordToken: String,
  resetPasswordExpire: Date,
  picture: {
    type: String
  },
  avatar: {
    type: String
  }
}, { timestamps: true });

// Encrypt password using bcrypt
userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) {
    next();
  }

  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

// Match user entered password to hashed password in database
userSchema.methods.matchPassword = async function(enteredPassword) {
  console.log('Attempting to match password');
  try {
    if (!enteredPassword) {
      console.error('Empty password provided for comparison');
      return false;
    }
    if (!this.password) {
      console.error('User does not have a password hash stored');
      return false;
    }
    
    const isMatch = await bcrypt.compare(enteredPassword, this.password);
    console.log(`Password comparison result: ${isMatch}`);
    return isMatch;
  } catch (error) {
    console.error('Error in password matching:', error);
    return false;
  }
};

// Generate and hash password token
userSchema.methods.getResetPasswordToken = function() {
  // Generate token
  const resetToken = crypto.randomBytes(20).toString('hex');

  // Hash token and set to resetPasswordToken field
  this.resetPasswordToken = crypto
    .createHash('sha256')
    .update(resetToken)
    .digest('hex');

  // Set expire
  this.resetPasswordExpire = Date.now() + 10 * 60 * 1000;

  return resetToken;
};

export const User = mongoose.model('User', userSchema); 