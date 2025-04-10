import api from '../utils/api';

/**
 * Bed service for managing hospital beds
 */
const bedService = {
  /**
   * Get all beds with pagination
   * @param {number} page - Page number
   * @param {number} limit - Items per page
   * @returns {Promise<Object>} Bed list with pagination info
   */
  getAllBeds: async (page = 1, limit = 10) => {
    try {
      const response = await api.get(`/api/beds?page=${page}&limit=${limit}`);
      return response.data;
    } catch (error) {
      console.error('Get beds error:', error);
      throw error;
    }
  },
  
  /**
   * Get a bed by ID
   * @param {string} id - Bed ID
   * @returns {Promise<Object>} Bed data
   */
  getBedById: async (id) => {
    try {
      const response = await api.get(`/api/beds/${id}`);
      return response.data;
    } catch (error) {
      console.error('Get bed error:', error);
      throw error;
    }
  },

  /**
   * Get beds by ward
   * @param {string} ward - Ward name
   * @returns {Promise<Object>} Beds in the specified ward
   */
  getBedsByWard: async (ward) => {
    try {
      const response = await api.get(`/api/beds/ward/${ward}`);
      return response.data;
    } catch (error) {
      console.error('Get beds by ward error:', error);
      throw error;
    }
  },

  /**
   * Get available beds
   * @returns {Promise<Object>} List of available beds
   */
  getAvailableBeds: async () => {
    try {
      const response = await api.get('/api/beds/available');
      return response.data;
    } catch (error) {
      console.error('Get available beds error:', error);
      throw error;
    }
  },

  /**
   * Book a bed for a patient
   * @param {Object} bookingData - Booking data including patientId, bedId, admissionDate, etc.
   * @returns {Promise<Object>} Booking confirmation
   */
  bookBed: async (bookingData) => {
    try {
      const response = await api.post('/api/beds/book', bookingData);
      return response.data;
    } catch (error) {
      console.error('Book bed error:', error);
      throw error;
    }
  },

  /**
   * Release a bed (mark as available)
   * @param {string} bedId - Bed ID
   * @param {Object} releaseData - Release data including discharge notes, billing info, etc.
   * @returns {Promise<Object>} Release confirmation
   */
  releaseBed: async (bedId, releaseData) => {
    try {
      const response = await api.post(`/api/beds/${bedId}/release`, releaseData);
      return response.data;
    } catch (error) {
      console.error('Release bed error:', error);
      throw error;
    }
  },

  /**
   * Get bed occupancy statistics
   * @returns {Promise<Object>} Bed statistics
   */
  getBedStats: async () => {
    try {
      const response = await api.get('/api/beds/stats');
      return response.data;
    } catch (error) {
      console.error('Get bed stats error:', error);
      throw error;
    }
  },

  /**
   * Get beds booked by a patient
   * @param {string} patientId - Patient ID
   * @returns {Promise<Object>} Bed booking history
   */
  getPatientBeds: async (patientId) => {
    try {
      const response = await api.get(`/api/beds/patient/${patientId}`);
      return response.data;
    } catch (error) {
      console.error('Get patient beds error:', error);
      throw error;
    }
  }
};

export default bedService; 