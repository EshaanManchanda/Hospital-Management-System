import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import { FaEnvelope, FaLock, FaSignInAlt, FaExclamationTriangle, FaGoogle } from "react-icons/fa";
import { authService } from "../../services";
import { testApiConnection as apiConnectionTest, testAuthentication } from "../../debug-api";
import { useLogin } from "../../contexts/LoginContext";
import { useGoogleAuth } from "../../contexts/GoogleAuthContext";
import { toast } from "react-hot-toast";

const LoginForm = () => {
  const { login } = useLogin();
  const { initiateGoogleLogin, loading: googleLoading } = useGoogleAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [loginSuccess, setLoginSuccess] = useState(false);
  const [debugInfo, setDebugInfo] = useState(null);
  const [apiStatus, setApiStatus] = useState(null);
  const [apiTesting, setApiTesting] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);

  // Get redirect location if it exists, otherwise default to homepage
  const from = location.state?.from?.pathname || "/";

  // Check if there's any state message from redirect (like after registration)
  useEffect(() => {
    if (location.state?.success) {
      setError("");
      // Use success message from state if available
      setDebugInfo(location.state.message || "Redirected with success state.");
    }
  }, [location]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError(""); // Clear error when user types
  };

  const handleRememberMeChange = () => {
    setRememberMe(!rememberMe);
  };

  const checkApiConnection = async () => {
    setApiTesting(true);
    try {
      const result = await apiConnectionTest();
      setApiStatus(result);
    } catch (error) {
      setApiStatus({ success: false, error: error.message });
    } finally {
      setApiTesting(false);
    }
  };

  const testAuth = async () => {
    setApiTesting(true);
    try {
      const result = await testAuthentication(formData.email, formData.password);
      setApiStatus(result);
      
      
      if (result.success) {
        // If successful authentication but normal login fails,
        // we can use this data to manually set localStorage
        const data = result.data;
        
        // Store token
        if (data.token) {
          localStorage.setItem('token', data.token);
        }
        
        // Find and store role
        const role = data.role || 
                   (data.user && data.user.role) || 
                   'admin'; // Fallback for testing
        localStorage.setItem('userRole', role);
        
        // Create and store user data
        const userData = {
          userId: data._id || data.userId || (data.user && data.user._id) || "unknown",
          name: data.name || (data.user && data.user.name) || "Test User",
          email: data.email || formData.email,
          role: role
        };
        localStorage.setItem('userData', JSON.stringify(userData));
        
        setDebugInfo({
          message: "Manual authentication successful",
          role: role,
          userData: userData
        });
        
        // After manual setup, try to navigate
        setTimeout(() => {
          // Get the user role directly from the response data first, then fallback to localStorage
          const userRole = data.role || authService.getUserRole() || 'admin'; // Fallback for testing
          
          // If we have a role from the response, manually set it in case the service didn't
          if (data.role && !localStorage.getItem('userRole')) {
            localStorage.setItem('userRole', data.role);
          } else if (!localStorage.getItem('userRole')) {
            // If no role in response or localStorage, set a fallback for testing
            localStorage.setItem('userRole', 'admin');
          }
          
          // Update redirects based on role
          if (userData?.role === 'admin') {
            navigate("/admin-dashboard", { replace: true });
          } else if (userData?.role === 'doctor') {
            navigate("/doctor-dashboard", { replace: true });
          } else if (userData?.role === 'patient') {
            navigate("/patient-dashboard", { replace: true });
          } else if (userData?.role === 'nurse') {
            navigate("/nurse-dashboard", { replace: true });
          } else if (userData?.role === 'pharmacist') {
            navigate("/pharmacy-dashboard", { replace: true });
          } else {
            // Default to home page if role is unknown
            navigate("/", { replace: true });
          }
        }, 2000);
      }
    } catch (error) {
      setApiStatus({ success: false, error: error.message });
    } finally {
      setApiTesting(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");
    setLoginSuccess(false);
    setDebugInfo(null);

    try {
      // Call the login function with form data
      const response = await authService.login(formData.email, formData.password);
      
      if (!response.success) {
        throw new Error(response.message || "Login failed. Please check your credentials.");
      }
      
      // Reset form after successful login
      setFormData({
        email: "",
        password: "",
      });
      
      setLoginSuccess(true);
      
      // Get the user role from the response data
      const userData = response.data.user;
      const userRole = userData.role;
      
      console.log("User role for navigation:", userRole);
      
      // Check for redirect path in session storage
      const redirectPath = sessionStorage.getItem('redirectAfterLogin');
      if (redirectPath) {
        sessionStorage.removeItem('redirectAfterLogin');
        navigate(redirectPath, { replace: true });
        return;
      }
      
      // Redirect based on user role
      switch (userRole) {
        case 'admin':
          navigate("/admin-dashboard", { replace: true });
          break;
        case 'doctor':
          navigate("/doctor-dashboard", { replace: true });
          break;
        case 'patient':
          navigate("/patient-dashboard", { replace: true });
          break;
        case 'nurse':
          navigate("/nurse-dashboard", { replace: true });
          break;
        case 'pharmacist':
          navigate("/pharmacy-dashboard", { replace: true });
          break;
        default:
          // Default to home page if role is unknown
          navigate("/", { replace: true });
      }
    } catch (err) {
      setError(err.message || "Failed to login. Please check your credentials.");
      
      // If normal login fails, try the test authentication
      if (process.env.NODE_ENV === 'development') {
        testAuth();
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleDebugAccess = () => {
    console.log("Emergency admin access button clicked");
    
    // Create admin credentials
    const adminCredentials = {
      userId: 'admin123',
      name: 'Admin User',
      email: 'admin@example.com',
      role: 'admin'
    };
    
    // Set credentials in localStorage
    localStorage.setItem('token', 'emergency-admin-token');
    localStorage.setItem('userRole', 'admin');
    localStorage.setItem('userData', JSON.stringify(adminCredentials));
    
    // Log the current authentication state for debugging
    console.log("Auth state after setting admin credentials:");
    console.log("- isAuthenticated:", authService.isAuthenticated());
    console.log("- userRole:", authService.getUserRole());
    console.log("- userData:", authService.getUserData());
    
    // Force direct navigation to admin dashboard with full page reload
    console.log("Redirecting to admin dashboard...");
    window.location.href = '/admin-dashboard';
  };

  const handleGoogleLogin = async () => {
    try {
      console.log("Initiating Google login from LoginForm");
      setIsLoading(true);
      setError("");
      
      // Call the initiateGoogleLogin function from GoogleAuthContext
      await initiateGoogleLogin();
      
      // The redirect will happen automatically
      console.log("Google OAuth flow initiated, redirecting to Google");
    } catch (error) {
      console.error("Google login error:", error);
      setError(error.message || "Failed to login with Google. Please try again.");
      toast.error(error.message || "Google login failed");
      setIsLoading(false);
    }
    // We don't set loading to false on success because the page will redirect
  };

  const handleRegister = async (formData) => {
    if (!formData.password) {
      // Show validation error to user
      toast.error("Password is required");
      return;
    }

    try {
      const result = await authService.register({
        name: formData.name,
        email: formData.email,
        password: formData.password, // Make sure this is always included
        role: formData.role,
        // other data...
      });
      
      if (result.success) {
        toast.success("Registration successful!");
        // Redirect or other success handling
      } else {
        toast.error(result.message);
      }
    } catch (error) {
      console.error("Registration error:", error);
      toast.error("Failed to register. Please try again.");
    }
  };

  return (
    <div className="w-full max-w-md">
      <form onSubmit={handleSubmit} className="space-y-5">
        {error && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 rounded-md"
          >
            <div className="flex items-center">
              <svg className="h-5 w-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
              {error}
            </div>
          </motion.div>
        )}
        
        {loginSuccess && (
          <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative">
            Login successful! Redirecting...
          </div>
        )}
        
        {debugInfo && location.state?.success && (
          <div className="bg-blue-100 border border-blue-400 text-blue-700 px-4 py-3 rounded relative">
            {debugInfo}
          </div>
        )}
        
        <div>
          <label
            htmlFor="email"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Email Address
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <FaEnvelope className="text-gray-400" />
            </div>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="pl-10 pr-4 py-3 w-full border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              placeholder="youremail@example.com"
              required
              disabled={isLoading}
            />
          </div>
        </div>
        
        <div>
          <div className="flex items-center justify-between mb-1">
            <label
              htmlFor="password"
              className="block text-sm font-medium text-gray-700"
            >
              Password
            </label>
            <a href="/forgot-password" className="text-sm text-blue-600 hover:text-indigo-600 transition-colors">
              Forgot password?
            </a>
          </div>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <FaLock className="text-gray-400" />
            </div>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              className="pl-10 pr-4 py-3 w-full border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              placeholder="••••••••"
              required
              disabled={isLoading}
            />
          </div>
        </div>
        
        <div className="flex items-center">
          <input
            id="remember-me"
            name="remember-me"
            type="checkbox"
            checked={rememberMe}
            onChange={handleRememberMeChange}
            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
          />
          <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-700">
            Remember me
          </label>
        </div>
        
        <motion.button
          type="submit"
          className="w-full bg-gradient-to-r from-blue-500 to-indigo-600 text-white font-semibold py-3 px-6 rounded-lg hover:shadow-lg transition duration-300 flex items-center justify-center"
          disabled={isLoading}
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.98 }}
        >
          {isLoading ? (
            <div className="flex items-center">
              <svg className="animate-spin -ml-1 mr-2 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Signing in...
            </div>
          ) : (
            <>
              <FaSignInAlt className="mr-2" />
              Sign In
            </>
          )}
        </motion.button>
        
        <div className="flex justify-between pt-2">
          <button
            type="button"
            disabled={apiTesting}
            onClick={checkApiConnection}
            className="text-xs text-gray-500 hover:text-blue-600 underline"
          >
            Test API Connection
          </button>
          
          <button
            type="button"
            disabled={apiTesting || !formData.email || !formData.password}
            onClick={testAuth}
            className="text-xs text-gray-500 hover:text-blue-600 underline"
          >
            Debug Authentication
          </button>
        </div>
      </form>
      
      {apiStatus && (
        <div className="mt-4 p-4 bg-gray-100 rounded text-xs font-mono overflow-auto">
          <p className="font-bold">API Status:</p>
          <pre>{JSON.stringify(apiStatus, null, 2)}</pre>
        </div>
      )}
      
      {debugInfo && loginSuccess && (
        <div className="mt-4 p-4 bg-gray-100 rounded text-xs font-mono overflow-auto">
          <p className="font-bold">Debug Info:</p>
          <pre>{JSON.stringify(debugInfo, null, 2)}</pre>
        </div>
      )}
      
      {/* Special hardcoded admin login link for debugging */}
      <div className="mt-4 text-center">
        <button 
          type="button"
          onClick={handleDebugAccess}
          className="text-xs text-red-400 hover:text-red-600 underline flex items-center justify-center mx-auto"
        >
          <FaExclamationTriangle className="mr-1" />
          Emergency Admin Access
        </button>
      </div>
    </div>
  );
};

export default LoginForm; 