import React, { createContext, useState, useEffect, useContext } from "react";
import { authService } from "../services";
import { useNavigate } from "react-router-dom";
import api from '../utils/api';

// Create the login context with default values
export const LoginContext = createContext({
  isLoggedIn: false,
  userRole: null,
  userData: null,
  login: () => {},
  googleLogin: () => {},
  logout: () => {},
});

// Create a provider component
export const LoginProvider = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userRole, setUserRole] = useState(null);
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Check login status on component mount
  useEffect(() => {
    const checkLoginStatus = () => {
      const token = localStorage.getItem('token');
      const userData = localStorage.getItem('userData');

      if (token && userData) {
        const parsedUserData = JSON.parse(userData);
        setIsLoggedIn(true);
        setUserRole(parsedUserData.role);
        setUserData(parsedUserData);
      } else {
        setIsLoggedIn(false);
        setUserRole(null);
        setUserData(null);
      }
    };

    checkLoginStatus();

    // Set up event listener for storage changes
    window.addEventListener('storage', checkLoginStatus);

    return () => {
      window.removeEventListener('storage', checkLoginStatus);
    };
  }, []);

  // Login function that will be provided to consumers
  const login = async (credentials) => {
    try {
      console.log('LoginContext: Attempting login');
      setLoading(true);
      setError(null);

      let email, password;

      // Handle both object and individual parameters
      if (typeof credentials === 'object') {
        email = credentials.email;
        password = credentials.password;
      } else {
        email = credentials;
        password = arguments[1];
      }

      console.log(`LoginContext: Login attempt for email: ${email}`);

      // Call the authService login method
      const response = await authService.login(email, password);

      console.log('LoginContext: Received login response', response);

      if (!response.success) {
        console.error('LoginContext: Login failed:', response.message);
        throw new Error(response.message || 'Login failed');
      }

      // Extract token and user data
      const { token, data } = response;
      const userData = data?.user || {};

      // Update auth state
      setUserData(userData);
      setIsLoggedIn(true);

      // Store token and user data
      localStorage.setItem('token', token || response.token);
      localStorage.setItem('userData', JSON.stringify(userData));
      localStorage.setItem('userRole', userData.role || 'user');

      // Set auth header for future requests
      api.defaults.headers.common['Authorization'] = `Bearer ${token || response.token}`;

      console.log('LoginContext: Login successful for role:', userData.role);

      // Return role for redirection
      return {
        success: true,
        role: userData.role,
        user: userData
      };
    } catch (error) {
      console.error('LoginContext: Login error:', error);

      let errorMessage = error.message || 'Login failed';

      if (error.response) {
        console.error('LoginContext: Error response:', error.response.data);
        errorMessage = error.response.data?.message || errorMessage;
      }

      setError(errorMessage);
      return {
        success: false,
        message: errorMessage
      };
    } finally {
      setLoading(false);
    }
  };

  // Google login function
  const googleLogin = async (googleData) => {
    try {
      console.log("LoginContext: Attempting Google login");
      const response = await authService.loginWithGoogle(googleData);

      if (!response.success) {
        throw new Error(response.message || "Google login failed");
      }

      setIsLoggedIn(true);

      // Get user data from response or auth service
      const userData = response.data?.user || authService.getUserData();
      const role = userData?.role || authService.getUserRole();

      console.log("LoginContext: Role after Google login:", role);
      setUserRole(role);
      setUserData(userData);

      return {
        ...response,
        role: role
      };
    } catch (error) {
      console.error("LoginContext: Google login error:", error);
      throw error;
    }
  };

  // Logout function
  const logout = () => {
    authService.logout();
    setIsLoggedIn(false);
    setUserRole(null);
    setUserData(null);
  };

  // Provide the context value
  const contextValue = {
    isLoggedIn,
    userRole,
    userData,
    login,
    googleLogin,
    logout
  };

  return (
    <LoginContext.Provider value={contextValue}>
      {children}
    </LoginContext.Provider>
  );
};

export default LoginContext;

// Add a custom hook to use the login context
export const useLogin = () => {
  const context = useContext(LoginContext);
  if (!context) {
    throw new Error('useLogin must be used within a LoginProvider');
  }
  return context;
};
