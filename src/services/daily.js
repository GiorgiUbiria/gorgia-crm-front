import defaultInstance from "../plugins/axios"

// Department Head Dailies
export const getDepartmentHeadDailies = async (params = {}) => {
  try {
    const response = await defaultInstance.get(`/api/department-head-dailies`, {
      params: {
        limit: params.limit || 10,
        page: params.page || 1,
        sortBy: params.sortBy || 'created_at',
        order: params.order || 'desc',
        ...params,
      },
    })
    return response.data
  } catch (error) {
    console.error("Error fetching Department Head Dailies:", error)
    throw error
  }
}

export const getMyDepartmentHeadDailies = async (params = {}) => {
  try {
    const response = await defaultInstance.get(`/api/department-head-dailies/my`, {
      params: {
        limit: params.limit || 10,
        page: params.page || 1,
        sortBy: params.sortBy || 'created_at',
        order: params.order || 'desc',
        ...params,
      },
    })
    return response.data
  } catch (error) {
    console.error("Error fetching My Department Head Dailies:", error)
    throw error
  }
}

export const getDepartmentHeadDaily = async id => {
  try {
    const response = await defaultInstance.get(`/api/department-head-dailies/${id}`)
    return response.data
  } catch (error) {
    console.error(`Error fetching Department Head Daily with ID ${id}:`, error)
    throw error
  }
}

export const createDepartmentHeadDaily = async data => {
  try {
    const formData = new FormData()
    Object.keys(data).forEach(key => {
      if (data[key] !== null && data[key] !== undefined) {
        formData.append(key, data[key])
      }
    })
    const response = await defaultInstance.post("/api/department-head-dailies", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    })
    return response.data
  } catch (error) {
    console.error("Error creating Department Head Daily:", error)
    throw error
  }
}

export const updateDepartmentHeadDaily = async (id, data) => {
  try {
    const formData = new FormData()
    Object.keys(data).forEach(key => {
      if (data[key] !== null && data[key] !== undefined) {
        formData.append(key, data[key])
      }
    })
    const response = await defaultInstance.put(`/api/department-head-dailies/${id}`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    })
    return response.data
  } catch (error) {
    console.error(`Error updating Department Head Daily with ID ${id}:`, error)
    throw error
  }
}

export const deleteDepartmentHeadDaily = async id => {
  try {
    const response = await defaultInstance.delete(`/api/department-head-dailies/${id}`)
    return response.data
  } catch (error) {
    console.error(`Error deleting Department Head Daily with ID ${id}:`, error)
    throw error
  }
}

// Regular Dailies
export const getRegularDailies = async (params = {}) => {
  try {
    const response = await defaultInstance.get(`/api/regular-dailies`, {
      params: {
        limit: params.limit || 10,
        page: params.page || 1,
        sortBy: params.sortBy || 'created_at',
        order: params.order || 'desc',
        ...params,
      },
    })
    return response.data
  } catch (error) {
    console.error("Error fetching Regular Dailies:", error)
    throw error
  }
}

export const getMyRegularDailies = async (params = {}) => {
  try {
    const response = await defaultInstance.get(`/api/regular-dailies/my`, {
      params: {
        limit: params.limit || 10,
        page: params.page || 1,
        sortBy: params.sortBy || 'created_at',
        order: params.order || 'desc',
        ...params,
      },
    })
    return response.data
  } catch (error) {
    console.error("Error fetching My Regular Dailies:", error)
    throw error
  }
}

export const createRegularDaily = async data => {
  try {
    const formData = new FormData()
    Object.keys(data).forEach(key => {
      if (data[key] !== null && data[key] !== undefined) {
        formData.append(key, data[key])
      }
    })
    const response = await defaultInstance.post("/api/regular-dailies", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    })
    return response.data
  } catch (error) {
    console.error("Error creating Regular Daily:", error)
    throw error
  }
}

export const updateRegularDaily = async (id, data) => {
  try {
    const formData = new FormData()
    Object.keys(data).forEach(key => {
      if (data[key] !== null && data[key] !== undefined) {
        formData.append(key, data[key])
      }
    })
    const response = await defaultInstance.put(`/api/regular-dailies/${id}`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    })
    return response.data
  } catch (error) {
    console.error(`Error updating Regular Daily with ID ${id}:`, error)
    throw error
  }
}

export const deleteRegularDaily = async id => {
  try {
    const response = await defaultInstance.delete(`/api/regular-dailies/${id}`)
    return response.data
  } catch (error) {
    console.error(`Error deleting Regular Daily with ID ${id}:`, error)
    throw error
  }
}

// Get all dailies based on user role
export const getAllDailies = async (params = {}) => {
  try {
    const response = await defaultInstance.get(`/api/dailies`, {
      params: {
        limit: params.limit || 10,
        page: params.page || 1,
        sortBy: params.sortBy || 'created_at',
        order: params.order || 'desc',
        ...params,
      },
    })
    return response.data
  } catch (error) {
    console.error("Error fetching all dailies:", error)
    throw error
  }
}
