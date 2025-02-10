import defaultInstance from "../plugins/axios"

export const getLeads = async (page = 1, limit = 10) => {
  try {
    const response = await defaultInstance.get(`/api/leads`, {
      params: { page, limit },
    })
    return response.data
  } catch (error) {
    console.error("Error fetching leads:", error)
    throw error
  }
}

export const createLead = async leadData => {
  try {
    const response = await defaultInstance.post(`/api/leads`, leadData)
    return response.data
  } catch (error) {
    console.error("Error creating lead:", error)
    throw error
  }
}

export const updateLead = async (leadId, leadData) => {
  try {
    const response = await defaultInstance.put(`/api/leads/${leadId}`, leadData)
    return response.data
  } catch (error) {
    console.error("Error updating lead:", error)
    throw error
  }
}

export const deleteLead = async leadId => {
  try {
    const response = await defaultInstance.delete(`/api/leads/${leadId}`)
    return response.data
  } catch (error) {
    console.error("Error deleting lead:", error)
    throw error
  }
}

export const fetchCommentsForLead = async leadId => {
  try {
    const response = await defaultInstance.get(`/api/leads/${leadId}/comments`)
    return response.data
  } catch (error) {
    console.error("Error fetching comments for lead:", error)
    throw error
  }
}

export const addCommentToLead = async (leadId, commentText) => {
  try {
    const response = await defaultInstance.post(
      `/api/leads/${leadId}/comments`,
      {
        comment: commentText,
      }
    )
    return response.data
  } catch (error) {
    console.error("Error adding comment to lead:", error)
    throw error
  }
}
