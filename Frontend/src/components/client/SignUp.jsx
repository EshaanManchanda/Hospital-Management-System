import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { FaUser, FaEnvelope, FaLock, FaPhoneAlt } from 'react-icons/fa';
import { Link, useNavigate } from 'react-router-dom';
import PasswordStrengthBar from 'react-password-strength-bar';
import axios from 'axios';

const SignUp = () => {
    const [formData, setFormData] = useState({
        fullName: '',
        email: '',
        password: '',
        selectedVal: '',
        phoneNumber: '',
        file: null,
    });

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

    return (
        <div className="bg-[hsl(var(--background))] min-h-screen flex items-center justify-center p-4">
            <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="bg-[hsl(var(--card))] p-8 rounded-lg shadow-lg max-w-md w-full"
            >
                <h2 className="text-3xl font-bold text-[hsl(var(--primary))] mb-6 text-center">Sign Up for Health Nest</h2>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label htmlFor="fullName" className="block text-sm font-medium text-[hsl(var(--foreground))] mb-1">Full Name</label>
                        <div className="relative">
                            <FaUser className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[hsl(var(--muted-foreground))]" />
                            <input
                                type="text"
                                id="fullName"
                                name="fullName"
                                value={formData.fullName}
                                onChange={handleChange}
                                className="pl-10 pr-4 py-2 w-full border border-[hsl(var(--border))] rounded-md focus:outline-none focus:ring-2 focus:ring-[hsl(var(--accent))]"
                                placeholder="John Doe"
                                required
                            />
                        </div>
                    </div>
                    <div>
                        <label htmlFor="email" className="block text-sm font-medium text-[hsl(var(--foreground))] mb-1">Email</label>
                        <div className="relative">
                            <FaEnvelope className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[hsl(var(--muted-foreground))]" />
                            <input
                                type="email"
                                id="email"
                                name="email"
                                value={formData.email}
                                onChange={handleChange}
                                className="pl-10 pr-4 py-2 w-full border border-[hsl(var(--border))] rounded-md focus:outline-none focus:ring-2 focus:ring-[hsl(var(--accent))]"
                                placeholder="johndoe@example.com"
                                required
                            />
                        </div>
                    </div>
                    <div>
                        <label htmlFor="password" className="block text-sm font-medium text-[hsl(var(--foreground))] mb-1">Password</label>
                        <div className="relative">
                            <FaLock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[hsl(var(--muted-foreground))]" />
                            <input
                                type="password"
                                id="password"
                                name="password"
                                value={formData.password}
                                onChange={handleChange}
                                className="pl-10 pr-4 py-2 w-full border border-[hsl(var(--border))] rounded-md focus:outline-none focus:ring-2 focus:ring-[hsl(var(--accent))]"
                                placeholder="••••••••"
                                required
                            />
                        </div>
                        <PasswordStrengthBar password={formData.password} />
                    </div>
                    <div>
                        <label htmlFor="selection" className="block text-sm font-medium text-[hsl(var(--foreground))] mb-1">Select</label>
                        <div className="relative">
                            <select
                                id="selection"
                                name="selectedVal"
                                value={formData.selectedVal}
                                onChange={handleChange}
                                className="pl-10 pr-4 py-2 w-full border border-[hsl(var(--border))] rounded-md focus:outline-none focus:ring-2 focus:ring-[hsl(var(--accent))]"
                            >
                                <option value="" disabled>Select</option>
                                <option value="doctor">Doctor</option>
                                <option value="patient">Patient</option>
                            </select>
                        </div>
                    </div>
                    {formData.selectedVal === 'doctor' && (
                        <div>
                            <label htmlFor="file" className="block text-sm font-medium text-[hsl(var(--foreground))] mb-1">Upload PDF</label>
                            <input
                                type="file"
                                id="file"
                                name="file"
                                accept="application/pdf"
                                onChange={handleChange}
                                required
                                className="border border-[hsl(var(--border))] rounded-md py-2 px-4 w-full focus:outline-none focus:ring-2 focus:ring-[hsl(var(--accent))]"
                            />
                        </div>
                    )}
                    <div>
                        <label htmlFor="phoneNumber" className="block text-sm font-medium text-[hsl(var(--foreground))] mb-1">Phone Number</label>
                        <div className="relative">
                            <FaPhoneAlt className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[hsl(var(--muted-foreground))]" />
                            <input
                                type="tel"
                                id="phoneNumber"
                                name="phoneNumber"
                                value={formData.phoneNumber}
                                onChange={handleChange}
                                className="pl-10 pr-4 py-2 w-full border border-[hsl(var(--border))] rounded-md focus:outline-none focus:ring-2 focus:ring-[hsl(var(--accent))]"
                                placeholder="(123) 456-7890"
                                required
                            />
                        </div>
                    </div>
                    <button
                        type="submit"
                        className="w-full bg-[hsl(var(--accent))] text-white font-bold py-2 px-4 rounded-md hover:bg-[hsl(var(--accent))/80] transition duration-300 shadow-md"
                    >
                        Sign Up
                    </button>
                </form>
                <p className="mt-4 text-center text-sm text-[hsl(var(--muted-foreground))]">
                    Already have an account?{' '}
                    <Link to="/login" className="text-[hsl(var(--accent))] hover:underline">
                        Log in
                    </Link>
                </p>
            </motion.div>
        </div>
    );
};

export default SignUp;
