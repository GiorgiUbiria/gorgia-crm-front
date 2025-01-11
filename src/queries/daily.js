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
    onSuccess: data => {
      queryClient.invalidateQueries({
        queryKey: dailyKeys.departmentHead.lists(),
      })

      queryClient.setQueryData(
        dailyKeys.departmentHead.detail(data.daily.id),
        data
      )

      const updateList = oldData => {
        if (!oldData?.dailies) return oldData
        return {
          ...oldData,
          dailies: [data.daily, ...oldData.dailies],
          total: (oldData.total || 0) + 1,
        }
      }

      queryClient.setQueriesData(
        { queryKey: dailyKeys.departmentHead.lists() },
        updateList
      )
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
    onSuccess: (data, { id }) => {
      queryClient.setQueryData(dailyKeys.departmentHead.detail(id), data)

      const updateList = oldData => {
        if (!oldData?.dailies) return oldData
        return {
          ...oldData,
          dailies: oldData.dailies.map(daily =>
            daily.id === id ? data.daily : daily
          ),
        }
      }

      queryClient.setQueriesData(
        { queryKey: dailyKeys.departmentHead.lists() },
        updateList
      )
    },
  })
}

export const useUpdateRegularDaily = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, data }) => updateRegularDaily(id, data),
    onSuccess: (data, { id }) => {
      queryClient.setQueryData(dailyKeys.regular.detail(id), data)

      const updateList = oldData => {
        if (!oldData?.dailies) return oldData
        return {
          ...oldData,
          dailies: oldData.dailies.map(daily =>
            daily.id === id ? data.daily : daily
          ),
        }
      }

      queryClient.setQueriesData(
        { queryKey: dailyKeys.regular.lists() },
        updateList
      )
    },
  })
}

export const useDeleteDepartmentHeadDaily = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: deleteDepartmentHeadDaily,
    onSuccess: (_, id) => {
      queryClient.removeQueries({
        queryKey: dailyKeys.departmentHead.detail(id),
      })

      const updateList = oldData => {
        if (!oldData?.dailies) return oldData
        return {
          ...oldData,
          dailies: oldData.dailies.filter(daily => daily.id !== id),
          total: Math.max(0, (oldData.total || 0) - 1),
        }
      }

      queryClient.setQueriesData(
        { queryKey: dailyKeys.departmentHead.lists() },
        updateList
      )
    },
  })
}

export const useDeleteRegularDaily = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: deleteRegularDaily,
    onSuccess: (_, id) => {
      queryClient.removeQueries({
        queryKey: dailyKeys.regular.detail(id),
      })

      const updateList = oldData => {
        if (!oldData?.dailies) return oldData
        return {
          ...oldData,
          dailies: oldData.dailies.filter(daily => daily.id !== id),
          total: Math.max(0, (oldData.total || 0) - 1),
        }
      }

      queryClient.setQueriesData(
        { queryKey: dailyKeys.regular.lists() },
        updateList
      )
    },
  })
}
