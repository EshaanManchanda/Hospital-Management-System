import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import axios from 'axios';
import { API_BASE_URL } from '../../config/constants';

/**
 * A component that helps debug authentication issues by displaying the current state
 * of authentication data
 */
const AuthDebugger = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [debugResult, setDebugResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // Only show in development mode
  if (process.env.NODE_ENV === 'production') {
    return null;
  }

  const handleTestLogin = async () => {
    if (!email || !password) {
      toast.error('Please provide both email and password');
      return;
    }

    setLoading(true);
    try {
      const response = await axios.post(`${API_BASE_URL}/api/auth/debug-login`, {
        email, 
        password
      });
      
      setDebugResult(response.data);
      
      if (response.data.success) {
        toast.success('Password is correct! Now trying real login...');
        
        // Try real login
        try {
          const loginResponse = await axios.post(`${API_BASE_URL}/api/auth/login`, {
            email,
            password
          });
          
          if (loginResponse.data.token) {
            // Save token and user data
            localStorage.setItem('token', loginResponse.data.token);
            localStorage.setItem('userData', JSON.stringify(loginResponse.data.user));
            localStorage.setItem('userRole', loginResponse.data.user.role);
            
            // Update API headers
            axios.defaults.headers.common['Authorization'] = `Bearer ${loginResponse.data.token}`;
            
            toast.success('Login successful! Redirecting...');
            setTimeout(() => {
              // Redirect based on role
              const role = loginResponse.data.user.role;
              switch(role) {
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
            }, 1000);
          }
        } catch (loginError) {
          console.error('Real login failed:', loginError);
          toast.error('Debug login worked but real login failed');
        }
      } else if (response.data.found) {
        toast.error('User found but password is incorrect');
      } else {
        toast.error('User not found');
      }
    } catch (error) {
      console.error('Debug login error:', error);
      toast.error('Failed to test login');
      setDebugResult({
        success: false,
        error: error.message
      });
    } finally {
      setLoading(false);
    }
  };

  const handleFixPassword = async () => {
    if (!email) {
      toast.error('Please provide an email');
      return;
    }

    setLoading(true);
    try {
      // Special endpoint to reset a user's password for debugging
      const response = await axios.post(`${API_BASE_URL}/api/auth/reset-debug-password`, {
        email,
        newPassword: password || 'Test123!' // Default password if none provided
      });
      
      if (response.data.success) {
        toast.success('Password has been reset! Try logging in with the new password.');
        setDebugResult({
          ...debugResult,
          passwordFixed: true,
          newPassword: password || 'Test123!'
        });
      } else {
        toast.error('Failed to reset password');
      }
    } catch (error) {
      console.error('Password reset error:', error);
      toast.error('Failed to reset password');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed bottom-4 right-4 z-50">
      {!isOpen ? (
        <button 
          onClick={() => setIsOpen(true)}
          className="bg-red-500 text-white px-3 py-2 rounded-md shadow-md hover:bg-red-600 text-xs"
        >
          🔧 Auth Debug
        </button>
      ) : (
        <div className="bg-white p-4 rounded-lg shadow-lg border border-gray-300 w-80">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-sm font-bold">Auth Debugger</h3>
            <button 
              onClick={() => setIsOpen(false)}
              className="text-gray-500 hover:text-gray-700"
            >
              ✖
            </button>
          </div>
          
          <div className="space-y-3 mb-4">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Email"
              className="w-full px-3 py-2 border rounded-md text-sm"
            />
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Password"
              className="w-full px-3 py-2 border rounded-md text-sm"
            />
          </div>
          
          <div className="flex space-x-2 mb-4">
            <button
              onClick={handleTestLogin}
              disabled={loading}
              className="bg-blue-500 text-white px-3 py-1 rounded-md text-xs hover:bg-blue-600 flex-1"
            >
              {loading ? 'Testing...' : 'Test Login'}
            </button>
            <button
              onClick={handleFixPassword}
              disabled={loading}
              className="bg-yellow-500 text-white px-3 py-1 rounded-md text-xs hover:bg-yellow-600 flex-1"
            >
              Fix Password
            </button>
          </div>
          
          {debugResult && (
            <div className="bg-gray-100 p-2 rounded-md text-xs overflow-auto max-h-40">
              <pre>{JSON.stringify(debugResult, null, 2)}</pre>
            </div>
          )}
          
          <p className="text-xs text-gray-500 mt-2">
            Dev tool only - not visible in production
          </p>
        </div>
      )}
    </div>
  );
};

export default AuthDebugger; 