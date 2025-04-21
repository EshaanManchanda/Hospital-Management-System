let api = null;

// Helper to get auth token
const getAuthToken = () => {
  const token = localStorage.getItem('token');
  return token ? `Bearer ${token}` : '';
};

const getAuthHeaders = () => ({
  'Authorization': getAuthToken(),
  'Content-Type': 'application/json'
});

const prescriptionService = {
  /**
   * Get prescriptions for a patient
   * @param {string} patientId
   * @param {object} params (page, limit, status, search)
   */
  getPrescriptionsByPatient: async (patientId, params = {}) => {
    try {
      if (!api) {
        api = (await import('../utils/api')).default;
      }
      const config = {
        headers: getAuthHeaders(),
        params
      };
      const response = await api.get(`/api/prescriptions/patient/${patientId}`, config);
      return response.data;
    } catch (error) {
      console.error('Get prescriptions by patient error:', error);
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to fetch prescriptions',
        error: error.response?.data?.error || error.message
      };
    }
  }
};

export default prescriptionService;