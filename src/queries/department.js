import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import {
  getDepartments,
  getPublicDepartments,
  getDepartmentMembers,
  createDepartment,
  updateDepartment,
  assignHead,
  deleteDepartment,
  approveDepartmentMember,
  rejectDepartmentMember,
  updateDepartmentMember,
} from "../services/admin/department"

export const departmentKeys = {
  all: ["departments"],
  list: () => [...departmentKeys.all, "list"],
  public: () => [...departmentKeys.all, "public"],
  members: departmentId => [...departmentKeys.all, "members", departmentId],
  detail: id => [...departmentKeys.all, "detail", id],
}

export const useGetDepartments = (options = {}) => {
  return useQuery({
    queryKey: departmentKeys.list(),
    queryFn: getDepartments,
    select: response => response.data,
    ...options,
  })
}

export const useGetPublicDepartments = (options = {}) => {
  return useQuery({
    queryKey: departmentKeys.public(),
    queryFn: getPublicDepartments,
    select: response => response.data,
    ...options,
  })
}

export const useGetDepartmentMembers = (departmentId, options = {}) => {
  return useQuery({
    queryKey: departmentKeys.members(departmentId),
    queryFn: () => getDepartmentMembers(departmentId),
    select: response => response.data,
    enabled: !!departmentId,
    ...options,
  })
}

export const useCreateDepartment = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: createDepartment,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: departmentKeys.all })
    },
  })
}

export const useUpdateDepartment = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: updateDepartment,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: departmentKeys.all })
    },
  })
}

export const useAssignHead = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ departmentId, userId }) => assignHead(departmentId, userId),
    onSuccess: (_, { departmentId }) => {
      queryClient.invalidateQueries({ queryKey: departmentKeys.all })
      queryClient.invalidateQueries({
        queryKey: departmentKeys.members(departmentId),
      })
    },
  })
}

export const useDeleteDepartment = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: deleteDepartment,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: departmentKeys.all })
    },
  })
}

export const useApproveDepartmentMember = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ departmentId, userId }) =>
      approveDepartmentMember(departmentId, userId),
    onSuccess: (_, { departmentId }) => {
      queryClient.invalidateQueries({
        queryKey: departmentKeys.members(departmentId),
      })
    },
  })
}

export const useRejectDepartmentMember = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ departmentId, userId }) =>
      rejectDepartmentMember(departmentId, userId),
    onSuccess: (_, { departmentId }) => {
      queryClient.invalidateQueries({
        queryKey: departmentKeys.members(departmentId),
      })
    },
  })
}

export const useUpdateDepartmentMember = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ departmentId, userId, data }) =>
      updateDepartmentMember(departmentId, userId, data),
    onSuccess: (_, { departmentId }) => {
      queryClient.invalidateQueries({
        queryKey: departmentKeys.members(departmentId),
      })
    },
  })
}
