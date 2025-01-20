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
  department: id => [...adminKeys.departments(), "department", id],
  users: {
    all: () => [...adminKeys.all, "users"],
    lists: () => [...adminKeys.users.all(), "list"],
    list: filters => [...adminKeys.users.lists(), { ...filters }],
    detail: id => [...adminKeys.users.all(), "detail", id],
  },
  departmentMembers: {
    all: () => [...adminKeys.all, "department-members"],
    byDepartment: departmentId => [
      ...adminKeys.departmentMembers.all(),
      departmentId,
    ],
  },
}

// Queries
export const useGetDepartments = (options = {}) => {
  return useQuery({
    queryKey: adminKeys.departments(),
    queryFn: getDepartments,
    select: response => response.data.data,
    refetchOnWindowFocus: true,
    keepPreviousData: true,
    ...options,
  })
}

export const useGetAdminUsers = (filters = {}) => {
  return useQuery({
    queryKey: adminKeys.users.list(filters),
    queryFn: getUsers,
    select: response => response.data.data,
    staleTime: 30 * 1000, // Consider data fresh for 30 seconds
    keepPreviousData: true,
    refetchOnWindowFocus: true,
  })
}

export const useGetDepartmentMembers = (departmentId, options = {}) => {
  return useQuery({
    queryKey: adminKeys.departmentMembers.byDepartment(departmentId),
    queryFn: () => getDepartmentMembers(departmentId),
    select: response => response.data.members,
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
    onSuccess: (_, { departmentId }) => {
      queryClient.invalidateQueries({ queryKey: adminKeys.departments() })
      queryClient.invalidateQueries({
        queryKey: adminKeys.department(departmentId),
      })
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
        queryKey: adminKeys.department(departmentId),
      })
      queryClient.invalidateQueries({
        queryKey: adminKeys.departmentMembers.byDepartment(departmentId),
      })
    },
  })
}

export const useDeleteDepartment = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: id => deleteDepartment(id.department_id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: adminKeys.departments() })
    },
    onError: (error, id) => {
      console.log(error, id)
    },
  })
}

export const useDeleteUser = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: id => deleteUser(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: adminKeys.users.lists() })
    },
  })
}

export const useUpdateUser = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, data }) => updateUserById(id, data),
    onMutate: async ({ id, data }) => {
      // Cancel outgoing refetches for all possible user queries
      await queryClient.cancelQueries({ queryKey: adminKeys.users.all() })

      // Get all existing user queries
      const existingQueries = queryClient.getQueriesData({
        queryKey: adminKeys.users.lists(),
      })
      const previousQueries = new Map(existingQueries)

      // Format the optimistic update
      const updatedUserData = {
        ...data,
        department: data.department_id ? { id: data.department_id } : null,
        roles: Array.isArray(data.roles)
          ? data.roles.map(roleId => ({
              id: typeof roleId === "object" ? roleId.id : roleId,
            }))
          : [],
      }

      // Update all matching queries
      existingQueries.forEach(([queryKey]) => {
        queryClient.setQueryData(queryKey, old => {
          if (!old?.data?.data) return old
          return {
            ...old,
            data: {
              ...old.data,
              data: old.data.data.map(user =>
                user.id === id ? { ...user, ...updatedUserData } : user
              ),
            },
          }
        })
      })

      return { previousQueries }
    },
    onError: (err, _, context) => {
      // Restore all queries on error
      if (context?.previousQueries) {
        context.previousQueries.forEach((value, queryKey) => {
          queryClient.setQueryData(queryKey, value)
        })
      }
    },
    onSuccess: () => {
      // Invalidate all user-related queries
      queryClient.invalidateQueries({ queryKey: adminKeys.users.all() })
      queryClient.invalidateQueries({
        queryKey: adminKeys.departmentMembers.all(),
      })
    },
  })
}

export const useCreateUser = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: data => createUser(data),
    onMutate: async newUser => {
      // Cancel outgoing refetches
      await queryClient.cancelQueries({ queryKey: adminKeys.users.lists() })
      await queryClient.cancelQueries({ queryKey: adminKeys.users.all() })

      // Snapshot for rollback
      const previousUsers = queryClient.getQueryData(adminKeys.users.list())

      // Optimistically update
      const optimisticUser = {
        id: Date.now(),
        name: newUser.name,
        sur_name: newUser.sur_name,
        email: newUser.email,
        mobile_number: newUser.mobile_number,
        position: newUser.position,
        department: null,
        status: "pending",
        roles: [],
        created_at: new Date().toISOString(),
      }

      // Update all possible user list queries
      queryClient.setQueriesData({ queryKey: adminKeys.users.lists() }, old => {
        if (!old) return { data: { data: [optimisticUser] } }
        return {
          ...old,
          data: {
            ...old.data,
            data: [...(old.data?.data || []), optimisticUser],
          },
        }
      })

      return { previousUsers }
    },
    onError: (err, newUser, context) => {
      // Rollback on error
      if (context?.previousUsers) {
        queryClient.setQueriesData(
          { queryKey: adminKeys.users.lists() },
          context.previousUsers
        )
      }
    },
    onSuccess: () => {
      // Invalidate and refetch all user-related queries
      queryClient.invalidateQueries({ queryKey: adminKeys.users.all() })
      queryClient.invalidateQueries({
        queryKey: adminKeys.departmentMembers.all(),
      })
    },
  })
}

export const useApproveDepartmentMember = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ departmentId, userId }) =>
      approveDepartmentMember(departmentId, userId),
    onMutate: async ({ departmentId, userId }) => {
      await queryClient.cancelQueries({
        queryKey: adminKeys.users.lists(),
      })
      await queryClient.cancelQueries({
        queryKey: adminKeys.departmentMembers.byDepartment(departmentId),
      })

      const previousUsers = queryClient.getQueryData(adminKeys.users.lists())
      const previousMembers = queryClient.getQueryData(
        adminKeys.departmentMembers.byDepartment(departmentId)
      )

      // Update user status optimistically
      queryClient.setQueryData(adminKeys.users.lists(), old => ({
        ...old,
        users: old?.users?.map(user =>
          user.id === userId ? { ...user, status: "accepted" } : user
        ),
      }))

      return { previousUsers, previousMembers }
    },
    onError: (err, { departmentId }, context) => {
      if (context?.previousUsers) {
        queryClient.setQueryData(adminKeys.users.lists(), context.previousUsers)
      }
      if (context?.previousMembers) {
        queryClient.setQueryData(
          adminKeys.departmentMembers.byDepartment(departmentId),
          context.previousMembers
        )
      }
    },
    onSuccess: (_, { departmentId }) => {
      queryClient.invalidateQueries({
        queryKey: adminKeys.departmentMembers.byDepartment(departmentId),
      })
      queryClient.invalidateQueries({ queryKey: adminKeys.users.lists() })
    },
  })
}

export const useRejectDepartmentMember = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ departmentId, userId }) =>
      rejectDepartmentMember(departmentId, userId),
    onMutate: async ({ departmentId, userId }) => {
      await queryClient.cancelQueries({
        queryKey: adminKeys.users.lists(),
      })
      await queryClient.cancelQueries({
        queryKey: adminKeys.departmentMembers.byDepartment(departmentId),
      })

      const previousUsers = queryClient.getQueryData(adminKeys.users.lists())
      const previousMembers = queryClient.getQueryData(
        adminKeys.departmentMembers.byDepartment(departmentId)
      )

      // Update user status optimistically
      queryClient.setQueryData(adminKeys.users.lists(), old => ({
        ...old,
        users: old?.users?.map(user =>
          user.id === userId ? { ...user, status: "rejected" } : user
        ),
      }))

      return { previousUsers, previousMembers }
    },
    onError: (err, { departmentId }, context) => {
      if (context?.previousUsers) {
        queryClient.setQueryData(adminKeys.users.lists(), context.previousUsers)
      }
      if (context?.previousMembers) {
        queryClient.setQueryData(
          adminKeys.departmentMembers.byDepartment(departmentId),
          context.previousMembers
        )
      }
    },
    onSuccess: (_, { departmentId }) => {
      queryClient.invalidateQueries({
        queryKey: adminKeys.departmentMembers.byDepartment(departmentId),
      })
      queryClient.invalidateQueries({ queryKey: adminKeys.users.lists() })
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
        queryKey: adminKeys.departmentMembers.byDepartment(departmentId),
      })
      queryClient.invalidateQueries({ queryKey: adminKeys.users.lists() })
    },
  })
}
