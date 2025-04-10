import React, { createContext, useState, useEffect, useCallback } from 'react';
import { authService } from '../services';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // Initialize user from localStorage on component mount
  useEffect(() => {
    const initializeAuth = async () => {
      try {
        // Check if we have userData in localStorage
        const userDataStr = localStorage.getItem('userData');
        if (userDataStr) {
          try {
            const userData = JSON.parse(userDataStr);
            console.log('AuthContext: Initializing from localStorage userData', userData);
            setUser(userData);
          } catch (error) {
            console.error('AuthContext: Failed to parse userData from localStorage', error);
            localStorage.removeItem('userData');
          }
        }

        // Check for token and verify with server if possible
        const token = localStorage.getItem('token');
        if (token) {
          try {
            console.log('AuthContext: Found token, verifying with server');
            const verifiedUser = await authService.verifyToken();
            console.log('AuthContext: Token verification successful', verifiedUser);
            
            // Update user data in state and localStorage with verified data
            setUser(verifiedUser);
            localStorage.setItem('userData', JSON.stringify(verifiedUser));
          } catch (error) {
            console.error('AuthContext: Token verification failed', error);
            // Keep using the userData from localStorage if available
            // verifyToken failure was already handled above
          }
        }
      } catch (error) {
        console.error('AuthContext: Error initializing auth', error);
      } finally {
        setLoading(false);
      }
    };

    initializeAuth();
  }, []);

  const login = useCallback(async (credentials) => {
    try {
      setLoading(true);
      console.log('AuthContext: Attempting login');
      const response = await authService.login(credentials);
      
      if (response.success) {
        console.log('AuthContext: Login successful', response);
        
        // Save the token and user data
        const { token, user } = response;
        
        if (token) {
          localStorage.setItem('token', token);
        } else {
          console.warn('AuthContext: No token received from login');
        }
        
        if (user) {
          localStorage.setItem('userData', JSON.stringify(user));
          setUser(user);
          
          // Redirect based on user role
          if (user.role === 'admin') {
            navigate('/admin/dashboard');
          } else if (user.role === 'doctor') {
            navigate('/doctor/dashboard');
          } else if (user.role === 'patient') {
            navigate('/patient/dashboard');
          } else {
            // Default route
            navigate('/dashboard');
          }
          
          toast.success(`Welcome back, ${user.firstName || user.name || 'User'}!`);
          return { success: true };
        } else {
          console.error('AuthContext: No user data received from login');
          toast.error('Login successful but user data is missing');
          return { success: false, error: 'User data missing' };
        }
      } else {
        console.error('AuthContext: Login failed', response.error);
        toast.error(response.message || 'Login failed. Please check your credentials.');
        return { success: false, error: response.error || response.message || 'Unknown error' };
      }
    } catch (error) {
      console.error('AuthContext: Login error', error);
      toast.error(error.message || 'An error occurred during login');
      return { success: false, error: error.message || 'Unknown error' };
    } finally {
      setLoading(false);
    }
  }, [navigate]);

  const register = useCallback(async (userData) => {
    try {
      setLoading(true);
      console.log('AuthContext: Attempting registration');
      const response = await authService.register(userData);
      
      if (response.success) {
        console.log('AuthContext: Registration successful', response);
        
        // Save the token and user data if present in the response
        const { token, user } = response;
        
        if (token) {
          localStorage.setItem('token', token);
        }
        
        if (user) {
          localStorage.setItem('userData', JSON.stringify(user));
          setUser(user);
          
          // Redirect based on user role or to login page
          if (user.role) {
            if (user.role === 'admin') {
              navigate('/admin/dashboard');
            } else if (user.role === 'doctor') {
              navigate('/doctor/dashboard');
            } else if (user.role === 'patient') {
              navigate('/patient/dashboard');
            } else {
              navigate('/dashboard');
            }
          } else {
            // If registration doesn't log the user in automatically
            navigate('/login');
          }
          
          toast.success('Registration successful!');
        } else {
          // If the user wasn't auto-logged in
          toast.success('Registration successful! Please log in.');
          navigate('/login');
        }
        
        return { success: true };
      } else {
        console.error('AuthContext: Registration failed', response.error);
        toast.error(response.message || 'Registration failed. Please try again.');
        return { success: false, error: response.error || response.message };
      }
    } catch (error) {
      console.error('AuthContext: Registration error', error);
      toast.error(error.message || 'An error occurred during registration');
      return { success: false, error: error.message };
    } finally {
      setLoading(false);
    }
  }, [navigate]);

  const logout = useCallback(() => {
    try {
      console.log('AuthContext: Logging out user');
      // Clear auth state
      setUser(null);
      
      // Clear localStorage items
      localStorage.removeItem('token');
      localStorage.removeItem('userData');
      
      // Call the authService logout
      authService.logout();
      
      // Redirect to login page
      toast.success('Logged out successfully!');
      navigate('/login');
    } catch (error) {
      console.error('AuthContext: Logout error', error);
      toast.error('An error occurred during logout');
    }
  }, [navigate]);

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        loading,
        login,
        register,
        logout
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}; 