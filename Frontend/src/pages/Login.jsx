import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { toast } from 'react-hot-toast';
import { authService } from '../services';
import { useGoogleAuth } from '../contexts/GoogleAuthContext';
import { useAuth } from '../contexts/AuthContext';
import LoginForm from '../components/LoginForm';
import { ROUTES } from '../config/constants';

const Login = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { login } = useAuth();
  const { handleOAuthCallback } = useGoogleAuth();
  const [processingToken, setProcessingToken] = useState(false);
  const [loginError, setLoginError] = useState(null);
  const [selectedRole, setSelectedRole] = useState('patient');

  // Process URL parameters (token or error) on component mount
  useEffect(() => {
    const processUrlParams = async () => {
      console.log('Checking URL parameters for auth tokens or errors');
      const searchParams = new URLSearchParams(location.search);
      const token = searchParams.get('token');
      const error = searchParams.get('error');
      const redirect = searchParams.get('redirect');
      const linkAccounts = searchParams.get('link') === 'true';

      // Log the URL parameters for debugging
      if (token) console.log('Found token in URL', token.substring(0, 15) + '...');
      if (error) console.log('Found error in URL:', error);
      if (redirect) console.log('Found redirect in URL:', redirect);
      if (linkAccounts) console.log('Account linking requested');

      // Clean URL by removing query parameters
      const cleanUrl = () => {
        try {
          const url = new URL(window.location.href);
          url.search = '';
          window.history.replaceState({}, document.title, url.toString());
          console.log('URL cleaned, removed query parameters');
        } catch (e) {
          console.error('Error cleaning URL:', e);
        }
      };

      // Handle OAuth errors
      if (error) {
        cleanUrl();
        const errorMsg = `Google authentication failed: ${error}`;
        console.error(errorMsg);
        toast.error(errorMsg);
        setLoginError(errorMsg);
        return;
      }

      // Handle OAuth token
      if (token) {
        setProcessingToken(true);
        try {
          console.log('Processing OAuth token from URL');
          dispatch({ type: 'AUTH_START' });
          
          // Process the token using handleGoogleCallback from authService
          console.log('Calling authService.handleGoogleCallback');
          const result = await authService.handleGoogleCallback(token);
          
          console.log('Handle Google callback result:', result);
          
          if (!result.success) {
            // Check if account exists but is not linked
            if (result.accountExists) {
              cleanUrl();
              setLoginError(result.error);
              toast.error(result.error);
              setProcessingToken(false);
              return;
            }
            throw new Error(result.error || 'Failed to authenticate with Google');
          }
          
          // Store redirect path if provided
          if (redirect) {
            console.log('Storing redirect path:', redirect);
            sessionStorage.setItem('redirectAfterLogin', redirect);
          }
          
          // Clean URL
          cleanUrl();
          
          // Update Redux state
          console.log('Dispatching AUTH_SUCCESS');
          dispatch({ 
            type: 'AUTH_SUCCESS', 
            payload: result.userData 
          });
          
          // Redirect to the appropriate dashboard based on user role
          const userData = result.userData;
          console.log('User data for redirect:', userData);
          
          const redirectPath = result.redirectPath || 
            (userData?.role === 'admin' ? ROUTES.ADMIN_DASHBOARD : 
             userData?.role === 'doctor' ? ROUTES.DOCTOR_DASHBOARD : 
             userData?.role === 'patient' ? ROUTES.PATIENT_DASHBOARD : 
             ROUTES.HOME);
          
          // Show appropriate success message
          let successMessage = 'Successfully logged in with Google!';
          if (result.accountLinked) {
            successMessage = 'Successfully linked your Google account with your existing account!';
          }
          
          // Show success message and redirect
          console.log('Redirecting to:', redirectPath);
          toast.success(successMessage);
          
          // Use setTimeout to ensure the toast is displayed before redirect
          setTimeout(() => {
            navigate(redirectPath, { replace: true });
          }, 500);
        } catch (error) {
          console.error('Error processing OAuth token:', error);
          dispatch({ type: 'AUTH_ERROR', payload: error.message });
          toast.error(error.message || 'Failed to authenticate with Google');
          setLoginError(error.message || 'Failed to authenticate with Google');
        } finally {
          setProcessingToken(false);
        }
      }
    };

    processUrlParams();
  }, [location, navigate, dispatch]);

  // Handle direct Google login button click
  const handleDirectGoogleLogin = () => {
    try {
      console.log(`Initiating direct Google login for role: ${selectedRole}`);
      authService.initiateGoogleLogin(selectedRole);
    } catch (error) {
      console.error('Direct Google login error:', error);
      toast.error(error.message || 'Failed to login with Google');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Sign in to your account
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Or{' '}
            <a href="/signup" className="font-medium text-indigo-600 hover:text-indigo-500">
              create a new account
            </a>
          </p>
        </div>
        
        {loginError && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded relative" role="alert">
            <span className="block sm:inline">{loginError}</span>
          </div>
        )}
        
        {processingToken ? (
          <div className="flex justify-center items-center py-8">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
            <span className="ml-3 text-gray-600">Authenticating...</span>
          </div>
        ) : (
          <>
            <LoginForm />
            
            {/* Direct Google login for debugging */}
            <div className="mt-8 border-t pt-6">
              <h3 className="text-center text-lg font-medium text-gray-700 mb-4">
                Direct Google Sign In (Debug)
              </h3>
              
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Select Role:
                </label>
                <select
                  value={selectedRole}
                  onChange={(e) => setSelectedRole(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                >
                  <option value="patient">Patient</option>
                  <option value="doctor">Doctor</option>
                  <option value="admin">Admin</option>
                </select>
              </div>
              
              <button
                onClick={handleDirectGoogleLogin}
                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
              >
                Sign in with Google (Debug)
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Login; 