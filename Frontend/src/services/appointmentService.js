import api from '../utils/api';

/**
 * Appointment service for managing appointments
 */
const appointmentService = {
  /**
   * Get all appointments with pagination
   * @param {number} page - Page number
   * @param {number} limit - Items per page
   * @returns {Promise<Object>} Appointment list with pagination info
   */
  getAllAppointments: async (page = 1, limit = 10) => {
    try {
      const response = await api.get(`/api/appointments?page=${page}&limit=${limit}`);
      return response.data;
    } catch (error) {
      console.error('Get appointments error:', error);
      throw error;
    }
  },
  
  /**
   * Get an appointment by ID
   * @param {string} id - Appointment ID
   * @returns {Promise<Object>} Appointment data
   */
  getAppointmentById: async (id) => {
    try {
      const response = await api.get(`/api/appointments/${id}`);
      return response.data;
    } catch (error) {
      console.error('Get appointment error:', error);
      throw error;
    }
  },

  /**
   * Create a new appointment
   * @param {Object} appointmentData - Appointment data
   * @returns {Promise<Object>} Created appointment data
   */
  createAppointment: async (appointmentData) => {
    try {
      // Process the appointment data to ensure symptoms is a string
      const processedData = {
        ...appointmentData,
        // Ensure symptoms is always a string, never an empty array
        symptoms: Array.isArray(appointmentData.symptoms) 
          ? (appointmentData.symptoms.length > 0 ? appointmentData.symptoms.join(', ') : '') 
          : (appointmentData.symptoms || '')
      };
      
      console.log('Creating appointment with processed data:', processedData);
      
      // Get the authentication token from localStorage
      const token = localStorage.getItem('token');
      if (!token) {
        console.error('No authentication token found when creating appointment');
        return {
          success: false,
          message: 'Authentication required'
        };
      }
      
      // Set authorization header
      api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      
      const response = await api.post('/api/appointments', processedData);
      return response.data;
    } catch (error) {
      console.error('Create appointment error:', error);
      console.error('Error details:', {
        message: error.message,
        status: error.response?.status,
        statusText: error.response?.statusText,
        responseData: error.response?.data
      });
      
      return {
        success: false,
        message: error.response?.data?.message || error.message || 'Failed to create appointment'
      };
    }
  },

  /**
   * Update an appointment
   * @param {string} id - Appointment ID
   * @param {Object} appointmentData - Appointment data to update
   * @returns {Promise<Object>} Updated appointment data
   */
  updateAppointment: async (id, appointmentData) => {
    try {
      const response = await api.put(`/api/appointments/${id}`, appointmentData);
      return response.data;
    } catch (error) {
      console.error('Update appointment error:', error);
      throw error;
    }
  },

  /**
   * Delete an appointment
   * @param {string} id - Appointment ID
   * @returns {Promise<Object>} Success message
   */
  deleteAppointment: async (id) => {
    try {
      const response = await api.delete(`/api/appointments/${id}`);
      return response.data;
    } catch (error) {
      console.error('Delete appointment error:', error);
      throw error;
    }
  },

  /**
   * Get appointments by doctor ID
   * @param {string} doctorId - Doctor ID
   * @param {number} page - Page number
   * @param {number} limit - Items per page
   * @returns {Promise<Object>} Appointment list with pagination info
   */
  getDoctorAppointments: async (doctorId, page = 1, limit = 10) => {
    try {
      const response = await api.get(`/api/appointments/doctor/${doctorId}?page=${page}&limit=${limit}`);
      return response.data;
    } catch (error) {
      console.error('Get doctor appointments error:', error);
      throw error;
    }
  },
  
  /**
   * Get appointments by patient ID
   * @param {string} patientId - Patient ID
   * @param {number} page - Page number
   * @param {number} limit - Items per page
   * @returns {Promise<Object>} Appointment list with pagination info
   */
  getPatientAppointments: async (page = 1, limit = 10) => {
    try {
      console.log(`Fetching appointments for current patient`);
      
      // Get the authentication token from localStorage
      const token = localStorage.getItem('token');
      if (!token) {
        console.error('No authentication token found when fetching patient appointments');
        return {
          success: false,
          message: 'Authentication required'
        };
      }
      
      // Set authorization header
      api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      
      // The backend will filter appointments for the authenticated patient
      const response = await api.get(`/api/appointments?page=${page}&limit=${limit}`);
      
      console.log('Patient appointments response:', response.data);
      
      if (response.data && response.data.success) {
        return {
          success: true,
          data: response.data.data || [],
          count: response.data.count || 0,
          message: response.data.message || 'Appointments retrieved successfully'
        };
      }
      
      return {
        success: false,
        data: [],
        message: response.data?.message || 'Failed to fetch appointments'
      };
    } catch (error) {
      console.error('Get patient appointments error:', error);
      console.error('Error details:', {
        message: error.message,
        status: error.response?.status,
        statusText: error.response?.statusText,
        responseData: error.response?.data,
        endpoint: `/api/appointments?page=${page}&limit=${limit}`
      });
      
      return {
        success: false,
        data: [],
        message: error.response?.data?.message || error.message || 'Failed to fetch appointments'
      };
    }
  },

  /**
   * Get available time slots for a doctor on a specific date
   * @param {string} doctorId - Doctor ID
   * @param {string} date - Date in YYYY-MM-DD format
   * @returns {Promise<Object>} Available time slots
   */
  getAvailableTimeSlots: async (doctorId, date) => {
    try {
      const response = await api.get(`/api/appointments/available-slots/${doctorId}/${date}`);
      return response.data;
    } catch (error) {
      console.error('Get available time slots error:', error);
      throw error;
    }
  }
};

export default appointmentService;

// Add this method to your appointmentService.js if it doesn't exist
export const updateAppointment = async (appointmentId, updateData) => {
  try {
    const response = await api.put(`/appointments/${appointmentId}`, updateData);
    return response.data;
  } catch (error) {
    console.error("Error updating appointment:", error);
    return {
      success: false,
      message: error.response?.data?.message || "Failed to update appointment"
    };
  }
};