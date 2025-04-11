import React, { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import { authService } from '../services';

/**
 * Component that redirects users to the appropriate dashboard based on their role
 * This uses localStorage for authentication data and validates the token before redirecting
 */
const DashboardRedirect = () => {
  const [destination, setDestination] = useState(null);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  
  useEffect(() => {
    const checkAuthAndRedirect = async () => {
      try {
        // Directly check localStorage for authentication data
        const token = localStorage.getItem('token');
        const userDataStr = localStorage.getItem('userData');
        
        console.log('DashboardRedirect - Auth check:', { 
          hasToken: !!token, 
          hasUserData: !!userDataStr
        });
        
        // If no token or user data, redirect to login
        if (!token || !userDataStr) {
          console.log('DashboardRedirect - Missing auth data, redirecting to login');
          setDestination('/login');
          return;
        }
        
        // Verify token validity with the backend
        try {
          const isValid = await authService.verifyToken();
          if (!isValid) {
            console.error('DashboardRedirect - Invalid or expired token');
            setError('Your session has expired. Please log in again.');
            setDestination('/login');
            return;
          }
        } catch (tokenError) {
          console.error('DashboardRedirect - Token verification failed:', tokenError);
          setError('Authentication error. Please log in again.');
          setDestination('/login');
          return;
        }
        
        // Parse user data from localStorage
        const userData = JSON.parse(userDataStr);
        console.log('DashboardRedirect - User data found:', userData);
        
        // Get role from user data
        const userRole = userData?.role?.toLowerCase();
        
        if (!userRole) {
          console.error('DashboardRedirect - No role found in user data');
          setError('No role associated with your account');
          setDestination('/login');
          return;
        }
        
        // Determine redirect path based on role
        switch (userRole) {
          case 'admin':
            console.log('DashboardRedirect - Admin role detected, redirecting to admin dashboard');
            setDestination('/admin-dashboard');
            break;
          case 'doctor':
            console.log('DashboardRedirect - Doctor role detected, redirecting to doctor dashboard');
            setDestination('/doctor-dashboard');
            break;
          case 'patient':
            console.log('DashboardRedirect - Patient role detected, redirecting to patient dashboard');
            setDestination('/patient-dashboard');
            break;
          case 'nurse':
            console.log('DashboardRedirect - Nurse role detected, redirecting to nurse dashboard');
            setDestination('/nurse-dashboard');
            break;
          case 'receptionist':
            console.log('DashboardRedirect - Receptionist role detected, redirecting to receptionist dashboard');
            setDestination('/receptionist-dashboard');
            break;
          case 'pharmacist':
            console.log('DashboardRedirect - Pharmacist role detected, redirecting to pharmacy dashboard');
            setDestination('/pharmacy-dashboard');
            break;
          default:
            console.warn(`DashboardRedirect - Unknown role detected: ${userRole}`);
            setError(`Unknown role: ${userRole}. Please contact support.`);
            setDestination('/login');
        }
      } catch (err) {
        console.error('DashboardRedirect - Error determining redirect:', err);
        setError('Error determining appropriate dashboard. Please try logging in again.');
        setDestination('/login');
      } finally {
        setIsLoading(false);
      }
    };

    // Execute the check
    checkAuthAndRedirect();
  }, []);
  
  // Show error if one occurred
  useEffect(() => {
    if (error) {
      toast.error(error);
    }
  }, [error]);
  
  // Render loading state while determining destination
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        <span className="ml-3 text-blue-600">Redirecting to your dashboard...</span>
      </div>
    );
  }
  
  // Redirect when destination is determined
  return <Navigate to={destination || '/login'} replace />;
};

export default DashboardRedirect; 