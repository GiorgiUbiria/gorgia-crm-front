import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import {
  getVacations,
  getVacationBalance,
  createVacation,
  createVacationForEmployee,
  updateVacationStatus,
  cancelVacation,
  getVacationDetails,
} from "../services/admin/vacation"
import { getCurrentUserVocations } from "../services/vacation"

// Query keys
export const vacationKeys = {
  all: ["vacations"],
  lists: () => [...vacationKeys.all, "list"],
  list: filters => [...vacationKeys.lists(), { filters }],
  details: id => [...vacationKeys.all, "detail", id],
  balance: () => [...vacationKeys.all, "balance"],
  userVacations: () => [...vacationKeys.all, "user"],
}

// Queries
export const useVacationBalance = () => {
  return useQuery({
    queryKey: vacationKeys.balance(),
    queryFn: getVacationBalance,
    staleTime: 1000 * 60 * 5, // Consider data fresh for 5 minutes
    cacheTime: 1000 * 60 * 30, // Cache for 30 minutes
  })
}

export const useVacations = (filters = {}) => {
  return useQuery({
    queryKey: vacationKeys.list(filters),
    queryFn: () => getVacations(filters),
    staleTime: 1000 * 60 * 2, // Consider data fresh for 2 minutes
    cacheTime: 1000 * 60 * 15, // Cache for 15 minutes
  })
}

export const useUserVacations = () => {
  return useQuery({
    queryKey: vacationKeys.userVacations(),
    queryFn: getCurrentUserVocations,
    staleTime: 1000 * 60 * 2, // Consider data fresh for 2 minutes
    cacheTime: 1000 * 60 * 15, // Cache for 15 minutes
  })
}

export const useVacationDetails = (id) => {
  return useQuery({
    queryKey: vacationKeys.details(id),
    queryFn: () => getVacationDetails(id),
    enabled: !!id, // Only run if id is provided
    staleTime: 1000 * 60 * 5, // Consider data fresh for 5 minutes
  })
}

// Mutations
export const useCreateVacation = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: createVacation,
    onSuccess: () => {
      // Invalidate relevant queries
      queryClient.invalidateQueries({ queryKey: vacationKeys.userVacations() })
      queryClient.invalidateQueries({ queryKey: vacationKeys.balance() })
    },
  })
}

export const useCreateVacationForEmployee = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: createVacationForEmployee,
    onSuccess: () => {
      // Invalidate relevant queries
      queryClient.invalidateQueries({ queryKey: vacationKeys.lists() })
      queryClient.invalidateQueries({ queryKey: vacationKeys.balance() })
    },
  })
}

export const useUpdateVacationStatus = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, status }) => updateVacationStatus(id, status),
    onSuccess: (_, variables) => {
      // Invalidate specific vacation and lists
      queryClient.invalidateQueries({ queryKey: vacationKeys.details(variables.id) })
      queryClient.invalidateQueries({ queryKey: vacationKeys.lists() })
      queryClient.invalidateQueries({ queryKey: vacationKeys.userVacations() })
    },
  })
}

export const useCancelVacation = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, data }) => cancelVacation(id, data),
    onSuccess: (_, variables) => {
      // Invalidate specific vacation and lists
      queryClient.invalidateQueries({ queryKey: vacationKeys.details(variables.id) })
      queryClient.invalidateQueries({ queryKey: vacationKeys.lists() })
      queryClient.invalidateQueries({ queryKey: vacationKeys.userVacations() })
      queryClient.invalidateQueries({ queryKey: vacationKeys.balance() })
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