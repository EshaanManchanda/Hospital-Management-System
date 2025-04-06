/**
 * Debug utilities for fixing common auth and routing issues
 */

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