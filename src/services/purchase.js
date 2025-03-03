import defaultInstance from "../plugins/axios"

export const getPurchaseList = async (filters = {}) => {
  const params = new URLSearchParams()

  if (filters.status) params.append("status", filters.status)
  if (filters.category) params.append("category", filters.category)
  if (filters.branch) params.append("branch", filters.branch)
  if (filters.per_page) params.append("per_page", filters.per_page)

  return defaultInstance.get(`/api/internal-purchases?${params.toString()}`)
}

export const getCurrentUserPurchases = async (page = 1, perPage = 15) => {
  return defaultInstance.get(
    `/api/internal-purchases/list?page=${page}&per_page=${perPage}`
  )
}

export const getITPurchases = async () => {
  const response = await defaultInstance.get(`/api/internal-purchases/it`)
  return response.data
}

export const getDepartmentPurchases = async (page = 1, perPage = 15) => {
  return defaultInstance.get(
    `/api/internal-purchases/department?page=${page}&per_page=${perPage}`
  )
}

export const createPurchase = async data => {
  const formData = new FormData()

  if (data.file) {
    console.log("Appending file:", {
      name: data.file.name,
      type: data.file.type,
      size: data.file.size,
    })
    formData.append("file", data.file)
  }

  formData.append("creates_stock", data.creates_stock ? "1" : "0")

  if (Array.isArray(data.products)) {
    data.products.forEach((product, index) => {
      Object.keys(product).forEach(key => {
        formData.append(`products[${index}][${key}]`, product[key])
      })
    })
  }

  Object.keys(data).forEach(key => {
    if (
      !["file", "creates_stock", "products"].includes(key) &&
      data[key] !== null
    ) {
      formData.append(key, data[key])
    }
  })

  console.log("FormData contents:")
  for (let pair of formData.entries()) {
    console.log(pair[0], pair[1])
  }

  return defaultInstance.post("/api/internal-purchases", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  })
}

export const updatePurchase = async (id, data) => {
  return defaultInstance.put(`/api/internal-purchases/${id}`, data)
}

export const deletePurchase = async id => {
  return defaultInstance.delete(`/api/internal-purchases/${id}`)
}

export const updatePurchaseStatus = async (id, status, comment = null) => {
  return defaultInstance.post(`/api/internal-purchases/${id}/status`, {
    status,
    comment,
  })
}

export const getPurchaseProducts = async (
  purchaseId,
  page = 1,
  perPage = 15
) => {
  return defaultInstance.get(
    `/api/internal-purchases/${purchaseId}/products?page=${page}&per_page=${perPage}`
  )
}

export const createPurchaseProduct = async (purchaseId, data) => {
  return defaultInstance.post(
    `/api/internal-purchases/${purchaseId}/products`,
    data
  )
}

export const updatePurchaseProduct = async (purchaseId, productId, data) => {
  return defaultInstance.put(
    `/api/internal-purchases/${purchaseId}/products/${productId}`,
    data
  )
}

export const deletePurchaseProduct = async (purchaseId, productId) => {
  return defaultInstance.delete(
    `/api/internal-purchases/${purchaseId}/products/${productId}`
  )
}

export const updateProductStatus = async (
  purchaseId,
  productId,
  status,
  comment,
  file
) => {
  const formData = new FormData()
  formData.append("status", status)
  formData.append("comment", comment)
  if (file) {
    formData.append("file", file)
  }

  return await defaultInstance.post(
    `/api/internal-purchases/${purchaseId}/products/${productId}/status`,
    formData,
    {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    }
  )
}

export const downloadPurchaseProduct = async (purchaseId, productId) => {
  return defaultInstance.get(
    `/api/internal-purchases/${purchaseId}/products/${productId}/download`,
    {
      responseType: "blob",
    }
  )
}

export const downloadPurchase = async purchaseId => {
  const response = await defaultInstance.get(
    `/api/internal-purchases/${purchaseId}/download`,
    {
      responseType: "blob",
    }
  )

  console.log(response)
  return response
}

export const updatePurchaseReviewStatus = async (id, data) => {
  const formData = new FormData()
  formData.append("review_comment", data.review_comment)
  if (data.file) {
    formData.append("file", data.file)
  }

  return defaultInstance.post(
    `/api/internal-purchases/${id}/review-status`,
    formData,
    {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    }
  )
}

export const updateProductReviewStatus = async (
  purchaseId,
  productId,
  data
) => {
  const formData = new FormData()
  formData.append("review_comment", data.review_comment)
  formData.append("in_stock", data.in_stock ? "1" : "0")
  if (data.technical_specifications) {
    formData.append("technical_specifications", data.technical_specifications)
  }
  if (data.file) {
    formData.append("file", data.file)
  }

  return defaultInstance.post(
    `/api/internal-purchases/${purchaseId}/products/${productId}/review-status`,
    formData,
    {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    }
  )
}

export const uploadInvoice = async (purchaseId, file) => {
  const formData = new FormData()
  formData.append("invoice", file)

  return defaultInstance.post(
    `/api/internal-purchases/${purchaseId}/invoice`,
    formData,
    {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    }
  )
}

export const downloadInvoice = async purchaseId => {
  return defaultInstance.get(
    `/api/internal-purchases/${purchaseId}/invoice`,
    {
      responseType: "blob",
    }
  )
}
