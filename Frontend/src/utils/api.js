import axios from 'axios';
import { toast } from 'react-hot-toast';
import authService from '../services/authService';
import patientService from '../services/patientService';
import doctorService from '../services/doctorService';
import appointmentService from '../services/appointmentService';

// Get the API URL from environment variables or use the fallback
const apiBaseUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000';
// Ensure we have the correct base URL structure
const apiBaseUrlWithoutApi = apiBaseUrl.endsWith('/api') 
  ? apiBaseUrl.slice(0, -4) 
  : apiBaseUrl;

console.log('API configured with:', { 
  baseUrl: apiBaseUrlWithoutApi,
  withCredentials: true,
  fullUrl: `${apiBaseUrlWithoutApi}/api/auth/login`
});

// Create axios instance
const api = axios.create({
  baseURL: apiBaseUrlWithoutApi,  // Use base URL without /api
  timeout: 15000,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true, // Enable sending cookies in cross-origin requests
});

// Request interceptor for adding auth token
api.interceptors.request.use(
  (config) => {
    // Log all outgoing requests for debugging
    console.log(`API Request: ${config.method.toUpperCase()} ${config.baseURL}${config.url}`, {
      headers: config.headers,
      withCredentials: config.withCredentials
    });
    
    // Get token from localStorage
    const token = localStorage.getItem('token');
    
    // If token exists, add to headers
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    
    return config;
  },
  (error) => {
    console.error('API Request Error:', error);
    return Promise.reject(error);
  }
);

// Response interceptor for handling errors
api.interceptors.response.use(
  (response) => {
    // Log successful responses
    console.log(`API Response Success: ${response.config.method.toUpperCase()} ${response.config.url}`, {
      status: response.status,
      data: response.data
    });
    return response;
  },
  (error) => {
    console.error('API Response Error:', error);
    
    // Handle specific error cases
    if (error.response) {
      // The request was made and the server responded with a status code
      // that falls out of the range of 2xx
      console.error('Response data:', error.response.data);
      console.error('Response status:', error.response.status);
      console.error('Request URL:', error.config.baseURL + error.config.url);
      
      // Handle authentication errors
      if (error.response.status === 401) {
        console.error('Authentication Error Details:', {
          url: error.config.url,
          method: error.config.method,
          data: error.config.data,
          message: error.response.data.message || 'Authentication failed'
        });
        
        // Check if it's a token expiration error or invalid credentials
        if (error.response.data.message && 
            (error.response.data.message.includes('expired') || 
             error.response.data.message.includes('invalid token'))) {
          toast.error('Your session has expired. Please login again.');
          // Clear auth data
          localStorage.removeItem('token');
          localStorage.removeItem('userData');
          
          // Redirect to login after a short delay
          setTimeout(() => {
            window.location.href = '/login';
          }, 1500);
        } else {
          // Most likely invalid credentials - don't show toast here
          // Let the login component handle the error message
          console.error('Login credentials error:', error.response.data.message || 'Invalid credentials');
        }
      }
    } else if (error.request) {
      // The request was made but no response was received
      console.error('Request made but no response received:', error.request);
      toast.error('No response from server. Please check your connection and make sure the backend is running.');
    } else {
      // Something happened in setting up the request that triggered an Error
      console.error('Error setting up request:', error.message);
    }
    
    return Promise.reject(error);
  }
);

// Re-export the services from the services directory
export {
  authService,
  patientService,
  doctorService,
  appointmentService
};

export default api;