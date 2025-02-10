import defaultInstance from "../plugins/axios"

export const fetchCommentsForLeadRequest = async vipLeadRequestId => {
  try {
    const response = await defaultInstance.get(
      `/api/vip-lead-requests/${vipLeadRequestId}/comments`
    )
    return response.data
  } catch (error) {
    console.error(
      `Error fetching comments for VIP lead request with ID ${vipLeadRequestId}:`,
      error
    )
    throw error
  }
}

export const addCommentToLeadRequest = async (
  requestId,
  commentText,
  parentId = null
) => {
  try {
    const response = await defaultInstance.post(
      `/api/vip-lead-requests/${requestId}/comments`,
      {
        comment: commentText,
        parent_id: parentId,
      }
    )
    return response.data
  } catch (error) {
    console.error(
      `Error adding comment to request with ID ${requestId}:`,
      error
    )
    throw error
  }
}

export const updateCommentForLeadRequest = async (
  vipLeadRequestId,
  commentId,
  commentText
) => {
  try {
    const response = await defaultInstance.put(
      `/api/vip-lead-requests/${vipLeadRequestId}/comments/${commentId}`,
      {
        comment: commentText,
      }
    )
    return response.data
  } catch (error) {
    console.error(
      `Error updating comment with ID ${commentId} for VIP lead request with ID ${vipLeadRequestId}:`,
      error
    )
    throw error
  }
}

export const deleteCommentFromLeadRequest = async (
  vipLeadRequestId,
  commentId
) => {
  try {
    const response = await defaultInstance.delete(
      `/api/vip-lead-requests/${vipLeadRequestId}/comments/${commentId}`
    )
    return response.data
  } catch (error) {
    console.error(
      `Error deleting comment with ID ${commentId} from VIP lead request with ID ${vipLeadRequestId}:`,
      error
    )
    throw error
  }
}
