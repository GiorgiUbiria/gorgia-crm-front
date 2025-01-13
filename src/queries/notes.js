import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import * as noteService from "../services/note"
import { queryKeys } from "./keys"

export const useNotes = (filters = {}) => {
  return useQuery({
    queryKey: queryKeys.notes.list(filters),
    queryFn: () => noteService.getNotes(filters),
    staleTime: 5 * 60 * 1000,
  })
}

export const useNote = (id) => {
  return useQuery({
    queryKey: queryKeys.notes.detail(id),
    queryFn: () => noteService.getNote(id),
    enabled: Boolean(id),
  })
}

export const useCreateNote = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (data) => noteService.createNote(data),
    onSuccess: () => {
      queryClient.invalidateQueries(queryKeys.notes.lists())
    },
  })
}

export const useUpdateNote = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, data }) => noteService.updateNote(id, data),
    onMutate: async ({ id, data }) => {
      await queryClient.cancelQueries(queryKeys.notes.detail(id))

      const previousNote = queryClient.getQueryData(queryKeys.notes.detail(id))

      queryClient.setQueryData(
        queryKeys.notes.detail(id),
        old => ({ ...old, ...data })
      )

      return { previousNote }
    },
    onError: (err, { id }, context) => {
      queryClient.setQueryData(
        queryKeys.notes.detail(id),
        context?.previousNote
      )
    },
    onSettled: (_, __, { id }) => {
      queryClient.invalidateQueries(queryKeys.notes.detail(id))
      queryClient.invalidateQueries(queryKeys.notes.lists())
    },
  })
}

export const useDeleteNote = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (id) => noteService.deleteNote(id),
    onSuccess: () => {
      queryClient.invalidateQueries(queryKeys.notes.lists())
    },
  })
} 