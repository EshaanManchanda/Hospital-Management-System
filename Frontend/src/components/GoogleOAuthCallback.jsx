import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import authService from '../services/authService';
import LoadingSpinner from './common/LoadingSpinner';
import ErrorMessage from './common/ErrorMessage';
import { GoogleAuthProvider } from '../contexts/GoogleAuthContext';

// Generate a secure password
const generateSecurePassword = () => {
  const uppercaseChars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  const lowercaseChars = 'abcdefghijklmnopqrstuvwxyz';
  const numberChars = '0123456789';
  const specialChars = '!@#$%^&*()_-+=<>?';
  
  const allChars = uppercaseChars + lowercaseChars + numberChars + specialChars;
  
  let password = '';
  
  // Ensure at least one of each character type
  password += uppercaseChars.charAt(Math.floor(Math.random() * uppercaseChars.length));
  password += lowercaseChars.charAt(Math.floor(Math.random() * lowercaseChars.length));
  password += numberChars.charAt(Math.floor(Math.random() * numberChars.length));
  password += specialChars.charAt(Math.floor(Math.random() * specialChars.length));
  
  // Add 8 more random characters
  for (let i = 0; i < 8; i++) {
    password += allChars.charAt(Math.floor(Math.random() * allChars.length));
  }
  
  // Shuffle the password
  password = password.split('').sort(() => 0.5 - Math.random()).join('');
  
  return password;
};

/**
 * Component for handling Google OAuth callback
 */
const GoogleOAuthCallbackContent = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const handleCallback = async () => {
      try {
        // Get the token from the URL
        const queryParams = new URLSearchParams(location.search);
        const token = queryParams.get('token');
        const authError = queryParams.get('error');
        
        if (authError) {
          throw new Error(`Authentication error: ${authError}`);
        }
        
        if (!token) {
          throw new Error('No token received from authentication provider');
        }

        // Generate a secure password for Google login
        const securePassword = generateSecurePassword();
        console.log('Generated secure password for OAuth callback');

        try {
          // Process the OAuth callback using authService
          const result = await authService.handleGoogleCallback(token, securePassword);
          
          if (!result || !result.success) {
            throw new Error('Authentication failed');
          }

          // Get user data
          const userData = result.userData;
          
          // Determine redirect URL based on user role
          let redirectUrl = '/';
          
          if (userData.role === 'admin') {
            redirectUrl = '/admin-dashboard';
          } else if (userData.role === 'doctor') {
            redirectUrl = '/doctor-dashboard';
          } else if (userData.role === 'nurse') {
            redirectUrl = '/nurse-dashboard';
          } else if (userData.role === 'patient') {
            redirectUrl = '/patient-dashboard';
          } else if (userData.role === 'receptionist') {
            redirectUrl = '/receptionist-dashboard';
          }
          
          // Show success message
          toast.success('Successfully logged in!');
          
          // Redirect to appropriate dashboard
          navigate(redirectUrl);
        } catch (error) {
          console.error('Authentication processing error:', error);
          throw new Error('Authentication failed. Please try again.');
        }
      } catch (err) {
        console.error('OAuth callback error:', err);
        setError(err.message || 'Authentication failed. Please try again.');
        toast.error(err.message || 'Authentication failed');
        
        // Navigate to login after 3 seconds on error
        setTimeout(() => {
          navigate('/login');
        }, 3000);
      } finally {
        setLoading(false);
      }
    };

    handleCallback();
  }, [navigate, location]);

  if (loading) {
    return <LoadingSpinner message="Completing authentication..." />;
  }

  if (error) {
    return <ErrorMessage message={error} />;
  }

  return null;
};

// Wrap the component with GoogleAuthProvider to ensure useGoogleAuth works
const GoogleOAuthCallback = () => {
  return (
    <GoogleAuthProvider>
      <GoogleOAuthCallbackContent />
    </GoogleAuthProvider>
  );
};

export default GoogleOAuthCallback; 