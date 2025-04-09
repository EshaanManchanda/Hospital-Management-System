import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { FcGoogle } from 'react-icons/fc';
import { useLogin } from "../../contexts/LoginContext";
import { useGoogleAuth, GoogleAuthProvider } from "../../contexts/GoogleAuthContext";
import { toast } from "react-hot-toast";

const LoginContent = () => {
  const { login } = useLogin();
  const { initiateGoogleLogin } = useGoogleAuth();
  const navigate = useNavigate();
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    
    try {
      // Validate inputs
      if (!formData.email || !formData.password) {
        throw new Error("Email and password are required");
      }
      
      console.log("Attempting login with email:", formData.email);
      
      // Use the login function with object format
      const response = await login({
        email: formData.email,
        password: formData.password
      });
      
      console.log("Login response:", response);
      
      if (!response || !response.success) {
        console.error("Login failed with response:", response);
        throw new Error(response?.message || "Login failed");
      }
      
      // Reset form after successful login
      setFormData({
        email: "",
        password: "",
      });
      
      toast.success("Login successful!");
      
      // Check if there's a specific redirect path
      const redirectPath = sessionStorage.getItem('redirectAfterLogin');
      console.log("Redirect path:", redirectPath);
      
      if (redirectPath) {
        sessionStorage.removeItem('redirectAfterLogin');
        navigate(redirectPath, { replace: true });
      } else {
        // Get user role from response
        const userRole = response.data?.user?.role || 'patient';
        console.log("User role from response:", userRole);
        
        // Navigate based on user role
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
          case 'receptionist':
            navigate("/receptionist-dashboard", { replace: true });
            break;
          default:
            console.warn("Unknown role in response:", userRole);
            navigate("/", { replace: true });
        }
      }
    } catch (err) {
      console.error("Login error:", err);
      
      // Extract the most useful error message
      let errorMessage = "Failed to login. Please check your credentials.";
      
      if (err.response) {
        // Server responded with an error
        console.error("Server error response:", err.response.data);
        errorMessage = err.response.data?.message || errorMessage;
      } else if (err.message) {
        // Error has a message property
        errorMessage = err.message;
      }
      
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleLogin = () => {
    // Default role is 'patient', the backend will determine actual role based on email
    initiateGoogleLogin('patient');
  };

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  
  const [isLoading, setIsLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-4">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
        <h2 className="text-2xl font-bold mb-6 text-center text-gray-800">Login to Your Account</h2>
        
        {/* Social login buttons */}
        <div className="mb-4">
          <button
            onClick={handleGoogleLogin}
            className="flex items-center justify-center w-full bg-white border border-gray-300 p-2 rounded-lg font-medium text-gray-700 hover:bg-gray-50 transition-colors shadow-sm"
          >
            <FcGoogle className="text-xl mr-2" />
            Continue with Google
          </button>
        </div>

        {/* Divider */}
        <div className="relative flex items-center justify-center my-6">
          <div className="border-t border-gray-300 absolute w-full"></div>
          <div className="bg-white px-3 relative text-sm text-gray-500">OR</div>
        </div>

        {/* Login form (placeholder) */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">Email</label>
            <input 
              type="email" 
              id="email" 
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="name@example.com"
            />
          </div>
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">Password</label>
            <input 
              type="password" 
              id="password" 
              name="password"
              value={formData.password}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="•••••••"
            />
          </div>
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <input 
                id="remember-me" 
                type="checkbox" 
                className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500" 
              />
              <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-700">
                Remember me
              </label>
            </div>
            <a href="#" className="text-sm text-blue-600 hover:text-blue-500">
              Forgot password?
            </a>
          </div>
          <button 
            type="submit" 
            className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors"
          >
            Sign in
          </button>
        </form>

        {/* Sign up link */}
        <p className="mt-6 text-center text-sm text-gray-600">
          Don't have an account?{' '}
          <Link to="/signup" className="text-blue-600 hover:text-blue-500 font-medium">
            Sign up
          </Link>
        </p>
      </div>
    </div>
  );
};

const Login = () => {
  return (
    <GoogleAuthProvider>
      <LoginContent />
    </GoogleAuthProvider>
  );
};

export default Login;
