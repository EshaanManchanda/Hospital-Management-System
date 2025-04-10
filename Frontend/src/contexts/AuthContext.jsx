import { createContext, useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import { authService } from '../services';

const AuthContext = createContext();
export { AuthContext }; // Export the context itself

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  console.log('AuthProvider mounting/rendering');

  useEffect(() => {
    const checkAuthStatus = async () => {
      console.log('AuthProvider: Checking auth status');
      try {
        // Check for token in localStorage
        const token = localStorage.getItem('token');
        const userData = localStorage.getItem('userData');
        
        console.log('AuthProvider: Token exists:', !!token);
        console.log('AuthProvider: UserData exists:', !!userData);
        
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
        
        try {
          // Verify token with server and get user data
          const userInfo = await authService.verifyToken();
          
          // If we get here, token is valid
          console.log('AuthProvider: Token verified successfully, user:', userInfo);
          setUser(userInfo);
        } catch (verifyError) {
          console.error('AuthProvider: Token verification failed:', verifyError.message);
          
          // If we have userData in localStorage, try using that as a fallback
          if (userData) {
            try {
              const parsedUserData = JSON.parse(userData);
              console.log('AuthProvider: Using cached userData as fallback:', parsedUserData);
              setUser(parsedUserData);
              
              // Still notify the user their session might need refreshing
              toast.warning('Session verification failed. Some features may be unavailable.', {
                duration: 5000,
                position: 'bottom-center'
              });
            } catch (parseError) {
              console.error('Failed to parse userData from localStorage:', parseError);
              localStorage.removeItem('userData');
              toast.error('Your session has expired. Please log in again.');
            }
          } else {
            // No userData fallback, clear auth data
            localStorage.removeItem('token');
            toast.error('Your session has expired. Please log in again.');
          }
        }
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
      console.log('AuthContext: Starting logout process');
      // Call the authService logout function
      const result = await authService.logout();
      console.log('AuthContext: Logout service result:', result);
      
      // Clear user state
      setUser(null);
      
      // Make sure localStorage is cleared completely
      localStorage.removeItem('token');
      localStorage.removeItem('userData');
      localStorage.removeItem('user');
      localStorage.removeItem('userRole');
      
      // Clear any session storage data too
      sessionStorage.removeItem('redirectAfterLogin');
      
      // Navigate to login page rather than home
      console.log('AuthContext: Redirecting to login page');
      navigate('/login');
      
      // Show success message
      toast.success('You have been logged out successfully');
      return true;
    } catch (error) {
      console.error('AuthContext: Logout error:', error);
      
      // Even if there's an error, clear user state and storage
      setUser(null);
      localStorage.removeItem('token');
      localStorage.removeItem('userData');
      localStorage.removeItem('user');
      localStorage.removeItem('userRole');
      sessionStorage.removeItem('redirectAfterLogin');
      
      // Show error message
      toast.error('Error during logout, but you have been logged out locally');
      
      // Redirect to login page regardless
      navigate('/login');
      return false;
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
      
      // Check if this registration should skip auth redirects (for admin-created patients)
      if (response.skipAuthRedirect || userData.skipAuthRedirect) {
        console.log("Registration successful but skipping auth redirect and login");
        return true;
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