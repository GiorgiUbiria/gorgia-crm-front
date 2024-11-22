import defaultInstance from '../plugins/axios'; // Ensure the correct path to your axios instance

/**
 * Fetch list of VIP leads
 * @param {number} page - The current page of VIP leads (optional, default is 1).
 * @param {number} limit - The number of VIP leads per page (optional, default is 10).
 * @returns {Promise} - Resolves to the list of VIP leads from the server.
 */
export const getAllLeadRequests = async (page = 1, limit = 10) => {
  try {
    const response = await defaultInstance.get('/api/vip-lead-requests', {
      params: {
        page,
        limit
      }
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching VIP lead requests:', error);
    throw error;
  }
};

/**
 * Fetch a specific VIP lead by ID
 * @param {number|string} id - The ID of the VIP lead.
 * @returns {Promise} - Resolves to the details of the VIP lead.
 */
export const getLeadRequestById = async (id) => {
  try {
    const response = await defaultInstance.get(`/api/vip-lead-requests/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching VIP lead with ID ${id}:`, error);
    throw error;
  }
};

/**
 * Create a new VIP lead
 * @param {object} data - The data for creating a new VIP lead.
 * @returns {Promise} - Resolves to the newly created VIP lead.
 */
export const createLeadRequest = async (data) => {
  try {
    const response = await defaultInstance.post('/api/vip-lead-requests', data);
    return response.data;
  } catch (error) {
    console.error('Error creating VIP lead:', error);
    throw error;
  }
};

/**
 * Update an existing VIP lead
 * @param {number|string} id - The ID of the VIP lead to update.
 * @param {object} data - The new data for the VIP lead.
 * @returns {Promise} - Resolves to the updated VIP lead.
 */
export const updateLeadRequest = async (id, data) => {
  try {
    const response = await defaultInstance.put(`/api/vip-lead-requests/${id}`, data);
    return response.data;
  } catch (error) {
    console.error(`Error updating VIP lead with ID ${id}:`, error);
    throw error;
  }
};

/**
 * Delete a VIP lead
 * @param {number|string} id - The ID of the VIP lead to delete.
 * @returns {Promise} - Resolves to the deletion confirmation.
 */
export const deleteLeadRequest = async (id) => {
  try {
    const response = await defaultInstance.delete(`/api/vip-lead-requests/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Error deleting VIP lead with ID ${id}:`, error);
    throw error;
  }
};

/**
 * Fetch comments for a specific VIP lead
 * @param {number|string} leadId - The ID of the VIP lead to fetch comments for.
 * @returns {Promise} - Resolves to the list of comments for the VIP lead.
 */
export const fetchCommentsForLeadRequest = async (leadId) => {
  try {
    const response = await defaultInstance.get(`/api/vip-lead-requests/${leadId}/comments`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching comments for VIP lead with ID ${leadId}:`, error);
    throw error;
  }
};

/**
 * Add a comment to a specific VIP lead
 * @param {number|string} leadId - The ID of the VIP lead to add a comment to.
 * @param {string} commentText - The text of the comment to add.
 * @returns {Promise} - Resolves to the newly added comment.
 */
export const addCommentToLeadRequest = async (leadId, commentText) => {
  try {
    const response = await defaultInstance.post(`/api/vip-lead-requests/${leadId}/comments`, {
      comment: commentText,
    });
    return response.data;
  } catch (error) {
    console.error(`Error adding comment to VIP lead with ID ${leadId}:`, error);
    throw error;
  }
};