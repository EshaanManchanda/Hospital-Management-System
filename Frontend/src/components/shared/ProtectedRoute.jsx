import React, { useState, useEffect } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import { ROUTES } from '../../config/constants';
import authService from '../../services/authService';
import api from '../../utils/api'; // Ensure this path is correct
// import api from '../../services/api';

/**
 * A component that protects routes by checking if the user is authenticated
 * and has the appropriate role before rendering the children
 */
const ProtectedRoute = ({ children, allowedRoles = [] }) => {
  const location = useLocation();
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userRole, setUserRole] = useState(null);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        setLoading(true);
        const isLoggedIn = authService.isAuthenticated();

        if (!isLoggedIn) {
          setIsAuthenticated(false);
          return;
        }

        const userData = authService.getUserData();
        setUserRole(userData ? userData.role : null);

        await authService.verifyToken(); // Check if token is valid
        setIsAuthenticated(true);
      } catch (error) {
        console.error('Token verification failed:', error);
        await authService.logout();
        setIsAuthenticated(false);
        toast.error('Your session has expired. Please login again.');
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, []); // Empty dependency array ensures this runs once on mount

  const logout = async () => {
    try {
      const response = await api.post('/api/auth/logout', {}, { withCredentials: true });
      console.log('Logout response:', response.data);
    } catch (error) {
      if (error.response) {
        console.error('Logout error response:', error.response.data);
      } else {
        console.error('Logout error:', error.message);
      }
    }
  };

  if (loading) {
    return <div>Loading...</div>; // Show a loading indicator
  }

  if (!isAuthenticated) {
    sessionStorage.setItem('redirectAfterLogin', location.pathname);
    toast.error('Please log in to access this page');
    return <Navigate to={ROUTES.LOGIN} replace state={{ from: location }} />;
  }

  if (allowedRoles.length > 0 && !allowedRoles.includes(userRole)) {
    toast.error('You do not have permission to access this page');
    return <Navigate to={ROUTES.HOME} replace />;
  }

  return children;
};

export default ProtectedRoute;
