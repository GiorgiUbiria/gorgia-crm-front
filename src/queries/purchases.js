import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import * as purchaseService from "../services/purchase"
import { queryKeys } from "./keys"

export const usePurchases = (filters = {}) => {
  return useQuery({
    queryKey: queryKeys.purchases.list(filters),
    queryFn: () => purchaseService.getPurchases(filters),
    staleTime: 5 * 60 * 1000,
  })
}

export const usePurchase = (id) => {
  return useQuery({
    queryKey: queryKeys.purchases.detail(id),
    queryFn: () => purchaseService.getPurchase(id),
    enabled: Boolean(id),
  })
}

export const useCreatePurchase = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (data) => purchaseService.createPurchase(data),
    onSuccess: () => {
      queryClient.invalidateQueries(queryKeys.purchases.lists())
    },
  })
}

export const useUpdatePurchase = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, data }) => purchaseService.updatePurchase(id, data),
    onMutate: async ({ id, data }) => {
      await queryClient.cancelQueries(queryKeys.purchases.detail(id))

      const previousPurchase = queryClient.getQueryData(queryKeys.purchases.detail(id))

      queryClient.setQueryData(
        queryKeys.purchases.detail(id),
        old => ({ ...old, ...data })
      )

      return { previousPurchase }
    },
    onError: (err, { id }, context) => {
      queryClient.setQueryData(
        queryKeys.purchases.detail(id),
        context?.previousPurchase
      )
    },
    onSettled: (_, __, { id }) => {
      queryClient.invalidateQueries(queryKeys.purchases.detail(id))
      queryClient.invalidateQueries(queryKeys.purchases.lists())
    },
  })
}

export const useDeletePurchase = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (id) => purchaseService.deletePurchase(id),
    onSuccess: () => {
      queryClient.invalidateQueries(queryKeys.purchases.lists())
    },
  })
}

export const useApprovePurchase = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, data }) => purchaseService.approvePurchase(id, data),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries(queryKeys.purchases.detail(id))
      queryClient.invalidateQueries(queryKeys.purchases.lists())
    },
  })
}

export const useRejectPurchase = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, data }) => purchaseService.rejectPurchase(id, data),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries(queryKeys.purchases.detail(id))
      queryClient.invalidateQueries(queryKeys.purchases.lists())
    },
  })
} 