import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import * as dailyService from "../services/daily"
import { queryKeys } from "./keys"

// Department Head Dailies
export const useDepartmentHeadDailies = (filters = {}) => {
  return useQuery({
    queryKey: queryKeys.dailies.departmentHead.list(filters),
    queryFn: () => dailyService.getDepartmentHeadDailies(filters),
    staleTime: 5 * 60 * 1000, // 5 minutes
  })
}

export const useMyDepartmentHeadDailies = (filters = {}) => {
  return useQuery({
    queryKey: queryKeys.dailies.departmentHead.my(filters),
    queryFn: () => dailyService.getMyDepartmentHeadDailies(filters),
    staleTime: 5 * 60 * 1000,
  })
}

export const useDepartmentHeadDaily = (id) => {
  return useQuery({
    queryKey: queryKeys.dailies.departmentHead.detail(id),
    queryFn: () => dailyService.getDepartmentHeadDaily(id),
    enabled: Boolean(id),
  })
}

export const useCreateDepartmentHeadDaily = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (data) => dailyService.createDepartmentHeadDaily(data),
    onSuccess: () => {
      queryClient.invalidateQueries(queryKeys.dailies.departmentHead.all)
    },
  })
}

export const useUpdateDepartmentHeadDaily = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, data }) => dailyService.updateDepartmentHeadDaily(id, data),
    onMutate: async ({ id, data }) => {
      await queryClient.cancelQueries(queryKeys.dailies.departmentHead.detail(id))

      const previousDaily = queryClient.getQueryData(
        queryKeys.dailies.departmentHead.detail(id)
      )

      queryClient.setQueryData(
        queryKeys.dailies.departmentHead.detail(id),
        old => ({ ...old, ...data })
      )

      return { previousDaily }
    },
    onError: (err, { id }, context) => {
      queryClient.setQueryData(
        queryKeys.dailies.departmentHead.detail(id),
        context?.previousDaily
      )
    },
    onSettled: (_, __, { id }) => {
      queryClient.invalidateQueries(queryKeys.dailies.departmentHead.detail(id))
      queryClient.invalidateQueries(queryKeys.dailies.departmentHead.lists())
    },
  })
}

export const useDeleteDepartmentHeadDaily = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (id) => dailyService.deleteDepartmentHeadDaily(id),
    onSuccess: () => {
      queryClient.invalidateQueries(queryKeys.dailies.departmentHead.all)
    },
  })
}

// Regular Dailies
export const useRegularDailies = (filters = {}) => {
  return useQuery({
    queryKey: queryKeys.dailies.regular.list(filters),
    queryFn: () => dailyService.getRegularDailies(filters),
    staleTime: 5 * 60 * 1000,
  })
}

export const useMyRegularDailies = (filters = {}) => {
  return useQuery({
    queryKey: queryKeys.dailies.regular.my(filters),
    queryFn: () => dailyService.getMyRegularDailies(filters),
    staleTime: 5 * 60 * 1000,
  })
}

export const useCreateRegularDaily = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (data) => dailyService.createRegularDaily(data),
    onSuccess: () => {
      queryClient.invalidateQueries(queryKeys.dailies.regular.all)
    },
  })
}

export const useUpdateRegularDaily = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, data }) => dailyService.updateRegularDaily(id, data),
    onMutate: async ({ id, data }) => {
      await queryClient.cancelQueries(queryKeys.dailies.regular.detail(id))

      const previousDaily = queryClient.getQueryData(
        queryKeys.dailies.regular.detail(id)
      )

      queryClient.setQueryData(
        queryKeys.dailies.regular.detail(id),
        old => ({ ...old, ...data })
      )

      return { previousDaily }
    },
    onError: (err, { id }, context) => {
      queryClient.setQueryData(
        queryKeys.dailies.regular.detail(id),
        context?.previousDaily
      )
    },
    onSettled: (_, __, { id }) => {
      queryClient.invalidateQueries(queryKeys.dailies.regular.detail(id))
      queryClient.invalidateQueries(queryKeys.dailies.regular.lists())
    },
  })
}

export const useDeleteRegularDaily = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (id) => dailyService.deleteRegularDaily(id),
    onSuccess: () => {
      queryClient.invalidateQueries(queryKeys.dailies.regular.all)
    },
  })
}

// All Dailies
export const useAllDailies = (filters = {}) => {
  return useQuery({
    queryKey: queryKeys.dailies.list(filters),
    queryFn: () => dailyService.getAllDailies(filters),
    staleTime: 5 * 60 * 1000,
  })
} 