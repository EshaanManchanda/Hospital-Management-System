import api from '../utils/api';

/**
 * Patient service for managing patient data
 */
const patientService = {
  /**
   * Get all patients with pagination
   * @param {number} page - Page number
   * @param {number} limit - Items per page
   * @returns {Promise<Object>} Patient list with pagination info
   */
  getAllPatients: async (page = 1, limit = 10) => {
    try {
      const response = await api.get(`/patients?page=${page}&limit=${limit}`);
      return response.data;
    } catch (error) {
      console.error('Get patients error:', error);
      throw error;
    }
  },
  
  /**
   * Get a patient by ID
   * @param {string} id - Patient ID
   * @returns {Promise<Object>} Patient data
   */
  getPatientById: async (id) => {
    try {
      const token = localStorage.getItem('token');
      const response = await api.get(`/patients/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return response.data;
    } catch (error) {
      console.error('Get patient error:', error);
      throw error;
    }
  },

  /**
   * Get patients by doctor ID
   * @param {string} doctorId - Doctor ID
   * @param {number} page - Page number
   * @param {number} limit - Items per page
   * @returns {Promise<Object>} Patient list with pagination info
   */
  getPatientsByDoctor: async (doctorId, page = 1, limit = 10) => {
    try {
      const response = await api.get(`/patients/doctor/${doctorId}?page=${page}&limit=${limit}`);
      return response.data;
    } catch (error) {
      console.error('Get patients by doctor error:', error);
      throw error;
    }
  },

  /**
   * Update a patient
   * @param {string} id - Patient ID
   * @param {Object} patientData - Patient data to update
   * @returns {Promise<Object>} Updated patient data
   */
  updatePatient: async (id, patientData) => {
    try {
      const response = await api.put(`/patients/${id}`, patientData);
      return response.data;
    } catch (error) {
      console.error('Update patient error:', error);
      throw error;
    }
  },

  /**
   * Add medical history to a patient
   * @param {string} id - Patient ID
   * @param {Object} medicalHistoryData - Medical history data
   * @returns {Promise<Object>} Updated patient data
   */
  addMedicalHistory: async (id, medicalHistoryData) => {
    try {
      const response = await api.post(`/patients/${id}/medical-history`, medicalHistoryData);
      return response.data;
    } catch (error) {
      console.error('Add medical history error:', error);
      throw error;
    }
  },

  /**
   * Add medication to a patient
   * @param {string} id - Patient ID
   * @param {Object} medicationData - Medication data
   * @returns {Promise<Object>} Updated patient data
   */
  addMedication: async (id, medicationData) => {
    try {
      const response = await api.post(`/patients/${id}/medications`, medicationData);
      return response.data;
    } catch (error) {
      console.error('Add medication error:', error);
      throw error;
    }
  },

  /**
   * Add medical report to a patient
   * @param {string} id - Patient ID
   * @param {Object} reportData - Report data
   * @returns {Promise<Object>} Updated patient data
   */
  addMedicalReport: async (id, reportData) => {
    try {
      const response = await api.post(`/patients/${id}/reports`, reportData);
      return response.data;
    } catch (error) {
      console.error('Add medical report error:', error);
      throw error;
    }
  }
};

export default patientService; 