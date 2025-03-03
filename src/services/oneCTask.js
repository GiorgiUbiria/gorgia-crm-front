import defaultInstance from "../plugins/axios"

export const getTaskList = async () => {
  try {
    const response = await defaultInstance.get("/api/1c-tasks")
    return response.data
  } catch (error) {
    console.error("Error fetching task list:", error)
    throw error
  }
}

export const getMyTasks = async () => {
  try {
    const response = await defaultInstance.get("/api/1c-tasks/my")
    return response.data
  } catch (error) {
    console.error("Error fetching my tasks:", error)
    throw error
  }
}

export const getTasksAssignedToMe = async () => {
  try {
    const response = await defaultInstance.get(
      "/api/1c-tasks/assigned-to-me"
    )
    return response.data
  } catch (error) {
    console.error("Error fetching assigned tasks:", error)
    throw error
  }
}

export const getTask = async id => {
  try {
    const response = await defaultInstance.get(`/api/1c-tasks/${id}`)
    return response.data
  } catch (error) {
    if (error.response?.status === 403) {
      throw new Error("You don't have permission to view this task")
    }
    if (error.response?.status === 404) {
      throw new Error("Task not found")
    }
    throw error
  }
}

export const createTask = async data => {
  try {
    const response = await defaultInstance.post("/api/1c-tasks", data)
    return response.data
  } catch (error) {
    console.error("Error creating task:", error)
    throw error
  }
}

export const updateTask = async (id, data) => {
  try {
    const response = await defaultInstance.put(`/api/1c-tasks/${id}`, data)
    return response.data
  } catch (error) {
    console.error("Error updating task:", error)
    throw error
  }
}

export const deleteTask = async id => {
  try {
    const response = await defaultInstance.delete(`/api/1c-tasks/${id}`)
    return response.data
  } catch (error) {
    console.error("Error deleting task:", error)
    throw error
  }
}

export const assignTask = async ({ taskId, userIds }) => {
  try {
    const response = await defaultInstance.post(
      `/api/1c-tasks/${taskId}/assign`,
      {
        user_ids: userIds,
      }
    )
    return response.data
  } catch (error) {
    console.error("Error assigning task:", error)
    throw error
  }
}

export const startTask = async id => {
  try {
    const response = await defaultInstance.patch(
      `/api/1c-tasks/${id}/start`
    )
    return response.data
  } catch (error) {
    console.error("Error starting task:", error)
    throw error
  }
}

export const finishTask = async id => {
  try {
    const response = await defaultInstance.patch(
      `/api/1c-tasks/${id}/finish`
    )
    return response.data
  } catch (error) {
    console.error("Error finishing task:", error)
    throw error
  }
}

export const getTaskComments = async taskId => {
  try {
    const response = await defaultInstance.get(
      `/api/1c-tasks/${taskId}/comments`
    )
    return response.data
  } catch (error) {
    console.error("Error fetching task comments:", error)
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
    console.error("Error creating task comment:", error)
    throw error
  }
}

export const updateTaskComment = async (taskId, commentId, data) => {
  try {
    const response = await defaultInstance.put(
      `/api/1c-tasks/${taskId}/comments/${commentId}`,
      data
    )
    return response.data
  } catch (error) {
    console.error("Error updating task comment:", error)
    throw error
  }
}

export const deleteTaskComment = async (taskId, commentId) => {
  try {
    const response = await defaultInstance.delete(
      `/api/1c-tasks/${taskId}/comments/${commentId}`
    )
    return response.data
  } catch (error) {
    console.error("Error deleting task comment:", error)
    throw error
  }
}

export const updateTaskStatus = async (id, status) => {
  try {
    const response = await defaultInstance.patch(
      `/api/1c-tasks/${id}/status`,
      { status }
    )
    return response.data
  } catch (error) {
    console.error("Error updating task status:", error)
    throw error
  }
}
