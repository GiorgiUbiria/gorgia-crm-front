import defaultInstance from "../plugins/axios"

export const getPeopleCounting = async ({
  page = 1,
  limit = 15,
  ...filters
} = {}) => {
  try {
    const response = await defaultInstance.get("/api/people-counting", {
      params: {
        page,
        limit,
        ...filters,
      },
    })
    return response.data
  } catch (error) {
    throw new Error(
      error.response?.data?.message || "Failed to fetch people counting data"
    )
  }
}

export const createPeopleCounting = async data => {
  try {
    const response = await defaultInstance.post("/api/people-counting", data)
    return response.data
  } catch (error) {
    throw new Error(
      error.response?.data?.message || "Failed to create people counting record"
    )
  }
}

export const updatePeopleCounting = async (id, data) => {
  try {
    const response = await defaultInstance.put(
      `/api/people-counting/${id}`,
      data
    )
    return response.data
  } catch (error) {
    throw new Error(
      error.response?.data?.message || "Failed to update people counting record"
    )
  }
}

export const deletePeopleCounting = async id => {
  try {
    const response = await defaultInstance.delete(`/api/people-counting/${id}`)
    return response.data
  } catch (error) {
    throw new Error(
      error.response?.data?.message || "Failed to delete people counting record"
    )
  }
}

export const bulkDeletePeopleCounting = async ids => {
  try {
    const response = await defaultInstance.post(
      "/api/people-counting/bulk-delete",
      { ids }
    )
    return response.data
  } catch (error) {
    throw new Error(
      error.response?.data?.message ||
        "Failed to delete people counting records"
    )
  }
}

export const getCities = async () => {
  try {
    const response = await defaultInstance.get(
      "/api/people-counting/cities/list"
    )
    return response.data
  } catch (error) {
    console.error("Error fetching cities:", error)
    throw error
  }
}

export const getBranches = async city => {
  try {
    const response = await defaultInstance.get(
      `/api/people-counting/branches/list`,
      {
        params: { city },
      }
    )
    return response.data
  } catch (error) {
    console.error("Error fetching branches:", error)
    throw error
  }
}
