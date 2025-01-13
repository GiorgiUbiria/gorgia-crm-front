import defaultInstance from "../plugins/axios"

export const getTaskComments = async taskId => {
  try {
    const response = await defaultInstance.get(
      `/api/tasks/${taskId}/comments`
    )
    return response.data
  } catch (error) {
    console.error("Error fetching task comments:", error)
    throw error
  }
}

export const createTaskComment = async ({ taskId, data }) => {
  try {
    const response = await defaultInstance.post(
      `/api/tasks/${taskId}/comments`,
      data
    )
    return response.data
  } catch (error) {
    console.error("Error creating task comment:", error)
    throw error
  }
}

export const updateTaskComment = async ({ taskId, commentId, data }) => {
  try {
    const response = await defaultInstance.put(
      `/api/tasks/${taskId}/comments/${commentId}`,
      data
    )
    return response.data
  } catch (error) {
    console.error("Error updating task comment:", error)
    throw error
  }
}

export const deleteTaskComment = async ({ taskId, commentId }) => {
  try {
    const response = await defaultInstance.delete(
      `/api/tasks/${taskId}/comments/${commentId}`
    )
    return response.data
  } catch (error) {
    console.error("Error deleting task comment:", error)
    throw error
  }
}
