/**
 * Debug utilities for troubleshooting common issues in the hospital management system
 */

import axios from 'axios';

/**
 * Set emergency admin access (use when normal login fails)
 * @returns {Object} admin credentials
 */
export const setEmergencyAdminAccess = () => {
  const adminCredentials = {
    userId: 'admin123',
    name: 'Admin User',
    email: 'admin@example.com',
    role: 'admin'
  };
  
  console.log("Setting emergency admin credentials in localStorage");
  
  // Set in localStorage
  localStorage.setItem('token', 'emergency-admin-token');
  localStorage.setItem('userRole', 'admin');
  localStorage.setItem('userData', JSON.stringify(adminCredentials));
  
  console.log("Admin credentials set. Ready for redirection.");
  
  // Return the credentials, let the caller handle redirection
  return adminCredentials;
};

/**
 * Clear all authentication data from localStorage
 */
export const clearAuthData = () => {
  localStorage.removeItem('token');
  localStorage.removeItem('userRole');
  localStorage.removeItem('userData');
};

/**
 * Fix React Router bugs by refreshing the page
 * Used for issues with React Router not capturing updated state
 */
export const refreshRouterState = () => {
  window.location.reload();
};

/**
 * Check if the current route is properly protected
 * @returns {Object} Status of protection checks
 */
export const debugProtectedRoute = () => {
  const token = localStorage.getItem('token');
  const userRole = localStorage.getItem('userRole');
  const userData = localStorage.getItem('userData');
  
  const status = {
    isAuthenticated: !!token,
    userRole,
    userData: userData ? JSON.parse(userData) : null,
    currentPath: window.location.pathname,
    pathRequiresAuth: window.location.pathname.includes('/admin') || 
                     window.location.pathname.includes('/doctor') ||
                     window.location.pathname === '/profile'
  };
  
  return status;
};

/**
 * Force redirect to a specific route
 * @param {string} route - Route to redirect to
 */
export const forceRedirect = (route) => {
  window.location.href = route;
};

/**
 * Set emergency admin access (use when normal login fails)
 */
export const enableEmergencyAccess = () => {
  // This is for development and debugging only
  localStorage.setItem('emergencyAccess', 'true');
  localStorage.setItem('userData', JSON.stringify({
    userId: 'admin-emergency',
    name: 'Emergency Admin',
    email: 'emergency@hospital.com',
    role: 'admin',
  }));
  console.log('Emergency access enabled. Refresh the page to use.');
};

/**
 * Check backend connectivity and display diagnostic information
 */
export const checkBackendConnectivity = async () => {
  // Get API configuration
  const apiBaseUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000';
  
  console.log('=== Backend Connectivity Check ===');
  console.log('Configuration:');
  console.log('- Frontend URL:', window.location.origin);
  console.log('- API Base URL:', apiBaseUrl);
  console.log('- Environment:', import.meta.env.MODE);
  
  // Validate API URL format
  let isValidUrl = false;
  try {
    new URL(apiBaseUrl);
    isValidUrl = true;
  } catch (e) {
    console.error('API URL is not a valid URL format');
  }
  
  if (!isValidUrl) {
    console.error('ERROR: Invalid API URL format. Check your .env file or environment variables.');
    return {
      success: false,
      message: 'Invalid API URL format',
      details: {
        apiUrl: apiBaseUrl,
        suggestion: 'Check your .env file and make sure VITE_API_URL is correctly set'
      }
    };
  }
  
  // Test various endpoints to pinpoint issues
  const endpoints = [
    { url: '/', name: 'Root path', optional: true },
    { url: '/api/health', name: 'Health endpoint', optional: true },
    { url: '/api/auth/login', name: 'Login endpoint', optional: false }, 
  ];
  
  const results = [];
  
  for (const endpoint of endpoints) {
    try {
      console.log(`Testing endpoint: ${apiBaseUrl}${endpoint.url}`);
      
      // Use a preflight OPTIONS request to check availability
      const response = await axios({
        method: 'OPTIONS',
        url: `${apiBaseUrl}${endpoint.url}`,
        timeout: 5000
      });
      
      results.push({
        endpoint: endpoint.url,
        status: response.status,
        success: true,
        message: 'Endpoint available'
      });
      
      console.log(`✓ ${endpoint.name} (${endpoint.url}): Available - ${response.status}`);
    } catch (error) {
      const status = error.response?.status;
      const errorMessage = error.message || 'Unknown error';
      
      // Some endpoints might return 4xx but still be "available"
      const isError = status === undefined;
      
      results.push({
        endpoint: endpoint.url,
        status: status || 'No response',
        success: !isError,
        message: isError 
          ? `Cannot connect: ${errorMessage}` 
          : `Endpoint exists but returned: ${status}`
      });
      
      if (isError) {
        console.error(`✗ ${endpoint.name} (${endpoint.url}): ${errorMessage}`);
      } else {
        console.log(`? ${endpoint.name} (${endpoint.url}): Status ${status}`);
      }
    }
  }
  
  // Overall diagnosis
  const criticalEndpoints = results.filter(r => 
    !r.success && !endpoints.find(e => e.url === r.endpoint).optional
  );
  
  if (criticalEndpoints.length > 0) {
    console.error('=== DIAGNOSIS: BACKEND CONNECTION ISSUE ===');
    console.error('Critical endpoints are not available:');
    criticalEndpoints.forEach(r => {
      console.error(`- ${r.endpoint}: ${r.message}`);
    });
    
    // Provide troubleshooting steps
    console.log('\nTROUBLESHOOTING STEPS:');
    console.log('1. Check if the backend server is running');
    console.log('2. Verify your VITE_API_URL in .env file. Current value:', apiBaseUrl);
    console.log('3. Check for CORS issues - backend must allow requests from:', window.location.origin);
    console.log('4. Ensure network connectivity between frontend and backend');
    console.log('5. Check backend logs for errors');
    
    return {
      success: false,
      message: 'Backend connectivity issue detected',
      details: {
        results,
        criticalIssues: criticalEndpoints
      }
    };
  }
  
  console.log('=== DIAGNOSIS: NO CRITICAL ISSUES DETECTED ===');
  console.log('Backend appears to be available. If you are still having login issues:');
  console.log('1. Check your credentials');
  console.log('2. Ensure the backend authorization service is working correctly');
  console.log('3. Check browser console for other errors');
  
  return {
    success: true,
    message: 'Backend connectivity check passed',
    details: {
      results
    }
  };
};

/**
 * Clear all local storage data and perform a clean login
 */
export const performCleanLogin = () => {
  localStorage.clear();
  sessionStorage.clear();
  console.log('All storage cleared. Redirecting to login page...');
  window.location.href = '/login';
};

// Export debug utilities
export default {
  enableEmergencyAccess,
  checkBackendConnectivity,
  performCleanLogin
}; 