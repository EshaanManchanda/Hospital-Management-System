import api from '../utils/api';

/**
 * Medical Record service for managing medical records
 */
const medicalRecordService = {
  /**
   * Get all medical records with pagination
   * @param {number} page - Page number
   * @param {number} limit - Items per page
   * @returns {Promise<Object>} Medical record list with pagination info
   */
  getAllMedicalRecords: async (page = 1, limit = 10) => {
    try {
      const response = await api.get(`/api/medical-records?page=${page}&limit=${limit}`);
      return response.data;
    } catch (error) {
      console.error('Get medical records error:', error);
      throw error;
    }
  },
  
  /**
   * Get a medical record by ID
   * @param {string} id - Medical record ID
   * @returns {Promise<Object>} Medical record data
   */
  getMedicalRecordById: async (id) => {
    try {
      const response = await api.get(`/api/medical-records/${id}`);
      return response.data;
    } catch (error) {
      console.error('Get medical record error:', error);
      throw error;
    }
  },

  /**
   * Get medical records by patient ID
   * @param {string} patientId - Patient ID
   * @param {number} page - Page number
   * @param {number} limit - Items per page
   * @returns {Promise<Object>} Medical record list with pagination info
   */
  getPatientMedicalRecords: async (patientId, page = 1, limit = 10) => {
    try {
      const response = await api.get(`/api/medical-records/patient/${patientId}?page=${page}&limit=${limit}`);
      return response.data;
    } catch (error) {
      console.error('Get patient medical records error:', error);
      throw error;
    }
  },

  /**
   * Create a new medical record
   * @param {Object} recordData - Medical record data
   * @returns {Promise<Object>} Created medical record data
   */
  createMedicalRecord: async (recordData) => {
    try {
      const response = await api.post('/api/medical-records', recordData);
      return response.data;
    } catch (error) {
      console.error('Create medical record error:', error);
      throw error;
    }
  },

  /**
   * Update a medical record
   * @param {string} id - Medical record ID
   * @param {Object} recordData - Medical record data to update
   * @returns {Promise<Object>} Updated medical record data
   */
  updateMedicalRecord: async (id, recordData) => {
    try {
      const response = await api.put(`/api/medical-records/${id}`, recordData);
      return response.data;
    } catch (error) {
      console.error('Update medical record error:', error);
      throw error;
    }
  },

  /**
   * Delete a medical record
   * @param {string} id - Medical record ID
   * @returns {Promise<Object>} Success message
   */
  deleteMedicalRecord: async (id) => {
    try {
      const response = await api.delete(`/api/medical-records/${id}`);
      return response.data;
    } catch (error) {
      console.error('Delete medical record error:', error);
      throw error;
    }
  }
};

export default medicalRecordService; 