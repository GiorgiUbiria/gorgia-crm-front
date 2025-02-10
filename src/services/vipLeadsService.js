import defaultInstance from "../plugins/axios"

export const getVipLeads = async (page = 1, limit = 10) => {
  try {
    const response = await defaultInstance.get("/api/vip-leads", {
      params: {
        page,
        limit,
      },
    })
    return response.data
  } catch (error) {
    console.error("Error fetching VIP leads:", error)
    throw error
  }
}

export const getVipLeadById = async id => {
  try {
    const response = await defaultInstance.get(`/api/vip-leads/${id}`)
    return response.data
  } catch (error) {
    console.error(`Error fetching VIP lead with ID ${id}:`, error)
    throw error
  }
}

export const createVipLead = async data => {
  try {
    const response = await defaultInstance.post("/api/vip-leads", data)
    return response.data
  } catch (error) {
    console.error("Error creating VIP lead:", error)
    throw error
  }
}

export const updateVipLead = async (id, data) => {
  try {
    const response = await defaultInstance.put(`/api/vip-leads/${id}`, data)
    return response.data
  } catch (error) {
    console.error(`Error updating VIP lead with ID ${id}:`, error)
    throw error
  }
}

export const deleteVipLead = async id => {
  try {
    const response = await defaultInstance.delete(`/api/vip-leads/${id}`)
    return response.data
  } catch (error) {
    console.error(`Error deleting VIP lead with ID ${id}:`, error)
    throw error
  }
}

export const fetchCommentsForVipLead = async leadId => {
  try {
    const response = await defaultInstance.get(
      `/api/vip-leads/${leadId}/comments`
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

export const addCommentToVipLead = async (leadId, commentText) => {
  try {
    const response = await defaultInstance.post(
      `/api/vip-leads/${leadId}/comments`,
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
