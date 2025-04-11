import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { FaUser, FaEnvelope, FaLock, FaPhoneAlt, FaArrowRight, FaArrowLeft, FaVenusMars, FaTint, FaRulerVertical, FaWeight, FaBirthdayCake, FaHeartbeat, FaShieldAlt, FaGoogle } from "react-icons/fa";
import PasswordStrengthBar from "react-password-strength-bar";
import { authService } from "../../services";
import { useGoogleAuth } from "../../contexts/GoogleAuthContext";
import { toast } from "react-hot-toast";

const SignUp = () => {
  const navigate = useNavigate();
  const { initiateGoogleLogin, loading: googleLoading } = useGoogleAuth();
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    password: "",
    gender: "",
    phoneNumber: "",
    age: "",
    bloodGroup: "",
    height: "",
    weight: "",
    role: "patient",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [step, setStep] = useState(1);
  const [passwordScore, setPasswordScore] = useState(0);

  const handlePasswordChange = (score) => {
    setPasswordScore(score);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    if (error) {
      setError("");
    }
  };

  const nextStep = () => {
    if (step === 1) {
      setError("");
      
      if (!formData.fullName.trim()) {
        setError("Please enter your full name");
        return;
      }
      
      if (!formData.email.trim()) {
        setError("Please enter your email address");
        return;
      }
      
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(formData.email.trim())) {
        setError("Please enter a valid email address");
        return;
      }
      
      // Password is no longer required for Google signup
      if (formData.password && passwordScore < 2) {
        setError("Please choose a stronger password");
        return;
      }
    }
    
    if (step === 2 && !formData.gender) {
      setError("Please select your gender");
      return;
    }
    
    setStep(step + 1);
    setError("");
  };

  const prevStep = () => {
    setStep(step - 1);
    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      // Basic client-side validation
      if (!formData.fullName.trim()) {
        throw new Error("Please enter your full name");
      }
      
      if (!formData.email.trim()) {
        throw new Error("Please enter your email address");
      }

      if (!formData.gender) {
        throw new Error("Please select your gender");
      }

      if (!formData.phoneNumber) {
        throw new Error("Please enter your mobile number");
      }

      if (!formData.password) {
        throw new Error("Please enter a password");
      }

      // Create patient data object with correct structure for backend
      const patientData = {
        user: {
          name: formData.fullName,
          email: formData.email,
          password: formData.password,
          role: "patient",
          mobile: formData.phoneNumber,
          gender: formData.gender
        },
        medicalHistory: {
          allergies: [],
          chronicConditions: [],
          surgeries: [],
          medications: []
        }
      };

      // Handle optional fields
      if (formData.age) {
        const currentYear = new Date().getFullYear();
        const birthYear = currentYear - parseInt(formData.age);
        // Set to January 1st of the birth year for simplicity
        patientData.user.dateOfBirth = new Date(birthYear, 0, 1).toISOString();
        // Also include the age directly
        patientData.user.age = parseInt(formData.age);
      }

      if (formData.bloodGroup) {
        patientData.bloodGroup = formData.bloodGroup;
      }
      
      if (formData.height) {
        patientData.height = parseInt(formData.height);
      }
      
      if (formData.weight) {
        patientData.weight = parseInt(formData.weight);
      }

      // Include empty address object to satisfy schema requirements
      patientData.user.address = {
        street: "",
        city: "",
        state: "",
        zipCode: "",
        country: ""
      };

      console.log("Registering patient:", { 
        ...patientData, 
        user: {
          ...patientData.user,
          password: "********"  // Hide password in logs
        }
      });
      
      // Try to directly use the patient-specific registration endpoint
      const response = await authService.registerPatient(patientData);
      
      // If that fails, fall back to the standard registration endpoint
      if (!response.success) {
        console.log("Patient-specific registration failed, trying standard registration");
        const standardResponse = await authService.register(patientData);
        
        if (!standardResponse.success) {
          throw new Error(standardResponse.message || "Registration failed. Please try again.");
        }
        
        console.log("Standard registration successful");
      } else {
        console.log("Patient-specific registration successful");
      }
      
      toast.success("Registration successful! Please login with your credentials.");
      navigate("/login", { 
        state: { 
          success: true, 
          message: "Registration successful! Please login with your credentials." 
        } 
      });
    } catch (error) {
      console.error("Registration error:", error);
      setError(error.response?.data?.message || error.message || "Registration failed. Please try again.");
      toast.error(error.response?.data?.message || error.message || "Registration failed. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleSignUp = async () => {
    try {
      setIsLoading(true);
      setError("");
      
      console.log("Initiating Google OAuth flow for patient signup");
      
      // Store a flag to indicate we're in the signup flow
      sessionStorage.setItem('googleSignupFlow', 'true');
      
      // Call initiateGoogleLogin from GoogleAuthContext with the patient role
      await initiateGoogleLogin("patient");
      
      // The rest of the auth flow will be handled by the GoogleOAuthCallback component
      // when Google redirects back to our callback URL
    } catch (error) {
      console.error("Google signup error:", error);
      toast.error(error.message || "Google sign-up failed");
      setError(error.message || "Google sign-up failed");
      setIsLoading(false);
    }
    // Note: We don't call setIsLoading(false) in the success path
    // because the page will redirect to Google
  };

  const renderStepIndicator = () => {
    return (
      <div className="mb-8">
        <div className="flex items-center justify-between mb-2">
          {[1, 2].map((i) => (
            <div 
              key={i} 
              className={`flex items-center justify-center w-10 h-10 rounded-full 
                ${step >= i 
                  ? 'bg-gradient-to-r from-blue-500 to-indigo-600 text-white' 
                  : 'bg-gray-200 text-gray-500'}`}
            >
              {i}
            </div>
          ))}
        </div>
        <div className="relative h-2 bg-gray-200 rounded-full">
          <motion.div 
            className="absolute top-0 left-0 h-full bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full"
            initial={{ width: step === 1 ? "0%" : "100%" }}
            animate={{ width: `${(step - 1) * 100}%` }}
            transition={{ duration: 0.3 }}
          />
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 flex flex-col md:flex-row overflow-hidden">
      {/* Left side illustration */}
      <div className="hidden md:flex md:w-1/2 bg-gradient-to-br from-blue-600 to-indigo-800 p-12 justify-center items-center">
        <div className="max-w-md text-white">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h1 className="text-4xl font-bold mb-6">Welcome to Health Nest</h1>
            <p className="text-blue-100 text-lg mb-8">
              Join our healthcare platform to manage your health journey efficiently. 
              Access appointments, medical records, and connect with healthcare professionals all in one place.
            </p>
            
            <div className="space-y-4">
              <div className="flex items-center">
                <div className="flex-shrink-0 h-8 w-8 bg-blue-400 bg-opacity-30 rounded-full flex items-center justify-center">
                  <FaHeartbeat className="text-white" />
                </div>
                <p className="ml-4 text-blue-100">Personalized health tracking</p>
              </div>
              
              <div className="flex items-center">
                <div className="flex-shrink-0 h-8 w-8 bg-blue-400 bg-opacity-30 rounded-full flex items-center justify-center">
                  <FaShieldAlt className="text-white" />
                </div>
                <p className="ml-4 text-blue-100">Secure and private health records</p>
              </div>
              
              <div className="flex items-center">
                <div className="flex-shrink-0 h-8 w-8 bg-blue-400 bg-opacity-30 rounded-full flex items-center justify-center">
                  <FaUser className="text-white" />
                </div>
                <p className="ml-4 text-blue-100">Connect with healthcare professionals</p>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
      
      {/* Right side form */}
      <div className="w-full md:w-1/2 py-10 px-4 sm:px-6 flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8"
        >
          <h2 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-600 mb-2 text-center">
            Patient Registration
          </h2>
          <p className="text-gray-500 text-center mb-8">Create your account to get started</p>
          
          {/* Google Sign-up Button */}
          <motion.button
            onClick={handleGoogleSignUp}
            disabled={isLoading || googleLoading}
            className="w-full flex items-center justify-center space-x-2 bg-white border-2 border-gray-300 text-gray-800 font-medium py-3 px-4 rounded-lg hover:bg-gray-50 hover:border-gray-400 transition duration-300 mb-6"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            type="button"
          >
            {isLoading || googleLoading ? (
              <svg className="animate-spin h-5 w-5 text-gray-800" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
            ) : (
              <>
                <FaGoogle className="text-xl text-blue-600" />
                <span>Sign up with Google</span>
              </>
            )}
          </motion.button>

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-white text-gray-500">Or fill in your details</span>
            </div>
          </div>
          
          {renderStepIndicator()}
          
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 rounded-md mb-6"
            >
              <div className="flex items-center">
                <svg className="h-5 w-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
                {error}
              </div>
            </motion.div>
          )}
          
          <form onSubmit={handleSubmit}>
            <AnimatePresence mode="wait">
              {step === 1 && (
                <motion.div
                  key="step1"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.3 }}
                  className="space-y-5"
                >
                  <div>
                    <label htmlFor="fullName" className="block text-sm font-medium text-gray-700 mb-1">
                      Full Name <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <FaUser className="text-gray-400" />
                      </div>
                      <input
                        type="text"
                        id="fullName"
                        name="fullName"
                        value={formData.fullName}
                        onChange={handleChange}
                        className="pl-10 pr-4 py-3 w-full border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                        placeholder="John Doe"
                        required
                      />
                    </div>
                  </div>
                  
                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                      Email <span className="text-red-500">*</span>
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
                        placeholder="johndoe@example.com"
                        required
                      />
                    </div>
                  </div>
                  
                  <div>
                    <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                      Password
                    </label>
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
                      />
                    </div>
                    <PasswordStrengthBar 
                      password={formData.password} 
                      onChangeScore={(score) => handlePasswordChange(score)}
                      scoreWords={['Weak', 'Weak', 'Fair', 'Good', 'Strong']}
                      scoreColors={['#e74c3c', '#e74c3c', '#f39c12', '#3498db', '#27ae60']}
                    />
                  </div>
                  
                  <div className="flex justify-end pt-4">
                    <motion.button
                      type="button"
                      onClick={nextStep}
                      className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white font-semibold py-3 px-6 rounded-lg hover:shadow-lg hover:from-blue-600 hover:to-indigo-700 transition duration-300 flex items-center"
                      whileHover={{ scale: 1.03 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      Next Step
                      <FaArrowRight className="ml-2" />
                    </motion.button>
                  </div>
                </motion.div>
              )}
              
              {step === 2 && (
                <motion.div
                  key="step2"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.3 }}
                  className="space-y-5"
                >
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    <div>
                      <label htmlFor="gender" className="block text-sm font-medium text-gray-700 mb-1">
                        Gender <span className="text-red-500">*</span>
                      </label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <FaVenusMars className="text-gray-400" />
                        </div>
                        <select
                          id="gender"
                          name="gender"
                          value={formData.gender}
                          onChange={handleChange}
                          className="pl-10 pr-4 py-3 w-full border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all appearance-none bg-none"
                          required
                        >
                          <option value="" disabled>Select Gender</option>
                          <option value="male">Male</option>
                          <option value="female">Female</option>
                          <option value="other">Other</option>
                        </select>
                      </div>
                    </div>
                    
                    <div>
                      <label htmlFor="phoneNumber" className="block text-sm font-medium text-gray-700 mb-1">
                        Phone Number <span className="text-red-500">*</span>
                      </label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <FaPhoneAlt className="text-gray-400" />
                        </div>
                        <input
                          type="tel"
                          id="phoneNumber"
                          name="phoneNumber"
                          value={formData.phoneNumber}
                          onChange={handleChange}
                          className="pl-10 pr-4 py-3 w-full border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                          placeholder="1234567890"
                        />
                      </div>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    <div>
                      <label htmlFor="age" className="block text-sm font-medium text-gray-700 mb-1">
                        Age
                      </label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <FaBirthdayCake className="text-gray-400" />
                        </div>
                        <input
                          type="number"
                          id="age"
                          name="age"
                          value={formData.age}
                          onChange={handleChange}
                          className="pl-10 pr-4 py-3 w-full border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                          placeholder="30"
                        />
                      </div>
                    </div>
                    
                    <div>
                      <label htmlFor="bloodGroup" className="block text-sm font-medium text-gray-700 mb-1">
                        Blood Group
                      </label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <FaTint className="text-gray-400" />
                        </div>
                        <select
                          id="bloodGroup"
                          name="bloodGroup"
                          value={formData.bloodGroup}
                          onChange={handleChange}
                          className="pl-10 pr-4 py-3 w-full border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all appearance-none bg-none"
                        >
                          <option value="" disabled>Select Blood Group</option>
                          <option value="A+">A+</option>
                          <option value="A-">A-</option>
                          <option value="B+">B+</option>
                          <option value="B-">B-</option>
                          <option value="AB+">AB+</option>
                          <option value="AB-">AB-</option>
                          <option value="O+">O+</option>
                          <option value="O-">O-</option>
                        </select>
                      </div>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    <div>
                      <label htmlFor="height" className="block text-sm font-medium text-gray-700 mb-1">
                        Height (cm)
                      </label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <FaRulerVertical className="text-gray-400" />
                        </div>
                        <input
                          type="number"
                          id="height"
                          name="height"
                          value={formData.height}
                          onChange={handleChange}
                          className="pl-10 pr-4 py-3 w-full border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                          placeholder="175"
                        />
                      </div>
                    </div>
                    
                    <div>
                      <label htmlFor="weight" className="block text-sm font-medium text-gray-700 mb-1">
                        Weight (kg)
                      </label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <FaWeight className="text-gray-400" />
                        </div>
                        <input
                          type="number"
                          id="weight"
                          name="weight"
                          value={formData.weight}
                          onChange={handleChange}
                          className="pl-10 pr-4 py-3 w-full border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                          placeholder="70"
                        />
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex justify-between pt-4">
                    <motion.button
                      type="button"
                      onClick={prevStep}
                      className="bg-gray-200 text-gray-700 font-semibold py-3 px-6 rounded-lg hover:bg-gray-300 transition duration-300 flex items-center"
                      whileHover={{ scale: 1.03 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <FaArrowLeft className="mr-2" />
                      Previous
                    </motion.button>
                    
                    <motion.button
                      type="submit"
                      disabled={isLoading}
                      className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white font-semibold py-3 px-6 rounded-lg hover:shadow-lg hover:from-blue-600 hover:to-indigo-700 transition duration-300 flex items-center"
                      whileHover={{ scale: 1.03 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      {isLoading ? (
                        <>
                          <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                          </svg>
                          Registering...
                        </>
                      ) : (
                        <>
                          Complete Registration
                        </>
                      )}
                    </motion.button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </form>
          
          <div className="mt-8 text-center">
            <p className="text-gray-600">
              Already have an account?{" "}
              <Link to="/login" className="font-medium text-blue-600 hover:text-indigo-600 transition-colors">
                Log in
              </Link>
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default SignUp;