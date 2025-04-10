import api from '../utils/api';

/**
 * Report service for generating and managing reports
 */
const reportService = {
  /**
   * Get patient reports
   * @param {Object} filters - Filter parameters
   * @returns {Promise<Object>} Patient reports
   */
  getPatientReports: async (filters = {}) => {
    try {
      const queryParams = new URLSearchParams(filters).toString();
      const response = await api.get(`/api/reports/patients?${queryParams}`);
      return response.data;
    } catch (error) {
      console.error('Get patient reports error:', error);
      throw error;
    }
  },
  
  /**
   * Get doctor reports
   * @param {Object} filters - Filter parameters
   * @returns {Promise<Object>} Doctor reports
   */
  getDoctorReports: async (filters = {}) => {
    try {
      const queryParams = new URLSearchParams(filters).toString();
      const response = await api.get(`/api/reports/doctors?${queryParams}`);
      return response.data;
    } catch (error) {
      console.error('Get doctor reports error:', error);
      throw error;
    }
  },

  /**
   * Get appointment reports
   * @param {Object} filters - Filter parameters
   * @returns {Promise<Object>} Appointment reports
   */
  getAppointmentReports: async (filters = {}) => {
    try {
      const queryParams = new URLSearchParams(filters).toString();
      const response = await api.get(`/api/reports/appointments?${queryParams}`);
      return response.data;
    } catch (error) {
      console.error('Get appointment reports error:', error);
      throw error;
    }
  },

  /**
   * Get revenue reports
   * @param {Object} filters - Filter parameters
   * @returns {Promise<Object>} Revenue reports
   */
  getRevenueReports: async (filters = {}) => {
    try {
      const queryParams = new URLSearchParams(filters).toString();
      const response = await api.get(`/api/reports/revenue?${queryParams}`);
      return response.data;
    } catch (error) {
      console.error('Get revenue reports error:', error);
      throw error;
    }
  },

  /**
   * Get pharmacy reports
   * @param {Object} filters - Filter parameters
   * @returns {Promise<Object>} Pharmacy reports
   */
  getPharmacyReports: async (filters = {}) => {
    try {
      const queryParams = new URLSearchParams(filters).toString();
      const response = await api.get(`/api/reports/pharmacy?${queryParams}`);
      return response.data;
    } catch (error) {
      console.error('Get pharmacy reports error:', error);
      throw error;
    }
  },

  /**
   * Get bed occupancy reports
   * @param {Object} filters - Filter parameters
   * @returns {Promise<Object>} Bed occupancy reports
   */
  getBedReports: async (filters = {}) => {
    try {
      const queryParams = new URLSearchParams(filters).toString();
      const response = await api.get(`/api/reports/beds?${queryParams}`);
      return response.data;
    } catch (error) {
      console.error('Get bed reports error:', error);
      throw error;
    }
  },

  /**
   * Get custom report
   * @param {string} reportType - Type of report
   * @param {Object} filters - Filter parameters
   * @returns {Promise<Object>} Custom report data
   */
  getCustomReport: async (reportType, filters = {}) => {
    try {
      const queryParams = new URLSearchParams(filters).toString();
      const response = await api.get(`/api/reports/${reportType}?${queryParams}`);
      return response.data;
    } catch (error) {
      console.error('Get custom report error:', error);
      throw error;
    }
  },

  /**
   * Export report to CSV
   * @param {string} reportType - Type of report
   * @param {Object} filters - Filter parameters
   * @returns {Promise<Blob>} CSV file blob
   */
  exportReportCSV: async (reportType, filters = {}) => {
    try {
      const queryParams = new URLSearchParams(filters).toString();
      const response = await api.get(`/api/reports/${reportType}/export/csv?${queryParams}`, {
        responseType: 'blob'
      });
      return response.data;
    } catch (error) {
      console.error('Export report to CSV error:', error);
      throw error;
    }
  },

  /**
   * Export report to PDF
   * @param {string} reportType - Type of report
   * @param {Object} filters - Filter parameters
   * @returns {Promise<Blob>} PDF file blob
   */
  exportReportPDF: async (reportType, filters = {}) => {
    try {
      const queryParams = new URLSearchParams(filters).toString();
      const response = await api.get(`/api/reports/${reportType}/export/pdf?${queryParams}`, {
        responseType: 'blob'
      });
      return response.data;
    } catch (error) {
      console.error('Export report to PDF error:', error);
      throw error;
    }
  }
};

export default reportService; 