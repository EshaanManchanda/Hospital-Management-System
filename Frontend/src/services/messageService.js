import api from '../utils/api';

/**
 * Message service for managing hospital communications
 */
const messageService = {
  /**
   * Get all messages for the current user
   * @param {number} page - Page number
   * @param {number} limit - Items per page
   * @returns {Promise<Object>} Messages with pagination info
   */
  getMessages: async (page = 1, limit = 10) => {
    try {
      const response = await api.get(`/api/messages?page=${page}&limit=${limit}`);
      return response.data;
    } catch (error) {
      console.error('Get messages error:', error);
      throw error;
    }
  },
  
  /**
   * Get a message by ID
   * @param {string} id - Message ID
   * @returns {Promise<Object>} Message data
   */
  getMessageById: async (id) => {
    try {
      const response = await api.get(`/api/messages/${id}`);
      return response.data;
    } catch (error) {
      console.error('Get message error:', error);
      throw error;
    }
  },

  /**
   * Send a new message
   * @param {Object} messageData - Message data including recipient, subject, content
   * @returns {Promise<Object>} Sent message data
   */
  sendMessage: async (messageData) => {
    try {
      const response = await api.post('/api/messages', messageData);
      return response.data;
    } catch (error) {
      console.error('Send message error:', error);
      throw error;
    }
  },

  /**
   * Mark a message as read
   * @param {string} id - Message ID
   * @returns {Promise<Object>} Updated message
   */
  markAsRead: async (id) => {
    try {
      const response = await api.patch(`/api/messages/${id}/read`);
      return response.data;
    } catch (error) {
      console.error('Mark message as read error:', error);
      throw error;
    }
  },

  /**
   * Delete a message
   * @param {string} id - Message ID
   * @returns {Promise<Object>} Success message
   */
  deleteMessage: async (id) => {
    try {
      const response = await api.delete(`/api/messages/${id}`);
      return response.data;
    } catch (error) {
      console.error('Delete message error:', error);
      throw error;
    }
  },

  /**
   * Get conversation with a specific user
   * @param {string} userId - User ID to get conversation with
   * @param {number} page - Page number
   * @param {number} limit - Items per page
   * @returns {Promise<Object>} Conversation messages with pagination
   */
  getConversation: async (userId, page = 1, limit = 10) => {
    try {
      const response = await api.get(`/api/messages/conversation/${userId}?page=${page}&limit=${limit}`);
      return response.data;
    } catch (error) {
      console.error('Get conversation error:', error);
      throw error;
    }
  },

  /**
   * Get unread message count
   * @returns {Promise<Object>} Number of unread messages
   */
  getUnreadCount: async () => {
    try {
      const response = await api.get('/api/messages/unread/count');
      return response.data;
    } catch (error) {
      console.error('Get unread count error:', error);
      throw error;
    }
  },

  /**
   * Get recent conversations
   * @returns {Promise<Object>} Recent conversations with last message preview
   */
  getRecentConversations: async () => {
    try {
      const response = await api.get('/api/messages/conversations');
      return response.data;
    } catch (error) {
      console.error('Get recent conversations error:', error);
      throw error;
    }
  }
};

export default messageService; 