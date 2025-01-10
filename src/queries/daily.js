import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import {
  getDepartmentHeadDailies,
  getDepartmentHeadDaily,
  createDepartmentHeadDaily,
  updateDepartmentHeadDaily,
  deleteDepartmentHeadDaily,
  getRegularDailies,
  getRegularDaily,
  createRegularDaily,
  updateRegularDaily,
  deleteRegularDaily,
  getMyRegularDailies,
  getDailies,
  createDaily,
} from "../services/daily"

// Query keys
export const dailyKeys = {
  all: ["dailies"],
  departmentHeadDailies: (page, limit) => [
    ...dailyKeys.all,
    "department-head",
    page,
    limit,
  ],
  departmentHeadDaily: id => [...dailyKeys.all, "department-head", "detail", id],
  regularDailies: params => [...dailyKeys.all, "regular", params],
  regularDaily: id => [...dailyKeys.all, "regular", "detail", id],
  myRegularDailies: params => [...dailyKeys.all, "regular", "my", params],
  dailies: (type, params) => [...dailyKeys.all, type, params],
}

// Queries
export const useGetDepartmentHeadDailies = (page = 1, limit = 10, options = {}) => {
  return useQuery({
    queryKey: dailyKeys.departmentHeadDailies(page, limit),
    queryFn: () => getDepartmentHeadDailies(page, limit),
    select: response => response,
    ...options,
  })
}

export const useGetDepartmentHeadDaily = (id, options = {}) => {
  return useQuery({
    queryKey: dailyKeys.departmentHeadDaily(id),
    queryFn: () => getDepartmentHeadDaily(id),
    select: response => response,
    ...options,
    enabled: !!id,
  })
}

export const useGetRegularDailies = (params = {}, options = {}) => {
  return useQuery({
    queryKey: dailyKeys.regularDailies(params),
    queryFn: () => getRegularDailies(params),
    select: response => response,
    ...options,
  })
}

export const useGetRegularDaily = (id, options = {}) => {
  return useQuery({
    queryKey: dailyKeys.regularDaily(id),
    queryFn: () => getRegularDaily(id),
    select: response => response,
    ...options,
    enabled: !!id,
  })
}

export const useGetMyRegularDailies = (params = {}, options = {}) => {
  return useQuery({
    queryKey: dailyKeys.myRegularDailies(params),
    queryFn: () => getMyRegularDailies(params),
    select: response => response,
    ...options,
  })
}

export const useGetDailies = (type, params = {}, options = {}) => {
  return useQuery({
    queryKey: dailyKeys.dailies(type, params),
    queryFn: () => getDailies(type, params),
    select: response => response,
    ...options,
  })
}

// Mutations
export const useCreateDepartmentHeadDaily = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: createDepartmentHeadDaily,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: dailyKeys.departmentHeadDailies(),
      })
    },
  })
}

export const useUpdateDepartmentHeadDaily = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, data }) => updateDepartmentHeadDaily(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: dailyKeys.departmentHeadDailies(),
      })
    },
  })
}

export const useDeleteDepartmentHeadDaily = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: deleteDepartmentHeadDaily,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: dailyKeys.departmentHeadDailies(),
      })
    },
  })
}

export const useCreateRegularDaily = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: createRegularDaily,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: dailyKeys.regularDailies() })
    },
  })
}

export const useUpdateRegularDaily = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, data }) => updateRegularDaily(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: dailyKeys.regularDailies() })
    },
  })
}

export const useDeleteRegularDaily = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: deleteRegularDaily,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: dailyKeys.regularDailies() })
    },
  })
}

export const useCreateDaily = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ type, data }) => createDaily(type, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: dailyKeys.all })
    },
  })
} 