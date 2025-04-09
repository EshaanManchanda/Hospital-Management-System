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

    const requestData = { email, password: loginPassword };
    if (linkGoogleAccount) {
      requestData.linkGoogleAccount = true;
    }

    const response = await api.post('/api/auth/login', requestData);
    const data = response.data;

    if (!data || !data.success) {
      throw new Error(data?.message || 'Login failed');
    }

    if (!data.token) {
      throw new Error('No authentication token received');
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
    console.log('Stored token:', data.token.substring(0, 20) + '...');
    localStorage.setItem('userData', JSON.stringify(userData));
    api.defaults.headers.common['Authorization'] = `Bearer ${data.token}`;

    return { success: true, data: { token: data.token, user: userData } };
  } catch (error) {
    console.error('Login error:', error);
    return { success: false, message: error.message };
  }
};

// Token verification
const verifyToken = async () => {
  const token = localStorage.getItem('token');
  if (!token) {
    throw new Error('No token provided');
  }

  // Debug logging
  console.log('Verifying token - First 20 chars:', token.substring(0, 20) + '...');
  
  try {
    // Validate token format before sending to server
    if (!validateToken(token)) {
      console.error('Invalid token format detected before API call');
      localStorage.removeItem('token');
      throw new Error('Invalid token format');
    }
    
    // Send token for verification
    const response = await api.get('/api/auth/verify-token', {
      headers: { Authorization: `Bearer ${token}` },
    });
    
    console.log('Token verification successful:', response.data);
    return response.data.user; // Return user data from the response
  } catch (error) {
    console.error('Token verification failed:', error);
    // Clear invalid token
    localStorage.removeItem('token');
    throw new Error('Invalid token format');
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
    // First, clear local storage and API headers
    localStorage.removeItem('token');
    localStorage.removeItem('userData');
    api.defaults.headers.common['Authorization'] = '';
    
    // Then try to call the server API, but don't depend on its success
    try {
      const token = localStorage.getItem('token');
      if (token) {
        await api.post('/api/auth/logout', null, {
          headers: { Authorization: `Bearer ${token}` },
        });
      }
    } catch (apiError) {
      // Log error but don't fail the logout process
      console.log('Server logout API call failed, but local session was cleared');
    }
    
    return { success: true, message: 'Logged out successfully' };
  } catch (error) {
    console.error('Logout error:', error);
    // Even if there's an error, we should still clear local data
    localStorage.removeItem('token');
    localStorage.removeItem('userData');
    api.defaults.headers.common['Authorization'] = '';
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

    // Token is valid, get user profile data
    const profileResponse = await api.get('/api/auth/profile', {
      headers: { Authorization: `Bearer ${token}` },
    });

    // Prepare user data from the response
    const userData = {
      userId: verifyResponse.data.user.id,
      name: verifyResponse.data.user.name,
      email: verifyResponse.data.user.email,
      role: verifyResponse.data.user.role,
      picture: verifyResponse.data.user.picture
    };

    // Store user data
    localStorage.setItem('userData', JSON.stringify(userData));

    return { 
      success: true, 
      userData,
      user: userData
    };
  } catch (error) {
    console.error('Google OAuth callback error:', error);
    throw new Error('Authentication failed');
  }
};

// Register a new user
const register = async (userData) => {
  try {
    const response = await api.post('/api/auth/register', userData);
    const data = response.data;

    if (!data || !data.success) {
      throw new Error(data?.message || 'Registration failed');
    }

    // If registration returns a token, store it
    if (data.token) {
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
    }

    return { success: true, data: data };
  } catch (error) {
    console.error('Registration error:', error);
    return { success: false, message: error.message || 'Registration failed' };
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

const authService = {
  login,
  logout,
  verifyToken,
  validateToken,
  isAuthenticated,
  handleGoogleCallback,
  register,
  initiateGoogleLogin,
  loginWithGoogle,
  getUserData: () => {
    return JSON.parse(localStorage.getItem('userData'));
  },
  getUserRole: () => {
    const userData = authService.getUserData();
    return userData ? userData.role : null;
  },
};

export default authService;
