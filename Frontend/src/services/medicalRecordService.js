// We'll use dynamic imports to avoid circular dependencies
let api = null;


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
const medicalRecordService = {
  /**
   * Get all medical records with pagination
   */

  
  getAllMedicalRecords: async (page = 1, limit = 10) => {
    try {
      if (!api) {
        api = (await import('../utils/api')).default;
      }
      
      const config = {
        headers: getAuthHeaders(),
        params: { page, limit }
      };
      
      const response = await api.get('/api/medical-records', config);
      return response.data;
    } catch (error) {
      console.error('Get medical records error:', error);
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to fetch medical records',
        error: error.response?.data?.error || error.message
      };
    }
  },

  /**
   * Get medical record by ID
   */
  getMedicalRecordById: async (id) => {
    try {
      if (!api) {
        api = (await import('../utils/api')).default;
      }
      
      const config = { headers: getAuthHeaders() };
      const response = await api.get(`/api/medical-records/${id}`, config);
      return response.data;
    } catch (error) {
      console.error('Get medical record error:', error);
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to fetch medical record',
        error: error.response?.data?.error || error.message
      };
    }
  },

  /**
   * Get medical records by patient ID
   */
  getPatientMedicalRecords: async (patientId, page = 1, limit = 10) => {
    try {
      if (!api) {
        api = (await import('../utils/api')).default;
      }
      
      const config = {
        headers: getAuthHeaders(),
        params: { page, limit }
      };
      
      const response = await api.get(`/api/medical-records/patient/${patientId}`, config);
      return response.data;
    } catch (error) {
      console.error('Get patient medical records error:', error);
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to fetch patient medical records',
        error: error.response?.data?.error || error.message
      };
    }
  },

  /**
   * Get medical records by doctor ID
   */
  getDoctorMedicalRecords: async (doctorId, page = 1, limit = 10) => {
    try {
      if (!api) {
        api = (await import('../utils/api')).default;
      }
      
      const config = {
        headers: getAuthHeaders(),
        params: { page, limit }
      };
      
      const response = await api.get(`/api/medical-records/doctor/${doctorId}`, config);
      return response.data;
    } catch (error) {
      console.error('Get doctor medical records error:', error);
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to fetch doctor medical records',
        error: error.response?.data?.error || error.message
      };
    }
  },

  /**
   * Create a new medical record
   */
  createMedicalRecord: async (recordData) => {
    try {
      if (!api) {
        api = (await import('../utils/api')).default;
      }
      
      const config = { headers: getAuthHeaders() };
      const response = await api.post('/api/medical-records', recordData, config);
      return response.data;
    } catch (error) {
      console.error('Create medical record error:', error);
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to create medical record',
        error: error.response?.data?.error || error.message
      };
    }
  },

  /**
   * Update a medical record
   */
  updateMedicalRecord: async (id, recordData) => {
    try {
      if (!api) {
        api = (await import('../utils/api')).default;
      }
      
      const config = { headers: getAuthHeaders() };
      const response = await api.put(`/api/medical-records/${id}`, recordData, config);
      return response.data;
    } catch (error) {
      console.error('Update medical record error:', error);
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to update medical record',
        error: error.response?.data?.error || error.message
      };
    }
  },

  /**
   * Delete a medical record
   */
  deleteMedicalRecord: async (id) => {
    try {
      if (!api) {
        api = (await import('../utils/api')).default;
      }
      
      const config = { headers: getAuthHeaders() };
      const response = await api.delete(`/api/medical-records/${id}`, config);
      return response.data;
    } catch (error) {
      console.error('Delete medical record error:', error);
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to delete medical record',
        error: error.response?.data?.error || error.message
      };
    }
  },

  /**
   * Get medical records statistics
   */
  getMedicalRecordsStats: async () => {
    try {
      if (!api) {
        api = (await import('../utils/api')).default;
      }
      
      const config = { headers: getAuthHeaders() };
      const response = await api.get('/api/medical-records/stats', config);
      return response.data;
    } catch (error) {
      console.error('Get medical records stats error:', error);
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to fetch medical records statistics',
        error: error.response?.data?.error || error.message
      };
    }
  },

  /**
   * Add attachment to medical record
   */
  addAttachment: async (id, attachmentData) => {
    try {
      if (!api) {
        api = (await import('../utils/api')).default;
      }
      
      const config = { 
        headers: {
          ...getAuthHeaders(),
          'Content-Type': 'multipart/form-data'
        }
      };
      
      const response = await api.post(`/api/medical-records/${id}/attachments`, attachmentData, config);
      return response.data;
    } catch (error) {
      console.error('Add attachment error:', error);
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to add attachment',
        error: error.response?.data?.error || error.message
      };
    }
  }
};

export default medicalRecordService;