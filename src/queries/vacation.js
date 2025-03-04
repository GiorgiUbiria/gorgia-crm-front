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

export const vacationKeys = {
  all: ["vacations"],
  lists: filters => [...vacationKeys.all, "list", filters],
  listDepartment: () => [...vacationKeys.all, "department"],
  details: id => [...vacationKeys.all, "detail", id],
  balance: () => [...vacationKeys.all, "balance"],
  userVacations: () => [...vacationKeys.all, "user"],
}

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
    mutationFn: ({ id, data }) => {
      if (!data?.cancellation_reason?.trim()) {
        throw new Error('Cancellation reason is required')
      }
      return cancelVacation(id, data)
    },
    onMutate: async ({ id, data }) => {
      await queryClient.cancelQueries({ queryKey: vacationKeys.userVacations() })

      const previousVacations = queryClient.getQueryData(vacationKeys.userVacations())

      queryClient.setQueryData(vacationKeys.userVacations(), old => {
        if (!old?.data?.data) return old
        return {
          ...old,
          data: {
            ...old.data,
            data: old.data.data.map(vacation =>
              vacation.id === id
                ? {
                    ...vacation,
                    status: 'cancelled',
                    cancellation_reason: data.cancellation_reason,
                    cancelled_at: new Date().toISOString()
                  }
                : vacation
            )
          }
        }
      })

      return { previousVacations }
    },
    onError: (err, variables, context) => {
      console.error('Failed to cancel vacation:', err)
      if (context?.previousVacations) {
        queryClient.setQueryData(vacationKeys.userVacations(), context.previousVacations)
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: vacationKeys.userVacations() })
    }
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
