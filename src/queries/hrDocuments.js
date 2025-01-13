import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import * as hrDocumentService from "../services/hrDocument"
import { queryKeys } from "./keys"

export const useHrDocuments = (filters = {}) => {
  return useQuery({
    queryKey: queryKeys.hrDocuments.list(filters),
    queryFn: () => hrDocumentService.getHrDocuments(filters),
    staleTime: 5 * 60 * 1000,
  })
}

export const useHrDocument = (id) => {
  return useQuery({
    queryKey: queryKeys.hrDocuments.detail(id),
    queryFn: () => hrDocumentService.getHrDocument(id),
    enabled: Boolean(id),
  })
}

export const useCreateHrDocument = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (data) => hrDocumentService.createHrDocument(data),
    onSuccess: () => {
      queryClient.invalidateQueries(queryKeys.hrDocuments.lists())
    },
  })
}

export const useUpdateHrDocument = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, data }) => hrDocumentService.updateHrDocument(id, data),
    onMutate: async ({ id, data }) => {
      await queryClient.cancelQueries(queryKeys.hrDocuments.detail(id))

      const previousDocument = queryClient.getQueryData(queryKeys.hrDocuments.detail(id))

      queryClient.setQueryData(
        queryKeys.hrDocuments.detail(id),
        old => ({ ...old, ...data })
      )

      return { previousDocument }
    },
    onError: (err, { id }, context) => {
      queryClient.setQueryData(
        queryKeys.hrDocuments.detail(id),
        context?.previousDocument
      )
    },
    onSettled: (_, __, { id }) => {
      queryClient.invalidateQueries(queryKeys.hrDocuments.detail(id))
      queryClient.invalidateQueries(queryKeys.hrDocuments.lists())
    },
  })
}

export const useDeleteHrDocument = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (id) => hrDocumentService.deleteHrDocument(id),
    onSuccess: () => {
      queryClient.invalidateQueries(queryKeys.hrDocuments.lists())
    },
  })
}

export const useApproveHrDocument = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, data }) => hrDocumentService.approveHrDocument(id, data),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries(queryKeys.hrDocuments.detail(id))
      queryClient.invalidateQueries(queryKeys.hrDocuments.lists())
    },
  })
}

export const useRejectHrDocument = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, data }) => hrDocumentService.rejectHrDocument(id, data),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries(queryKeys.hrDocuments.detail(id))
      queryClient.invalidateQueries(queryKeys.hrDocuments.lists())
    },
  })
} 