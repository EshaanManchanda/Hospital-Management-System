import { useState, useEffect, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useGoogleAuth } from '../contexts/GoogleAuthContext';
import { authService } from '../services';
import { toast } from 'react-hot-toast';
import { FaGoogle } from 'react-icons/fa';

const LoginForm = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [linkGoogleAccount, setLinkGoogleAccount] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { initiateGoogleLogin } = useGoogleAuth();
  const userTypeRef = useRef(null);

  // Check for saved Google user info and redirect path on component mount
  useEffect(() => {
    const savedGoogleInfo = localStorage.getItem('googleUserInfo');
    if (savedGoogleInfo) {
      try {
        const googleUser = JSON.parse(savedGoogleInfo);
        toast.info(`Welcome back, ${googleUser.name}. Please try Google login again or use manual login.`);
      } catch (error) {
        console.error('Error parsing saved Google info:', error);
        localStorage.removeItem('googleUserInfo');
      }
    }

    // Check for redirect path in URL or location state
    const params = new URLSearchParams(location.search);
    const redirectPath = params.get('redirect') || location.state?.from?.pathname;
    if (redirectPath) {
      sessionStorage.setItem('redirectAfterLogin', redirectPath);
    }
  }, [location]);

  const validateForm = () => {
    const newErrors = {};
    if (!email) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = 'Email is invalid';
    }
    if (!password) {
      newErrors.password = 'Password is required';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setLoading(true);
    setErrors({});
    try {
      console.log('Attempting login with email/password');
      
      // If linkGoogleAccount is true, we'll add a parameter to indicate this in the login request
      const loginParams = { 
        email, 
        password,
        linkGoogleAccount 
      };
      
      const response = await authService.login(loginParams);
      
      if (!response.success) {
        throw new Error(response.message || 'Login failed');
      }

      const successMsg = linkGoogleAccount 
        ? 'Login successful! You can now link your Google account.'
        : 'Login successful!';
        
      toast.success(successMsg);
      
      // Clear any saved Google info
      localStorage.removeItem('googleUserInfo');
      
      // If linking Google account, redirect to Google OAuth flow with link=true parameter
      if (linkGoogleAccount) {
        // Store that we're already logged in and want to link accounts
        sessionStorage.setItem('linkGoogleAccount', 'true');
        // Redirect to Google login with link parameter
        const role = response.role || response.data?.user?.role;
        authService.initiateGoogleLogin(role);
        return;
      }
      
      // Handle role-based redirects
      const redirectPath = sessionStorage.getItem('redirectAfterLogin');
      if (redirectPath) {
        sessionStorage.removeItem('redirectAfterLogin');
        navigate(redirectPath, { replace: true });
      } else {
        // Use role from response
        const role = response.role || response.data?.user?.role;
        switch (role) {
          case 'admin':
            navigate('/admin-dashboard', { replace: true });
            break;
          case 'doctor':
            navigate('/doctor-dashboard', { replace: true });
            break;
          case 'patient':
            navigate('/patient-dashboard', { replace: true });
            break;
          default:
            navigate('/', { replace: true });
        }
      }
    } catch (error) {
      console.error('Login error:', error);
      const errorMessage = error.response?.data?.message || error.message || 'Login failed';
      
      // Handle specific error cases
      if (error.response?.status === 401) {
        setErrors({ form: 'Invalid email or password' });
      } else if (error.response?.status === 403) {
        setErrors({ form: 'Account is locked. Please contact support.' });
      } else if (error.response?.status === 404) {
        setErrors({ form: 'Account not found' });
      } else {
        setErrors({ form: errorMessage });
      }
      
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async (e) => {
    e.preventDefault();
    setGoogleLoading(true);
    setErrors({});
    
    try {
      console.log('Google login button clicked');
      
      // Get user role selection (if applicable)
      const role = userTypeRef.current?.value || 'patient';
      console.log(`Selected role for Google login: ${role}`);
      
      // Check if we're linking accounts
      const linkAccount = linkGoogleAccount || sessionStorage.getItem('linkGoogleAccount') === 'true';
      if (linkAccount) {
        console.log('Account linking requested');
        // If we're already logged in, we need to pass a parameter to indicate linking
        sessionStorage.setItem('linkGoogleAccount', 'true');
      }
      
      // Initiate Google login
      console.log('Initiating Google login process...');
      const success = authService.initiateGoogleLogin(role);
      
      if (!success) {
        throw new Error('Failed to initiate Google login');
      }
      
      // Note: No need to set loading to false here since we're redirecting
    } catch (error) {
      console.error('Google login error:', error);
      setErrors({ form: error.message || 'Failed to login with Google' });
      setGoogleLoading(false);
      toast.error(error.message || 'Failed to login with Google');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {errors.form && (
        <div className="p-3 text-sm text-red-700 bg-red-100 rounded-md">
          {errors.form}
        </div>
      )}
      
      <div className="space-y-2">
        <label htmlFor="email" className="block text-sm font-medium text-gray-700">
          Email
        </label>
        <input
          id="email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Enter your email"
          className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 ${
            errors.email ? 'border-red-300' : 'border-gray-300'
          }`}
          required
        />
        {errors.email && (
          <p className="text-sm text-red-600">{errors.email}</p>
        )}
      </div>
      
      <div className="space-y-2">
        <label htmlFor="password" className="block text-sm font-medium text-gray-700">
          Password
        </label>
        <input
          id="password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Enter your password"
          className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 ${
            errors.password ? 'border-red-300' : 'border-gray-300'
          }`}
          required
        />
        {errors.password && (
          <p className="text-sm text-red-600">{errors.password}</p>
        )}
      </div>
      
      <div className="flex items-center">
        <input
          id="link-google"
          type="checkbox"
          checked={linkGoogleAccount}
          onChange={(e) => setLinkGoogleAccount(e.target.checked)}
          className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
        />
        <label htmlFor="link-google" className="ml-2 block text-sm text-gray-700">
          Link with Google account after login
        </label>
      </div>
      
      <div className="flex flex-col space-y-3">
        <button 
          type="submit" 
          disabled={loading || googleLoading}
          className="w-full py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
        >
          {loading ? (
            <>
              <span className="inline-block w-4 h-4 mr-2 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
              Logging in...
            </>
          ) : (
            linkGoogleAccount ? 'Login & Link Google' : 'Login'
          )}
        </button>
        
        <div className="relative my-4">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-300"></div>
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-2 bg-white text-gray-500">Or</span>
          </div>
        </div>
        
        <button 
          type="button" 
          onClick={handleGoogleLogin} 
          disabled={loading || googleLoading}
          className="w-full flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
        >
          {googleLoading ? (
            <>
              <span className="inline-block w-4 h-4 mr-2 border-2 border-gray-700 border-t-transparent rounded-full animate-spin"></span>
              Connecting to Google...
            </>
          ) : (
            <>
              <FaGoogle className="h-5 w-5 mr-2 text-[#4285F4]" />
              {linkGoogleAccount ? 'Link with Google' : 'Sign in with Google'}
            </>
          )}
        </button>
      </div>
    </form>
  );
};

export default LoginForm; 