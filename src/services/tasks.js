import defaultInstance from "../plugins/axios"

export const getTasks = async (filters = {}) => {
  try {
    const response = await defaultInstance.get("/api/tasks", { params: filters })
    return response.data
  } catch (error) {
    console.error("Error fetching tasks:", error)
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
  try {
    const response = await defaultInstance.post("/api/tasks", data)
    return response.data
  } catch (error) {
    console.error("Error creating task:", error)
    throw error
  }
}

export const updateTask = async ({ id, data }) => {
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

// These functions are kept for backward compatibility
export const getTaskList = getTasks
export const getMyTasks = async () => getTasks({ assigned_user_id: JSON.parse(sessionStorage.getItem("authUser"))?.id })
export const getTasksAssignedToMe = async () => getTasks({ assigned_to_me: true })

// These functions are now handled through updateTask
export const assignTask = async ({ taskId, userIds }) => {
  return updateTask({
    id: taskId,
    data: { assigned_users: userIds }
  })
}

export const startTask = async id => {
  return updateTask({
    id,
    data: { status: "In Progress" }
  })
}

export const finishTask = async id => {
  return updateTask({
    id,
    data: { status: "Completed" }
  })
}

export const updateTaskStatus = async (id, status) => {
  return updateTask({
    id,
    data: { status }
  })
}
