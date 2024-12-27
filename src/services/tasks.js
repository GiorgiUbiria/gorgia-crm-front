import defaultInstance from "../plugins/axios"

// Task List Operations
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

// Individual Task Operations
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
  try {
    const response = await defaultInstance.post("/api/tasks", data)
    return response.data
  } catch (error) {
    console.error("Error creating task:", error)
    throw error
  }
}

export const updateTask = async (id, data) => {
  try {
    const response = await defaultInstance.put(`/api/tasks/${id}`, data)
    return response.data
  } catch (error) {
    console.error("Error updating task:", error)
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

// Task Status Operations
export const assignTask = async id => {
  try {
    const response = await defaultInstance.post(`/api/tasks/${id}/assign`)
    return response.data
  } catch (error) {
    console.error("Error assigning task:", error)
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

// Task Comments Operations
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
    const response = await defaultInstance.post(`/api/tasks/${taskId}/comments`, data)
    return response.data
  } catch (error) {
    console.error("Error creating task comment:", error)
    throw error
  }
}

export const updateTaskComment = async (taskId, commentId, data) => {
  try {
    const response = await defaultInstance.put(`/api/tasks/${taskId}/comments/${commentId}`, data)
    return response.data
  } catch (error) {
    console.error("Error updating task comment:", error)
    throw error
  }
}

export const deleteTaskComment = async (taskId, commentId) => {
  try {
    const response = await defaultInstance.delete(`/api/tasks/${taskId}/comments/${commentId}`)
    return response.data
  } catch (error) {
    console.error("Error deleting task comment:", error)
    throw error
  }
}
