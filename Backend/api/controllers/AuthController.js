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
    const { 
      name, 
      email, 
      password, 
      role = 'patient', 
      mobile, 
      gender, 
      dateOfBirth, 
      address,
      // Admin specific fields
      adminLevel,
      permissions,
      department,
      contactNumber,
      office
    } = req.body;

    console.log(`Registration attempt for email: ${email}, role: ${role}`);

    // Check if user already exists
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ 
        success: false,
        message: "User already exists" 
      });
    }

    // Validate role - ensure it's one of the allowed roles
    const validRoles = ['patient', 'doctor', 'admin', 'nurse', 'receptionist'];
    const userRole = validRoles.includes(role) ? role : 'patient';

    console.log(`Creating user with role: ${userRole}`);

    // Create user with validated role
    const userData = {
      name,
      email,
      password,
      role: userRole
    };
    
    // Add optional fields if present
    if (mobile) {
      // Format mobile number to ensure it only contains digits and optional + prefix
      const formattedMobile = mobile.replace(/\D+/g, '');
      userData.mobile = formattedMobile;
    }
    
    if (gender) {
      // Ensure gender is lowercase to match enum values
      userData.gender = gender.toLowerCase();
    }
    
    if (dateOfBirth) userData.dateOfBirth = dateOfBirth;
    
    // Handle address as an object with specific properties
    if (address && typeof address === 'object') {
      userData.address = {
        street: address.street || '',
        city: address.city || '',
        state: address.state || '',
        zipCode: address.zipCode || '',
        country: address.country || ''
      };
    }

    console.log('User data prepared for creation:', userData);

    const user = await User.create(userData);

    console.log(`User created with ID: ${user._id}`);

    // Create role-specific records
    let roleSpecificData = null;

    try {
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
        
        console.log(`Doctor record created with ID: ${doctor._id}`);
        roleSpecificData = { doctorId: doctor._id };
      } 
      else if (userRole === 'patient') {
        // Import Patient model dynamically
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
        
        console.log(`Patient record created with ID: ${patient._id}`);
        roleSpecificData = { patientId: patient._id };
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
        
        console.log(`Nurse record created with ID: ${nurse._id}`);
        roleSpecificData = { nurseId: nurse._id };
      }
      else if (userRole === 'receptionist') {
        // Import Receptionist model dynamically
        const { Receptionist } = await import("../models/Receptionist.js");
    
        // Create receptionist record
        const receptionist = await Receptionist.create({
            user: user._id,
            workingHours: req.body.workingHours || { start: '09:00', end: '17:00' },
            assignedDepartment: req.body.assignedDepartment || 'Front Desk',
            jobResponsibilities: req.body.jobResponsibilities || ['Patient Registration', 'Appointment Scheduling'],
            languages: req.body.languages || ['English'],
            feedbackRating: null, // Explicitly set to null to avoid validation error
        });
    
        console.log(`Receptionist record created with ID: ${receptionist._id}`);
        roleSpecificData = { receptionistId: receptionist._id };
      }
      else if (userRole === 'admin') {
        console.log('Attempting to create admin record');
        
        try {
          // Import the Admin model dynamically
          const AdminModule = await import("../models/Admin.js");
          const Admin = AdminModule.Admin;
          
          if (!Admin) {
            console.error('Admin model not found in the imported module');
            throw new Error('Admin model not available');
          }
          
          // Get valid permissions from Admin model schema
          const adminSchema = Admin.schema;
          const validPermissions = adminSchema.path('permissions.0').enumValues;
          console.log('Valid admin permissions:', validPermissions);
          
          // Filter provided permissions to only include valid ones
          let adminPermissions = ['view_reports']; // Default permission
          
          if (permissions && Array.isArray(permissions)) {
            console.log('Permissions provided:', permissions);
            
            // Convert all permissions to lowercase for case-insensitive comparison
            const normalizedPermissions = permissions.map(p => p.toLowerCase());
            const normalizedValidPermissions = validPermissions.map(p => p.toLowerCase());
            
            // For each provided permission, find the correctly cased version
            adminPermissions = normalizedPermissions
              .map((p, index) => {
                const validIndex = normalizedValidPermissions.indexOf(p);
                if (validIndex !== -1) {
                  return validPermissions[validIndex]; // Return the correctly cased version
                }
                console.warn(`Permission not found: ${permissions[index]}`);
                return null;
              })
              .filter(p => p !== null); // Remove any permissions that weren't found
            
            console.log('Normalized permissions:', adminPermissions);
            
            // If no valid permissions found, use default
            if (adminPermissions.length === 0) {
              console.warn('No valid permissions found, using default permissions');
              adminPermissions = ['view_reports'];
            }
          }
          
          // Create admin record with provided or default values
          const adminData = {
            user: user._id,
            adminLevel: adminLevel || 'assistant',
            permissions: adminPermissions,
            department: department || 'Administration',
            contactNumber: contactNumber || '',
            office: office || 'Main Office',
            joinDate: new Date()
          };

          console.log('Creating admin with data:', JSON.stringify(adminData));
          const admin = await Admin.create(adminData);
          
          console.log(`Admin record created with ID: ${admin._id}`);
          roleSpecificData = { adminId: admin._id };
        } catch (adminError) {
          console.error('Error creating admin record:', adminError);
          
          // Try creating with just the basic permissions if there was an error with permissions
          if (adminError.message.includes('permissions')) {
            try {
              console.log('Attempting to create admin with basic permissions only');
              
              const AdminModule = await import("../models/Admin.js");
              const Admin = AdminModule.Admin;
              
              const admin = await Admin.create({
                user: user._id,
                adminLevel: adminLevel || 'assistant',
                permissions: ['view_reports'], // Use only a safe default permission
                department: department || 'Administration',
                contactNumber: contactNumber || '',
                office: office || 'Main Office',
                joinDate: new Date()
              });
              
              console.log(`Admin record created with basic permissions. ID: ${admin._id}`);
              roleSpecificData = { adminId: admin._id };
            } catch (retryError) {
              console.error('Second attempt to create admin failed:', retryError);
              roleSpecificData = { 
                adminId: null, 
                adminError: `First error: ${adminError.message}. Retry error: ${retryError.message}`
              };
            }
          } else {
            // Continue with user registration even if admin record creation fails
            roleSpecificData = { 
              adminId: null, 
              adminError: adminError.message
            };
          }
        }
      }
    } catch (roleSpecificError) {
      console.error(`Error creating ${userRole} record:`, roleSpecificError);
      // We don't fail the whole registration if only the role-specific record fails
      // User is already created at this point
    }

    // Generate token
    const token = generateToken(user._id);
    
    if (!token) {
      console.error('Failed to generate token for user:', user._id);
      return res.status(500).json({
        success: false,
        message: 'Error generating authentication token'
      });
    }

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
      message: error.message || 'Server Error',
      error: error.message
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
        message: "Please add a password"
      });
    }

    // Check if user exists with this email
    let user = await User.findOne({ email });
    let isNewUser = false;
    let accountLinked = false;
    let roleSpecificData = null;

    if (!user) {
      isNewUser = true;
      
      // Set default picture based on gender
      let userPicture;
      if (gender === 'male') {
        userPicture = '../assets/Man.jpg';
      } else if (gender === 'female') {
        userPicture = '../assets/Women.jpg';
      } else {
        userPicture = '../assets/Man.jpg';
      }

      // Validate role
      const validRoles = ['patient', 'doctor', 'admin', 'nurse', 'receptionist'];
      const userRole = validRoles.includes(role) ? role : 'patient';

      console.log(`Creating new user with role: ${userRole}`);

      // Create user
      const userData = {
        name,
        email,
        googleId,
        password,
        picture: picture || userPicture,
        role: userRole,
        gender: gender || 'other',
        isVerified: true
      };

      user = await User.create(userData);
      
      // Create role-specific record
      try {
        if (userRole === 'patient') {
          const { Patient } = await import("../models/Patient.js");
          const patient = await Patient.create({
            user: user._id,
            bloodGroup: 'O+',
            height: 170,
            weight: 70,
            allergies: [],
            chronicDiseases: [],
            status: 'Active'
          });
          roleSpecificData = { 
            patientId: patient._id,
            patientData: {
              bloodGroup: patient.bloodGroup,
              height: patient.height,
              weight: patient.weight,
              status: patient.status
            }
          };
        } 
        // ... other role creation code remains the same ...
      } catch (roleError) {
        console.error(`Error creating ${userRole} record:`, roleError);
      }
    } else if (!user.googleId) {
      if (linkAccount) {
        console.log(`Linking Google account (${googleId}) to existing user: ${user.email}`);
        user.googleId = googleId;
        user.picture = picture || user.picture;
        await user.save();
        accountLinked = true;
      } else {
        return res.status(409).json({
          success: false,
          message: 'An account with this email already exists. Please use password login or request account linking.'
        });
      }
    }

    // Generate token
    const token = generateToken(user._id);
    if (!token) {
      return res.status(500).json({
        success: false,
        message: 'Error generating authentication token'
      });
    }

    // Get role-specific ID if not already set
    if (!roleSpecificData) {
      try {
        if (user.role === 'patient') {
          const { Patient } = await import("../models/Patient.js");
          const patient = await Patient.findOne({ user: user._id });
          if (patient) {
            roleSpecificData = { 
              patientId: patient._id,
              patientData: {
                bloodGroup: patient.bloodGroup,
                height: patient.height,
                weight: patient.weight,
                status: patient.status || 'Active'
              }
            };
          }
        } 
        // ... other role fetching code remains the same ...
      } catch (error) {
        console.error('Error fetching role-specific data:', error);
      }
    }

    // Send response
    res.status(200).json({
      success: true,
      data: {
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
          picture: user.picture || '../assets/Man.jpg',
          ...roleSpecificData
        },
        token,
        isNewUser,
        accountLinked
      }
    });
  } catch (error) {
    console.error('Google login error:', error);
    res.status(500).json({
      success: false,
      message: 'Error during Google authentication',
      error: error.message
    });
  }
};

// Helper function for Google sign-up (used by OAuth callback)
const handleGoogleSignUp = async (userData) => {
  try {
    // Create a new user record
    const user = await User.create(userData);
    
    // Try to create a role-specific record but don't fail if it doesn't work
    try {
      // Create role-specific records based on user role
      if (userData.role === 'patient') {
        const { Patient } = await import("../models/Patient.js");
        const patient = await Patient.create({
          user: user._id,
          bloodGroup: 'O+',
          height: 170,
          weight: 70,
          allergies: [],
          chronicDiseases: [],
          status: 'Active'
        });
        return { 
          success: true, 
          user,
          roleData: { 
            patientId: patient._id,
            patientData: {
              bloodGroup: patient.bloodGroup,
              height: patient.height,
              weight: patient.weight,
              status: patient.status
            }
          }
        };
      } 
      // ... other role creation code remains the same ...
    } catch (roleError) {
      // Log error but don't prevent user creation
      console.error('Error creating role-specific record during Google sign-up:', roleError);
    }
    
    return { success: true, user };
  } catch (error) {
    console.error('Error in Google sign-up:', error);
    return { success: false, error };
  }
};

// Google OAuth callback handler
export const googleCallback = async (req, res) => {
  try {
    const { code } = req.query;
    
    // Validate the OAuth2 client and Google API are properly imported
    if (!oauth2Client || !google) {
      console.error('OAuth2 client or Google API not properly initialized');
      return res.redirect(`${process.env.FRONTEND_URL}/login?error=oauth_configuration_error`);
    }
    
    // Exchange authorization code for tokens
    const { tokens } = await oauth2Client.getToken(code);
    oauth2Client.setCredentials(tokens);

    // Get user info from Google
    const { data } = await google.oauth2('v2').userinfo.get();
    const { email, name, picture, id: googleId } = data;

    // Check if user exists
    let user = await User.findOne({ email });
    let roleSpecificData = {};
    let roleCreated = true;

    if (!user) {
      // Create new user with Google account
      const userData = {
        name,
        email,
        password: crypto.randomBytes(20).toString('hex'),
        role: 'patient',
        googleId,
        picture: picture,
        isVerified: true
      };
      
      // Use the helper function to create user and role-specific record
      const result = await handleGoogleSignUp(userData);
      
      if (!result.success) {
        console.error('Failed to create user during Google OAuth callback:', result.error);
        return res.redirect(`${process.env.FRONTEND_URL}/login?error=user_creation_failed`);
      }
      
      user = result.user;
      if (result.roleData) {
        roleSpecificData = result.roleData;
      } else {
        roleCreated = false;
      }
    } else {
      // For existing users, update Google ID if not set
      if (!user.googleId) {
        user.googleId = googleId;
        user.picture = picture || user.picture;
        await user.save();
      }
      
      // Get role-specific data for existing user
      if (user.role === 'patient') {
        const { Patient } = await import("../models/Patient.js");
        const patient = await Patient.findOne({ user: user._id });
        if (patient) {
          roleSpecificData = { 
            patientId: patient._id,
            patientData: {
              bloodGroup: patient.bloodGroup,
              height: patient.height,
              weight: patient.weight,
              status: patient.status || 'Active'
            }
          };
        } else {
          // If patient record doesn't exist for some reason, create one
          try {
            const newPatient = await Patient.create({
              user: user._id,
              bloodGroup: 'O+',
              height: 170,
              weight: 70,
              allergies: [],
              chronicDiseases: [],
              status: 'Active'
            });
            roleSpecificData = { 
              patientId: newPatient._id,
              patientData: {
                bloodGroup: newPatient.bloodGroup,
                height: newPatient.height,
                weight: newPatient.weight,
                status: newPatient.status
              }
            };
          } catch (error) {
            console.error('Error creating patient record for existing user:', error);
            roleCreated = false;
          }
        }
      }
      // ... similar code for other roles ...
    }

    // Generate token
    const token = generateToken(user._id);
    if (!token) {
      console.error('Failed to generate token for user:', user._id);
      return res.redirect(`${process.env.FRONTEND_URL}/login?error=token_generation_failed`);
    }
    
    // Prepare response data
    const responseData = {
      token,
      success: true,
      message: 'Authentication successful',
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        picture: user.picture || picture,
        ...roleSpecificData
      },
      setupNeeded: !roleCreated
    };

    // Redirect to frontend with data
    const queryParams = new URLSearchParams(responseData).toString();
    res.redirect(`${process.env.FRONTEND_URL}/auth/google/callback?${queryParams}`);
  } catch (error) {
    console.error('Google OAuth callback error:', error);
    res.redirect(`${process.env.FRONTEND_URL}/login?error=google_auth_failed`);
  }
};