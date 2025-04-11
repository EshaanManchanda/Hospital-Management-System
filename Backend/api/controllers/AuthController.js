import { User } from "../models/User.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import crypto from "crypto";
import { sendEmail } from "../utils/email.js";
import { Patient } from "../models/Patient.js";

// Generate JWT token
const generateToken = (id) => {
  if (!id) {
    console.error('Missing user ID for token generation');
    return null;
  }
  
  try {
    const secret = process.env.JWT_SECRET || 'your_jwt_secret_key';
    console.log('Generating token for user ID:', id);
    console.log('Using secret (first 5 chars):', secret.substring(0, 5) + '...');
    
    const expiresIn = process.env.JWT_EXPIRES_IN || '30d';
    const token = jwt.sign({ id }, secret, { expiresIn });
    
    // Validate token
    const decoded = jwt.verify(token, secret);
    console.log('Token generated and verified, expires:', new Date(decoded.exp * 1000).toISOString());
    
    return token;
  } catch (error) {
    console.error('Token generation error:', error);
    return null;
  }
};

// Register a new user
export const register = async (req, res) => {
  try {
    const { name, email, password, role = 'patient', mobile, gender, dateOfBirth, address } = req.body;

    // Check if user already exists
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: "User already exists" });
    }

    // Validate role - ensure it's one of the allowed roles
    const validRoles = ['patient', 'doctor', 'admin', 'nurse', 'receptionist'];
    const userRole = validRoles.includes(role) ? role : 'patient';

    // Create user with validated role
    const user = await User.create({
      name,
      email,
      password,
      role: userRole, // Use validated role
      mobile,
      gender,
      dateOfBirth,
      address
    });

    // Create role-specific records
    let roleSpecificData = null;

    if (userRole === 'doctor') {
      // Import Doctor model dynamically
      const { Doctor } = await import("../models/Doctor.js");
      
      // Create doctor record
      const doctor = await Doctor.create({
        user: user._id,
        specialization: req.body.specialization || 'General Medicine',
        experience: req.body.experience || 0,
        fee: req.body.fee || 0,
        about: req.body.about || `Dr. ${name} is a healthcare provider at our hospital.`,
        workingHours: req.body.workingHours || { start: '09:00', end: '17:00' },
        workingDays: req.body.workingDays || ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday']
      });
      
      roleSpecificData = { doctorId: doctor._id };
    } 
    else if (userRole === 'patient') {
      // Import Patient model dynamically
      try {
        const { Patient } = await import("../models/Patient.js");
        
        // Create patient record with required fields
        const patient = await Patient.create({
          user: user._id,
          bloodGroup: req.body.bloodGroup || 'O+',
          height: req.body.height || 170,
          weight: req.body.weight || 70,
          allergies: req.body.allergies || [],
          chronicDiseases: req.body.chronicDiseases || []
        });
        
        roleSpecificData = { patientId: patient._id };
      } catch (patientError) {
        console.error('Error creating patient record during registration:', patientError);
        // Continue with user registration even if patient record creation fails
        // We can update the patient record later
      }
    }
    else if (userRole === 'nurse') {
      // Import Nurse model dynamically
      const { Nurse } = await import("../models/Nurse.js");
      
      // Create nurse record
      const nurse = await Nurse.create({
        user: user._id,
        department: req.body.department || 'General',
        shift: req.body.shift || 'Morning',
        qualification: req.body.qualification || 'Registered Nurse',
        experience: req.body.experience || 0,
        specialization: req.body.specialization || 'General Care',
        workingDays: req.body.workingDays || ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
        workingHours: req.body.workingHours || { start: '09:00', end: '17:00' }
      });
      
      roleSpecificData = { nurseId: nurse._id };
    }
    else if (userRole === 'receptionist') {
      // Import Receptionist model dynamically
      const { Receptionist } = await import("../models/Receptionist.js");
      
      // Create receptionist record
      const receptionist = await Receptionist.create({
        user: user._id,
        assignedDepartment: req.body.assignedDepartment || 'Front Desk',
        workingHours: req.body.workingHours || { start: '09:00', end: '17:00' },
        workingDays: req.body.workingDays || ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
        jobResponsibilities: req.body.jobResponsibilities || ['Patient Registration', 'Appointment Scheduling'],
        languages: req.body.languages || ['English']
      });
      
      roleSpecificData = { receptionistId: receptionist._id };
    }
    else if (userRole === 'admin') {
      // Import the Admin model dynamically
      const { Admin } = await import("../models/Admin.js");
      
      // Create a basic admin record
      const admin = await Admin.create({
        user: user._id,
        adminLevel: 'assistant', // Default level
        permissions: ['view_reports'], // Limited permissions by default
        department: 'Administration',
        contactNumber: '',
        office: 'Main Office',
        joinDate: new Date()
      });
      
      roleSpecificData = { adminId: admin._id };
    }

    // Generate token
    const token = generateToken(user._id);

    res.status(201).json({
      success: true,
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        ...roleSpecificData
      }
    });
  } catch (error) {
    console.error('Register error:', error);
    res.status(500).json({
      success: false,
      message: 'Server Error'
    });
  }
};

// Login user
export const login = async (req, res) => {
  try {
    const { email, password, linkGoogleAccount } = req.body;

    console.log(`Login attempt for email: ${email}`);

    // Check if user exists
    const user = await User.findOne({ email }).select('+password');
    if (!user) {
      console.log(`Login failed: User with email ${email} not found`);
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials'
      });
    }

    console.log(`User found with ID: ${user._id}, role: ${user.role}`);

    // Check if password is correct
    const isMatch = await user.matchPassword(password);
    console.log(`Password match result: ${isMatch}`);
    
    if (!isMatch) {
      console.log(`Login failed: Password does not match for user ${email}`);
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials'
      });
    }

    // Generate token
    const token = generateToken(user._id);
    console.log(`Token generated for user: ${user._id}`);
    
    // Create response object
    const responseData = {
      success: true,
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role
      }
    };
    
    // If linkGoogleAccount is true, include it in the response
    if (linkGoogleAccount) {
      responseData.linkGoogleAccount = true;
    }

    // If user is a patient, include patient ID
    if (user.role === 'patient') {
      // Import the Patient model dynamically to avoid circular dependency
      const { Patient } = await import("../models/Patient.js");
      
      // Find the patient record for this user
      const patient = await Patient.findOne({ user: user._id });
      
      if (patient) {
        responseData.user.patientId = patient._id;
        console.log(`Added patient ID: ${patient._id} to response`);
      }
    } 
    // If user is a doctor, include doctor ID
    else if (user.role === 'doctor') {
      // Import the Doctor model dynamically to avoid circular dependency
      const { Doctor } = await import("../models/Doctor.js");
      
      // Find the doctor record for this user
      const doctor = await Doctor.findOne({ user: user._id });
      
      if (doctor) {
        responseData.user.doctorId = doctor._id;
      }
    }
    // If user is an admin, include admin ID
    else if (user.role === 'admin') {
      // Import the Admin model dynamically to avoid circular dependency
      const { Admin } = await import("../models/Admin.js");
      
      // Find the admin record for this user
      const admin = await Admin.findOne({ user: user._id });
      
      if (admin) {
        responseData.user.adminId = admin._id;
      }
    }
    // If user is a nurse, include nurse ID
    else if (user.role === 'nurse') {
      // Import the Nurse model dynamically to avoid circular dependency
      const { Nurse } = await import("../models/Nurse.js");
      
      // Find the nurse record for this user
      const nurse = await Nurse.findOne({ user: user._id });
      
      if (nurse) {
        responseData.user.nurseId = nurse._id;
      }
    }
    // If user is a receptionist, include receptionist ID
    else if (user.role === 'receptionist') {
      // Import the Receptionist model dynamically to avoid circular dependency
      const { Receptionist } = await import("../models/Receptionist.js");
      
      // Find the receptionist record for this user
      const receptionist = await Receptionist.findOne({ user: user._id });
      
      if (receptionist) {
        responseData.user.receptionistId = receptionist._id;
      }
    }

    res.status(200).json(responseData);
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({
      success: false,
      message: 'Server Error'
    });
  }
};

// Get user profile
export const getUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select('-password');
    
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    
    res.status(200).json(user);
  } catch (error) {
    console.error("Profile error:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Update user profile
export const updateUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    
    // Update fields
    user.name = req.body.name || user.name;
    user.email = req.body.email || user.email;
    user.mobile = req.body.mobile || user.mobile;
    
    if (req.body.address) {
      user.address = {
        ...user.address,
        ...req.body.address
      };
    }
    
    // Update password if provided
    if (req.body.password) {
      user.password = req.body.password;
    }
    
    // Update profile image if provided
    if (req.body.profileImage) {
      user.profileImage = req.body.profileImage;
    }
    
    const updatedUser = await user.save();
    
    res.status(200).json({
      _id: updatedUser._id,
      name: updatedUser.name,
      email: updatedUser.email,
      role: updatedUser.role,
      token: generateToken(updatedUser._id),
    });
  } catch (error) {
    console.error("Update profile error:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Forgot password
export const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // Generate reset token
    const resetToken = user.getResetPasswordToken();
    await user.save();

    // Create reset URL
    const resetUrl = `${process.env.FRONTEND_URL}/reset-password/${resetToken}`;

    // Send email
    const message = `
      <h1>You have requested a password reset</h1>
      <p>Please make a PUT request to:</p>
      <p>${resetUrl}</p>
    `;

    try {
      await sendEmail({
        email: user.email,
        subject: 'Password Reset Request',
        message
      });

      res.status(200).json({
        success: true,
        message: 'Email sent'
      });
    } catch (error) {
      user.resetPasswordToken = undefined;
      user.resetPasswordExpire = undefined;
      await user.save();

      return res.status(500).json({
        success: false,
        message: 'Email could not be sent'
      });
    }
  } catch (error) {
    console.error('Forgot password error:', error);
    res.status(500).json({
      success: false,
      message: 'Server Error'
    });
  }
};

// Reset password
export const resetPassword = async (req, res) => {
  try {
    const resetPasswordToken = crypto
      .createHash('sha256')
      .update(req.params.resetToken)
      .digest('hex');

    const user = await User.findOne({
      resetPasswordToken,
      resetPasswordExpire: { $gt: Date.now() }
    });

    if (!user) {
      return res.status(400).json({
        success: false,
        message: 'Invalid reset token'
      });
    }

    // Set new password
    user.password = req.body.password;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;
    await user.save();

    // Generate token
    const token = generateToken(user._id);

    res.status(200).json({
      success: true,
      token
    });
  } catch (error) {
    console.error('Reset password error:', error);
    res.status(500).json({
      success: false,
      message: 'Server Error'
    });
  }
};

// Verify reset token
export const verifyResetToken = async (req, res) => {
  try {
    // Hash the token from params
    const resetPasswordToken = crypto
      .createHash('sha256')
      .update(req.params.token)
      .digest('hex');

    console.log('Verifying reset token:', req.params.token);
    console.log('Hashed token:', resetPasswordToken);

    // Check if a user exists with this token and it hasn't expired
    const user = await User.findOne({
      resetPasswordToken,
      resetPasswordExpire: { $gt: Date.now() }
    });

    if (!user) {
      console.log('No user found with the provided reset token or token expired');
      return res.status(400).json({
        success: false,
        message: 'Invalid or expired token'
      });
    }

    console.log('Valid reset token for user:', user.email);
    
    // Token is valid
    return res.status(200).json({
      success: true,
      message: 'Token is valid',
      email: user.email
    });
  } catch (error) {
    console.error('Verify reset token error:', error);
    return res.status(500).json({
      success: false,
      message: 'Server Error'
    });
  }
};

// Login with Google
export const loginWithGoogle = async (req, res) => {
  try {
    const { googleId, email, name, picture, gender, role, password, linkAccount } = req.body;

    // Validate required fields
    if (!email) {
      return res.status(400).json({
        success: false,
        message: "Email is required"
      });
    }

    // Validate password field - required for creating new users
    if (!password) {
      return res.status(400).json({
        success: false,
        message: ["Please add a password"]
      });
    }

    // Check if user exists with this email
    let user = await User.findOne({ email });
    let isNewUser = false;
    let accountLinked = false;

    if (!user) {
      isNewUser = true;
      
      // Set default picture based on gender
      let userPicture;
      if (gender === 'male') {
        userPicture = '../assets/Man.jpg'; // Default picture for male
      } else if (gender === 'female') {
        userPicture = '../assets/Women.jpg'; // Default picture for female
      } else {
        userPicture = '../assets/Man.jpg'; // Default picture if gender is not specified
      }

      // Validate role - ensure it's one of the allowed roles
      const validRoles = ['patient', 'doctor', 'admin', 'nurse', 'receptionist'];
      const userRole = validRoles.includes(role) ? role : 'patient';

      // Logging for debugging
      console.log(`Creating new user with validated role: ${userRole}`);

      // User data to create (always include password)
      const userData = {
        name,
        email,
        googleId,
        password, // Include password for all Google users
        picture: picture || userPicture,
        role: userRole,
        gender: gender || 'other',
        isVerified: true // Google users are automatically verified
      };

      // Create new user
      user = await User.create(userData);
      
      // Create role-specific data
      if (userRole === 'patient') {
        try {
          // Import the Patient model dynamically
          const { Patient } = await import("../models/Patient.js");
          
          // Create a basic patient record with all required fields
          const patient = await Patient.create({
            user: user._id,
            bloodGroup: 'O+', // Default blood group
            height: 170, // Default height in cm
            weight: 70, // Default weight in kg
            allergies: [],
            chronicDiseases: []
          });
          
          // Add patient ID to role-specific data
          if (patient) {
            responseData.patientId = patient._id;
          }
        } catch (patientError) {
          console.error('Error creating patient record:', patientError);
          // Continue with the response even if patient record creation fails
          // The user is already created, we can update the patient record later
        }
      } 
      else if (userRole === 'doctor') {
        // Import the Doctor model dynamically
        const { Doctor } = await import("../models/Doctor.js");
        
        // Create a basic doctor record
        const doctor = await Doctor.create({
          user: user._id,
          specialization: 'General Medicine',
          experience: 0,
          fee: 500,
          about: `Dr. ${name} is a healthcare provider at our hospital.`,
          workingHours: { start: '09:00', end: '17:00' },
          workingDays: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday']
        });
      }
      else if (userRole === 'nurse') {
        // Import the Nurse model dynamically
        const { Nurse } = await import("../models/Nurse.js");
        
        // Create a basic nurse record
        const nurse = await Nurse.create({
          user: user._id,
          department: 'General',
          shift: 'Morning',
          qualification: 'Registered Nurse',
          experience: 0,
          specialization: 'General Care',
          workingDays: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
          workingHours: { start: '09:00', end: '17:00' }
        });
      }
      else if (userRole === 'receptionist') {
        // Import the Receptionist model dynamically
        const { Receptionist } = await import("../models/Receptionist.js");
        
        // Create a basic receptionist record
        const receptionist = await Receptionist.create({
          user: user._id,
          assignedDepartment: 'Front Desk',
          workingHours: { start: '09:00', end: '17:00' },
          workingDays: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
          jobResponsibilities: ['Patient Registration', 'Appointment Scheduling'],
          languages: ['English']
        });
      }
      else if (userRole === 'admin') {
        // Import the Admin model dynamically
        const { Admin } = await import("../models/Admin.js");
        
        // Create a basic admin record
        const admin = await Admin.create({
          user: user._id,
          adminLevel: 'assistant', // Default level
          permissions: ['view_reports'], // Limited permissions by default
          department: 'Administration',
          contactNumber: '',
          office: 'Main Office',
          joinDate: new Date()
        });
      }
    } else if (!user.googleId) {
      // User exists but doesn't have Google ID
      if (linkAccount) {
        // User wants to link account - update existing user with Google ID
        console.log(`Linking Google account (${googleId}) to existing user: ${user.email}`);
        user.googleId = googleId;
        user.picture = picture || user.picture; // Use existing picture if not provided
        await user.save();
        accountLinked = true;
      } else {
        // User doesn't want to link accounts - return conflict error
        console.log(`Account with email ${email} exists but is not linked to Google`);
        return res.status(409).json({
          success: false,
          message: 'An account with this email already exists. Please use password login or request account linking.'
        });
      }
    }

    // Generate JWT token
    const token = generateToken(user._id);

    // Prepare response data
    const responseData = {
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      picture: user.picture || '../assets/Man.jpg', // Use default if not set
      token,
      accountLinked
    };

    // Add role-specific IDs if applicable
    if (user.role === 'patient') {
      const { Patient } = await import("../models/Patient.js");
      const patient = await Patient.findOne({ user: user._id });
      if (patient) {
        responseData.patientId = patient._id;
      }
    } else if (user.role === 'doctor') {
      const { Doctor } = await import("../models/Doctor.js");
      const doctor = await Doctor.findOne({ user: user._id });
      if (doctor) {
        responseData.doctorId = doctor._id;
      }
    } else if (user.role === 'nurse') {
      const { Nurse } = await import("../models/Nurse.js");
      const nurse = await Nurse.findOne({ user: user._id });
      if (nurse) {
        responseData.nurseId = nurse._id;
      }
    } else if (user.role === 'receptionist') {
      const { Receptionist } = await import("../models/Receptionist.js");
      const receptionist = await Receptionist.findOne({ user: user._id });
      if (receptionist) {
        responseData.receptionistId = receptionist._id;
      }
    } else if (user.role === 'admin') {
      const { Admin } = await import("../models/Admin.js");
      const admin = await Admin.findOne({ user: user._id });
      if (admin) {
        responseData.adminId = admin._id;
      }
    }

    // Add isNewUser flag to help frontend with onboarding
    responseData.isNewUser = isNewUser;

    res.json(responseData);
  } catch (error) {
    console.error('Google login error:', error);
    res.status(500).json({ message: 'Error during Google authentication', error: error.message });
  }
};

// Function to verify token 
export const verifyToken = async (req, res) => {
  try {
    // Log the verification attempt
    console.log('Verifying token for user:', req.user?._id);
    
    // If the request reaches here, it means the token is valid (authenticate middleware has verified it)
    const userData = {
      id: req.user._id,
      name: req.user.name,
      email: req.user.email,
      role: req.user.role,
      picture: req.user.picture || null
    };
    
    console.log('Token verified successfully for user:', userData.id);
    
    return res.status(200).json({
      success: true,
      message: 'Token is valid',
      user: userData
    });
  } catch (error) {
    console.error('Token verification error:', error);
    return res.status(401).json({
      success: false,
      message: 'Invalid or expired token'
    });
  }
};

// Get current user profile
export const me = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    
    // Check if a password parameter was sent in the query - used for Google accounts
    const { password } = req.query;
    
    // If password was provided and user doesn't have a password, add it
    if (password && user.googleId) {
      // Update the user with the provided password
      user.password = password;
      await user.save();
      console.log('Updated Google user with a secure password');
    }

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // Look up role-specific data
    let roleData = {};
    if (user.role === 'patient') {
      const { Patient } = await import('../models/Patient.js');
      const patient = await Patient.findOne({ user: user._id });
      if (patient) {
        roleData.patientId = patient._id;
      }
    } else if (user.role === 'doctor') {
      const { Doctor } = await import('../models/Doctor.js');
      const doctor = await Doctor.findOne({ user: user._id });
      if (doctor) {
        roleData.doctorId = doctor._id;
      }
    } else if (user.role === 'admin') {
      const { Admin } = await import('../models/Admin.js');
      const admin = await Admin.findOne({ user: user._id });
      if (admin) {
        roleData.adminId = admin._id;
      }
    } else if (user.role === 'nurse') {
      const { Nurse } = await import('../models/Nurse.js');
      const nurse = await Nurse.findOne({ user: user._id });
      if (nurse) {
        roleData.nurseId = nurse._id;
      }
    } else if (user.role === 'receptionist') {
      const { Receptionist } = await import('../models/Receptionist.js');
      const receptionist = await Receptionist.findOne({ user: user._id });
      if (receptionist) {
        roleData.receptionistId = receptionist._id;
      }
    }

    res.status(200).json({
      success: true,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        ...roleData
      }
    });
  } catch (error) {
    console.error('Error fetching user profile:', error);
    res.status(500).json({
      success: false,
      message: 'Server Error'
    });
  }
};

// For updating profile
export const getProfile = async (req, res) => {
  try {
    // req.user is set by the authenticate middleware
    return res.status(200).json(req.user);
  } catch (error) {
    console.error('Error getting profile:', error);
    return res.status(500).json({
      success: false,
      message: 'Error retrieving profile information'
    });
  }
};

// Update profile
export const updateProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }
    
    // Update fields if provided
    if (req.body.name) user.name = req.body.name;
    if (req.body.email) user.email = req.body.email;
    if (req.body.phone) user.phone = req.body.phone;
    if (req.body.picture) user.picture = req.body.picture;
    
    // Save updated user
    await user.save();
    
    return res.status(200).json({
      success: true,
      message: 'Profile updated successfully',
      user
    });
  } catch (error) {
    console.error('Error updating profile:', error);
    return res.status(500).json({
      success: false,
      message: 'Error updating profile information'
    });
  }
};

// Refresh token
export const refreshToken = async (req, res) => {
  try {
    // Check if user exists in request (from authenticate middleware)
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'Authentication required'
      });
    }
    
    // Generate new token
    const token = jwt.sign(
      { 
        id: req.user._id,
        email: req.user.email,
        role: req.user.role,
        name: req.user.name,
        picture: req.user.picture
      },
      process.env.JWT_SECRET,
      { expiresIn: '1d' }
    );
    
    return res.status(200).json({
      success: true,
      message: 'Token refreshed successfully',
      token
    });
  } catch (error) {
    console.error('Error refreshing token:', error);
    return res.status(500).json({
      success: false,
      message: 'Error refreshing token'
    });
  }
};

// Logout
export const logout = async (req, res) => {
  try {
    // Clear token cookie if using cookies
    res.clearCookie('token');
    
    return res.status(200).json({
      success: true,
      message: 'Logged out successfully'
    });
  } catch (error) {
    console.error('Error during logout:', error);
    return res.status(500).json({
      success: false,
      message: 'Error during logout'
    });
  }
};

// @desc    Update password
// @route   PUT /api/auth/update-password
// @access  Private
export const updatePassword = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('+password');

    // Check current password
    const isMatch = await user.matchPassword(req.body.currentPassword);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: 'Current password is incorrect'
      });
    }

    user.password = req.body.newPassword;
    await user.save();

    // Generate token
    const token = generateToken(user._id);

    res.status(200).json({
      success: true,
      token
    });
  } catch (error) {
    console.error('Update password error:', error);
    res.status(500).json({
      success: false,
      message: 'Server Error'
    });
  }
};

// This function is part of server.js, not directly in the AuthController
// We're adding the try/catch around the Patient.create to prevent OAuth failure
const handleGoogleSignUp = async (userData) => {
  try {
    // Create a new user record
    const user = await User.create(userData);
    
    // Try to create a patient record but don't fail if it doesn't work
    try {
      if (userData.role === 'patient') {
        // Create a basic patient record with all required fields
        await Patient.create({
          user: user._id,
          bloodGroup: 'O+', // Default blood group
          height: 170, // Default height in cm
          weight: 70, // Default weight in kg
          allergies: [],
          chronicDiseases: []
        });
      }
    } catch (patientError) {
      // Log error but don't prevent user creation
      console.error('Error creating patient record during Google sign-up:', patientError);
    }
    
    return { success: true, user };
  } catch (error) {
    console.error('Error in Google sign-up:', error);
    return { success: false, error };
  }
}; 