import React from 'react';
import { Navigate } from 'react-router-dom';
import { authService } from '../../services';

/**
 * A component that protects routes by checking if the user is authenticated
 * and has the appropriate role before rendering the children
 * 
 * @param {Object} props - Component props
 * @param {React.ReactNode} props.children - The components to render if authenticated
 * @param {string|string[]} props.allowedRoles - The roles allowed to access the route
 * @returns {React.ReactNode} The protected route
 */
const ProtectedRoute = ({ children, allowedRoles }) => {
  // Check if user is authenticated
  const isAuthenticated = authService.isAuthenticated();
  
  // Get user role
  const userRole = authService.getUserRole();
  
  // If not authenticated, redirect to login
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  
  // Convert allowedRoles to array if it's a string
  const roles = Array.isArray(allowedRoles) ? allowedRoles : [allowedRoles];
  
  // If roles are specified and user's role is not included, redirect to home
  if (roles.length > 0 && !roles.includes(userRole)) {
    return <Navigate to="/" replace />;
  }
  
  // If user is authenticated and has the appropriate role, render the children
  return children;
};

export default ProtectedRoute; 