import api from '../utils/api';

/**
 * Schedule service for managing schedules and timetables
 */
const scheduleService = {
  /**
   * Get all schedules with pagination
   * @param {number} page - Page number
   * @param {number} limit - Items per page
   * @returns {Promise<Object>} Schedule list with pagination info
   */
  getAllSchedules: async (page = 1, limit = 10) => {
    try {
      const response = await api.get(`/api/schedules?page=${page}&limit=${limit}`);
      return response.data;
    } catch (error) {
      console.error('Get schedules error:', error);
      throw error;
    }
  },
  
  /**
   * Get a schedule by ID
   * @param {string} id - Schedule ID
   * @returns {Promise<Object>} Schedule data
   */
  getScheduleById: async (id) => {
    try {
      const response = await api.get(`/api/schedules/${id}`);
      return response.data;
    } catch (error) {
      console.error('Get schedule error:', error);
      throw error;
    }
  },

  /**
   * Get schedules for the current user
   * @param {string} startDate - Start date (YYYY-MM-DD)
   * @param {string} endDate - End date (YYYY-MM-DD)
   * @returns {Promise<Object>} User's schedule
   */
  getMySchedule: async (startDate, endDate) => {
    try {
      const response = await api.get(`/api/schedules/me?startDate=${startDate}&endDate=${endDate}`);
      return response.data;
    } catch (error) {
      console.error('Get my schedule error:', error);
      throw error;
    }
  },

  /**
   * Get doctor's schedule
   * @param {string} doctorId - Doctor ID
   * @param {string} startDate - Start date (YYYY-MM-DD)
   * @param {string} endDate - End date (YYYY-MM-DD)
   * @returns {Promise<Object>} Doctor's schedule
   */
  getDoctorSchedule: async (doctorId, startDate, endDate) => {
    try {
      const response = await api.get(`/api/schedules/doctor/${doctorId}?startDate=${startDate}&endDate=${endDate}`);
      return response.data;
    } catch (error) {
      console.error('Get doctor schedule error:', error);
      throw error;
    }
  },

  /**
   * Create a new schedule
   * @param {Object} scheduleData - Schedule data
   * @returns {Promise<Object>} Created schedule data
   */
  createSchedule: async (scheduleData) => {
    try {
      const response = await api.post('/api/schedules', scheduleData);
      return response.data;
    } catch (error) {
      console.error('Create schedule error:', error);
      throw error;
    }
  },

  /**
   * Update a schedule
   * @param {string} id - Schedule ID
   * @param {Object} scheduleData - Schedule data to update
   * @returns {Promise<Object>} Updated schedule data
   */
  updateSchedule: async (id, scheduleData) => {
    try {
      const response = await api.put(`/api/schedules/${id}`, scheduleData);
      return response.data;
    } catch (error) {
      console.error('Update schedule error:', error);
      throw error;
    }
  },

  /**
   * Delete a schedule
   * @param {string} id - Schedule ID
   * @returns {Promise<Object>} Success message
   */
  deleteSchedule: async (id) => {
    try {
      const response = await api.delete(`/api/schedules/${id}`);
      return response.data;
    } catch (error) {
      console.error('Delete schedule error:', error);
      throw error;
    }
  },

  /**
   * Get department schedules
   * @param {string} department - Department name
   * @param {string} date - Date (YYYY-MM-DD)
   * @returns {Promise<Object>} Department schedules
   */
  getDepartmentSchedules: async (department, date) => {
    try {
      const response = await api.get(`/api/schedules/department/${department}?date=${date}`);
      return response.data;
    } catch (error) {
      console.error('Get department schedules error:', error);
      throw error;
    }
  }
};

export default scheduleService; 