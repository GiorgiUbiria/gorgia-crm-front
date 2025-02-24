import defaultInstance from "../plugins/axios"

export const getTaskComments = async (
  taskId,
  page = 1,
  limit = 10,
  sortBy = "created_at",
  order = "desc"
) => {
  try {
    const response = await defaultInstance.get(
      `/api/1c-tasks/${taskId}/comments`,
      {
        params: {
          page,
          limit,
          sortBy,
          order,
        },
      }
    )
    return response.data
  } catch (error) {
    console.error(
      "Error fetching task comments:",

      error?.response?.data || error.message
    )
    throw error
  }
}

export const getTaskComment = async commentId => {
  try {
    const response = await defaultInstance.get(`/api/comments/${commentId}`)
    return response.data
  } catch (error) {
    console.error(
      "Error fetching task comment:",
      error?.response?.data || error.message
    )
    throw error
  }
}

export const createTaskComment = async (taskId, data) => {
  try {
    const response = await defaultInstance.post(
      `/api/1c-tasks/${taskId}/comments`,
      data
    )
    return response.data
  } catch (error) {
    console.error(
      "Error creating task comment:",
      error?.response?.data || error.message
    )
    throw error
  }
}

export const deleteTaskComment = async commentId => {
  try {
    const response = await defaultInstance.delete(`/api/comments/${commentId}`)
    return response.data
  } catch (error) {
    console.error(
      "Error deleting task comment:",
      error?.response?.data || error.message
    )
    throw error
  }
}
