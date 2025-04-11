import React, { createContext, useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import api from '../utils/api';
import { useDispatch } from 'react-redux';
import { authService } from '../services';
import { useAuth } from './AuthContext';
import { API_BASE_URL, ROUTES } from '../config/constants';

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

const GoogleAuthContext = createContext();

// Validate user data structure
const validateUserData = (userData) => {
  if (!userData) return false;
  
  console.log("Validating user data:", userData);
  
  // Check if either id or userId is present (support both formats)
  if (!userData.id && !userData.userId) {
    console.error("Missing id/userId in userData:", userData);
    return false;
  }
  
  // Check for other required fields
  if (!userData.name) {
    console.error("Missing name in userData:", userData);
    return false;
  }
  
  if (!userData.email) {
    console.error("Missing email in userData:", userData);
    return false;
  }
  
  if (!userData.role) {
    console.error("Missing role in userData:", userData);
    return false;
  }
  
  return true;
};

// Validate JWT token format
const validateToken = (token) => {
  if (!token || typeof token !== 'string') {
    return false;
  }
  
  const parts = token.split('.');
  if (parts.length !== 3) {
    return false;
  }
  
  try {
    // Check if each part is a valid base64 string
    parts.forEach(part => {
      atob(part.replace(/-/g, '+').replace(/_/g, '/'));
    });
    return true;
  } catch (error) {
    console.error('Token validation error:', error);
    return false;
  }
};

export const GoogleAuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { login: authLogin } = useAuth();

  // Check initial authentication
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const token = localStorage.getItem('token');
        const userDataStr = localStorage.getItem('userData');
        
        if (!token || !userDataStr) {
          setUser(null);
          return;
        }
        
        // Validate token format
        if (!validateToken(token)) {
          console.error('Invalid token format found in localStorage');
          await handleLogout();
          return;
        }
        
        // Parse and validate user data
        const userData = JSON.parse(userDataStr);
        if (!validateUserData(userData)) {
          console.error('Invalid user data found in localStorage');
          await handleLogout();
          return;
        }
        
        // Verify token with backend
        try {
          await authService.verifyToken();
          setUser(userData);
          dispatch({ type: 'AUTH_SUCCESS', payload: userData });
        } catch (error) {
          console.error('Token verification failed:', error);
          await handleLogout();
        }
      } catch (error) {
        console.error('Auth check error:', error);
        await handleLogout();
      }
    };

    checkAuth();
  }, [dispatch]);

  const handleLogout = async () => {
    try {
      setLoading(true);
      await authService.logout();
      setUser(null);
      dispatch({ type: 'LOGOUT' });
      navigate(ROUTES.LOGIN);
    } catch (error) {
      console.error('Logout error:', error);
      toast.error('Error during logout');
    } finally {
      setLoading(false);
    }
  };

  // Google login handler - redirects to Google OAuth
  const initiateGoogleLogin = async (role = 'patient') => {
    try {
      setLoading(true);
      setError(null);
      console.log('Initiating Google login flow');
      
      // Store current path for redirect after login
      const currentPath = window.location.pathname;
      if (currentPath !== ROUTES.LOGIN && currentPath !== ROUTES.REGISTER) {
        sessionStorage.setItem('redirectAfterLogin', currentPath);
      }
      
      // Check if we want to link accounts
      const linkAccount = sessionStorage.getItem('linkGoogleAccount') === 'true';
      
      // Store role in session storage
      sessionStorage.setItem('googleAuthRole', role);
      console.log(`Initiating Google login for role: ${role}, link account: ${linkAccount}`);
      
      // Use authService.initiateGoogleLogin directly
      const success = authService.initiateGoogleLogin(role);
      
      if (!success) {
        throw new Error('Failed to initiate Google login');
      }
      
      // The redirect will be handled by the authService function
      // No need to do anything else here as we're leaving the page
    } catch (error) {
      console.error('Google login initiation error:', error);
      setError(error.message || 'Failed to initiate Google login');
      toast.error(error.message || 'Failed to initiate Google login');
      setLoading(false);
      throw error; // Re-throw to allow components to catch it
    }
  };

  // Process Google login data after successful authentication
  const handleGoogleLogin = async (googleData) => {
    try {
      setLoading(true);
      setError(null);

      if (!googleData || !validateUserData(googleData)) {
        throw new Error('Invalid Google user data');
      }

      // Always generate a secure password for Google authentication
      const generatedPassword = generateSecurePassword();
      console.log('Generated secure password for Google login');

      console.log('Sending Google auth data to backend');
      
      // Send to backend for authentication
      const response = await authService.loginWithGoogle({
        googleId: googleData.googleId,
        email: googleData.email,
        name: googleData.name,
        gender: googleData.gender || 'other',
        password: generatedPassword, // Always include the generated secure password
        role: sessionStorage.getItem('googleAuthRole') || 'patient' // Get role from session storage
      });

      if (!response.success) {
        throw new Error(response.message || 'Google login failed');
      }

      const { token, user: userData } = response.data;

      // Store authentication data
      localStorage.setItem('token', token);
      localStorage.setItem('userData', JSON.stringify(userData));
      api.defaults.headers.common['Authorization'] = `Bearer ${token}`;

      // Update application state
      setUser(userData);
      dispatch({ type: 'AUTH_SUCCESS', payload: userData });

      // Show success message
      toast.success('Successfully logged in with Google!');

      // Handle redirect based on user role
      let redirectPath;
      switch (userData.role) {
        case 'admin':
          redirectPath = ROUTES.ADMIN_DASHBOARD;
          break;
        case 'doctor':
          redirectPath = ROUTES.DOCTOR_DASHBOARD;
          break;
        case 'patient':
          redirectPath = ROUTES.PATIENT_DASHBOARD;
          break;
        case 'nurse':
          redirectPath = ROUTES.NURSE_DASHBOARD;
          break;
        case 'receptionist':
          redirectPath = ROUTES.RECEPTIONIST_DASHBOARD;
          break;
        default:
          redirectPath = ROUTES.HOME; // Fallback to home if role is not recognized
      }

      navigate(redirectPath);

      return response;
    } catch (error) {
      console.error('Google login error:', error);
      setError(error.message || 'Google login failed');
      toast.error(error.message || 'Google login failed');
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // Handle callback after Google OAuth redirect
  const handleOAuthCallback = async (token) => {
    try {
      setLoading(true);
      setError(null);
      
      if (!token) {
        throw new Error('No token received from Google authentication');
      }
      
      // Generate a secure password for Google users
      const generatedPassword = generateSecurePassword();
      console.log('Generated secure password for Google OAuth callback');
      
      // Set the token in localStorage and API headers
      localStorage.setItem('token', token);
      api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      
      // First verify the token
      const verifyResponse = await api.get('/api/auth/verify-token', {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      if (!verifyResponse.data || !verifyResponse.data.success) {
        throw new Error('Token verification failed');
      }
      
      // Get user data from API
      const response = await api.get('/api/auth/profile', {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      const userData = response.data;
      
      if (!userData || !userData.email) {
        throw new Error('Invalid user data received');
      }
      
      // Create standard user data object
      const standardUserData = {
        userId: userData._id,
        name: userData.name,
        email: userData.email,
        role: userData.role || 'patient',
        picture: userData.picture
      };
      
      // Add role-specific IDs if available
      if (userData.patientId) standardUserData.patientId = userData.patientId;
      if (userData.doctorId) standardUserData.doctorId = userData.doctorId;
      if (userData.adminId) standardUserData.adminId = userData.adminId;
      if (userData.nurseId) standardUserData.nurseId = userData.nurseId;
      if (userData.receptionistId) standardUserData.receptionistId = userData.receptionistId;
      
      // Store user data
      localStorage.setItem('userData', JSON.stringify(standardUserData));
      localStorage.setItem('userRole', userData.role || 'patient');
      
      // Update application state
      setUser(standardUserData);
      dispatch({ type: 'AUTH_SUCCESS', payload: standardUserData });
      
      // Show success message
      toast.success('Google login successful');
      
      // Determine redirect path based on user role
      let redirectPath;
      switch (userData.role) {
        case 'admin':
          redirectPath = ROUTES.ADMIN_DASHBOARD;
          break;
        case 'doctor':
          redirectPath = ROUTES.DOCTOR_DASHBOARD;
          break;
        case 'patient':
          redirectPath = ROUTES.PATIENT_DASHBOARD;
          break;
        case 'nurse':
          redirectPath = ROUTES.NURSE_DASHBOARD;
          break;
        case 'receptionist':
          redirectPath = ROUTES.RECEPTIONIST_DASHBOARD;
          break;  
        default:
          redirectPath = ROUTES.HOME; // Fallback to home if role is not recognized
      }
      
      return { userData: standardUserData, redirectPath };
    } catch (error) {
      console.error('Google OAuth callback error:', error);
      setError(error.message || 'Google authentication failed');
      toast.error(error.message || 'Google authentication failed');
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const value = {
    user,
    loading,
    error,
    setError,
    initiateGoogleLogin,
    handleGoogleLogin,
    handleOAuthCallback,
    logout: handleLogout
  };

  return (
    <GoogleAuthContext.Provider value={value}>
      {children}
    </GoogleAuthContext.Provider>
  );
};

export const useGoogleAuth = () => {
  const context = useContext(GoogleAuthContext);
  if (!context) {
    throw new Error('useGoogleAuth must be used within a GoogleAuthProvider');
  }
  return context;
}; 