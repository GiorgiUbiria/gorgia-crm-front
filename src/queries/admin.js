import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import {
  getDepartments,
  getUsers,
  getDepartmentMembers,
  createDepartment,
  updateDepartment,
  assignHead,
  deleteDepartment,
  deleteUser,
  updateUserById,
  createUser,
  approveDepartmentMember,
  rejectDepartmentMember,
  updateDepartmentMember,
} from "../services/admin/department"

// Query keys
export const adminKeys = {
  all: ["admin"],
  departments: () => [...adminKeys.all, "departments"],
  users: () => [...adminKeys.all, "users"],
  departmentMembers: departmentId => [
    ...adminKeys.all,
    "department-members",
    departmentId,
  ],
}

// Queries
export const useGetDepartments = (options = {}) => {
  return useQuery({
    queryKey: adminKeys.departments(),
    queryFn: getDepartments,
    select: response => response.data.data,
    ...options,
  })
}

export const useGetAdminUsers = (options = {}) => {
  return useQuery({
    queryKey: adminKeys.users(),
    queryFn: getUsers,
    select: response => response.data.users,
    ...options,
  })
}

export const useGetDepartmentMembers = (departmentId, options = {}) => {
  return useQuery({
    queryKey: adminKeys.departmentMembers(departmentId),
    queryFn: () => getDepartmentMembers(departmentId),
    select: response => response.data.members,
    enabled: !!departmentId,
    ...options,
  })
}

// Mutations
export const useCreateDepartment = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: data => createDepartment(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: adminKeys.departments() })
    },
  })
}

export const useUpdateDepartment = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: data => updateDepartment(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: adminKeys.departments() })
    },
  })
}

export const useAssignHead = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ departmentId, userId }) => assignHead(departmentId, userId),
    onSuccess: (_, { departmentId }) => {
      queryClient.invalidateQueries({ queryKey: adminKeys.departments() })
      queryClient.invalidateQueries({
        queryKey: adminKeys.departmentMembers(departmentId),
      })
    },
  })
}

export const useDeleteDepartment = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: id => deleteDepartment(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: adminKeys.departments() })
    },
  })
}

export const useDeleteUser = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: id => deleteUser(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: adminKeys.users() })
    },
  })
}

export const useUpdateUser = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, data }) => updateUserById(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: adminKeys.users() })
      queryClient.invalidateQueries({
        queryKey: adminKeys.departmentMembers(),
      })
    },
  })
}

export const useCreateUser = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: data => createUser(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: adminKeys.users() })
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
        queryKey: adminKeys.departmentMembers(departmentId),
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
        queryKey: adminKeys.departmentMembers(departmentId),
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
        queryKey: adminKeys.departmentMembers(departmentId),
      })
    },
  })
} 