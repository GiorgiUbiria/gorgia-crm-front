import defaultInstance from "../plugins/axios"

// Get all internal purchases with filters
export const getPurchaseList = async (filters = {}) => {
  const params = new URLSearchParams()

  if (filters.status) params.append("status", filters.status)
  if (filters.category) params.append("category", filters.category)
  if (filters.branch) params.append("branch", filters.branch)
  if (filters.per_page) params.append("per_page", filters.per_page)

  return defaultInstance.get(`/api/internal-purchases?${params.toString()}`)
}

// Get current user's purchases
export const getCurrentUserPurchases = async (page = 1, perPage = 15) => {
  return defaultInstance.get(
    `/api/internal-purchases/list?page=${page}&per_page=${perPage}`
  )
}

// Get department purchases
export const getDepartmentPurchases = async (page = 1, perPage = 15) => {
  return defaultInstance.get(
    `/api/internal-purchases/department?page=${page}&per_page=${perPage}`
  )
}

// Create new purchase with products
export const createPurchase = async data => {
  return defaultInstance.post("/api/internal-purchases", data)
}

// Update existing purchase
export const updatePurchase = async (id, data) => {
  return defaultInstance.put(`/api/internal-purchases/${id}`, data)
}

// Delete purchase
export const deletePurchase = async id => {
  return defaultInstance.delete(`/api/internal-purchases/${id}`)
}

// Change purchase status
export const updatePurchaseStatus = async (id, status, comment = null) => {
  return defaultInstance.post(`/api/internal-purchases/${id}/status`, {
    status,
    comment,
  })
}

// Get products for a purchase
export const getPurchaseProducts = async (
  purchaseId,
  page = 1,
  perPage = 15
) => {
  return defaultInstance.get(
    `/api/internal-purchases/${purchaseId}/products?page=${page}&per_page=${perPage}`
  )
}

// Create new product for a purchase
export const createPurchaseProduct = async (purchaseId, data) => {
  return defaultInstance.post(
    `/api/internal-purchases/${purchaseId}/products`,
    data
  )
}

// Update existing product
export const updatePurchaseProduct = async (purchaseId, productId, data) => {
  return defaultInstance.put(
    `/api/internal-purchases/${purchaseId}/products/${productId}`,
    data
  )
}

// Delete product
export const deletePurchaseProduct = async (purchaseId, productId) => {
  return defaultInstance.delete(
    `/api/internal-purchases/${purchaseId}/products/${productId}`
  )
}

// Change product status
export const updateProductStatus = async (
  purchaseId,
  productId,
  status,
  comment
) => {
  return await defaultInstance.post(
    `/api/internal-purchases/${purchaseId}/products/${productId}/status`,
    {
      status,
      comment,
    }
  )
}
