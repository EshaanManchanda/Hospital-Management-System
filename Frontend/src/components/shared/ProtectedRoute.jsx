import React, { useEffect, useState } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import { ROUTES } from '../../config/constants';

/**
 * A component that protects routes by checking if the user is authenticated
 * and has the appropriate role before rendering the children
 */
const ProtectedRoute = ({ children, allowedRoles = [] }) => {
  const location = useLocation();
  const [loading, setLoading] = useState(true);
  const [hasPermission, setHasPermission] = useState(false);
  const [redirectPath, setRedirectPath] = useState(ROUTES.LOGIN);
  
  // Get user data directly from localStorage - more reliable than context in some cases
  // This ensures the route protection works even if auth context is not ready
  const [userData, setUserData] = useState(null);
  
  // Check authentication state
  useEffect(() => {
    const checkAuthState = () => {
      try {
        setLoading(true);
        
        // Check for token and user data
        const token = localStorage.getItem('token');
        const userDataStr = localStorage.getItem('userData');
        
        console.log('ProtectedRoute - Auth check:', { 
          path: location.pathname,
          hasToken: !!token, 
          hasUserData: !!userDataStr
        });
        
        // If token or user data is missing
        if (!token || !userDataStr) {
          console.log('ProtectedRoute - Missing auth data, redirecting to login');
          setHasPermission(false);
          // Store current path for redirect after login
          sessionStorage.setItem('redirectAfterLogin', location.pathname);
          setRedirectPath(ROUTES.LOGIN);
          return;
        }
        
        // Parse user data
        const parsedUserData = JSON.parse(userDataStr);
        setUserData(parsedUserData);
        
        // Check if user has required role
        if (allowedRoles.length > 0) {
          const userRole = parsedUserData?.role?.toLowerCase();
          console.log(`ProtectedRoute - Checking if user role "${userRole}" is allowed:`, allowedRoles);
          
          if (!userRole || !allowedRoles.includes(userRole)) {
            console.log('ProtectedRoute - User does not have required role');
            setHasPermission(false);
            
            // Based on the role, redirect to appropriate dashboard instead of home
            switch(userRole) {
              case 'admin':
                setRedirectPath('/admin-dashboard');
                break;
              case 'doctor':
                setRedirectPath('/doctor-dashboard');
                break;
              case 'patient':
                setRedirectPath('/patient-dashboard');
                break;
              case 'nurse':
                setRedirectPath('/nurse-dashboard');
                break;
              case 'receptionist':
                setRedirectPath('/receptionist-dashboard');
                break;
              case 'pharmacist':
                setRedirectPath('/pharmacy-dashboard');
                break;
              default:
                setRedirectPath(ROUTES.HOME);
            }
            return;
          }
        }
        
        // User is authenticated and has required role
        console.log('ProtectedRoute - User has permission to access this route');
        setHasPermission(true);
      } catch (error) {
        console.error('ProtectedRoute - Error checking permissions', error);
        setHasPermission(false);
        setRedirectPath(ROUTES.LOGIN);
      } finally {
        setLoading(false);
      }
    };

    checkAuthState();
  }, [location.pathname, allowedRoles]);

  // Show loading while checking permissions
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        <span className="ml-3 text-blue-600">Checking credentials...</span>
      </div>
    );
  }

  // If user has permission, render children
  if (hasPermission) {
    // Remove any redirect path from session storage
    sessionStorage.removeItem('redirectAfterLogin');
    return children;
  }
  
  // Log the redirect for debugging
  console.log(`ProtectedRoute - Redirecting from ${location.pathname} to ${redirectPath}`);
  
  // If redirecting to login, store current path
  if (redirectPath === ROUTES.LOGIN) {
    sessionStorage.setItem('redirectAfterLogin', location.pathname);
  }
  
  // Redirect to appropriate path
  return <Navigate to={redirectPath} replace state={{ from: location }} />;
};

export default ProtectedRoute;
