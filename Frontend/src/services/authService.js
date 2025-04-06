import api from '../utils/api';

/**
 * Authentication service for login, registration, and user profile management
 */
const authService = {
  /**
   * Login a user with email and password
   * @param {string} email - User email
   * @param {string} password - User password
   * @returns {Promise<Object>} User data and token
   */
  login: async (email, password) => {
    try {
      const response = await api.post('/auth/login', { email, password });
      const data = response.data;
      
      console.log("Auth service login response:", data);
      
      // Store auth data in localStorage
      if (data.token) {
        localStorage.setItem('token', data.token);
        
        // Ensure we have a role - try different possible locations in the response
        const userRole = data.role || data.userRole || (data.user && data.user.role);
        
        console.log("Role found in response:", userRole);
        
        if (userRole) {
          localStorage.setItem('userRole', userRole);
          console.log("Role stored in localStorage:", userRole);
        } else {
          console.warn("No role found in response. Response data structure:", JSON.stringify(data));
        }
        
        // Create a userData object from the response
        // Try to extract user info from different possible response structures
        const userData = {
          userId: data._id || data.userId || (data.user && data.user._id) || "unknown",
          name: data.name || (data.user && data.user.name) || "",
          email: data.email || email || (data.user && data.user.email) || "",
          role: userRole || "unknown"
        };
        
        // Add patientId if it exists (for patient role)
        if (userRole === 'patient' && data.patientId) {
          userData.patientId = data.patientId;
        } else if (userRole === 'patient' && data.patient && data.patient._id) {
          userData.patientId = data.patient._id;
        }
        
        localStorage.setItem('userData', JSON.stringify(userData));
        console.log("User data stored in localStorage:", userData);
      } else {
        console.warn("No token in response:", data);
      }
      
      return data;
    } catch (error) {
      console.error('Login error in authService:', error);
      throw error;
    }
  },
  
  /**
   * Debug function to test the login process without storing data
   * @param {string} email - User email
   * @param {string} password - User password
   * @returns {Promise<Object>} Login response data
   */
  debugLogin: async (email, password) => {
    try {
      // Make the request without storing anything
      const response = await api.post('/auth/login', { email, password });
      
      // Return the data
      return response.data;
    } catch (error) {
      throw error;
    }
  },
  
  /**
   * Register a new patient
   * @param {Object} userData - User registration data
   * @returns {Promise<Object>} Registered user data
   */
  register: async (userData) => {
    try {
      const response = await api.post('/patients/register', userData);
      const data = response.data;
      
      // Check if registration is successful
      if (data.success) {
        // Store token if it exists
        if (data.token) {
          localStorage.setItem('token', data.token);
        }
        
        // Get patientId - either directly from response or from data.patient
        const patientId = data.patientId || (data.data && data.data.patient && data.data.patient._id);
        
        // Get user info
        const user = data.data && data.data.user;
        
        if (user && patientId) {
          // Store role
          localStorage.setItem('userRole', 'patient');
          
          // Create and store user data with patient ID
          const userData = {
            userId: user._id,
            patientId: patientId,
            name: user.name,
            email: user.email,
            role: 'patient'
          };
          
          localStorage.setItem('userData', JSON.stringify(userData));
        }
      }
      
      return response.data;
    } catch (error) {
      throw error;
    }
  },
  
  /**
   * Get the current user's profile
   * @returns {Promise<Object>} User profile data
   */
  getProfile: async () => {
    try {
      const response = await api.get('/auth/profile');
      return response.data;
    } catch (error) {
      throw error;
    }
  },
  
  /**
   * Update the current user's profile
   * @param {Object} userData - User data to update
   * @returns {Promise<Object>} Updated user data
   */
  updateProfile: async (userData) => {
    try {
      const response = await api.put('/auth/profile', userData);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  /**
   * Logout the current user
   */
  logout: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('userRole');
    localStorage.removeItem('userData');
    // Redirect to login page
    window.location.href = '/login';
  },

  /**
   * Check if the user is authenticated
   * @returns {boolean} Whether the user is authenticated
   */
  isAuthenticated: () => {
    return !!localStorage.getItem('token');
  },

  /**
   * Get the current user's role
   * @returns {string|null} The user's role
   */
  getUserRole: () => {
    return localStorage.getItem('userRole');
  },

  /**
   * Get the current user's data
   * @returns {Object|null} The user's data
   */
  getUserData: () => {
    const userData = localStorage.getItem('userData');
    return userData ? JSON.parse(userData) : null;
  }
};

export default authService; 