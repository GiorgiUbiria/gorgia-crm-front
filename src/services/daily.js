import defaultInstance from "../plugins/axios"

const BASE_URL = "/api"

// Department Head Dailies

/**
 * Fetches a list of Department Head Dailies.
 * @param {number} page - The page number.
 * @param {number} limit - The number of items per page.
 * @returns {Object} - An object containing dailies, department, and user.
 */
export const getDepartmentHeadDailies = async (page = 1, limit = 10) => {
  try {
    const response = await defaultInstance.get(
      `/api/department-head-dailies?page=${page}&limit=${limit}`
    )
    const { dailies, department, user } = response.data
    return { dailies, department, user }
  } catch (error) {
    console.error("Error fetching Department Head Dailies:", error)
    throw error
  }
}

/**
 * Fetches a single Department Head Daily by ID.
 * @param {number} id - The ID of the daily.
 * @returns {Object} - An object containing daily, department, and user.
 */
export const getDepartmentHeadDaily = async id => {
  try {
    const response = await defaultInstance.get(
      `/api/department-head-dailies/${id}`
    )
    console.log(response)
    const { daily, department, user } = response.data
    return { daily, department, user }
  } catch (error) {
    console.error(`Error fetching Department Head Daily with ID ${id}:`, error)
    throw error
  }
}

/**
 * Creates a new Department Head Daily.
 * @param {Object} data - The daily data.
 * @returns {Object} - An object containing the created daily, department, and user.
 */
export const createDepartmentHeadDaily = async data => {
  try {
    const formData = new FormData()
    Object.keys(data).forEach(key => {
      if (data[key] !== null && data[key] !== undefined) {
        formData.append(key, data[key])
      }
    })
    const response = await defaultInstance.post(
      "/api/department-head-dailies",
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    )
    const { daily, department, user } = response.data
    return { daily, department, user }
  } catch (error) {
    console.error("Error creating Department Head Daily:", error)
    throw error
  }
}

/**
 * Updates an existing Department Head Daily.
 * @param {number} id - The ID of the daily.
 * @param {Object} data - The updated daily data.
 * @returns {Object} - An object containing the updated daily, department, and user.
 */
export const updateDepartmentHeadDaily = async (id, data) => {
  try {
    const formData = new FormData()
    Object.keys(data).forEach(key => {
      if (data[key] !== null && data[key] !== undefined) {
        formData.append(key, data[key])
      }
    })
    const response = await defaultInstance.post(
      `/api/department-head-dailies/${id}`,
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    )
    const { daily, department, user } = response.data
    return { daily, department, user }
  } catch (error) {
    console.error(`Error updating Department Head Daily with ID ${id}:`, error)
    throw error
  }
}

/**
 * Deletes a Department Head Daily by ID.
 * @param {number} id - The ID of the daily.
 * @returns {Object} - An object containing a success message, department_id, and user_id.
 */
export const deleteDepartmentHeadDaily = async id => {
  try {
    const response = await defaultInstance.delete(
      `/api/department-head-dailies/${id}`
    )
    const { message, department_id, user_id } = response.data
    return { message, department_id, user_id }
  } catch (error) {
    console.error(`Error deleting Department Head Daily with ID ${id}:`, error)
    throw error
  }
}

// Regular Dailies

/**
 * Fetches a list of Regular Dailies.
 * @param {Object} params - Query parameters for pagination.
 * @returns {Object} - An object containing dailies, department, and user.
 */
export const getRegularDailies = async (params = {}) => {
  try {
    const response = await defaultInstance.get(`/api/regular-dailies`, {
      params,
    })
    const { dailies, department, user } = response.data
    return { dailies, department, user }
  } catch (error) {
    console.error("Error fetching Regular Dailies:", error)
    throw error
  }
}

/**
 * Fetches a single Regular Daily by ID.
 * @param {number} id - The ID of the daily.
 * @returns {Object} - An object containing daily, department, and user.
 */
export const getRegularDaily = async id => {
  try {
    const response = await defaultInstance.get(`/api/regular-dailies/${id}`)
    const { daily, department, user } = response.data
    return { daily, department, user }
  } catch (error) {
    console.error(`Error fetching Regular Daily with ID ${id}:`, error)
    throw error
  }
}

/**
 * Creates a new Regular Daily.
 * @param {Object} data - The daily data.
 * @returns {Object} - An object containing the created daily, department, and user.
 */
export const createRegularDaily = async data => {
  try {
    const formData = new FormData()
    Object.keys(data).forEach(key => {
      if (data[key] !== null && data[key] !== undefined) {
        formData.append(key, data[key])
      }
    })
    const response = await defaultInstance.post(
      "/api/regular-dailies",
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    )
    const { daily, department, user } = response.data
    return { daily, department, user }
  } catch (error) {
    console.error("Error creating Regular Daily:", error)
    throw error
  }
}

/**
 * Updates an existing Regular Daily.
 * @param {number} id - The ID of the daily.
 * @param {Object} data - The updated daily data.
 * @returns {Object} - An object containing the updated daily, department, and user.
 */
export const updateRegularDaily = async (id, data) => {
  try {
    const formData = new FormData()
    Object.keys(data).forEach(key => {
      if (data[key] !== null && data[key] !== undefined) {
        formData.append(key, data[key])
      }
    })
    const response = await defaultInstance.put(
      `/api/regular-dailies/${id}`,
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    )
    const { daily, department, user } = response.data
    return { daily, department, user }
  } catch (error) {
    console.error(`Error updating Regular Daily with ID ${id}:`, error)
    throw error
  }
}

/**
 * Deletes a Regular Daily by ID.
 * @param {number} id - The ID of the daily.
 * @returns {Object} - An object containing a success message, department_id, and user_id.
 */
export const deleteRegularDaily = async id => {
  try {
    const response = await defaultInstance.delete(`/api/regular-dailies/${id}`)
    const { message, department_id, user_id } = response.data
    return { message, department_id, user_id }
  } catch (error) {
    console.error(`Error deleting Regular Daily with ID ${id}:`, error)
    throw error
  }
}

/**
 * Fetches the logged-in user's Regular Dailies.
 * @param {Object} params - Query parameters for pagination.
 * @returns {Object} - An object containing dailies, department, and user.
 */
export const getMyRegularDailies = async (params = {}) => {
  try {
    const response = await defaultInstance.get(`/api/regular-dailies/my`, {
      params,
    })
    const { dailies, department, user } = response.data
    return { dailies, department, user }
  } catch (error) {
    console.error("Error fetching My Regular Dailies:", error)
    throw error
  }
}

// General Dailies

/**
 * Fetches a list of Dailies based on type and user role.
 * @param {string} type - The type of dailies ('department_head' or 'regular').
 * @param {Object} params - Query parameters for pagination.
 * @returns {Object} - An object containing dailies, department, and user.
 */
export const getDailies = async (type, params = {}) => {
  try {
    const endpoint =
      type === "department_head"
        ? "/department-head-dailies"
        : "/regular-dailies"
    const response = await defaultInstance.get(`${BASE_URL}${endpoint}`, {
      params,
    })
    const { dailies, department, user } = response.data
    return { dailies, department, user }
  } catch (error) {
    console.error(`Error fetching ${type} Dailies:`, error)
    throw error
  }
}

/**
 * Creates a new Daily based on type.
 * @param {string} type - The type of daily ('department_head' or 'regular').
 * @param {Object} data - The daily data.
 * @returns {Object} - An object containing the created daily, department, and user.
 */
export const createDaily = async (type, data) => {
  try {
    const endpoint =
      type === "department_head"
        ? "/department-head-dailies"
        : "/regular-dailies"
    const formData = new FormData()
    Object.keys(data).forEach(key => {
      if (data[key] !== null && data[key] !== undefined) {
        formData.append(key, data[key])
      }
    })
    const response = await defaultInstance.post(
      `${BASE_URL}${endpoint}`,
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    )
    const { daily, department, user } = response.data
    return { daily, department, user }
  } catch (error) {
    console.error(`Error creating ${type} Daily:`, error)
    throw error
  }
}
