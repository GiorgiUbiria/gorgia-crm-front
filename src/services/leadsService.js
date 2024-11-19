import defaultInstance from '../plugins/axios'; // Adjust the path if needed

/**
 * Fetch list of leads
 * @param {number} page - The current page of leads.
 * @param {number} limit - The number of leads per page.
 * @returns {Promise} - The list of leads from the server.
 */
export const getLeads = async (page = 1, limit = 10) => {
  try {
    const response = await defaultInstance.get(`/api/leads`, {
      params: { page, limit }
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching leads:", error);
    throw error;
  }
};

/**
 * Create a new lead entry
 * @param {object} leadData - The data for creating a new lead.
 * @returns {Promise} - The newly created lead data.
 */
export const createLead = async (leadData) => {
  try {
    const response = await defaultInstance.post(`/api/leads`, leadData);
    return response.data;
  } catch (error) {
    console.error("Error creating lead:", error);
    throw error;
  }
};

/**
 * Update an existing lead entry
 * @param {number} leadId - The ID of the lead to update.
 * @param {object} leadData - The new data for the lead.
 * @returns {Promise} - The updated lead data.
 */
export const updateLead = async (leadId, leadData) => {
  try {
    const response = await defaultInstance.put(`/api/leads/${leadId}`, leadData);
    return response.data;
  } catch (error) {
    console.error("Error updating lead:", error);
    throw error;
  }
};

/**
 * Delete a lead entry
 * @param {number} leadId - The ID of the lead to delete.
 * @returns {Promise} - Confirmation of the deletion.
 */
export const deleteLead = async (leadId) => {
  try {
    const response = await defaultInstance.delete(`/api/leads/${leadId}`);
    return response.data;
  } catch (error) {
    console.error("Error deleting lead:", error);
    throw error;
  }
};

/**
 * Fetch comments for a specific lead
 * @param {number} leadId - The ID of the lead to fetch comments for.
 * @returns {Promise} - The list of comments for the lead.
 */
export const fetchCommentsForLead = async (leadId) => {
  try {
    const response = await defaultInstance.get(`/api/leads/${leadId}/comments`);
    return response.data;
  } catch (error) {
    console.error("Error fetching comments for lead:", error);
    throw error;
  }
};

/**
 * Add a comment to a specific lead
 * @param {number} leadId - The ID of the lead to add a comment to.
 * @param {string} commentText - The text of the comment.
 * @returns {Promise} - The newly added comment.
 */
export const addCommentToLead = async (leadId, commentText) => {
  try {
    const response = await defaultInstance.post(`/api/leads/${leadId}/comments`, {
      comment: commentText,
    });
    return response.data;
  } catch (error) {
    console.error("Error adding comment to lead:", error);
    throw error;
  }
};
