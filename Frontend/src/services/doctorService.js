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
      const response = await api.get(`/doctors?page=${page}&limit=${limit}`);
      return response.data;
    } catch (error) {
      console.error('Get doctors error:', error);
      throw error;
    }
  },
  
  /**
   * Get a doctor by ID
   * @param {string} id - Doctor ID
   * @returns {Promise<Object>} Doctor data
   */
  getDoctorById: async (id) => {
    try {
      const response = await api.get(`/doctors/${id}`);
      return response.data;
    } catch (error) {
      console.error('Get doctor error:', error);
      throw error;
    }
  },

  /**
   * Create a new doctor
   * @param {Object} doctorData - Doctor data
   * @returns {Promise<Object>} Created doctor data
   */
  createDoctor: async (doctorData) => {
    try {
      const response = await api.post('/doctors', doctorData);
      return response.data;
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
      const response = await api.put(`/doctors/${id}`, doctorData);
      return response.data;
    } catch (error) {
      console.error('Update doctor error:', error);
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
      const response = await api.delete(`/doctors/${id}`);
      return response.data;
    } catch (error) {
      console.error('Delete doctor error:', error);
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
      const response = await api.post(`/doctors/${id}/ratings`, ratingData);
      return response.data;
    } catch (error) {
      console.error('Add doctor rating error:', error);
      throw error;
    }
  }
};

export default doctorService; 