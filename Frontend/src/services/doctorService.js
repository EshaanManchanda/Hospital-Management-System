import api from '../utils/api';

/**
 * Doctor service for managing doctor data
 */
const doctorService = {
  /**
   * Get all doctors with pagination
   * @param {number} page - Page number
   * @param {number} limit - Items per page
   * @returns {Promise<Object>} Doctor list with pagination info
   */
  getAllDoctors: async (page = 1, limit = 10) => {
    try {
      // Use the proper endpoint based on the backend route
      const response = await api.get(`/api/doctors`);
      
      console.log("Doctor API response:", response.data);
      
      // Safely extract data with fallbacks
      const responseData = response?.data || {};
      
      // Handle all possible response structures
      let doctors = [];
      let count = 0;
      let success = true;
      
      // Case 1: Standard API response with success flag
      if (typeof responseData.success === 'boolean' && responseData.success === true) {
        doctors = responseData.data || [];
        count = responseData.count || doctors.length;
      }
      // Case 2: Direct array of doctors
      else if (Array.isArray(responseData)) {
        doctors = responseData;
        count = responseData.length;
      }
      // Case 3: Data property containing array
      else if (responseData.data && Array.isArray(responseData.data)) {
        doctors = responseData.data;
        count = responseData.count || doctors.length;
      }
      // Case 4: Unknown structure but has doctors property
      else if (responseData.doctors && Array.isArray(responseData.doctors)) {
        doctors = responseData.doctors;
        count = responseData.totalDoctors || doctors.length;
      }
      // If none of the above, consider it an error
      else {
        throw new Error('Invalid API response format');
      }
      
      // Return standardized response
      return {
        success: true,
        doctors: doctors,
        totalDoctors: count
      };
    } catch (error) {
      console.error('Get doctors error:', error);
      // Return error in a way that won't cause "is not a function" errors
      return {
        success: false,
        doctors: [],
        totalDoctors: 0,
        message: error.message || 'Failed to fetch doctors'
      };
    }
  },
  
  /**
   * Get a doctor by ID
   * @param {string} id - Doctor ID
   * @returns {Promise<Object>} Doctor data
   */
  getDoctorById: async (id) => {
    try {
      const response = await api.get(`/api/doctors/${id}`);
      
      if (response.data && response.data.success) {
        return {
          doctor: response.data.data,
          success: true
        };
      } else {
        throw new Error(response.data?.message || 'Failed to fetch doctor');
      }
    } catch (error) {
      console.error('Get doctor error:', error);
      throw error;
    }
  },

  /**
   * Create a new doctor
   * @param {Object} doctorData - Doctor data including user information
   * @returns {Promise<Object>} Created doctor data
   */
  createDoctor: async (doctorData) => {
    try {
      // The data is already formatted in the form component
      // to match the API expectations, so we don't need additional formatting here
      console.log('Creating doctor with data:', doctorData);
      
      const response = await api.post('/api/doctors', doctorData);
      
      if (response.data && response.data.success) {
        return {
          doctor: response.data.data,
          message: response.data.message || 'Doctor created successfully',
          success: true
        };
      } else {
        throw new Error(response.data?.message || 'Failed to create doctor');
      }
    } catch (error) {
      console.error('Create doctor error:', error);
      throw error;
    }
  },

  /**
   * Update a doctor
   * @param {string} id - Doctor ID
   * @param {Object} doctorData - Doctor data to update
   * @returns {Promise<Object>} Updated doctor data
   */
  updateDoctor: async (id, doctorData) => {
    try {
      // Log the doctor ID and data being sent
      console.log('Updating doctor with ID:', id);
      console.log('Full update payload:', doctorData);
      
      // Create a sanitized payload by removing undefined or null values
      const sanitizedData = Object.entries(doctorData)
        .filter(([_, value]) => value !== undefined && value !== null)
        .reduce((acc, [key, value]) => ({ ...acc, [key]: value }), {});
      
      console.log('Sanitized update payload:', sanitizedData);
      
      // Make the API call with proper error handling
      const response = await api.put(`/api/doctors/${id}`, sanitizedData);
      
      if (response.data && response.data.success) {
        return {
          doctor: response.data.data,
          message: response.data.message || 'Doctor updated successfully',
          success: true
        };
      } else {
        throw new Error(response.data?.message || 'Failed to update doctor');
      }
    } catch (error) {
      console.error('Update doctor error:', error);
      // Log detailed error information
      if (error.response) {
        console.error('Error response:', {
          status: error.response.status,
          statusText: error.response.statusText,
          data: error.response.data
        });
      }
      throw error;
    }
  },
  
  /**
   * Delete a doctor
   * @param {string} id - Doctor ID
   * @returns {Promise<Object>} Success message
   */
  deleteDoctor: async (id) => {
    try {
      const response = await api.delete(`/api/doctors/${id}`);
      
      if (response.data && response.data.success) {
        return {
          message: response.data.message || 'Doctor deleted successfully',
          success: true
        };
      } else {
        throw new Error(response.data?.message || 'Failed to delete doctor');
      }
    } catch (error) {
      console.error('Delete doctor error:', error);
      throw error;
    }
  },
  
  /**
   * Get doctors by specialization
   * @param {string} specialization - Specialization name
   * @returns {Promise<Object>} Filtered doctor list
   */
  getDoctorsBySpecialization: async (specialization) => {
    try {
      const response = await api.get(`/api/doctors/specialization/${specialization}`);
      
      if (response.data && response.data.success) {
        return {
          doctors: response.data.data || [],
          success: true
        };
      } else {
        throw new Error(response.data?.message || 'Failed to fetch doctors by specialization');
      }
    } catch (error) {
      console.error('Get doctors by specialization error:', error);
      throw error;
    }
  },
  
  /**
   * Get list of all available specializations
   * @returns {Promise<Object>} List of specializations
   */
  getSpecializations: async () => {
    try {
      const response = await api.get('/api/doctors/specializations');
      
      if (response.data && response.data.success) {
        return {
          specializations: response.data.data || [],
          success: true
        };
      } else {
        throw new Error(response.data?.message || 'Failed to fetch specializations');
      }
    } catch (error) {
      console.error('Get specializations error:', error);
      throw error;
    }
  },

  /**
   * Add rating to a doctor
   * @param {string} id - Doctor ID
   * @param {Object} ratingData - Rating data
   * @returns {Promise<Object>} Updated doctor data
   */
  addDoctorRating: async (id, ratingData) => {
    try {
      const response = await api.post(`/api/doctors/${id}/ratings`, ratingData);
      return response.data;
    } catch (error) {
      console.error('Add doctor rating error:', error);
      throw error;
    }
  }
};

export default doctorService; 