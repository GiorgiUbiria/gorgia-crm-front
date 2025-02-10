import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import * as hrDocumentService from "../services/hrDocument"

const queryKeys = {
  all: ["hr-documents"],
  lists: () => [...queryKeys.all],
  list: () => [...queryKeys.lists()],
  current: () => [...queryKeys.all, "current"],
  hrAdditionalDocuments: {
    list: () => ["hr-additional-documents"],
    lists: () => ["hr-additional-documents"],
    current: () => ["hr-additional-documents", "current"]
  }
}

export const useHrDocuments = (filters = {}) => {
  return useQuery({
    queryKey: queryKeys.hrDocuments.list(filters),
    queryFn: () => hrDocumentService.getHrDocuments(filters),
    staleTime: 5 * 60 * 1000,
  })
}

export const useHrDocument = id => {
  return useQuery({
    queryKey: queryKeys.hrDocuments.detail(id),
    queryFn: () => hrDocumentService.getHrDocument(id),
    enabled: Boolean(id),
  })
}

export const useCreateHrDocument = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: data => hrDocumentService.createHrDocument(data),
    onSuccess: () => {
      queryClient.invalidateQueries(queryKeys.hrDocuments.lists())
    },
  })
}

export const useUpdateHrDocumentStatus = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, status, data }) =>
      hrDocumentService.updateHrDocumentStatus(id, status, data),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries(queryKeys.hrDocuments.detail(id))
      queryClient.invalidateQueries(queryKeys.hrDocuments.lists())
    },
  })
}

export const useHrAdditionalDocuments = () => {
  return useQuery({
    queryKey: queryKeys.hrAdditionalDocuments.list(),
    queryFn: hrDocumentService.getHrAdditionalDocuments,
    staleTime: 5 * 60 * 1000,
  })
}

export const useCurrentUserHrAdditionalDocuments = () => {
  return useQuery({
    queryKey: queryKeys.hrAdditionalDocuments.current(),
    queryFn: hrDocumentService.getCurrentUserHrAdditionalDocuments,
    staleTime: 5 * 60 * 1000,
  })
}

export const useCreateHrAdditionalDocument = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: data => hrDocumentService.createHrAdditionalDocument(data),
    onSuccess: () => {
      queryClient.invalidateQueries(queryKeys.hrAdditionalDocuments.lists())
    },
  })
}

export const useUpdateHrAdditionalDocumentStatus = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, status }) =>
      hrDocumentService.updateHrAdditionalDocumentStatus(id, status),
    onSuccess: () => {
      queryClient.invalidateQueries(queryKeys.hrAdditionalDocuments.lists())
    },
  })
}

export const useUpdateHrAdditionalDocumentOneCStatus = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, data }) =>
      hrDocumentService.updateHrAdditionalDocumentOneCStatus(id, data),
    onMutate: async ({ id, data }) => {
      await queryClient.cancelQueries({
        queryKey: queryKeys.hrAdditionalDocuments.list(),
      })

      const previousData = queryClient.getQueryData(
        queryKeys.hrAdditionalDocuments.list()
      )

      queryClient.setQueryData(queryKeys.hrAdditionalDocuments.list(), old => {
        if (!old?.data?.data) return old
        return {
          ...old,
          data: {
            ...old.data,
            data: old.data.data.map(doc =>
              doc.id === id
                ? {
                    ...doc,
                    stored_in_one_c: data.stored_in_one_c,
                    one_c_comment: data.one_c_comment,
                  }
                : doc
            ),
          },
        }
      })

      return { previousData }
    },
    onError: (err, _, context) => {
      if (context?.previousData) {
        queryClient.setQueryData(
          queryKeys.hrAdditionalDocuments.list(),
          context.previousData
        )
      }
      console.error("Error updating 1C status:", err)
    },
    onSuccess: (response, { id }) => {
      queryClient.setQueryData(queryKeys.hrAdditionalDocuments.list(), old => {
        if (!old?.data?.data) return old
        return {
          ...old,
          data: {
            ...old.data,
            data: old.data.data.map(doc =>
              doc.id === id ? { ...doc, ...response.data } : doc
            ),
          },
        }
      })
    },
    onSettled: () => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.hrAdditionalDocuments.list(),
      })
    },
  })
}
