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
      const response = await api.get(`/appointments?page=${page}&limit=${limit}`);
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
      const response = await api.get(`/appointments/${id}`);
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
      const response = await api.post('/appointments', appointmentData);
      return response.data;
    } catch (error) {
      console.error('Create appointment error:', error);
      throw error;
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
      const response = await api.put(`/appointments/${id}`, appointmentData);
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
      const response = await api.delete(`/appointments/${id}`);
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
      const response = await api.get(`/appointments/doctor/${doctorId}?page=${page}&limit=${limit}`);
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
  getPatientAppointments: async (patientId, page = 1, limit = 10) => {
    try {
      console.log(`Fetching appointments for patient: ${patientId}`);
      
      // Get the authentication token from localStorage
      const token = localStorage.getItem('token');
      if (!token) {
        console.error('No authentication token found when fetching patient appointments');
        throw new Error('Authentication required');
      }
      
      // Make the API request with the authorization header
      // The backend filters appointments for the authenticated patient in the /appointments endpoint
      // So we use the main appointments endpoint instead of a patient-specific one
      const response = await api.get(`/appointments?page=${page}&limit=${limit}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      
      console.log('Patient appointments response:', response.data);
      return response.data;
    } catch (error) {
      console.error('Get patient appointments error:', error);
      console.error('Error details:', {
        message: error.message,
        status: error.response?.status,
        statusText: error.response?.statusText,
        responseData: error.response?.data,
        endpoint: `/appointments?page=${page}&limit=${limit}`
      });
      throw error;
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
      const response = await api.get(`/appointments/available-slots/${doctorId}/${date}`);
      return response.data;
    } catch (error) {
      console.error('Get available time slots error:', error);
      throw error;
    }
  }
};

export default appointmentService; 