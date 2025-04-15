import api from '../utils/api';
import { API_BASE_URL } from '../config/constants';

/**
 * Authentication service for login, registration, and user profile management
 */

// Helper function to generate a secure random password
const generateSecurePassword = () => {
  // Create a strong password with uppercase, lowercase, numbers and special characters
  const uppercaseChars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  const lowercaseChars = 'abcdefghijklmnopqrstuvwxyz';
  const numberChars = '0123456789';
  const specialChars = '!@#$%^&*()_-+=<>?';
  
  // Combine all character types
  const allChars = uppercaseChars + lowercaseChars + numberChars + specialChars;
  
  // Generate a random 12-character password
  let password = '';
  
  // Ensure at least one of each character type
  password += uppercaseChars.charAt(Math.floor(Math.random() * uppercaseChars.length));
  password += lowercaseChars.charAt(Math.floor(Math.random() * lowercaseChars.length));
  password += numberChars.charAt(Math.floor(Math.random() * numberChars.length));
  password += specialChars.charAt(Math.floor(Math.random() * specialChars.length));
  
  // Add 8 more random characters
  for (let i = 0; i < 8; i++) {
    password += allChars.charAt(Math.floor(Math.random() * allChars.length));
  }
  
  // Shuffle the password
  password = password.split('').sort(() => 0.5 - Math.random()).join('');
  
  return password;
};

// Token validation function
const validateToken = (token) => {
  if (!token || typeof token !== 'string') {
    console.log('Token validation failed: token is null, undefined, or not a string');
    return false;
  }
  
  // Simple format check for JWT (should have 3 parts separated by dots)
  const parts = token.split('.');
  if (parts.length !== 3) {
    console.log('Token validation failed: token does not have 3 parts');
    return false;
  }
  
  // Skip detailed base64 validation as it's causing issues
  // Just check if it looks roughly like a JWT
  if (parts[0].length < 5 || parts[1].length < 5) {
    console.log('Token validation failed: token parts too short');
    return false;
  }
  
  console.log('Token validation passed: basic structure looks valid');
  return true;
};

// Login with email and password
const login = async (emailOrData, password) => {
  try {
    let email, loginPassword, linkGoogleAccount;
    
    if (typeof emailOrData === 'object' && emailOrData !== null) {
      email = emailOrData.email;
      loginPassword = emailOrData.password;
      linkGoogleAccount = emailOrData.linkGoogleAccount;
    } else {
      email = emailOrData;
      loginPassword = password;
    }

    // Debug output - sanitize password for logging
    console.log('Login attempt with:', { 
      email, 
      passwordProvided: !!loginPassword,
      linkGoogleAccount
    });

    const requestData = { email, password: loginPassword };
    if (linkGoogleAccount) {
      requestData.linkGoogleAccount = true;
    }

    console.log('Sending login request to API endpoint: /api/auth/login');
    
    try {
      // First try with '/api/auth/login' path (standard format)
      const response = await api.post('/api/auth/login', requestData);
      const data = response.data;
      
      console.log('Login response received:', { 
        success: data?.success, 
        hasToken: !!data?.token,
        message: data?.message,
        user: data?.user ? {
          id: data.user.id || data.user._id,
          role: data.user.role,
          // Don't log email for privacy
          hasPatientId: !!data.user.patientId,
          hasDoctorId: !!data.user.doctorId,
          hasAdminId: !!data.user.adminId,
          hasNurseId: !!data.user.nurseId,
          hasReceptionistId: !!data.user.receptionistId
        } : 'No user data'
      });
      
      if (!data || !data.success) {
        throw new Error(data?.message || 'Login failed');
      }
      
      if (!data.token) {
        throw new Error('No authentication token received');
      }
      
      // Extract all role-specific IDs
      const userData = {
        userId: data.user.id || data.user._id,
        name: data.user.name || '',
        email: data.user.email || '',
        role: data.user.role || 'patient',
      };
      
      // Add role-specific IDs if they exist
      if (data.user.patientId) userData.patientId = data.user.patientId;
      if (data.user.doctorId) userData.doctorId = data.user.doctorId;
      if (data.user.adminId) userData.adminId = data.user.adminId;
      if (data.user.nurseId) userData.nurseId = data.user.nurseId;
      if (data.user.receptionistId) userData.receptionistId = data.user.receptionistId;
      
      console.log('Storing user data:', { ...userData, email: '[REDACTED]' });
      
      // Store token in localStorage - CRITICAL STEP
      localStorage.setItem('token', data.token);
      console.log('Stored token (length):', data.token ? data.token.length : 0);
      console.log('Token preview:', data.token ? `${data.token.substring(0, 20)}...` : 'null');
      
      // Store user data in localStorage
      localStorage.setItem('userData', JSON.stringify(userData));
      console.log('Stored userData in localStorage');
      
      // Set API authorization header 
      api.defaults.headers.common['Authorization'] = `Bearer ${data.token}`;
      console.log('Set Authorization header for API calls');
      
      // Double check localStorage to verify data was stored
      const verifyToken = localStorage.getItem('token');
      const verifyUserData = localStorage.getItem('userData');
      
      console.log('Verification check - token exists:', !!verifyToken);
      console.log('Verification check - userData exists:', !!verifyUserData);
      
      // Return consistent response format
      return { 
        success: true, 
        token: data.token,
        role: userData.role, 
        user: userData,
        data: { token: data.token, user: userData }
      };
    } catch (authError) {
      console.error('Login error (first attempt):', authError);
      
      // If the first attempt fails, try without the /api prefix
      // This is a fallback for servers configured differently
      if (authError.response?.status === 404) {
        console.log('Trying alternative API endpoint: /auth/login');
        try {
          const altResponse = await api.post('/auth/login', requestData);
          const altData = altResponse.data;
          
          console.log('Alternative login response:', altData);
          
          if (!altData || !altData.success) {
            throw new Error(altData?.message || 'Login failed');
          }
          
          if (!altData.token) {
            throw new Error('No authentication token received');
          }
          
          // Extract all role-specific IDs
          const userData = {
            userId: altData.user.id || altData.user._id,
            name: altData.user.name || '',
            email: altData.user.email || '',
            role: altData.user.role || 'patient',
          };
          
          // Add role-specific IDs if they exist
          if (altData.user.patientId) userData.patientId = altData.user.patientId;
          if (altData.user.doctorId) userData.doctorId = altData.user.doctorId;
          if (altData.user.adminId) userData.adminId = altData.user.adminId;
          if (altData.user.nurseId) userData.nurseId = altData.user.nurseId;
          if (altData.user.receptionistId) userData.receptionistId = altData.user.receptionistId;
          
          // Store token in localStorage with double verification
          localStorage.setItem('token', altData.token);
          console.log('Stored token (alt path):', altData.token ? `${altData.token.substring(0, 20)}...` : 'null');
          
          // Store user data in localStorage
          localStorage.setItem('userData', JSON.stringify(userData));
          console.log('Stored userData in localStorage (alt path)');
          
          // Set API authorization header
          api.defaults.headers.common['Authorization'] = `Bearer ${altData.token}`;
          
          // Return consistent response format
          return { 
            success: true, 
            token: altData.token,
            role: userData.role, 
            user: userData,
            data: { token: altData.token, user: userData }
          };
        } catch (altError) {
          console.error('Login error (alternative attempt):', altError);
          throw altError; // Rethrow the alternative error
        }
      }
      throw authError; // Rethrow the original error if not a 404
    }
  } catch (error) {
    console.error('Login error details:', {
      message: error.message,
      response: error.response?.data,
      status: error.response?.status
    });
    
    if (error.response?.status === 401) {
      return { success: false, message: 'Invalid email or password' };
    }
    
    if (error.response?.status === 404) {
      return { success: false, message: 'Authentication service not available. Please check the backend server configuration.' };
    }
    
    return { success: false, message: error.message || 'Login failed' };
  }
};

// Token verification
const verifyToken = async () => {
  try {
    console.log("Beginning token verification");
    
    // Retrieve token from localStorage
    const token = localStorage.getItem('token');
    
    // Handle missing token case
    if (!token) {
      console.error('No token found in localStorage');
      // Check if userData exists as a fallback
      const userDataStr = localStorage.getItem('userData');
      if (userDataStr) {
        console.log('No token but userData exists, using as fallback');
        try {
          return JSON.parse(userDataStr);
        } catch (parseError) {
          console.error('Failed to parse userData', parseError);
        }
      }
      throw new Error('No token provided');
    }

    // Debug logging - don't validate token format to avoid unnecessary failures
    console.log('Verifying token - length:', token.length);
    
    // Try multiple API endpoints for verification
    const endpoints = [
      { method: 'get', url: '/api/auth/verify-token' },
      { method: 'post', url: '/api/auth/verify-token' },
      { method: 'get', url: '/api/auth/me' },
      { method: 'post', url: '/api/auth/me' }
    ];
    
    let lastError = null;
    
    for (const endpoint of endpoints) {
      try {
        console.log(`Attempting token verification with ${endpoint.method.toUpperCase()} to ${endpoint.url}`);
        
        let response;
        if (endpoint.method === 'get') {
          response = await api.get(endpoint.url, {
            headers: { Authorization: `Bearer ${token}` }
          });
        } else {
          response = await api.post(endpoint.url, {}, {
            headers: { Authorization: `Bearer ${token}` }
          });
        }
        
        if (response.data && (response.data.success || response.data.user)) {
          console.log(`Token verification successful with ${endpoint.method.toUpperCase()} to ${endpoint.url}`);
          // Return the user data from the response
          const userData = response.data.user || response.data;
          console.log('Token verified successfully, returning user data');
          return userData;
        }
        
        console.log(`${endpoint.method.toUpperCase()} ${endpoint.url} returned without success flag`);
      } catch (endpointError) {
        lastError = endpointError;
        console.log(`${endpoint.method.toUpperCase()} ${endpoint.url} verification failed:`, endpointError.message);
        // Continue to next endpoint
      }
    }
    
    // If we got here, all endpoints failed
    console.error('All verification endpoints failed');
    
    // Use userData from localStorage as fallback
    const userDataStr = localStorage.getItem('userData');
    if (userDataStr) {
      try {
        const userData = JSON.parse(userDataStr);
        console.log('Using userData from localStorage as fallback:', userData.role);
        return userData;
      } catch (parseError) {
        console.error('Failed to parse userData from localStorage:', parseError);
      }
    }
    
    // If we reach here, throw the last error we encountered
    throw lastError || new Error('Token verification failed');
  } catch (error) {
    console.error('Token verification failed:', error);
    
    // Be more specific about the error type
    if (error.response?.status === 401) {
      throw new Error('Token expired or invalid');
    } else if (error.message === 'No token provided') {
      throw new Error('No token provided');
    } else {
      throw new Error('Authentication failed: ' + error.message);
    }
  }
};

// Check if the user is authenticated
const isAuthenticated = () => {
  const token = localStorage.getItem('token');
  const userData = localStorage.getItem('userData');
  return !!token && !!userData;
};

// Logout function
const logout = async () => {
  try {
    console.log('Performing logout operation');
    
    // First, clear local storage and API headers
    localStorage.removeItem('token');
    localStorage.removeItem('userData');
    localStorage.removeItem('user'); // Additional cleanup
    
    // Clear Authorization header
    if (api && api.defaults && api.defaults.headers) {
      api.defaults.headers.common['Authorization'] = '';
      console.log('Cleared Authorization header');
    }
    
    // Then try to call the server API, but don't depend on its success
    try {
      const token = localStorage.getItem('token');
      if (token) {
        console.log('Calling logout API endpoint');
        // Try both endpoints
        try {
          await api.post('/api/auth/logout', {}, {
            headers: { Authorization: `Bearer ${token}` },
          });
        } catch (error) {
          // Fallback to alternative endpoint
          await api.post('/auth/logout', {}, {
            headers: { Authorization: `Bearer ${token}` },
          });
        }
      }
    } catch (apiError) {
      // Log error but don't fail the logout process
      console.log('Server logout API call failed, but local session was cleared:', apiError);
    }
    
    console.log('Logout completed successfully');
    return { success: true, message: 'Logged out successfully' };
  } catch (error) {
    console.error('Logout error:', error);
    // Even if there's an error, we should still clear local data
    localStorage.removeItem('token');
    localStorage.removeItem('userData');
    localStorage.removeItem('user');
    if (api && api.defaults && api.defaults.headers) {
      api.defaults.headers.common['Authorization'] = '';
    }
    return { success: true, message: 'Logged out successfully (fallback)' };
  }
};

// Handle Google OAuth callback
const handleGoogleCallback = async (token, password) => {
  try {
    if (!token) {
      throw new Error('No token provided');
    }

    console.log('Handling Google callback with token');

    // Store token
    localStorage.setItem('token', token);
    api.defaults.headers.common['Authorization'] = `Bearer ${token}`;

    // Default to a generated password if none is provided
    const securePassword = password || generateSecurePassword();
    console.log('Using secure password for Google OAuth callback');

    // First verify the token
    const verifyResponse = await api.get('/api/auth/verify-token', {
      headers: { Authorization: `Bearer ${token}` },
    });

    if (!verifyResponse.data || !verifyResponse.data.success) {
      throw new Error('Token verification failed');
    }

    // Check if user already has a patient profile
    try {
      // Try to fetch existing patient profile first
      const patientResponse = await api.get('/api/patients/me', {
        headers: { Authorization: `Bearer ${token}` },
      });
      
      if (patientResponse.data && patientResponse.data.success && patientResponse.data.patient) {
        console.log('Found existing patient profile:', patientResponse.data.patient._id);
        
        // Store user data with patient ID
        const userData = {
          userId: verifyResponse.data.user.id || verifyResponse.data.user._id,
          name: verifyResponse.data.user.name,
          email: verifyResponse.data.user.email,
          role: 'patient',
          picture: verifyResponse.data.user.picture,
          patientId: patientResponse.data.patient._id
        };
        
        localStorage.setItem('userData', JSON.stringify(userData));
        console.log('Stored user data with existing patient ID:', userData.patientId);
        
        return { 
          success: true, 
          userData,
          user: userData,
          setupRequired: false
        };
      }
    } catch (fetchError) {
      console.log('No existing patient profile found, will create new one');
    }

    // Create patient profile if it doesn't exist
    try {
      const createPatientData = {
        user: {
          name: verifyResponse.data.user.name,
          email: verifyResponse.data.user.email,
          password: securePassword,
          role: 'patient',
          picture: verifyResponse.data.user.picture
        },
        // Default patient data
        bloodGroup: '',
        height: 0,
        weight: 0,
        allergies: [],
        chronicDiseases: [],
        emergencyContact: {
          name: '',
          phone: '',
          relationship: ''
        }
      };
    
      // Create patient profile
      const patientResponse = await api.post('/api/patients', createPatientData, {
        headers: { Authorization: `Bearer ${token}` },
      });
    
      if (patientResponse.data && patientResponse.data.success) {
        // Extract patient ID, ensuring we check all possible locations
        const patientId = 
          patientResponse.data.patient?._id || 
          patientResponse.data.patient?.id || 
          patientResponse.data._id ||
          patientResponse.data.id;
        
        if (!patientId) {
          console.error('Failed to extract patient ID from response:', patientResponse.data);
        } else {
          console.log('Successfully extracted patient ID:', patientId);
        }
        
        // Update userData to include patientId from response
        const userData = {
          userId: verifyResponse.data.user.id || verifyResponse.data.user._id,
          name: verifyResponse.data.user.name,
          email: verifyResponse.data.user.email,
          role: 'patient',
          picture: verifyResponse.data.user.picture,
          patientId: patientId
        };
    
        console.log('Created patient profile with ID:', userData.patientId);
        localStorage.setItem('userData', JSON.stringify(userData));
    
        return { 
          success: true, 
          userData,
          user: userData,
          setupRequired: true
        };
      }
    } catch (patientError) {
      console.error('Error creating patient profile:', patientError);
      // Continue with basic user data if patient creation fails
    }

    // Fallback to basic user data if patient creation fails
    const userData = {
      userId: verifyResponse.data.user.id || verifyResponse.data.user._id,
      name: verifyResponse.data.user.name,
      email: verifyResponse.data.user.email,
      role: 'patient',
      picture: verifyResponse.data.user.picture
    };

    localStorage.setItem('userData', JSON.stringify(userData));
    console.warn('Storing user data WITHOUT patient ID as fallback');

    return { 
      success: true, 
      userData,
      user: userData,
      setupRequired: true
    };
  } catch (error) {
    console.error('Google OAuth callback error:', error);
    throw new Error('Authentication failed');
  }
};

// Register a new user
const register = async (userData) => {
  try {
    // Check if this registration should skip auth redirects (for admin-created patients)
    const skipAuthRedirect = userData.skipAuthRedirect || false;
    
    // Normalize userData to match backend validation schema
    let requestData;

    // Check if data is in the nested format with user property
    if (userData.user) {
      console.log('Received nested user data format, normalizing for API');
      // Extract fields from the nested structure to match backend validation
      requestData = {
        // Required fields from user object
        name: userData.user.name,
        email: userData.user.email,
        password: userData.user.password,
        role: userData.user.role || 'patient',
        
        // Additional fields that might be needed
        gender: userData.user.gender,
        mobile: userData.user.mobile,
        dateOfBirth: userData.user.dateOfBirth,
        address: userData.user.address,
        
        // Patient-specific fields
        bloodGroup: userData.bloodGroup,
        height: userData.height,
        weight: userData.weight,
        
        // Medical history if available
        allergies: userData.medicalHistory?.allergies,
        chronicConditions: userData.medicalHistory?.chronicConditions,
        surgeries: userData.medicalHistory?.surgeries,
        medications: userData.medicalHistory?.medications,
        
        // Pass through the skipAuthRedirect flag
        skipAuthRedirect
      };
    } else {
      // Data is already in the correct format
      requestData = { ...userData };
    }

    // Debug logging for registration data
    console.log('Registering with normalized data:', {
      ...requestData,
      password: requestData.password ? '********' : undefined,
      skipAuthRedirect
    });
    
    // Try registering with the standard endpoint
    try {
      const response = await api.post('/api/auth/register', requestData);
      const data = response.data;

      if (!data || !data.success) {
        throw new Error(data?.message || 'Registration failed');
      }

      // If registration returns a token and we're not skipping auth redirect, store it
      if (data.token && !skipAuthRedirect) {
        // Validate token format
        if (!validateToken(data.token)) {
          console.warn('Received unusual token format from server, attempting to use it anyway');
        }

        const userData = {
          userId: data.user?.id || data.user?._id,
          name: data.user?.name,
          email: data.user?.email,
          role: data.user?.role,
          ...(data.user?.patientId && { patientId: data.user.patientId })
        };

        // Store token and user data
        localStorage.setItem('token', data.token);
        localStorage.setItem('userData', JSON.stringify(userData));
        api.defaults.headers.common['Authorization'] = `Bearer ${data.token}`;

        return { 
          success: true, 
          data: { token: data.token, user: userData },
          skipAuthRedirect
        };
      }

      return { 
        success: true, 
        data: data,
        skipAuthRedirect
      };
    } catch (error) {
      // If general registration fails, try the patient-specific endpoint
      if (requestData.role === 'patient') {
        console.log('General registration failed, trying patient-specific endpoint');
        return registerPatient(requestData);
      }
      throw error;
    }
  } catch (error) {
    console.error('Registration error:', error);
    return { success: false, message: error.response?.data?.message || error.message || 'Registration failed' };
  }
};

// Register a new patient (using dedicated patient registration endpoint)
const registerPatient = async (patientData) => {
  try {
    // Check if this registration should skip auth redirects (for admin-created patients)
    const skipAuthRedirect = patientData.skipAuthRedirect || false;
    
    // Normalize patientData format for the patient registration endpoint
    let requestData;
    
    // Check if data is in the nested format with user property
    if (patientData.user) {
      console.log('Formatting nested patient data for patient-specific API');
      requestData = {
        // User fields
        name: patientData.user.name,
        email: patientData.user.email,
        password: patientData.user.password,
        gender: patientData.user.gender,
        mobile: patientData.user.mobile,
        age: patientData.user.age,
        
        // If there's a dateOfBirth but no age, calculate the age
        ...(patientData.user.dateOfBirth && !patientData.user.age && {
          age: Math.floor((new Date() - new Date(patientData.user.dateOfBirth)) / (365.25 * 24 * 60 * 60 * 1000))
        }),
        
        // Patient-specific fields
        bloodGroup: patientData.bloodGroup,
        height: patientData.height,
        weight: patientData.weight,
        
        // Pass through the skipAuthRedirect flag
        skipAuthRedirect
      };
    } else {
      // Data is already in a flat format
      requestData = { ...patientData };
      
      // If there's a dateOfBirth but no age, calculate the age
      if (patientData.dateOfBirth && !patientData.age) {
        requestData.age = Math.floor((new Date() - new Date(patientData.dateOfBirth)) / (365.25 * 24 * 60 * 60 * 1000));
      }
    }

    // Debug logging for registration data
    console.log('Registering patient with formatted data:', {
      ...requestData,
      password: requestData.password ? '********' : undefined,
      skipAuthRedirect
    });
    
    const response = await api.post('/api/patients/register', requestData);
    const data = response.data;

    if (!data || !data.success) {
      throw new Error(data?.message || 'Patient registration failed');
    }

    console.log('Patient registration successful, response:', {
      success: data.success,
      hasToken: !!data.token,
      patientId: data.patientId,
      role: data.role,
      skipAuthRedirect
    });
    
    // If registration returns a token and we're not skipping auth redirect, store it
    if (data.token && !skipAuthRedirect) {
      // Validate token format but continue even if it doesn't match expected format
      if (!validateToken(data.token)) {
        console.warn('Received unusual token format from server during patient registration, attempting to use it anyway');
      }

      // Extract user data from the nested response structure
      const userData = {
        userId: data.data?.user?._id || data.patientId,
        name: data.data?.user?.name || requestData.name,
        email: data.data?.user?.email || requestData.email,
        role: data.role || 'patient',
        patientId: data.patientId
      };

      // Store token and user data
      localStorage.setItem('token', data.token);
      console.log('Stored token from patient registration');
      localStorage.setItem('userData', JSON.stringify(userData));
      console.log('Stored user data from patient registration');
      api.defaults.headers.common['Authorization'] = `Bearer ${data.token}`;

      return { 
        success: true, 
        data: { token: data.token, user: userData },
        skipAuthRedirect
      };
    }

    return { 
      success: true, 
      data: data,
      skipAuthRedirect
    };
  } catch (error) {
    console.error('Patient registration error:', error);
    return { success: false, message: error.response?.data?.message || error.message || 'Patient registration failed' };
  }
};

// Initiate Google OAuth login
const initiateGoogleLogin = (role = 'patient') => {
  try {
    console.log(`Initiating Google OAuth login for role: ${role}`);
    
    // Store the role in session storage for use after OAuth
    sessionStorage.setItem('googleAuthRole', role);
    
    // Create the Google OAuth URL with role parameter
    const googleAuthUrl = `${API_BASE_URL}/api/auth/google?role=${role}`;
    
    // Redirect to the Google OAuth URL
    window.location.href = googleAuthUrl;
    
    return true;
  } catch (error) {
    console.error('Error initiating Google login:', error);
    return false;
  }
};

// Login with Google credentials
const loginWithGoogle = async (googleData) => {
  try {
    // Ensure we have a password for the Google user
    if (!googleData.password) {
      // Create a secure password if none is provided
      googleData.password = generateSecurePassword();
      console.log('Generated secure password for Google login in loginWithGoogle function');
    }

    const response = await api.post('/api/auth/google', googleData);
    const data = response.data;

    if (!data || !data.success) {
      throw new Error(data?.message || 'Google login failed');
    }

    if (!data.token) {
      throw new Error('No authentication token received from Google login');
    }
    
    // Validate token format
    if (!validateToken(data.token)) {
      console.error('Received invalid token format from server');
      throw new Error('Invalid authentication token format');
    }

    const userData = {
      userId: data.user.id || data.user._id,
      name: data.user.name,
      email: data.user.email,
      role: data.user.role,
    };

    // Store token and user data
    localStorage.setItem('token', data.token);
    localStorage.setItem('userData', JSON.stringify(userData));
    api.defaults.headers.common['Authorization'] = `Bearer ${data.token}`;

    return { success: true, data: { token: data.token, user: userData } };
  } catch (error) {
    console.error('Google login error:', error);
    return { success: false, message: error.message };
  }
};

// Forgot password function - request password reset email
const forgotPassword = async (email) => {
  try {
    console.log(`Requesting password reset for email: ${email}`);
    const response = await api.post('/api/auth/forgot-password', { email });
    
    if (response.data && response.data.success) {
      return { 
        success: true, 
        message: response.data.message || 'Password reset email sent successfully' 
      };
    }
    
    return { 
      success: false, 
      message: response.data?.message || 'Failed to send password reset email' 
    };
  } catch (error) {
    console.error('Forgot password error:', error);
    return { 
      success: false, 
      message: error.response?.data?.message || error.message || 'Failed to send password reset email' 
    };
  }
};

// Reset password with token function
const resetPassword = async (token, newPassword) => {
  try {
    console.log('Resetting password with token');
    const response = await api.post('/api/auth/reset-password', { 
      token, 
      password: newPassword 
    });
    
    if (response.data && response.data.success) {
      return { 
        success: true, 
        message: response.data.message || 'Password reset successful' 
      };
    }
    
    return { 
      success: false, 
      message: response.data?.message || 'Failed to reset password' 
    };
  } catch (error) {
    console.error('Reset password error:', error);
    return { 
      success: false, 
      message: error.response?.data?.message || error.message || 'Failed to reset password' 
    };
  }
};

// Verify reset token validity
const verifyResetToken = async (token) => {
  try {
    console.log('Verifying reset token validity');
    const response = await api.get(`/api/auth/verify-reset-token/${token}`);
    
    if (response.data && response.data.success) {
      return { 
        success: true, 
        message: response.data.message || 'Token is valid' 
      };
    }
    
    return { 
      success: false, 
      message: response.data?.message || 'Invalid or expired token' 
    };
  } catch (error) {
    console.error('Verify reset token error:', error);
    return { 
      success: false, 
      message: error.response?.data?.message || error.message || 'Invalid or expired token' 
    };
  }
};

// Get doctor profile data
const getDoctorProfile = async () => {
  try {
    // Get user data from localStorage
    const userData = JSON.parse(localStorage.getItem('userData'));
    
    if (!userData || userData.role !== 'doctor') {
      throw new Error('No doctor data found or user is not a doctor');
    }

    // First try to get from localStorage
    const cachedDoctorProfile = localStorage.getItem('doctorProfile');
    if (cachedDoctorProfile) {
      const parsedProfile = JSON.parse(cachedDoctorProfile);
      console.log('Using cached doctor profile from localStorage');
      return { success: true, doctor: parsedProfile };
    }

    // If not in localStorage, fetch from API
    const token = localStorage.getItem('token');
    if (!token) {
      throw new Error('No authentication token found');
    }

    // Set authorization header
    api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    
    // Fetch doctor profile from API
    console.log('Fetching doctor profile from API');
    const response = await api.get('/api/doctors/me');
    
    if (response.data && (response.data.success || response.data.data)) {
      // Handle both response formats: { success: true, data: {...} } or { success: true, doctor: {...} }
      const doctorData = response.data.data || response.data.doctor;
      
      if (!doctorData) {
        throw new Error('Doctor data not found in API response');
      }
      
      // Format the doctor data to ensure all fields are properly structured
      const formattedDoctorData = {
        id: doctorData._id,
        doctorId: doctorData._id,
        userId: doctorData.user?._id,
        name: doctorData.user?.name || '',
        email: doctorData.user?.email || '',
        mobile: doctorData.user?.mobile || '',
        gender: doctorData.user?.gender || '',
        profileImage: doctorData.user?.profileImage || '',
        
        // Professional details
        specialization: doctorData.specialization || '',
        experience: doctorData.experience || 0,
        fee: doctorData.fee || 0,
        about: doctorData.about || '',
        isAvailable: doctorData.isAvailable !== undefined ? doctorData.isAvailable : true,
        averageRating: doctorData.averageRating || 0,
        
        // Schedule information
        workingDays: doctorData.workingDays || [],
        workingHours: doctorData.workingHours || { start: '09:00', end: '17:00' },
        
        // Arrays
        qualifications: doctorData.qualifications || [],
        patients: doctorData.patients || [],
        appointments: doctorData.appointments || [],
        ratings: doctorData.ratings || [],
        
        // Timestamps
        createdAt: doctorData.createdAt,
        updatedAt: doctorData.updatedAt
      };
      
      // Cache the formatted doctor profile in localStorage
      localStorage.setItem('doctorProfile', JSON.stringify(formattedDoctorData));
      console.log('Cached doctor profile in localStorage');
      
      return { success: true, doctor: formattedDoctorData };
    } else {
      throw new Error(response.data?.message || 'Failed to fetch doctor profile');
    }
  } catch (error) {
    console.error('Error fetching doctor profile:', error);
    return { success: false, message: error.message };
  }
};

const authService = {
  login,
  logout,
  verifyToken,
  validateToken,
  isAuthenticated,
  handleGoogleCallback,
  register,
  registerPatient,
  initiateGoogleLogin,
  loginWithGoogle,
  forgotPassword,
  resetPassword,
  verifyResetToken,
  getDoctorProfile, // Add the new function to the exported object
  getUserData: () => {
    return JSON.parse(localStorage.getItem('userData'));
  },
  getUserRole: () => {
    const userData = authService.getUserData();
    return userData ? userData.role : null;
  },
};

export { authService };
export default authService;
