import axios from 'axios';
import authService from '../services/authService';
import patientService from '../services/patientService';
import doctorService from '../services/doctorService';
import appointmentService from '../services/appointmentService';

// If you want to use environment variables later, make sure your build tool supports it
const API_URL = 'https://hospital-management-system-0qrz.onrender.com/api';
const API_TIMEOUT = 30000;

// Create an axios instance with default config
const api = axios.create({
  baseURL: API_URL,
  timeout: API_TIMEOUT,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add request interceptor to include the authentication token in the headers
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Add response interceptor to handle common error cases
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Handle 401 unauthorized errors (expired token, etc.)
    if (error.response && error.response.status === 401) {
      // Clear local storage
      localStorage.removeItem('token');
      localStorage.removeItem('userRole');
      localStorage.removeItem('userData');
      
      // Redirect to login page
      if (window.location.pathname !== '/login') {
        window.location.href = '/login';
      }
    }
    
    // Log the error for debugging
    console.error('API Error:', error.response?.data || error.message);
    
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