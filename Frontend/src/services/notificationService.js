import api from '../utils/api';

/**
 * Notification service for managing notifications
 */
const notificationService = {
  /**
   * Get all notifications for the current user
   * @param {number} page - Page number
   * @param {number} limit - Items per page
   * @returns {Promise<Object>} Notifications with pagination info
   */
  getNotifications: async (page = 1, limit = 10) => {
    try {
      const response = await api.get(`/api/notifications?page=${page}&limit=${limit}`);
      return response.data;
    } catch (error) {
      console.error('Get notifications error:', error);
      throw error;
    }
  },
  
  /**
   * Get a notification by ID
   * @param {string} id - Notification ID
   * @returns {Promise<Object>} Notification data
   */
  getNotificationById: async (id) => {
    try {
      const response = await api.get(`/api/notifications/${id}`);
      return response.data;
    } catch (error) {
      console.error('Get notification error:', error);
      throw error;
    }
  },

  /**
   * Mark a notification as read
   * @param {string} id - Notification ID
   * @returns {Promise<Object>} Updated notification
   */
  markAsRead: async (id) => {
    try {
      const response = await api.patch(`/api/notifications/${id}/read`);
      return response.data;
    } catch (error) {
      console.error('Mark notification as read error:', error);
      throw error;
    }
  },

  /**
   * Mark all notifications as read
   * @returns {Promise<Object>} Success message
   */
  markAllAsRead: async () => {
    try {
      const response = await api.patch('/api/notifications/read-all');
      return response.data;
    } catch (error) {
      console.error('Mark all notifications as read error:', error);
      throw error;
    }
  },

  /**
   * Delete a notification
   * @param {string} id - Notification ID
   * @returns {Promise<Object>} Success message
   */
  deleteNotification: async (id) => {
    try {
      const response = await api.delete(`/api/notifications/${id}`);
      return response.data;
    } catch (error) {
      console.error('Delete notification error:', error);
      throw error;
    }
  },

  /**
   * Get unread notification count
   * @returns {Promise<Object>} Number of unread notifications
   */
  getUnreadCount: async () => {
    try {
      const response = await api.get('/api/notifications/unread/count');
      return response.data;
    } catch (error) {
      console.error('Get unread count error:', error);
      throw error;
    }
  },

  /**
   * Create a new notification
   * @param {Object} notificationData - Notification data
   * @returns {Promise<Object>} Created notification data
   */
  createNotification: async (notificationData) => {
    try {
      const response = await api.post('/api/notifications', notificationData);
      return response.data;
    } catch (error) {
      console.error('Create notification error:', error);
      throw error;
    }
  },

  /**
   * Get notification settings
   * @returns {Promise<Object>} User's notification settings
   */
  getSettings: async () => {
    try {
      const response = await api.get('/api/notifications/settings');
      return response.data;
    } catch (error) {
      console.error('Get notification settings error:', error);
      throw error;
    }
  },

  /**
   * Update notification settings
   * @param {Object} settingsData - Notification settings data
   * @returns {Promise<Object>} Updated settings
   */
  updateSettings: async (settingsData) => {
    try {
      const response = await api.put('/api/notifications/settings', settingsData);
      return response.data;
    } catch (error) {
      console.error('Update notification settings error:', error);
      throw error;
    }
  }
};

export default notificationService; 