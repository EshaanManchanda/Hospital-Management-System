import api from '../utils/api';

/**
 * Revenue service for managing hospital revenue and billing
 */
const revenueService = {
  /**
   * Get revenue summary
   * @param {Object} filters - Filter parameters like period, startDate, endDate
   * @returns {Promise<Object>} Revenue summary data
   */
  getRevenueSummary: async (filters = {}) => {
    try {
      const queryParams = new URLSearchParams(filters).toString();
      const response = await api.get(`/api/revenue/summary?${queryParams}`);
      return response.data;
    } catch (error) {
      console.error('Get revenue summary error:', error);
      throw error;
    }
  },
  
  /**
   * Get revenue breakdown by department
   * @param {Object} filters - Filter parameters
   * @returns {Promise<Object>} Revenue breakdown data
   */
  getRevenueByDepartment: async (filters = {}) => {
    try {
      const queryParams = new URLSearchParams(filters).toString();
      const response = await api.get(`/api/revenue/by-department?${queryParams}`);
      return response.data;
    } catch (error) {
      console.error('Get revenue by department error:', error);
      throw error;
    }
  },

  /**
   * Get revenue trends
   * @param {string} period - Period type (daily, weekly, monthly, yearly)
   * @param {number} limit - Number of data points to return
   * @returns {Promise<Object>} Revenue trend data
   */
  getRevenueTrends: async (period = 'monthly', limit = 12) => {
    try {
      const response = await api.get(`/api/revenue/trends?period=${period}&limit=${limit}`);
      return response.data;
    } catch (error) {
      console.error('Get revenue trends error:', error);
      throw error;
    }
  },

  /**
   * Get all invoices with pagination
   * @param {number} page - Page number
   * @param {number} limit - Items per page
   * @returns {Promise<Object>} Invoice list with pagination info
   */
  getAllInvoices: async (page = 1, limit = 10) => {
    try {
      const response = await api.get(`/api/revenue/invoices?page=${page}&limit=${limit}`);
      return response.data;
    } catch (error) {
      console.error('Get invoices error:', error);
      throw error;
    }
  },

  /**
   * Get an invoice by ID
   * @param {string} id - Invoice ID
   * @returns {Promise<Object>} Invoice data
   */
  getInvoiceById: async (id) => {
    try {
      const response = await api.get(`/api/revenue/invoices/${id}`);
      return response.data;
    } catch (error) {
      console.error('Get invoice error:', error);
      throw error;
    }
  },

  /**
   * Create a new invoice
   * @param {Object} invoiceData - Invoice data
   * @returns {Promise<Object>} Created invoice data
   */
  createInvoice: async (invoiceData) => {
    try {
      const response = await api.post('/api/revenue/invoices', invoiceData);
      return response.data;
    } catch (error) {
      console.error('Create invoice error:', error);
      throw error;
    }
  },

  /**
   * Update an invoice
   * @param {string} id - Invoice ID
   * @param {Object} invoiceData - Invoice data to update
   * @returns {Promise<Object>} Updated invoice data
   */
  updateInvoice: async (id, invoiceData) => {
    try {
      const response = await api.put(`/api/revenue/invoices/${id}`, invoiceData);
      return response.data;
    } catch (error) {
      console.error('Update invoice error:', error);
      throw error;
    }
  },

  /**
   * Delete an invoice
   * @param {string} id - Invoice ID
   * @returns {Promise<Object>} Success message
   */
  deleteInvoice: async (id) => {
    try {
      const response = await api.delete(`/api/revenue/invoices/${id}`);
      return response.data;
    } catch (error) {
      console.error('Delete invoice error:', error);
      throw error;
    }
  },

  /**
   * Get patient invoices
   * @param {string} patientId - Patient ID
   * @param {number} page - Page number
   * @param {number} limit - Items per page
   * @returns {Promise<Object>} Patient's invoices with pagination
   */
  getPatientInvoices: async (patientId, page = 1, limit = 10) => {
    try {
      const response = await api.get(`/api/revenue/invoices/patient/${patientId}?page=${page}&limit=${limit}`);
      return response.data;
    } catch (error) {
      console.error('Get patient invoices error:', error);
      throw error;
    }
  },

  /**
   * Process invoice payment
   * @param {string} invoiceId - Invoice ID
   * @param {Object} paymentData - Payment data
   * @returns {Promise<Object>} Payment confirmation
   */
  processPayment: async (invoiceId, paymentData) => {
    try {
      const response = await api.post(`/api/revenue/invoices/${invoiceId}/payment`, paymentData);
      return response.data;
    } catch (error) {
      console.error('Process payment error:', error);
      throw error;
    }
  },

  /**
   * Generate invoice PDF
   * @param {string} invoiceId - Invoice ID
   * @returns {Promise<Blob>} PDF file blob
   */
  generateInvoicePDF: async (invoiceId) => {
    try {
      const response = await api.get(`/api/revenue/invoices/${invoiceId}/pdf`, {
        responseType: 'blob'
      });
      return response.data;
    } catch (error) {
      console.error('Generate invoice PDF error:', error);
      throw error;
    }
  }
};

export default revenueService; 