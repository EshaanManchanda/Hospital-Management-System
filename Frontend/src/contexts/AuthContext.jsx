import { createContext, useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import authService from '../services/authService';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const checkAuthStatus = async () => {
      try {
        // Check for token in localStorage
        const token = localStorage.getItem('token');
        const userData = localStorage.getItem('userData');
        
        if (!token) {
          console.log('No token found in localStorage');
          setLoading(false);
          return;
        }
        
        console.log('Token found in localStorage, validating format');
        
        // Validate token format first
        if (!authService.validateToken(token)) {
          console.error('Token format validation failed on startup');
          localStorage.removeItem('token');
          localStorage.removeItem('userData');
          setLoading(false);
          return;
        }
        
        console.log('Token format is valid, verifying with server');
        
        // Verify token with server and get user data
        const userInfo = await authService.verifyToken();
        
        // If we get here, token is valid
        console.log('Token verified successfully, user:', userInfo.id);
        setUser(userInfo);
      } catch (err) {
        console.error('Auth check failed:', err.message);
        // Clear invalid auth data
        localStorage.removeItem('token');
        localStorage.removeItem('userData');
        toast.error('Your session has expired. Please log in again.');
      } finally {
        setLoading(false);
      }
    };
    
    checkAuthStatus();
  }, []);

  const login = async (email, password) => {
    try {
      setLoading(true);
      setError(null);
      
      // Handle different parameter formats
      let loginParams;
      if (typeof email === 'object' && email !== null) {
        // Email is an object containing all login data
        loginParams = email;
      } else {
        // Email and password provided separately
        loginParams = { email, password };
      }
      
      console.log('Attempting login with:', { email: loginParams.email, hasPassword: !!loginParams.password });
      const response = await authService.login(loginParams);
      
      if (!response.success) {
        setError(response.message);
        toast.error(response.message);
        return false;
      }
      
      const { token, user } = response.data;
      
      // Save user in state
      setUser(user);
      toast.success('Login successful');
      
      // Check for redirect path in session storage
      const redirectPath = sessionStorage.getItem('redirectAfterLogin');
      if (redirectPath) {
        sessionStorage.removeItem('redirectAfterLogin');
        navigate(redirectPath);
        return true;
      }
      
      // Redirect based on role
      switch (user.role) {
        case 'admin':
          navigate('/admin-dashboard');
          break;
        case 'doctor':
          navigate('/doctor-dashboard');
          break;
        case 'patient':
          navigate('/patient-dashboard');
          break;
        default:
          navigate('/');
      }
      
      return true;
    } catch (error) {
      setError('An unexpected error occurred during login');
      toast.error(error.message || 'An unexpected error occurred during login');
      console.error('Unexpected login error:', error);
      return false;
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    try {
      await authService.logout();
      setUser(null);
      navigate('/login');
    } catch (error) {
      console.error('Logout error:', error);
      toast.error('Error during logout');
    }
  };

  const register = async (userData) => {
    try {
      setLoading(true);
      setError(null);
      
      // Validate required fields
      const requiredFields = ['name', 'email', 'password', 'role'];
      for (const field of requiredFields) {
        if (!userData[field]) {
          const message = `${field.charAt(0).toUpperCase() + field.slice(1)} is required`;
          setError(message);
          toast.error(message);
          setLoading(false);
          return false;
        }
      }
      
      const response = await authService.register(userData);
      
      if (!response.success) {
        const errorMessage = response.message || 'Registration failed';
        setError(errorMessage);
        toast.error(errorMessage);
        setLoading(false);
        return false;
      }
      
      // Get user data from response
      const user = response.user;
      
      // Update state with new user
      setUser(user);
      toast.success('Registration successful');
      
      // Redirect based on role
      switch (user.role) {
        case 'admin':
          navigate('/admin-dashboard');
          break;
        case 'doctor':
          navigate('/doctor-dashboard');
          break;
        case 'patient':
          navigate('/patient-dashboard');
          break;
        default:
          navigate('/');
      }
      
      return true;
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Registration failed';
      setError(errorMessage);
      toast.error(errorMessage);
      console.error('Registration error:', error);
      return false;
    } finally {
      setLoading(false);
    }
  };

  const value = {
    user,
    loading,
    error,
    login,
    logout,
    register,
    isAuthenticated: !!user
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}; 