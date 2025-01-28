import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import {
  getVacations,
  getVacationBalance,
  createVacation,
  createVacationForEmployee,
  updateVacationStatus,
  cancelVacation,
  getVacationDetails,
  getDepartmentVacations,
  updateOneCStatus,
} from "../services/admin/vacation"
import { getCurrentUserVocations } from "../services/vacation"

// Query keys
export const vacationKeys = {
  all: ["vacations"],
  lists: filters => [...vacationKeys.all, "list", filters],
  listDepartment: () => [...vacationKeys.all, "department"],
  details: id => [...vacationKeys.all, "detail", id],
  balance: () => [...vacationKeys.all, "balance"],
  userVacations: () => [...vacationKeys.all, "user"],
}

// Queries
export const useVacationBalance = () => {
  return useQuery({
    queryKey: vacationKeys.balance(),
    queryFn: getVacationBalance,
    staleTime: 1000 * 60 * 5,
    cacheTime: 1000 * 60 * 30,
  })
}

export const useVacations = (options = {}) => {
  return useQuery({
    queryKey: vacationKeys.lists(options.filters),
    queryFn: () => getVacations(options.filters),
    staleTime: 1000 * 60 * 2,
    cacheTime: 1000 * 60 * 15,
    ...options,
  })
}

export const useDepartmentVacations = (options = {}) => {
  return useQuery({
    queryKey: vacationKeys.listDepartment(),
    queryFn: () => getDepartmentVacations(),
    staleTime: 1000 * 60 * 2,
    cacheTime: 1000 * 60 * 15,
    ...options,
  })
}

export const useUserVacations = () => {
  return useQuery({
    queryKey: vacationKeys.userVacations(),
    queryFn: getCurrentUserVocations,
    staleTime: 1000 * 60 * 2,
    cacheTime: 1000 * 60 * 15,
  })
}

export const useVacationDetails = id => {
  return useQuery({
    queryKey: vacationKeys.details(id),
    queryFn: () => getVacationDetails(id),
    enabled: !!id,
    staleTime: 1000 * 60 * 5,
  })
}

// Mutations
export const useCreateVacation = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: createVacation,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: vacationKeys.all })
    },
  })
}

export const useCreateVacationForEmployee = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: createVacationForEmployee,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: vacationKeys.all })
    },
  })
}

export const useUpdateVacationStatus = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, status, rejection_reason }) =>
      updateVacationStatus(id, status, rejection_reason),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: vacationKeys.all })
    },
  })
}

export const useCancelVacation = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, data }) => cancelVacation(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: vacationKeys.all })
    },
  })
}

export const useUpdateOneCStatus = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, data }) => updateOneCStatus(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: vacationKeys.all })
    },
  })
}

// Optimistic updates helper
export const getOptimisticVacation = (newData, queryClient, queryKey) => {
  const previousVacations = queryClient.getQueryData(queryKey)

  if (!previousVacations) return undefined

  return {
    ...previousVacations,
    data: {
      ...previousVacations.data,
      data: [newData, ...previousVacations.data.data],
    },
  }
}
