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
  updatePurchaseReviewStatus,
  updateProductReviewStatus,
  getITPurchases,
} from "../services/purchase"

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

export const useGetPurchaseList = (filters = {}, options = {}) => {
  return useQuery({
    queryKey: purchaseKeys.list(filters),
    queryFn: () => getPurchaseList(filters),
    select: response => response.data.data,
    ...options,
  })
}

export const useGetITPurchases = (options = {}) => {
  return useQuery({
    queryKey: purchaseKeys.list({ status: "pending IT team review" }),
    queryFn: () => getITPurchases(),
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

export const useGetDepartmentPurchases = (
  page = 1,
  perPage = 15,
  options = {}
) => {
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

export const useCreatePurchase = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: data => createPurchase(data),
    onSuccess: () => {
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
    mutationFn: ({ id, status, comment }) => {
      console.log('Updating purchase status:', { id, status, comment })
      return updatePurchaseStatus(id, status, comment)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: purchaseKeys.all })
      queryClient.invalidateQueries({
        queryKey: purchaseKeys.departmentPurchases(),
      })
    },
    onError: (error) => {
      console.error('Purchase status update error:', error)
      throw error
    }
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

export const useUpdatePurchaseReviewStatus = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, data }) => updatePurchaseReviewStatus(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: purchaseKeys.all })
    },
  })
}

export const useUpdateProductReviewStatus = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ purchaseId, productId, data }) =>
      updateProductReviewStatus(purchaseId, productId, data),
    onSuccess: (_, { purchaseId }) => {
      queryClient.invalidateQueries({
        queryKey: purchaseKeys.products(purchaseId),
      })
      queryClient.invalidateQueries({ queryKey: purchaseKeys.all })
    },
  })
}
