import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { FaUser, FaEnvelope, FaLock, FaPhoneAlt } from 'react-icons/fa';
import { Link, useNavigate } from 'react-router-dom';
import PasswordStrengthBar from 'react-password-strength-bar';
import axios from 'axios';
import { FcGoogle } from 'react-icons/fc';
import { FaUserMd } from 'react-icons/fa';
import { HiOutlineOfficeBuilding } from 'react-icons/hi';
import { useGoogleAuth, GoogleAuthProvider } from "../../contexts/GoogleAuthContext";

const SignUpContent = () => {
    const { initiateGoogleLogin } = useGoogleAuth();
    const [formData, setFormData] = useState({
        fullName: '',
        email: '',
        password: '',
        selectedVal: '',
        phoneNumber: '',
        file: null,
    });
    const [selectedRole, setSelectedRole] = useState('patient');

    const navigate = useNavigate(); // Initialize navigate

    const handleChange = (e) => {
        const { name, value, type, files } = e.target;
        setFormData({ ...formData, [name]: type === 'file' ? files[0] : value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const formDataToSend = {
            name: formData.fullName,
            email: formData.email,
            gender: formData.selectedVal,
            mobile: formData.phoneNumber,
            age: formData.age,
        };

        try {
            const response = await axios.post('http://localhost:6005/api/patients/register', formDataToSend, {
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            console.log('Patient registered successfully:', response.data);
            if (response.data.name) {
                navigate('/home'); // Navigate to /home
            }

            setFormData({
                fullName: '',
                email: '',
                selectedVal: '',
                phoneNumber: '',
                age: '',
            });

            alert('Patient registered successfully!');
        } catch (error) {
            console.error('Error during registration:', error.response?.data || error.message);
            alert('Registration failed. Please try again.');
        }
    };

    const handleRoleSelect = (role) => {
        setSelectedRole(role);
    };

    const handleGoogleSignup = () => {
        initiateGoogleLogin(selectedRole);
    };

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-4">
            <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
                <h2 className="text-2xl font-bold mb-6 text-center text-gray-800">Create Your Account</h2>
                
                {/* Role selection */}
                <div className="mb-6">
                    <p className="text-sm text-gray-600 mb-2">Sign up as:</p>
                    <div className="flex justify-between gap-2">
                        <button
                            onClick={() => handleRoleSelect('patient')}
                            className={`flex-1 py-2 rounded-md flex items-center justify-center gap-2 transition-colors ${
                                selectedRole === 'patient' 
                                    ? 'bg-blue-100 text-blue-600 border border-blue-300' 
                                    : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
                            }`}
                        >
                            <FaUser className="text-lg" />
                            <span>Patient</span>
                        </button>
                        <button
                            onClick={() => handleRoleSelect('doctor')}
                            className={`flex-1 py-2 rounded-md flex items-center justify-center gap-2 transition-colors ${
                                selectedRole === 'doctor' 
                                    ? 'bg-blue-100 text-blue-600 border border-blue-300' 
                                    : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
                            }`}
                        >
                            <FaUserMd className="text-lg" />
                            <span>Doctor</span>
                        </button>
                        <button
                            onClick={() => handleRoleSelect('admin')}
                            className={`flex-1 py-2 rounded-md flex items-center justify-center gap-2 transition-colors ${
                                selectedRole === 'admin' 
                                    ? 'bg-blue-100 text-blue-600 border border-blue-300' 
                                    : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
                            }`}
                        >
                            <HiOutlineOfficeBuilding className="text-xl" />
                            <span>Admin</span>
                        </button>
                    </div>
                </div>

                {/* Social signup buttons */}
                <div className="mb-4">
                    <button
                        onClick={handleGoogleSignup}
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

                {/* Signup form */}
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label htmlFor="firstName" className="block text-sm font-medium text-gray-700 mb-1">First Name</label>
                            <input 
                                type="text" 
                                id="firstName" 
                                name="fullName"
                                value={formData.fullName}
                                onChange={handleChange}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                placeholder="John"
                            />
                        </div>
                        <div>
                            <label htmlFor="lastName" className="block text-sm font-medium text-gray-700 mb-1">Last Name</label>
                            <input 
                                type="text" 
                                id="lastName" 
                                name="fullName"
                                value={formData.fullName}
                                onChange={handleChange}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                placeholder="Doe"
                            />
                        </div>
                    </div>
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
                    <div>
                        <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-1">Confirm Password</label>
                        <input 
                            type="password" 
                            id="confirmPassword" 
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="•••••••"
                        />
                    </div>
                    {selectedRole === 'doctor' && (
                        <div>
                            <label htmlFor="specialization" className="block text-sm font-medium text-gray-700 mb-1">Specialization</label>
                            <input 
                                type="text" 
                                id="specialization" 
                                name="specialization"
                                value={formData.specialization}
                                onChange={handleChange}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                placeholder="e.g. Cardiology, Dermatology"
                            />
                        </div>
                    )}
                    <div>
                        <label htmlFor="phoneNumber" className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
                        <input 
                            type="tel" 
                            id="phoneNumber" 
                            name="phoneNumber"
                            value={formData.phoneNumber}
                            onChange={handleChange}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="(123) 456-7890"
                        />
                    </div>
                    <div className="flex items-center">
                        <input 
                            id="terms" 
                            type="checkbox" 
                            className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500" 
                        />
                        <label htmlFor="terms" className="ml-2 block text-sm text-gray-700">
                            I agree to the <a href="#" className="text-blue-600 hover:underline">Terms</a> and <a href="#" className="text-blue-600 hover:underline">Privacy Policy</a>
                        </label>
                    </div>
                    <button 
                        type="submit" 
                        className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors"
                    >
                        Create Account
                    </button>
                </form>

                {/* Login link */}
                <p className="mt-6 text-center text-sm text-gray-600">
                    Already have an account?{' '}
                    <Link to="/login" className="text-blue-600 hover:text-blue-500 font-medium">
                        Sign in
                    </Link>
                </p>
            </div>
        </div>
    );
};

const SignUp = () => {
    return (
        <GoogleAuthProvider>
            <SignUpContent />
        </GoogleAuthProvider>
    );
};

export default SignUp;
