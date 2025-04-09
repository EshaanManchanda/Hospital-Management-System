import axios from 'axios';
import { toast } from 'react-hot-toast';
import authService from '../services/authService';
import patientService from '../services/patientService';
import doctorService from '../services/doctorService';
import appointmentService from '../services/appointmentService';

// Get the API URL from environment variables or use the fallback
const apiBaseUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000';
// No need to append /api as it's included in the routes
const apiTimeout = parseInt(import.meta.env.VITE_API_TIMEOUT || '45000');

console.log('API configured with:', { 
  baseUrl: apiBaseUrl,
  timeout: apiTimeout 
});

// Create axios instance
const api = axios.create({
  baseURL: apiBaseUrl,  // Use apiBaseUrl directly without appending /api
  timeout: 15000,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true, // Enable sending cookies in cross-origin requests
});

// Request interceptor for adding auth token
api.interceptors.request.use(
  (config) => {
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
      
      // Handle authentication errors
      if (error.response.status === 401 || error.response.status === 403) {
        // Check if it's a token expiration error
        if (error.response.data.message && 
            (error.response.data.message.includes('expired') || 
             error.response.data.message.includes('invalid'))) {
          toast.error('Your session has expired. Please login again.');
          // Clear auth data
          localStorage.removeItem('token');
          localStorage.removeItem('userData');
          
          // Redirect to login after a short delay
          setTimeout(() => {
            window.location.href = '/login';
          }, 1500);
        }
      }
    } else if (error.request) {
      // The request was made but no response was received
      console.error('Request made but no response received:', error.request);
      toast.error('No response from server. Please check your connection.');
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