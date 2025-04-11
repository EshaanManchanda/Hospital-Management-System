import axios from 'axios';
import { toast } from 'react-hot-toast';

// Get the API URL from environment variables or use the fallback
const apiBaseUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000';
// Ensure we have the correct base URL structure
const apiBaseUrlWithoutApi = apiBaseUrl.endsWith('/api') 
  ? apiBaseUrl.slice(0, -4) 
  : apiBaseUrl;

console.log('API configured with:', { 
  baseUrl: apiBaseUrlWithoutApi,
  withCredentials: true
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
    // Log all outgoing requests for debugging if in development
    if (import.meta.env.DEV) {
      console.log(`API Request: ${config.method?.toUpperCase()} ${config.baseURL}${config.url}`, {
        headers: config.headers,
        withCredentials: config.withCredentials,
        data: config.data
      });
    }
    
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

// Response interceptor for handling common errors
api.interceptors.response.use(
  (response) => {
    // Log response in development
    if (import.meta.env.DEV) {
      console.log('API Response:', {
        status: response.status,
        url: response.config.url,
        data: response.data
      });
    }
    return response;
  },
  (error) => {
    // Handle different error responses
    if (error.response) {
      // The request was made and the server responded with a status code
      // that falls out of the range of 2xx
      const { status, data } = error.response;
      
      switch (status) {
        case 401:
          // Unauthorized: Token expired or invalid
          localStorage.removeItem('token');
          localStorage.removeItem('userData');
          
          // Only show toast if we're not already on the login page
          if (!window.location.pathname.includes('/login')) {
            toast.error('Your session has expired. Please log in again.', {
              duration: 5000
            });
            
            // Redirect to login after 1 second
            setTimeout(() => {
              window.location.href = '/login';
            }, 1000);
          }
          break;
          
        case 403:
          // Forbidden: User doesn't have permission
          toast.error('You do not have permission to perform this action.', {
            duration: 5000
          });
          break;
          
        case 404:
          // Not found
          console.error('Resource not found:', data);
          break;
          
        case 422:
          // Validation errors
          if (data.errors) {
            const errorMessages = Object.values(data.errors)
              .flat()
              .join(', ');
            toast.error(`Validation error: ${errorMessages}`, {
              duration: 5000
            });
          } else {
            toast.error('Validation failed. Please check your input.', {
              duration: 5000
            });
          }
          break;
          
        case 500:
          // Server error
          toast.error('Server error occurred. Please try again later.', {
            duration: 5000
          });
          break;
          
        default:
          // Other errors
          if (data.message) {
            toast.error(data.message, {
              duration: 5000
            });
          } else {
            toast.error('An error occurred. Please try again.', {
              duration: 5000
            });
          }
      }
    } else if (error.request) {
      // The request was made but no response was received
      toast.error('Network error. Please check your connection.', {
        duration: 5000
      });
    } else {
      // Something happened in setting up the request that triggered an Error
      toast.error('Application error. Please try again.', {
        duration: 5000
      });
    }
    
    return Promise.reject(error);
  }
);

export default api;