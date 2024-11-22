import defaultInstance from '../plugins/axios'; // Ensure the correct path to your axios instance

/**
 * Fetch comments for a specific VIP lead
 * @param {number|string} vipLeadRequestId - The ID of the VIP lead request to fetch comments for.
 * @returns {Promise} - Resolves to the list of comments for the VIP lead request.
 */
export const fetchCommentsForLeadRequest = async (vipLeadRequestId) => {
  try {
    const response = await defaultInstance.get(`/api/vip-lead-requests/${vipLeadRequestId}/comments`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching comments for VIP lead request with ID ${vipLeadRequestId}:`, error);
    throw error;
  }
};

/**
 * Add a comment to a specific VIP lead request
 * @param {number|string} vipLeadRequestId - The ID of the VIP lead request to add a comment to.
 * @param {string} commentText - The text of the comment to add.
 * @returns {Promise} - Resolves to the newly added comment.
 */
export const addCommentToLeadRequest = async (requestId, commentText, parentId = null) => {
  try {
    const response = await defaultInstance.post(`/api/vip-lead-requests/${requestId}/comments`, {
      comment: commentText,
      parent_id: parentId
    });
    return response.data;
  } catch (error) {
    console.error(`Error adding comment to request with ID ${requestId}:`, error);
    throw error;
  }
};

/**
 * Update a comment for a specific VIP lead request
 * @param {number|string} vipLeadRequestId - The ID of the VIP lead request.
 * @param {number|string} commentId - The ID of the comment to update.
 * @param {string} commentText - The new text of the comment.
 * @returns {Promise} - Resolves to the updated comment.
 */
export const updateCommentForLeadRequest = async (vipLeadRequestId, commentId, commentText) => {
  try {
    const response = await defaultInstance.put(`/api/vip-lead-requests/${vipLeadRequestId}/comments/${commentId}`, {
      comment: commentText,
    });
    return response.data;
  } catch (error) {
    console.error(`Error updating comment with ID ${commentId} for VIP lead request with ID ${vipLeadRequestId}:`, error);
    throw error;
  }
};

/**
 * Delete a comment from a specific VIP lead request
 * @param {number|string} vipLeadRequestId - The ID of the VIP lead request.
 * @param {number|string} commentId - The ID of the comment to delete.
 * @returns {Promise} - Resolves to the deletion confirmation.
 */
export const deleteCommentFromLeadRequest = async (vipLeadRequestId, commentId) => {
  try {
    const response = await defaultInstance.delete(`/api/vip-lead-requests/${vipLeadRequestId}/comments/${commentId}`);
    return response.data;
  } catch (error) {
    console.error(`Error deleting comment with ID ${commentId} from VIP lead request with ID ${vipLeadRequestId}:`, error);
    throw error;
  }
};