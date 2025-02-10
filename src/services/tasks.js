import defaultInstance from "../plugins/axios"

export const getTaskList = async () => {
  try {
    const response = await defaultInstance.get("/api/tasks")
    return response.data
  } catch (error) {
    console.error("Error fetching task list:", error)
    throw error
  }
}

export const getMyTasks = async () => {
  try {
    const response = await defaultInstance.get("/api/tasks/my")
    console.log(response.data)
    return response.data
  } catch (error) {
    console.error("Error fetching my tasks:", error)
    throw error
  }
}

export const getTasksAssignedToMe = async () => {
  try {
    const response = await defaultInstance.get("/api/tasks/assigned-to-me")
    return response.data
  } catch (error) {
    console.error("Error fetching assigned tasks:", error)
    throw error
  }
}

export const getTask = async id => {
  try {
    const response = await defaultInstance.get(`/api/tasks/${id}`)
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
  console.group("Task Creation Debug")
  console.log("Task Service - Creating Task - Request Data:", data)
  try {
    console.log("Task Service - Sending POST request to /api/tasks")
    const response = await defaultInstance.post("/api/tasks", data)
    console.log("Task Service - Creation Response:", response.data)
    console.log("Task Service - Response Status:", response.status)
    console.groupEnd()
    return response.data
  } catch (error) {
    console.error("Task Service - Creation Error:", error)
    console.error("Task Service - Error Response:", error.response?.data)
    console.groupEnd()
    throw error
  }
}

export const updateTask = async ({ id, data }) => {
  if (!id) {
    throw new Error("Task ID is required for update operation")
  }

  console.log("Task Service - Updating Task:", { id, data })
  try {
    const response = await defaultInstance.put(`/api/tasks/${id}`, data)
    console.log("Task Service - Update Response:", response.data)
    return response.data
  } catch (error) {
    console.error("Task Service - Update Error:", error)
    if (error.response?.status === 404) {
      throw new Error(`Task with ID ${id} not found`)
    }
    throw error
  }
}

export const deleteTask = async id => {
  try {
    const response = await defaultInstance.delete(`/api/tasks/${id}`)
    return response.data
  } catch (error) {
    console.error("Error deleting task:", error)
    throw error
  }
}

export const assignTask = async ({ taskId, userIds }) => {
  console.log("Task Service - Assigning Task:", { taskId, userIds })
  try {
    const response = await defaultInstance.post(`/api/tasks/${taskId}/assign`, {
      user_ids: userIds || [],
    })
    console.log("Task Service - Assignment Response:", response.data)
    return response.data
  } catch (error) {
    console.error("Task Service - Assignment Error:", error)
    throw error
  }
}

export const startTask = async id => {
  try {
    const response = await defaultInstance.patch(`/api/tasks/${id}/start`)
    return response.data
  } catch (error) {
    console.error("Error starting task:", error)
    throw error
  }
}

export const finishTask = async id => {
  try {
    const response = await defaultInstance.patch(`/api/tasks/${id}/finish`)
    return response.data
  } catch (error) {
    console.error("Error finishing task:", error)
    throw error
  }
}

export const getTaskComments = async taskId => {
  try {
    const response = await defaultInstance.get(`/api/tasks/${taskId}/comments`)
    return response.data
  } catch (error) {
    console.error("Error fetching task comments:", error)
    throw error
  }
}

export const createTaskComment = async (taskId, data) => {
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

export const updateTaskComment = async (taskId, commentId, data) => {
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

export const deleteTaskComment = async (taskId, commentId) => {
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
