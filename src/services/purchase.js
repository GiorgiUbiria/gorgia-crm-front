import defaultInstance from "../plugins/axios"

export const getPurchaseList = async (showAll = false, page = 1, pageSize = 10) => {
  const params = new URLSearchParams()
  if (showAll) {
    params.append('all', 'true')
  } else {
    params.append('page', page)
    params.append('per_page', pageSize)
  }
  
  return defaultInstance.get(`/api/internal-purchase/list?${params.toString()}`)
}

export const createPurchase = async data => {
  console.log("createPurchase called with:", data)
  try {
    const config = {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    }

    const response = await defaultInstance.post(
      "/api/internal-purchase/create",
      data,
      config
    )
    console.log("createPurchase response:", response)
    return response.data
  } catch (error) {
    console.error("createPurchase error:", error)
    throw error
  }
}

export const getPurchase = async data => {
  return defaultInstance.get("/api/internal-purchase/create", data)
}

export const getCurrentUserPurchases = async () => {
  return defaultInstance.get("/api/internal-purchases/current-user")
}

export const updatePurchaseStatus = async (id, status, comment = null) => {
  return defaultInstance.post(`/api/internal-purchase/${id}/status/`, {
    status,
    comment,
  })
}

export const downloadPurchaseFile = async id => {
  return defaultInstance.get(`/api/internal-purchase/${id}/download`, {
    responseType: "blob",
    headers: {
      'Accept': 'application/pdf',
    }
  })
}
