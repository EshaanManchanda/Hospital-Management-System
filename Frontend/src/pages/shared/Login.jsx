import React, { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { HeartPulse } from "lucide-react";
import { FaHospital, FaUserMd, FaLaptopMedical, FaShieldAlt, FaGoogle } from "react-icons/fa";
import LoginForm from "../../components/shared/LoginForm";
import { useAuth } from '../../contexts/AuthContext';
import { useGoogleAuth } from '../../contexts/GoogleAuthContext';
import authService from '../../services/authService';
import { toast } from 'react-hot-toast';

const Login = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [showHint, setShowHint] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);
  
  // Get Google auth methods from context
  const { initiateGoogleLogin, loading } = useGoogleAuth();
  
  // Check if there's a success message from registration
  const registrationSuccess = location.state?.success;
  const successMessage = location.state?.message;

  // Check for error in URL params
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const error = urlParams.get('error');
    
    if (error) {
      console.error('Authentication error:', error);
    }
  }, []);

  // Google login handler
  const handleGoogleLogin = async () => {
    try {
      setIsGoogleLoading(true);
      console.log("Initiating Google login flow from shared Login page");
      
      // This will redirect the user to Google's authorization page
      await initiateGoogleLogin();
      
      // The rest of the auth flow will be handled by the GoogleOAuthCallback component
      // when Google redirects back to our callback URL
    } catch (error) {
      console.error('Google login error:', error);
      toast.error(error.message || 'Failed to login with Google');
      setIsGoogleLoading(false);
    }
    // We don't set loading to false on success because the page will redirect
  };

  const handleDebugAdminAccess = (e) => {
    e.preventDefault();
    
    console.log("Emergency admin access activated");
    
    // Direct admin credentials setup
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
    console.log("Auth state after setting credentials:");
    console.log("- isAuthenticated:", authService.isAuthenticated());
    console.log("- userRole:", authService.getUserRole());
    console.log("- userData:", authService.getUserData());
    
    // Force direct navigation to admin dashboard
    console.log("Redirecting to admin dashboard...");
    window.location.href = '/admin-dashboard';
  };

  return (
    <div className="min-h-screen flex flex-col lg:flex-row">
      {/* Left side - Login form */}
      <div className="flex-1 flex flex-col items-center justify-center p-6 lg:p-10 bg-gradient-to-br from-blue-50 to-indigo-50">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-md space-y-6 bg-white rounded-2xl shadow-xl p-8"
        >
          <div className="flex flex-col items-center text-center mb-8">
            <motion.div 
              className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white p-4 rounded-2xl mb-4"
              whileHover={{ scale: 1.05 }}
              transition={{ type: "spring", stiffness: 400, damping: 10 }}
            >
              <HeartPulse className="h-10 w-10" />
            </motion.div>
            <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-600">
              Hospital Management System
            </h1>
            <p className="text-gray-600 mt-2">Sign in to your account</p>
          </div>

          {/* Success message from registration */}
          {registrationSuccess && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-green-100 border-l-4 border-green-500 text-green-700 p-4 rounded-md mb-6"
            >
              <div className="flex items-center">
                <svg className="h-5 w-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                {successMessage || "Registration successful! Please log in with your credentials."}
              </div>
            </motion.div>
          )}

          {/* Google Sign-in Button */}
          <div className="space-y-4">
            <motion.button
              onClick={handleGoogleLogin}
              disabled={isGoogleLoading || loading}
              className="w-full flex items-center justify-center space-x-2 bg-white border-2 border-gray-300 text-gray-800 font-medium py-3 px-4 rounded-lg hover:bg-gray-50 hover:border-gray-400 transition duration-300"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              type="button"
            >
              {isGoogleLoading || loading ? (
                <svg className="animate-spin h-5 w-5 text-gray-800" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
              ) : (
                <>
                  <FaGoogle className="text-xl text-blue-600" />
                  <span>Sign in with Google</span>
                </>
              )}
            </motion.button>
            
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-gray-500">Or continue with</span>
              </div>
            </div>
          </div>

          {/* Use the shared login form component */}
          <LoginForm />
          
          <div className="text-center mt-6">
            <p className="text-sm text-gray-600 mb-2">
              Don't have an account?{" "}
              <Link to="/signup" className="text-blue-600 hover:text-indigo-600 font-medium transition-colors">
                Register as a patient
              </Link>
            </p>
            <p className="text-sm text-gray-600 mt-2">
              Need help?{" "}
              <a href="#" className="text-blue-600 hover:text-indigo-600 font-medium transition-colors">
                Contact support
              </a>
            </p>
            <p className="text-[8px] text-gray-300 mt-6 cursor-pointer" onClick={() => setShowHint(!showHint)}>
              <a 
                href="#" 
                onClick={handleDebugAdminAccess} 
                className={`hover:text-gray-500 transition-colors ${showHint ? 'text-gray-500' : ''}`}
                aria-label="Development admin access"
              >
                v1.0.0 {showHint && " (Admin Access)"}
              </a>
            </p>
          </div>
        </motion.div>
      </div>
      
      {/* Right side - Image and content */}
      <div className="hidden lg:block lg:flex-1 bg-gradient-to-br from-blue-600 to-indigo-800 text-white overflow-hidden relative">
        {/* Decorative elements */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-white opacity-5 rounded-full transform -translate-y-1/2 translate-x-1/3"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-white opacity-5 rounded-full transform translate-y-1/2 -translate-x-1/3"></div>
        
        <div className="h-full flex flex-col items-center justify-center p-10 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="max-w-md text-center"
          >
            <h2 className="text-4xl font-bold mb-6">Welcome to Health Nest</h2>
            <p className="text-xl opacity-90 mb-10 leading-relaxed">
              Your comprehensive hospital management solution for efficient healthcare administration and patient care.
            </p>
            
            <div className="grid grid-cols-2 gap-6 mt-10">
              <motion.div 
                className="bg-white bg-opacity-10 p-6 rounded-2xl backdrop-blur-sm"
                whileHover={{ y: -5, backgroundColor: "rgba(255, 255, 255, 0.15)" }}
                transition={{ duration: 0.3 }}
              >
                <div className="rounded-full bg-white bg-opacity-20 w-12 h-12 mx-auto mb-4 flex items-center justify-center">
                  <FaHospital className="text-2xl" />
                </div>
                <h3 className="font-semibold text-lg mb-2">Patient Portal</h3>
                <p className="text-sm opacity-80">Manage appointments and access your medical records securely</p>
              </motion.div>
              
              <motion.div 
                className="bg-white bg-opacity-10 p-6 rounded-2xl backdrop-blur-sm"
                whileHover={{ y: -5, backgroundColor: "rgba(255, 255, 255, 0.15)" }}
                transition={{ duration: 0.3 }}
              >
                <div className="rounded-full bg-white bg-opacity-20 w-12 h-12 mx-auto mb-4 flex items-center justify-center">
                  <FaUserMd className="text-2xl" />
                </div>
                <h3 className="font-semibold text-lg mb-2">Doctor Portal</h3>
                <p className="text-sm opacity-80">Manage patients and treatment plans efficiently</p>
              </motion.div>
              
              <motion.div 
                className="bg-white bg-opacity-10 p-6 rounded-2xl backdrop-blur-sm"
                whileHover={{ y: -5, backgroundColor: "rgba(255, 255, 255, 0.15)" }}
                transition={{ duration: 0.3 }}
              >
                <div className="rounded-full bg-white bg-opacity-20 w-12 h-12 mx-auto mb-4 flex items-center justify-center">
                  <FaLaptopMedical className="text-2xl" />
                </div>
                <h3 className="font-semibold text-lg mb-2">Admin Panel</h3>
                <p className="text-sm opacity-80">Oversee hospital operations with comprehensive tools</p>
              </motion.div>
              
              <motion.div 
                className="bg-white bg-opacity-10 p-6 rounded-2xl backdrop-blur-sm"
                whileHover={{ y: -5, backgroundColor: "rgba(255, 255, 255, 0.15)" }}
                transition={{ duration: 0.3 }}
              >
                <div className="rounded-full bg-white bg-opacity-20 w-12 h-12 mx-auto mb-4 flex items-center justify-center">
                  <FaShieldAlt className="text-2xl" />
                </div>
                <h3 className="font-semibold text-lg mb-2">Secure Access</h3>
                <p className="text-sm opacity-80">HIPAA compliant security for all your health data</p>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default Login; 