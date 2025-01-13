import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import * as vacationService from "../services/vacation"
import { queryKeys } from "./keys"

export const useVacations = (filters = {}) => {
  return useQuery({
    queryKey: queryKeys.vacations.list(filters),
    queryFn: () => vacationService.getVacations(filters),
    staleTime: 5 * 60 * 1000,
  })
}

export const useVacation = (id) => {
  return useQuery({
    queryKey: queryKeys.vacations.detail(id),
    queryFn: () => vacationService.getVacation(id),
    enabled: Boolean(id),
  })
}

export const useCreateVacation = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (data) => vacationService.createVacation(data),
    onSuccess: () => {
      queryClient.invalidateQueries(queryKeys.vacations.lists())
    },
  })
}

export const useUpdateVacation = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, data }) => vacationService.updateVacation(id, data),
    onMutate: async ({ id, data }) => {
      await queryClient.cancelQueries(queryKeys.vacations.detail(id))

      const previousVacation = queryClient.getQueryData(queryKeys.vacations.detail(id))

      queryClient.setQueryData(
        queryKeys.vacations.detail(id),
        old => ({ ...old, ...data })
      )

      return { previousVacation }
    },
    onError: (err, { id }, context) => {
      queryClient.setQueryData(
        queryKeys.vacations.detail(id),
        context?.previousVacation
      )
    },
    onSettled: (_, __, { id }) => {
      queryClient.invalidateQueries(queryKeys.vacations.detail(id))
      queryClient.invalidateQueries(queryKeys.vacations.lists())
    },
  })
}

export const useDeleteVacation = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (id) => vacationService.deleteVacation(id),
    onSuccess: () => {
      queryClient.invalidateQueries(queryKeys.vacations.lists())
    },
  })
} 