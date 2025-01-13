import defaultInstance from "../plugins/axios"

export const getFarmTaskComments = async taskId => {
  try {
    const response = await defaultInstance.get(
      `/api/farm-tasks/${taskId}/comments`
    )
    return response.data
  } catch (error) {
    console.error("Error fetching farm task comments:", error)
    throw error
  }
}

export const createFarmTaskComment = async ({ taskId, data }) => {
  try {
    const response = await defaultInstance.post(
      `/api/farm-tasks/${taskId}/comments`,
      data
    )
    return response.data
  } catch (error) {
    console.error("Error creating farm task comment:", error)
    throw error
  }
}

export const updateFarmTaskComment = async ({ taskId, commentId, data }) => {
  try {
    const response = await defaultInstance.put(
      `/api/farm-tasks/${taskId}/comments/${commentId}`,
      data
    )
    return response.data
  } catch (error) {
    console.error("Error updating farm task comment:", error)
    throw error
  }
}

export const deleteFarmTaskComment = async ({ taskId, commentId }) => {
  try {
    const response = await defaultInstance.delete(
      `/api/farm-tasks/${taskId}/comments/${commentId}`
    )
    return response.data
  } catch (error) {
    console.error("Error deleting farm task comment:", error)
    throw error
  }
}

// Backward compatibility exports
export const getTaskComments = getFarmTaskComments
export const createTaskComment = async (taskId, data) => createFarmTaskComment({ taskId, data })
export const updateTaskComment = async (taskId, commentId, data) => updateFarmTaskComment({ taskId, commentId, data })
export const deleteTaskComment = async (taskId, commentId) => deleteFarmTaskComment({ taskId, commentId })
