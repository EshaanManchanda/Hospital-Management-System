import React, { createContext, useState, useEffect } from "react";
import { authService } from "../services";

// Create the login context with default values
const LoginContext = createContext({
  isLoggedIn: false,
  userRole: null,
  userData: null,
  login: () => {},
  logout: () => {},
});

// Create a provider component
export const LoginProvider = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userRole, setUserRole] = useState(null);
  const [userData, setUserData] = useState(null);

  // Check login status on component mount
  useEffect(() => {
    const checkLoginStatus = () => {
      const isAuthenticated = authService.isAuthenticated();
      setIsLoggedIn(isAuthenticated);
      
      if (isAuthenticated) {
        setUserRole(authService.getUserRole());
        setUserData(authService.getUserData());
      } else {
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

  // Login function
  const login = async (email, password) => {
    try {
      const response = await authService.login(email, password);
      setIsLoggedIn(true);
      setUserRole(authService.getUserRole());
      setUserData(authService.getUserData());
      return response;
    } catch (error) {
      console.error("Login error:", error);
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
    logout
  };

  return (
    <LoginContext.Provider value={contextValue}>
      {children}
    </LoginContext.Provider>
  );
};

export default LoginContext;
