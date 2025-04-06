// API Testing script - Run this in your browser console to debug API connection

import axios from 'axios';

// Base URL from environment or default
// const API_URL = process.env.REACT_APP_API_URL || 'http://127.0.0.1:5000/api';
const API_URL='http://127.0.0.1:5000/api'

console.log('Debug API - Using API URL:', API_URL);

// Function to test API connectivity
export const testApiConnection = async () => {
  try {
    console.log('Testing API connection...');
    // Try to hit a simple endpoint that doesn't require auth
    const response = await axios.get(`${API_URL}/health`);
    console.log('API connection successful:', response.data);
    return { success: true, data: response.data };
  } catch (error) {
    console.error('API connection failed:', error.message);
    // Try alternative URL
    try {
      const alternativeUrl = 'http://localhost:5000/api';
      console.log('Trying alternative URL:', alternativeUrl);
      const altResponse = await axios.get(`${alternativeUrl}/health`);
      console.log('Alternative API connection successful:', altResponse.data);
      return { 
        success: true, 
        data: altResponse.data, 
        message: 'Connected using alternative URL' 
      };
    } catch (altError) {
      console.error('Alternative API connection also failed:', altError.message);
      return { 
        success: false, 
        error: error.message, 
        alternativeError: altError.message 
      };
    }
  }
};

// Function to test authentication
export const testAuthentication = async (email, password) => {
  try {
    console.log('Testing authentication with:', { email });
    
    // Try with configured API URL
    const response = await axios.post(`${API_URL}/auth/login`, { 
      email, 
      password 
    });
    
    console.log('Authentication successful:', response.data);
    
    // Return the full response data for analysis
    return { 
      success: true, 
      url: API_URL,
      data: response.data 
    };
  } catch (error) {
    console.error('Authentication failed with primary URL:', error.message);
    
    // Try alternative URL
    try {
      const alternativeUrl = 'http://localhost:5000/api';
      console.log('Trying alternative URL for auth:', alternativeUrl);
      
      const altResponse = await axios.post(`${alternativeUrl}/auth/login`, { 
        email, 
        password 
      });
      
      console.log('Authentication successful with alternative URL:', altResponse.data);
      
      return { 
        success: true, 
        url: alternativeUrl,
        data: altResponse.data, 
        message: 'Authenticated using alternative URL' 
      };
    } catch (altError) {
      console.error('Authentication failed with alternative URL:', altError.message);
      
      return { 
        success: false, 
        primaryError: error.response?.data || error.message,
        alternativeError: altError.response?.data || altError.message,
        primaryStatus: error.response?.status,
        alternativeStatus: altError.response?.status
      };
    }
  }
};

// Create a debugging script to test the API directly
const debugAPI = {
  API_URL: 'http://127.0.0.1:5000/api',
  testApiConnection, // Include the function in the object too
  testAuthentication, // Include the function in the object too
  
  // Test doctor endpoint
  testGetDoctors: async () => {
    try {
      console.log('Testing GET /doctors endpoint...');
      const response = await axios.get(`${debugAPI.API_URL}/doctors`);
      console.log('Response:', response.data);
      
      if (response.data.data && response.data.data.length > 0) {
        const firstDoctor = response.data.data[0];
        console.log('First doctor ID:', firstDoctor._id);
        console.log('First doctor name:', firstDoctor.user?.name);
      } else {
        console.log('No doctors found in the response');
      }
      
      return response.data;
    } catch (error) {
      console.error('Error testing doctors endpoint:', error.response?.data || error.message);
      throw error;
    }
  },
  
  // Test appointment creation
  testCreateAppointment: async (token, doctorId, patientId) => {
    try {
      if (!doctorId || !patientId) {
        throw new Error('Doctor ID and Patient ID are required for testing');
      }
      
      console.log('Testing POST /appointments endpoint...');
      console.log('Using doctor ID:', doctorId);
      console.log('Using patient ID:', patientId);
      
      const appointmentData = {
        doctorId,
        patientId,
        date: new Date().toISOString().split('T')[0], // Today
        time: '10:00 AM',
        type: 'consultation',
        description: 'Test appointment',
        symptoms: ['Test symptom']
      };
      
      console.log('Appointment payload:', appointmentData);
      
      const response = await axios.post(
        `${debugAPI.API_URL}/appointments`, 
        appointmentData,
        {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          }
        }
      );
      
      console.log('Appointment created successfully:', response.data);
      return response.data;
    } catch (error) {
      console.error('Error creating test appointment:', error.response?.data || error.message);
      throw error;
    }
  }
};

// Expose the debugging API to the window object for testing in the browser console
window.debugAPI = debugAPI;

export default debugAPI;

// Auto-run the connection test when imported in development
if (process.env.NODE_ENV !== 'production') {
  console.log('Running API connectivity test...');
  testApiConnection().then(result => {
    console.log('API Connection Test Result:', result);
  });
} 