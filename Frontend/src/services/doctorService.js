// We'll use dynamic imports to avoid circular dependencies
let api = null;

// Helper function to get auth token
const getAuthToken = () => {
  const token = localStorage.getItem('token');
  return token ? `Bearer ${token}` : '';
};

// Helper function to set auth headers
const getAuthHeaders = () => {
  return {
    'Authorization': getAuthToken(),
    'Content-Type': 'application/json'
  };
};

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
      if (!api) {
        api = (await import('../utils/api')).default;
      }
      
      const config = {
        headers: getAuthHeaders(),
        params: { page, limit }
      };
      
      const response = await api.get('/api/doctors', config);
      
      console.log("Doctor API response:", response.data);
      
      // Return the API response directly with standardized structure
      if (response.data && response.data.success) {
        // Log detailed doctor data to help diagnose issues
        const doctorData = response.data.data || [];
        doctorData.forEach((doctor, index) => {
          console.log(`API doctor ${index + 1} details:`, {
            doctorId: doctor._id,
            name: doctor.name,
            email: doctor.email,
            specialization: doctor.specialization
          });
        });
        
        return {
          success: true,
          data: doctorData,
          count: response.data.count || 0,
          message: response.data.message || 'Doctors fetched successfully'
        };
      } else {
        return {
          success: false,
          data: [],
          count: 0,
          message: response.data?.message || 'Failed to fetch doctors'
        };
      }
    } catch (error) {
      console.error('Get doctors error:', error);
      return {
        success: false,
        data: [],
        count: 0,
        message: error.message || 'Failed to fetch doctors'
      };
    }
  },
  
  /**
   * Get a doctor by ID (will create one if user exists but doctor doesn't)
   * @param {string} id - Doctor ID
   * @param {boolean} preventAutoCreation - If true, prevents automatic doctor creation
   * @returns {Promise<Object>} Doctor data
   */
  getDoctorById: async (id, preventAutoCreation = true) => {
    try {
      if (!api) {
        api = (await import('../utils/api')).default;
      }
      
      const config = { headers: getAuthHeaders() };
      
      if (preventAutoCreation) {
        try {
          const response = await api.get(`/api/doctors/${id}?preventAutoCreation=true`, config);
          
          if (response.data && response.data.success) {
            console.log('Doctor found:', response.data.data);
            return {
              success: true,
              data: response.data.data,
              message: response.data.message || 'Doctor retrieved successfully'
            };
          } else {
            return {
              success: false,
              data: null,
              message: response.data?.message || 'Failed to fetch doctor'
            };
          }
        } catch (error) {
          console.error('Get doctor error:', error);
          
          // Handle 404 case specially
          if (error.response && error.response.status === 404) {
            return {
              success: false,
              message: 'Doctor not found',
              error: 'The requested doctor could not be found'
            };
          }
          
          return {
            success: false,
            message: error.message || 'Failed to fetch doctor',
            error: error.response?.data?.error || error.message
          };
        }
      } else {
        // Original behavior - allows auto-creation
        const response = await api.get(`/api/doctors/${id}`, config);
        
        if (response.data && response.data.success) {
          console.log('Doctor found or created:', response.data.data);
          return {
            success: true,
            data: response.data.data,
            message: response.data.message || 'Doctor retrieved successfully'
          };
        } else {
          return {
            success: false,
            data: null,
            message: response.data?.message || 'Failed to fetch doctor'
          };
        }
      }
    } catch (error) {
      console.error('Get doctor error:', error);
      
      // Handle 404 case specially
      if (error.response && error.response.status === 404) {
        return {
          success: false,
          message: 'Doctor not found',
          error: 'The requested doctor could not be found'
        };
      }
      
      return {
        success: false,
        message: error.message || 'Failed to fetch doctor',
        error: error.response?.data?.error || error.message
      };
    }
  },

  /**
   * Create a new doctor
   * @param {Object} doctorData - Doctor data
   * @returns {Promise<Object>} Created doctor data
   */
  createDoctor: async (doctorData) => {
    try {
      if (!api) {
        api = (await import('../utils/api')).default;
      }
      
      const config = { headers: getAuthHeaders() };
      const response = await api.post('/api/doctors', doctorData, config);
      
      if (response.data && response.data.success) {
        return {
          success: true,
          data: response.data.data,
          message: response.data.message || 'Doctor created successfully'
        };
      } else {
        return {
          success: false,
          message: response.data?.message || 'Failed to create doctor',
          error: response.data?.error
        };
      }
    } catch (error) {
      console.error('Create doctor error:', error);
      return {
        success: false,
        message: error.response?.data?.message || error.message,
        error: error.response?.data?.error || 'Failed to create doctor'
      };
    }
  },

  /**
   * Update a doctor
   * @param {string} id - Doctor ID
   * @param {Object} doctorData - Doctor data to update
   * @returns {Promise<Object>} Updated doctor data
   */
  /**
   * Update doctor profile
   * @param {string} id - Doctor ID
   * @param {Object} doctorData - Updated doctor data
   * @returns {Promise<Object>} Updated doctor data
   */
  updateDoctor: async (id, doctorData) => {
    try {
      if (!api) {
        api = (await import('../utils/api')).default;
      }
      
      const config = { headers: getAuthHeaders() };
      const response = await api.put(`/api/doctors/${id}`, doctorData, config);
      
      if (response.data && response.data.success) {
        // Update the cached doctor profile in localStorage
        const updatedDoctor = response.data.doctor || response.data.data;
        if (updatedDoctor) {
          localStorage.setItem('doctorProfile', JSON.stringify(updatedDoctor));
        }
        
        return {
          success: true,
          doctor: updatedDoctor,
          message: response.data.message || 'Doctor profile updated successfully'
        };
      } else {
        return {
          success: false,
          message: response.data?.message || 'Failed to update doctor profile'
        };
      }
    } catch (error) {
      console.error('Error updating doctor:', error);
      
      // Handle different error types
      if (error.response) {
        // Server responded with an error
        console.error('Server error response:', error.response.data);
        
        // Special handling for 404 Not Found errors
        if (error.response.status === 404) {
          return {
            success: false,
            message: 'Doctor not found',
            error: 'The requested doctor could not be found in the database. It may have been deleted.'
          };
        }
        
        return {
          success: false,
          message: error.response.data?.message || 'Server error',
          error: error.response.data?.error || error.message
        };
      } else if (error.request) {
        // Request was made but no response received
        return {
          success: false,
          message: 'No response from server',
          error: 'Network error - check your connection'
        };
      } else {
        // Something else caused the error
        return {
          success: false,
          message: 'Failed to send request',
          error: error.message
        };
      }
    }
  },
  
  /**
   * Delete a doctor
   * @param {string} id - Doctor ID
   * @returns {Promise<Object>} Success message
   */
  deleteDoctor: async (id) => {
    try {
      if (!api) {
        api = (await import('../utils/api')).default;
      }
      
      const config = { headers: getAuthHeaders() };
      const response = await api.delete(`/api/doctors/${id}`, config);
      
      if (response.data && response.data.success) {
        return {
          success: true,
          message: response.data.message || 'Doctor deleted successfully'
        };
      } else {
        return {
          success: false,
          message: response.data?.message || 'Failed to delete doctor'
        };
      }
    } catch (error) {
      console.error('Delete doctor error:', error);
      return {
        success: false,
        message: error.response?.data?.message || error.message,
        error: error.response?.data?.error || 'Failed to delete doctor'
      };
    }
  },
  
  /**
   * Check if a doctor exists in the database
   * @param {string} id - Doctor ID
   * @returns {Promise<boolean>} True if doctor exists, false otherwise
   */
  checkDoctorExists: async (id) => {
    try {
      if (!api) {
        api = (await import('../utils/api')).default;
      }
      
      const config = { headers: getAuthHeaders() };
      const response = await api.get(`/api/doctors/${id}`, config);
      
      // If we get a successful response, the doctor exists
      console.log('Doctor check result:', response.data);
      return response.data && response.data.success;
    } catch (error) {
      console.log('Doctor not found or error occurred:', error.response?.status);
      return false;

    }
  },
  
  /**
   * Get doctors by specialization
   * @param {string} specialization - Specialization name
   * @returns {Promise<Object>} Filtered doctor list
   */
  getDoctorsBySpecialization: async (specialization) => {
    try {
      if (!api) {
        api = (await import('../utils/api')).default;
      }
      
      const config = { headers: getAuthHeaders() };
      const response = await api.get(`/api/doctors/specialization/${specialization}`, config);
      
      if (response.data && response.data.success) {
        return {
          success: true,
          data: response.data.data || [],
          message: response.data.message || 'Doctors retrieved successfully'
        };
      }
      
      return {
        success: false,
        data: [],
        message: response.data?.message || 'Failed to fetch doctors by specialization'
      };
    } catch (error) {
      console.error('Get doctors by specialization error:', error);
      return {
        success: false,
        data: [],
        message: error.message || 'Failed to fetch doctors by specialization'
      };
    }
  },
  
  /**
   * Get list of all available specializations
   * @returns {Promise<Object>} List of specializations
   */
  getSpecializations: async () => {
    try {
      if (!api) {
        api = (await import('../utils/api')).default;
      }
      
      const config = { headers: getAuthHeaders() };
      const response = await api.get('/api/doctors/specializations', config);
      
      if (response.data && response.data.success) {
        return {
          success: true,
          data: response.data.data || [],
          message: response.data.message || 'Specializations retrieved successfully'
        };
      }
      
      return {
        success: false,
        data: [],
        message: response.data?.message || 'Failed to fetch specializations'
      };
    } catch (error) {
      console.error('Get specializations error:', error);
      return {
        success: false,
        data: [],
        message: error.message || 'Failed to fetch specializations'
      };
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
      const config = { headers: getAuthHeaders() };
      const response = await api.post(`/api/doctors/${id}/ratings`, ratingData, config);
      return response.data;
    } catch (error) {
      console.error('Add doctor rating error:', error);
      throw error;
    }
  },

  /**
   * Get the current doctor's profile
   * @returns {Promise<Object>} Doctor profile data
   */
  getMyProfile: async () => {
    try {
      // First try to get from localStorage
      const cachedDoctorProfile = localStorage.getItem('doctorProfile');
      
      if (cachedDoctorProfile) {
        try {
          const parsedProfile = JSON.parse(cachedDoctorProfile);
          console.log('Using cached doctor profile from localStorage');
          
          // Check if the cached profile has all required fields
          if (parsedProfile && parsedProfile._id) {
            return {
              success: true,
              doctor: parsedProfile,
              message: 'Doctor profile fetched from cache',
              source: 'cache'
            };
          }
        } catch (parseError) {
          console.warn('Error parsing cached doctor profile:', parseError);
          // Continue to API fetch if parsing fails
        }
      }
      
      // If not in localStorage or invalid cache, fetch from API
      console.log('No valid cached profile found, fetching from API');
      
      // Ensure api is available
      if (!api) {
        api = (await import('../utils/api')).default;
      }
      
      const token = localStorage.getItem('token');
      if (!token) {
        return {
          success: false,
          message: 'Authentication required'
        };
      }
      
      // Set authorization header
      api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      
      const response = await api.get('/api/doctors/me', config);
      
      if (response.data && response.data.success) {
        // Cache the doctor profile in localStorage for faster access
        localStorage.setItem('doctorProfile', JSON.stringify(response.data.doctor));
        
        return {
          success: true,
          doctor: response.data.doctor,
          message: 'Doctor profile fetched successfully from API',
          source: 'api'
        };
      } else {
        return {
          success: false,
          message: response.data?.message || 'Failed to fetch doctor profile'
        };
      }
    } catch (error) {
      console.error('Error fetching doctor profile:', error);
      return {
        success: false,
        message: error.response?.data?.message || error.message || 'Failed to fetch doctor profile'
      };
    }
  },

  /**
   * Get all patients for the current doctor
   * @returns {Promise<Object>} List of patients
   */
  getDoctorPatients: async () => {
    try {
      if (!api) {
        api = (await import('../utils/api')).default;
      }
      
      const config = { headers: getAuthHeaders() };
      const response = await api.get('/api/doctors/patients', config);
      
      if (response.data && response.data.success) {
        return {
          success: true,
          data: response.data.patients || response.data.data || [],
          message: response.data.message || 'Patients retrieved successfully'
        };
      }
      
      return {
        success: false,
        data: [],
        message: response.data?.message || 'Failed to fetch patients'
      };
    } catch (error) {
      console.error('Get doctor patients error:', error);
      return {
        success: false,
        data: [],
        message: error.response?.data?.message || error.message || 'Failed to fetch patients'
      };
    }
  },

  /**
   * Get patient details by ID
   * @param {string} patientId - Patient ID
   * @returns {Promise<Object>} Patient details
   */
  getPatientDetails: async (patientId) => {
    try {
      if (!api) {
        api = (await import('../utils/api')).default;
      }
      
      const config = { headers: getAuthHeaders() };
      const response = await api.get(`/api/doctors/patients/${patientId}`, config);
      
      if (response.data && response.data.success) {
        return {
          success: true,
          data: response.data.patient || response.data.data,
          message: response.data.message || 'Patient details retrieved successfully'
        };
      }
      
      return {
        success: false,
        message: response.data?.message || 'Failed to fetch patient details'
      };
    } catch (error) {
      console.error('Get patient details error:', error);
      return {
        success: false,
        message: error.response?.data?.message || error.message || 'Failed to fetch patient details'
      };
    }
  },
}
// Export as both default and named export
// Export the service
export { doctorService };
export default doctorService;
