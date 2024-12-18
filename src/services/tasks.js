import defaultInstance from "../plugins/axios"

export const getTaskList = async (
  page = 1,
  limit = 10,
  sortBy = "created_at",
  order = "desc"
) => {
  try {
    const response = await defaultInstance.get("/api/tasks", {
      params: {
        page,
        limit,
        sortBy,
        order,
      },
    })
    return response.data
  } catch (error) {
    console.error(
      "Error fetching task list:",
      error?.response?.data || error.message
    )
    throw error
  }
}

export const getTask = async id => {
  try {
    const response = await defaultInstance.get(`/api/tasks/${id}`)
    return response.data
  } catch (error) {
    console.error(
      "Error fetching task:",
      error?.response?.data || error.message
    )
    throw error
  }
}

export const createTask = async data => {
  try {
    const response = await defaultInstance.post("/api/tasks", data)
    return response.data
  } catch (error) {
    console.error(
      "Error creating task:",
      error?.response?.data || error.message
    )
    throw error
  }
}

export const updateTask = async (id, data) => {
  try {
    const response = await defaultInstance.put(`/api/tasks/${id}`, data)
    return response.data
  } catch (error) {
    console.error(
      "Error updating task:",
      error?.response?.data || error.message
    )
    throw error
  }
}

export const updateTaskStatus = async (id, status) => {
  try {
    const response = await defaultInstance.patch(`/api/tasks/${id}/status`, {
      status: status,
    })
    console.log(response)
    if (!response.data) {
      throw new Error("Task not found")
    }
    return response.data
  } catch (error) {
    console.error(
      "Error updating task status:",
      error?.response?.data || error.message
    )
    if (error?.response?.status === 404) {
      throw new Error("Task not found")
    }
    throw error
  }
}

export const deleteTask = async id => {
  try {
    const response = await defaultInstance.delete(`/api/tasks/${id}`)
    return response.data
  } catch (error) {
    console.error(
      "Error deleting task:",
      error?.response?.data || error.message
    )
    throw error
  }
}

export const startTask = async id => {
  try {
    const response = await defaultInstance.patch(`/api/tasks/${id}/start`)
    return response.data
  } catch (error) {
    console.error(
      "Error starting task:",
      error?.response?.data || error.message
    )
    throw error
  }
}

export const finishTask = async id => {
  try {
    const response = await defaultInstance.patch(`/api/tasks/${id}/finish`)
    return response.data
  } catch (error) {
    console.error(
      "Error finishing task:",
      error?.response?.data || error.message
    )
    throw error
  }
}
