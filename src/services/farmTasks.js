import defaultInstance from "../plugins/axios"

export const getFarmTasks = async (filters = {}) => {
  try {
    const response = await defaultInstance.get("/api/farm-tasks", { params: filters })
    return response.data
  } catch (error) {
    console.error("Error fetching farm tasks:", error)
    throw error
  }
}

export const getFarmTask = async id => {
  try {
    const response = await defaultInstance.get(`/api/farm-tasks/${id}`)
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

export const createFarmTask = async data => {
  try {
    const response = await defaultInstance.post("/api/farm-tasks", data)
    return response.data
  } catch (error) {
    console.error("Error creating farm task:", error)
    throw error
  }
}

export const updateFarmTask = async ({ id, data }) => {
  try {
    const response = await defaultInstance.put(`/api/farm-tasks/${id}`, data)
    return response.data
  } catch (error) {
    console.error("Error updating farm task:", error)
    throw error
  }
}

export const deleteFarmTask = async id => {
  try {
    const response = await defaultInstance.delete(`/api/farm-tasks/${id}`)
    return response.data
  } catch (error) {
    console.error("Error deleting farm task:", error)
    throw error
  }
}

// These functions are kept for backward compatibility
export const getTaskList = getFarmTasks
export const getMyTasks = async () => getFarmTasks({ assigned_user_id: JSON.parse(sessionStorage.getItem("authUser"))?.id })
export const getTasksAssignedToMe = async () => getFarmTasks({ assigned_to_me: true })
export const getTask = getFarmTask
export const createTask = createFarmTask
export const updateTask = async (id, data) => updateFarmTask({ id, data })
export const deleteTask = deleteFarmTask

// These functions are now handled through updateFarmTask
export const assignTask = async ({ taskId, userIds }) => {
  return updateFarmTask({
    id: taskId,
    data: { assigned_users: userIds }
  })
}

export const startTask = async id => {
  return updateFarmTask({
    id,
    data: { status: "In Progress" }
  })
}

export const finishTask = async id => {
  return updateFarmTask({
    id,
    data: { status: "Completed" }
  })
}

export const updateTaskStatus = async (id, status) => {
  return updateFarmTask({
    id,
    data: { status }
  })
}
