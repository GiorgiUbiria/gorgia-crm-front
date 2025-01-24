import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import {
  getPurchaseList,
  getCurrentUserPurchases,
  getDepartmentPurchases,
  createPurchase,
  updatePurchase,
  deletePurchase,
  updatePurchaseStatus,
  getPurchaseProducts,
  createPurchaseProduct,
  updatePurchaseProduct,
  deletePurchaseProduct,
  updateProductStatus,
} from "../services/purchase"

// Query keys
export const purchaseKeys = {
  all: ["purchases"],
  list: filters => [...purchaseKeys.all, "list", filters],
  userPurchases: (page, perPage) => [
    ...purchaseKeys.all,
    "user",
    page,
    perPage,
  ],
  departmentPurchases: (page, perPage) => [
    ...purchaseKeys.all,
    "department",
    page,
    perPage,
  ],
  products: purchaseId => [...purchaseKeys.all, "products", purchaseId],
}

// Queries
export const useGetPurchaseList = (filters = {}, options = {}) => {
  return useQuery({
    queryKey: purchaseKeys.list(filters),
    queryFn: () => getPurchaseList(filters),
    select: response => response.data,
    ...options,
  })
}

export const useGetCurrentUserPurchases = (page = 1, perPage = 15) => {
  return useQuery({
    queryKey: purchaseKeys.userPurchases(page, perPage),
    queryFn: () => getCurrentUserPurchases(page, perPage),
    select: response => response.data,
  })
}

export const useGetDepartmentPurchases = (page = 1, perPage = 15, options = {}) => {
  return useQuery({
    queryKey: purchaseKeys.departmentPurchases(page, perPage),
    queryFn: () => getDepartmentPurchases(page, perPage),
    select: response => response.data,
    ...options,
  })
}

export const useGetPurchaseProducts = (purchaseId, page = 1, perPage = 15) => {
  return useQuery({
    queryKey: purchaseKeys.products(purchaseId),
    queryFn: () => getPurchaseProducts(purchaseId, page, perPage),
    select: response => response.data,
    enabled: !!purchaseId,
  })
}

// Mutations
export const useCreatePurchase = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: data => createPurchase(data),
    onSuccess: () => {
      // Invalidate relevant queries
      queryClient.invalidateQueries({ queryKey: purchaseKeys.all })
    },
  })
}

export const useUpdatePurchase = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, data }) => updatePurchase(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: purchaseKeys.all })
    },
  })
}

export const useDeletePurchase = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: id => deletePurchase(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: purchaseKeys.all })
    },
  })
}

export const useUpdatePurchaseStatus = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, status, comment }) =>
      updatePurchaseStatus(id, status, comment),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: purchaseKeys.all })
      queryClient.invalidateQueries({ queryKey: purchaseKeys.departmentPurchases() })
    },
  })
}

export const useCreatePurchaseProduct = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ purchaseId, data }) =>
      createPurchaseProduct(purchaseId, data),
    onSuccess: (_, { purchaseId }) => {
      queryClient.invalidateQueries({
        queryKey: purchaseKeys.products(purchaseId),
      })
    },
  })
}

export const useUpdatePurchaseProduct = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ purchaseId, productId, data }) =>
      updatePurchaseProduct(purchaseId, productId, data),
    onSuccess: (_, { purchaseId }) => {
      queryClient.invalidateQueries({
        queryKey: purchaseKeys.products(purchaseId),
      })
    },
  })
}

export const useDeletePurchaseProduct = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ purchaseId, productId }) =>
      deletePurchaseProduct(purchaseId, productId),
    onSuccess: (_, { purchaseId }) => {
      queryClient.invalidateQueries({
        queryKey: purchaseKeys.products(purchaseId),
      })
    },
  })
}

export const useUpdateProductStatus = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ purchaseId, productId, status, comment, file }) =>
      updateProductStatus(purchaseId, productId, status, comment, file),
    onSuccess: (_, { purchaseId }) => {
      queryClient.invalidateQueries({
        queryKey: purchaseKeys.products(purchaseId),
      })
      queryClient.invalidateQueries({ queryKey: purchaseKeys.all })
    },
  })
}
