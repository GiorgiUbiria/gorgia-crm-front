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

export const uploadMonthlyReport = async (file, reportPeriod) => {
  try {
    const formData = new FormData()
    formData.append('file', file)
    formData.append('report_period', reportPeriod)

    const response = await defaultInstance.post(
      "/api/people-counting/upload/monthly",
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      }
    )
    return response.data
  } catch (error) {
    throw new Error(
      error.response?.data?.message || "Failed to upload monthly report"
    )
  }
}

export const uploadWeeklyReport = async (file, reportPeriod) => {
  try {
    const formData = new FormData()
    formData.append('file', file)
    formData.append('report_period', reportPeriod)

    const response = await defaultInstance.post(
      "/api/people-counting/upload/weekly",
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      }
    )
    return response.data
  } catch (error) {
    throw new Error(
      error.response?.data?.message || "Failed to upload weekly report"
    )
  }
}

export const getUploadedFiles = async ({
  page = 1,
  limit = 15,
  status,
  report_type,
} = {}) => {
  try {
    const response = await defaultInstance.get("/api/people-counting/files", {
      params: {
        page,
        limit,
        status,
        report_type,
      },
    })
    return response.data
  } catch (error) {
    throw new Error(
      error.response?.data?.message || "Failed to fetch uploaded files"
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

export const getEntrances = async branch => {
  try {
    const response = await defaultInstance.get(
      `/api/people-counting/entrances/list`,
      {
        params: { branch },
      }
    )
    return response.data
  } catch (error) {
    console.error("Error fetching entrances:", error)
    throw error
  }
}
