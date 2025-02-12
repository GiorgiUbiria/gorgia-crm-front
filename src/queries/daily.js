import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import {
  getDepartmentHeadDailies,
  getMyDepartmentHeadDailies,
  getDepartmentHeadDaily,
  createDepartmentHeadDaily,
  updateDepartmentHeadDaily,
  deleteDepartmentHeadDaily,
  getRegularDailies,
  getMyRegularDailies,
  createRegularDaily,
  updateRegularDaily,
  deleteRegularDaily,
  getAllDailies,
} from "../services/daily"

export const dailyKeys = {
  all: ["dailies"],
  lists: () => [...dailyKeys.all, "list"],
  list: filters => [...dailyKeys.lists(), { ...filters }],
  details: () => [...dailyKeys.all, "detail"],
  detail: id => [...dailyKeys.details(), id],
  departmentHead: {
    all: () => [...dailyKeys.all, "department-head"],
    lists: () => [...dailyKeys.departmentHead.all(), "list"],
    list: filters => [...dailyKeys.departmentHead.lists(), { ...filters }],
    my: filters => [...dailyKeys.departmentHead.lists(), "my", { ...filters }],
    detail: id => [...dailyKeys.departmentHead.all(), "detail", id],
  },
  regular: {
    all: () => [...dailyKeys.all, "regular"],
    lists: () => [...dailyKeys.regular.all(), "list"],
    list: filters => [...dailyKeys.regular.lists(), { ...filters }],
    my: filters => [...dailyKeys.regular.lists(), "my", { ...filters }],
    detail: id => [...dailyKeys.regular.all(), "detail", id],
  },
}

export const useGetAllDailies = (params = {}, options = {}) => {
  return useQuery({
    queryKey: dailyKeys.list(params),
    queryFn: () => getAllDailies(params),
    ...options,
  })
}

export const useGetDepartmentHeadDailies = (params = {}, options = {}) => {
  return useQuery({
    queryKey: dailyKeys.departmentHead.list(params),
    queryFn: () => getDepartmentHeadDailies(params),
    ...options,
  })
}

export const useGetMyDepartmentHeadDailies = (params = {}, options = {}) => {
  return useQuery({
    queryKey: dailyKeys.departmentHead.my(params),
    queryFn: () => getMyDepartmentHeadDailies(params),
    ...options,
  })
}

export const useGetDepartmentHeadDaily = (id, options = {}) => {
  return useQuery({
    queryKey: dailyKeys.departmentHead.detail(id),
    queryFn: () => getDepartmentHeadDaily(id),
    ...options,
    enabled: !!id,
  })
}

export const useGetRegularDailies = (params = {}, options = {}) => {
  return useQuery({
    queryKey: dailyKeys.regular.list(params),
    queryFn: () => getRegularDailies(params),
    ...options,
  })
}

export const useGetMyRegularDailies = (params = {}, options = {}) => {
  return useQuery({
    queryKey: dailyKeys.regular.my(params),
    queryFn: () => getMyRegularDailies(params),
    ...options,
  })
}

export const useCreateDepartmentHeadDaily = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: createDepartmentHeadDaily,
    onMutate: async data => {
      // Cancel any outgoing refetches
      await queryClient.cancelQueries({
        queryKey: dailyKeys.departmentHead.lists(),
      })

      // Snapshot the previous value
      const previousDailies = queryClient.getQueryData(
        dailyKeys.departmentHead.list({})
      )

      // Create an optimistic daily entry
      const optimisticDaily = {
        id: `temp-${Date.now()}`, // temporary ID
        ...data,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        status: "pending",
      }

      // Optimistically update lists
      queryClient.setQueriesData(
        { queryKey: dailyKeys.departmentHead.lists() },
        old => {
          if (!old?.dailies) return old
          return {
            ...old,
            dailies: [optimisticDaily, ...old.dailies],
            total: (old.total || 0) + 1,
          }
        }
      )

      return { previousDailies }
    },
    onError: (err, _, context) => {
      // Revert the optimistic update on error
      if (context?.previousDailies) {
        queryClient.setQueriesData(
          { queryKey: dailyKeys.departmentHead.lists() },
          context.previousDailies
        )
      }
    },
    onSettled: () => {
      // Always refetch after mutation settles
      queryClient.invalidateQueries({
        queryKey: dailyKeys.departmentHead.lists(),
      })
      // Also invalidate the all dailies list if it exists
      queryClient.invalidateQueries({
        queryKey: dailyKeys.all,
      })
    },
  })
}

export const useCreateRegularDaily = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: createRegularDaily,
    onSuccess: data => {
      queryClient.invalidateQueries({
        queryKey: dailyKeys.regular.lists(),
      })

      queryClient.setQueryData(dailyKeys.regular.detail(data.daily.id), data)

      const updateList = oldData => {
        if (!oldData?.dailies) return oldData
        return {
          ...oldData,
          dailies: [data.daily, ...oldData.dailies],
          total: (oldData.total || 0) + 1,
        }
      }

      queryClient.setQueriesData(
        { queryKey: dailyKeys.regular.lists() },
        updateList
      )
    },
  })
}

export const useUpdateDepartmentHeadDaily = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, data }) => updateDepartmentHeadDaily(id, data),
    onMutate: async ({ id, data }) => {
      // Cancel any outgoing refetches
      await queryClient.cancelQueries({
        queryKey: dailyKeys.departmentHead.detail(id),
      })
      await queryClient.cancelQueries({
        queryKey: dailyKeys.departmentHead.lists(),
      })

      // Snapshot the previous value
      const previousDaily = queryClient.getQueryData(
        dailyKeys.departmentHead.detail(id)
      )

      // Optimistically update the detail view
      queryClient.setQueryData(dailyKeys.departmentHead.detail(id), old => ({
        ...old,
        daily: {
          ...(old?.daily || {}),
          ...data,
          updated_at: new Date().toISOString(),
        },
      }))

      // Optimistically update any lists that contain this daily
      queryClient.setQueriesData(
        { queryKey: dailyKeys.departmentHead.lists() },
        old => {
          if (!old?.dailies) return old
          return {
            ...old,
            dailies: old.dailies.map(daily =>
              daily.id === id
                ? {
                    ...daily,
                    ...data,
                    updated_at: new Date().toISOString(),
                  }
                : daily
            ),
          }
        }
      )

      return { previousDaily }
    },
    onError: (err, { id }, context) => {
      // Revert the optimistic update on error
      if (context?.previousDaily) {
        queryClient.setQueryData(
          dailyKeys.departmentHead.detail(id),
          context.previousDaily
        )
      }
      // Invalidate to ensure consistency
      queryClient.invalidateQueries({
        queryKey: dailyKeys.departmentHead.detail(id),
      })
      queryClient.invalidateQueries({
        queryKey: dailyKeys.departmentHead.lists(),
      })
    },
    onSettled: (_, __, variables) => {
      // Always refetch after mutation settles to ensure consistency
      queryClient.invalidateQueries({
        queryKey: dailyKeys.departmentHead.detail(variables.id),
      })
      queryClient.invalidateQueries({
        queryKey: dailyKeys.departmentHead.lists(),
      })
      // Also invalidate the all dailies list if it exists
      queryClient.invalidateQueries({
        queryKey: dailyKeys.all,
      })
    },
  })
}

export const useUpdateRegularDaily = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, data }) => updateRegularDaily(id, data),
    onMutate: async ({ id, data }) => {
      // Cancel any outgoing refetches
      await queryClient.cancelQueries({
        queryKey: dailyKeys.regular.detail(id),
      })
      await queryClient.cancelQueries({
        queryKey: dailyKeys.regular.lists(),
      })

      // Snapshot the previous value
      const previousDaily = queryClient.getQueryData(
        dailyKeys.regular.detail(id)
      )

      // Optimistically update the detail view
      queryClient.setQueryData(dailyKeys.regular.detail(id), old => ({
        ...old,
        daily: {
          ...(old?.daily || {}),
          ...data,
          updated_at: new Date().toISOString(),
        },
      }))

      // Optimistically update any lists that contain this daily
      queryClient.setQueriesData(
        { queryKey: dailyKeys.regular.lists() },
        old => {
          if (!old?.dailies) return old
          return {
            ...old,
            dailies: old.dailies.map(daily =>
              daily.id === id
                ? {
                    ...daily,
                    ...data,
                    updated_at: new Date().toISOString(),
                  }
                : daily
            ),
          }
        }
      )

      return { previousDaily }
    },
    onError: (err, { id }, context) => {
      // Revert the optimistic update on error
      if (context?.previousDaily) {
        queryClient.setQueryData(
          dailyKeys.regular.detail(id),
          context.previousDaily
        )
      }
      // Invalidate to ensure consistency
      queryClient.invalidateQueries({
        queryKey: dailyKeys.regular.detail(id),
      })
      queryClient.invalidateQueries({
        queryKey: dailyKeys.regular.lists(),
      })
    },
    onSettled: (_, __, variables) => {
      // Always refetch after mutation settles
      queryClient.invalidateQueries({
        queryKey: dailyKeys.regular.detail(variables.id),
      })
      queryClient.invalidateQueries({
        queryKey: dailyKeys.regular.lists(),
      })
      // Also invalidate the all dailies list if it exists
      queryClient.invalidateQueries({
        queryKey: dailyKeys.all,
      })
    },
  })
}

export const useDeleteDepartmentHeadDaily = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: deleteDepartmentHeadDaily,
    onMutate: async id => {
      // Cancel any outgoing refetches
      await queryClient.cancelQueries({
        queryKey: dailyKeys.departmentHead.detail(id),
      })
      await queryClient.cancelQueries({
        queryKey: dailyKeys.departmentHead.lists(),
      })

      // Snapshot the previous values
      const previousDaily = queryClient.getQueryData(
        dailyKeys.departmentHead.detail(id)
      )
      const previousLists = queryClient.getQueriesData({
        queryKey: dailyKeys.departmentHead.lists(),
      })

      // Remove the daily from detail cache
      queryClient.removeQueries({
        queryKey: dailyKeys.departmentHead.detail(id),
      })

      // Optimistically update lists
      queryClient.setQueriesData(
        { queryKey: dailyKeys.departmentHead.lists() },
        old => {
          if (!old?.dailies) return old
          return {
            ...old,
            dailies: old.dailies.filter(daily => daily.id !== id),
            total: Math.max(0, (old.total || 0) - 1),
          }
        }
      )

      return { previousDaily, previousLists }
    },
    onError: (err, id, context) => {
      // Restore the detail cache
      if (context?.previousDaily) {
        queryClient.setQueryData(
          dailyKeys.departmentHead.detail(id),
          context.previousDaily
        )
      }
      // Restore all list caches
      if (context?.previousLists) {
        context.previousLists.forEach(([queryKey, value]) => {
          queryClient.setQueryData(queryKey, value)
        })
      }
    },
    onSettled: () => {
      // Always refetch after mutation settles
      queryClient.invalidateQueries({
        queryKey: dailyKeys.departmentHead.lists(),
      })
      queryClient.invalidateQueries({
        queryKey: dailyKeys.all,
      })
    },
  })
}

export const useDeleteRegularDaily = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: deleteRegularDaily,
    onMutate: async id => {
      // Cancel any outgoing refetches
      await queryClient.cancelQueries({
        queryKey: dailyKeys.regular.detail(id),
      })
      await queryClient.cancelQueries({
        queryKey: dailyKeys.regular.lists(),
      })

      // Snapshot the previous values
      const previousDaily = queryClient.getQueryData(
        dailyKeys.regular.detail(id)
      )
      const previousLists = queryClient.getQueriesData({
        queryKey: dailyKeys.regular.lists(),
      })

      // Remove the daily from detail cache
      queryClient.removeQueries({
        queryKey: dailyKeys.regular.detail(id),
      })

      // Optimistically update lists
      queryClient.setQueriesData(
        { queryKey: dailyKeys.regular.lists() },
        old => {
          if (!old?.dailies) return old
          return {
            ...old,
            dailies: old.dailies.filter(daily => daily.id !== id),
            total: Math.max(0, (old.total || 0) - 1),
          }
        }
      )

      return { previousDaily, previousLists }
    },
    onError: (err, id, context) => {
      // Restore the detail cache
      if (context?.previousDaily) {
        queryClient.setQueryData(
          dailyKeys.regular.detail(id),
          context.previousDaily
        )
      }
      // Restore all list caches
      if (context?.previousLists) {
        context.previousLists.forEach(([queryKey, value]) => {
          queryClient.setQueryData(queryKey, value)
        })
      }
    },
    onSettled: () => {
      // Always refetch after mutation settles
      queryClient.invalidateQueries({
        queryKey: dailyKeys.regular.lists(),
      })
      queryClient.invalidateQueries({
        queryKey: dailyKeys.all,
      })
    },
  })
}
