import api from '../utils/api';

/**
 * Pharmacy service for managing medicines and prescriptions
 */
const pharmacyService = {
  /**
   * Get all medicines with pagination
   * @param {number} page - Page number
   * @param {number} limit - Items per page
   * @returns {Promise<Object>} Medicine list with pagination info
   */
  getAllMedicines: async (page = 1, limit = 10) => {
    try {
      const response = await api.get(`/api/medicines?page=${page}&limit=${limit}`);
      return response.data;
    } catch (error) {
      console.error('Get medicines error:', error);
      throw error;
    }
  },
  
  /**
   * Get a medicine by ID
   * @param {string} id - Medicine ID
   * @returns {Promise<Object>} Medicine data
   */
  getMedicineById: async (id) => {
    try {
      const response = await api.get(`/api/medicines/${id}`);
      return response.data;
    } catch (error) {
      console.error('Get medicine error:', error);
      throw error;
    }
  },

  /**
   * Create a new medicine
   * @param {Object} medicineData - Medicine data
   * @returns {Promise<Object>} Created medicine data
   */
  createMedicine: async (medicineData) => {
    try {
      const response = await api.post('/api/medicines', medicineData);
      return response.data;
    } catch (error) {
      console.error('Create medicine error:', error);
      throw error;
    }
  },

  /**
   * Update a medicine
   * @param {string} id - Medicine ID
   * @param {Object} medicineData - Medicine data to update
   * @returns {Promise<Object>} Updated medicine data
   */
  updateMedicine: async (id, medicineData) => {
    try {
      const response = await api.put(`/api/medicines/${id}`, medicineData);
      return response.data;
    } catch (error) {
      console.error('Update medicine error:', error);
      throw error;
    }
  },

  /**
   * Delete a medicine
   * @param {string} id - Medicine ID
   * @returns {Promise<Object>} Success message
   */
  deleteMedicine: async (id) => {
    try {
      const response = await api.delete(`/api/medicines/${id}`);
      return response.data;
    } catch (error) {
      console.error('Delete medicine error:', error);
      throw error;
    }
  },

  /**
   * Get inventory statistics
   * @returns {Promise<Object>} Inventory statistics
   */
  getInventoryStats: async () => {
    try {
      const response = await api.get('/api/medicines/stats');
      return response.data;
    } catch (error) {
      console.error('Get inventory stats error:', error);
      throw error;
    }
  },

  /**
   * Get medicines by category
   * @param {string} category - Medicine category
   * @returns {Promise<Object>} Medicine list
   */
  getMedicinesByCategory: async (category) => {
    try {
      const response = await api.get(`/api/medicines/category/${category}`);
      return response.data;
    } catch (error) {
      console.error('Get medicines by category error:', error);
      throw error;
    }
  },

  /**
   * Update medicine stock
   * @param {string} id - Medicine ID
   * @param {number} quantity - Quantity to add or subtract (negative for subtract)
   * @returns {Promise<Object>} Updated medicine data
   */
  updateStock: async (id, quantity) => {
    try {
      const response = await api.post(`/api/medicines/${id}/stock`, { quantity });
      return response.data;
    } catch (error) {
      console.error('Update stock error:', error);
      throw error;
    }
  }
};

export default pharmacyService; 