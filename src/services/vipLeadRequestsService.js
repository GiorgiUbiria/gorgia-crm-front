import defaultInstance from "../plugins/axios"

export const getAllLeadRequests = async (page = 1, limit = 10) => {
  try {
    const response = await defaultInstance.get("/api/vip-lead-requests", {
      params: {
        page,
        limit,
      },
    })
    return response.data
  } catch (error) {
    console.error("Error fetching VIP lead requests:", error)
    throw error
  }
}

export const getLeadRequestById = async id => {
  try {
    const response = await defaultInstance.get(`/api/vip-lead-requests/${id}`)
    return response.data
  } catch (error) {
    console.error(`Error fetching VIP lead with ID ${id}:`, error)
    throw error
  }
}

export const createLeadRequest = async data => {
  try {
    const response = await defaultInstance.post("/api/vip-lead-requests", data)
    return response.data
  } catch (error) {
    console.error("Error creating VIP lead:", error)
    throw error
  }
}

export const updateLeadRequest = async (id, data) => {
  try {
    const response = await defaultInstance.put(
      `/api/vip-lead-requests/${id}`,
      data
    )
    return response.data
  } catch (error) {
    console.error(`Error updating VIP lead with ID ${id}:`, error)
    throw error
  }
}

export const deleteLeadRequest = async id => {
  try {
    const response = await defaultInstance.delete(
      `/api/vip-lead-requests/${id}`
    )
    return response.data
  } catch (error) {
    console.error(`Error deleting VIP lead with ID ${id}:`, error)
    throw error
  }
}

export const fetchCommentsForLeadRequest = async leadId => {
  try {
    const response = await defaultInstance.get(
      `/api/vip-lead-requests/${leadId}/comments`
    )
    return response.data
  } catch (error) {
    console.error(
      `Error fetching comments for VIP lead with ID ${leadId}:`,
      error
    )
    throw error
  }
}

export const addCommentToLeadRequest = async (leadId, commentText) => {
  try {
    const response = await defaultInstance.post(
      `/api/vip-lead-requests/${leadId}/comments`,
      {
        comment: commentText,
      }
    )
    return response.data
  } catch (error) {
    console.error(`Error adding comment to VIP lead with ID ${leadId}:`, error)
    throw error
  }
}
