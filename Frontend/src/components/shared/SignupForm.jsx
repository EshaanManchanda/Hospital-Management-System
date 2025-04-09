import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { toast } from 'react-hot-toast';
import { Button, Spinner } from 'flowbite-react';
import { FaUserMd, FaUser, FaHospitalUser } from 'react-icons/fa';
import authService from '../../services/authService';
import { useAuth } from '../../contexts/AuthContext';

const schema = yup.object().shape({
  name: yup.string().required('Name is required'),
  email: yup.string().email('Email is not valid').required('Email is required'),
  password: yup.string()
    .min(6, 'Password must be at least 6 characters')
    .required('Password is required'),
  confirmPassword: yup.string()
    .oneOf([yup.ref('password'), null], 'Passwords must match')
    .required('Confirm password is required'),
  role: yup.string().required('Please select a role')
});

const SignupForm = () => {
  const { register: authRegister } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [selectedRole, setSelectedRole] = useState('patient');
  const navigate = useNavigate();

  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      role: 'patient'
    }
  });

  const onSubmit = async (data) => {
    setIsLoading(true);
    try {
      // Remove confirmPassword as it's not needed for the API
      const { confirmPassword, ...signupData } = data;
      
      // Try to register the user
      const response = await authService.register(signupData);
      
      if (response.success && response.user) {
        const user = response.user;
        toast.success('Registration successful! Redirecting to your dashboard...');
        
        // Redirect based on role
        switch (user.role) {
          case 'admin':
            navigate('/admin-dashboard', { replace: true });
            break;
          case 'doctor':
            navigate('/doctor-dashboard', { replace: true });
            break;
          case 'patient':
          default:
            navigate('/patient-dashboard', { replace: true });
        }
      } else {
        // Error is displayed by AuthContext
        toast.error(response.message || 'Registration failed. Please try again.');
        setIsLoading(false);
      }
    } catch (error) {
      console.error('Registration error:', error);
      toast.error(error.response?.data?.message || 'Registration failed. Please try again.');
      setIsLoading(false);
    }
  };

  const handleRoleChange = (role) => {
    setSelectedRole(role);
  };

  return (
    <div className="w-full max-w-md p-6 bg-white rounded-lg shadow-md">
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="mb-6">
          <label className="block mb-2 text-sm font-medium text-gray-900">
            Full Name
          </label>
          <input
            type="text"
            {...register('name')}
            className={`bg-gray-50 border ${errors.name ? 'border-red-500' : 'border-gray-300'} text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5`}
            placeholder="John Doe"
          />
          {errors.name && (
            <p className="mt-1 text-sm text-red-600">{errors.name.message}</p>
          )}
        </div>

        <div className="mb-6">
          <label className="block mb-2 text-sm font-medium text-gray-900">
            Email
          </label>
          <input
            type="email"
            {...register('email')}
            className={`bg-gray-50 border ${errors.email ? 'border-red-500' : 'border-gray-300'} text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5`}
            placeholder="name@example.com"
          />
          {errors.email && (
            <p className="mt-1 text-sm text-red-600">{errors.email.message}</p>
          )}
        </div>

        <div className="mb-6">
          <label className="block mb-2 text-sm font-medium text-gray-900">
            Password
          </label>
          <input
            type="password"
            {...register('password')}
            className={`bg-gray-50 border ${errors.password ? 'border-red-500' : 'border-gray-300'} text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5`}
            placeholder="•••••••"
          />
          {errors.password && (
            <p className="mt-1 text-sm text-red-600">{errors.password.message}</p>
          )}
        </div>

        <div className="mb-6">
          <label className="block mb-2 text-sm font-medium text-gray-900">
            Confirm Password
          </label>
          <input
            type="password"
            {...register('confirmPassword')}
            className={`bg-gray-50 border ${errors.confirmPassword ? 'border-red-500' : 'border-gray-300'} text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5`}
            placeholder="•••••••"
          />
          {errors.confirmPassword && (
            <p className="mt-1 text-sm text-red-600">{errors.confirmPassword.message}</p>
          )}
        </div>

        <div className="mb-6">
          <label className="block mb-2 text-sm font-medium text-gray-900">
            I am a:
          </label>
          <div className="flex justify-between">
            <div 
              className={`flex flex-col items-center justify-center p-4 border rounded-lg cursor-pointer transition-all ${selectedRole === 'patient' ? 'border-blue-500 bg-blue-50' : 'border-gray-200 hover:bg-gray-50'}`}
              onClick={() => handleRoleChange('patient')}
            >
              <FaUser className="w-6 h-6 mb-2 text-blue-600" />
              <label className="cursor-pointer">
                <input
                  type="radio"
                  {...register('role')}
                  value="patient"
                  className="hidden"
                  checked={selectedRole === 'patient'}
                  onChange={() => {}}
                />
                Patient
              </label>
            </div>
            
            <div 
              className={`flex flex-col items-center justify-center p-4 border rounded-lg cursor-pointer transition-all ${selectedRole === 'doctor' ? 'border-blue-500 bg-blue-50' : 'border-gray-200 hover:bg-gray-50'}`}
              onClick={() => handleRoleChange('doctor')}
            >
              <FaUserMd className="w-6 h-6 mb-2 text-blue-600" />
              <label className="cursor-pointer">
                <input
                  type="radio"
                  {...register('role')}
                  value="doctor"
                  className="hidden"
                  checked={selectedRole === 'doctor'}
                  onChange={() => {}}
                />
                Doctor
              </label>
            </div>
            
            <div 
              className={`flex flex-col items-center justify-center p-4 border rounded-lg cursor-pointer transition-all ${selectedRole === 'admin' ? 'border-blue-500 bg-blue-50' : 'border-gray-200 hover:bg-gray-50'}`}
              onClick={() => handleRoleChange('admin')}
            >
              <FaHospitalUser className="w-6 h-6 mb-2 text-blue-600" />
              <label className="cursor-pointer">
                <input
                  type="radio"
                  {...register('role')}
                  value="admin"
                  className="hidden"
                  checked={selectedRole === 'admin'}
                  onChange={() => {}}
                />
                Admin
              </label>
            </div>
          </div>
          {errors.role && (
            <p className="mt-1 text-sm text-red-600">{errors.role.message}</p>
          )}
        </div>

        <Button 
          type="submit" 
          className="w-full"
          color="blue"
          disabled={isLoading}
        >
          {isLoading ? (
            <>
              <Spinner size="sm" className="mr-2" />
              Creating your account...
            </>
          ) : (
            'Create Account'
          )}
        </Button>
      </form>
    </div>
  );
};

export default SignupForm; 