// We'll use dynamic imports to avoid circular dependencies
let api = null;

const getAuthToken = () => {
  const token = localStorage.getItem('token');
  return token ? `Bearer ${token}` : '';
};

// Helper function to set auth headers for JSON requests
const getAuthHeaders = () => {
  return {
    'Authorization': getAuthToken(),
    'Content-Type': 'application/json'
  };
};

// Helper function to set auth headers for multipart/form-data requests
const getMultipartHeaders = () => {
  return {
    'Authorization': getAuthToken()
    // Do not set Content-Type here; let the browser set it for FormData
  };
};

const medicalRecordService = {
  /**
   * Get all medical records with pagination
   * GET /api/medical-records?page=1&limit=10
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
   * Get a medical record by ID
   * GET /api/medical-records/:id
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
   * Get all medical records for a specific patient
   * GET /api/medical-records/patient/:patientId?page=1&limit=10
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
   * Get all medical records for a specific doctor
   * GET /api/medical-records/doctor/:doctorId?page=1&limit=10
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
   * POST /api/medical-records
   * If uploading files, use FormData and getMultipartHeaders
   */
  createMedicalRecord: async (recordData, isMultipart = false) => {
    try {
      if (!api) {
        api = (await import('../utils/api')).default;
      }
      let config;
      if (isMultipart) {
        config = { headers: getMultipartHeaders() };
      } else {
        config = { headers: getAuthHeaders() };
      }
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
   * PUT /api/medical-records/:id
   * If uploading files, use FormData and getMultipartHeaders
   */
  updateMedicalRecord: async (id, recordData, isMultipart = false) => {
    try {
      if (!api) {
        api = (await import('../utils/api')).default;
      }
      let config;
      if (isMultipart) {
        config = { headers: getMultipartHeaders() };
      } else {
        config = { headers: getAuthHeaders() };
      }
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
   * DELETE /api/medical-records/:id
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
   * GET /api/medical-records/stats
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
   * POST /api/medical-records/:id/attachments
   * attachmentData should be FormData
   */
  addAttachment: async (id, attachmentData) => {
    try {
      if (!api) {
        api = (await import('../utils/api')).default;
      }
      const config = {
        headers: getMultipartHeaders()
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