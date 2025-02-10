import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import * as userService from "../services/user"
import * as userRolesService from "../services/userRoles"
import { queryKeys } from "./keys"

export const useUsers = (filters = {}) => {
  return useQuery({
    queryKey: queryKeys.users.list(filters),
    queryFn: () => userService.getUsers(filters),
    staleTime: 5 * 60 * 1000,
  })
}

export const useUser = (id) => {
  return useQuery({
    queryKey: queryKeys.users.detail(id),
    queryFn: () => userService.getUser(id),
    enabled: Boolean(id),
  })
}

export const useCreateUser = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (data) => userService.createUser(data),
    onSuccess: () => {
      queryClient.invalidateQueries(queryKeys.users.lists())
    },
  })
}

export const useUpdateUser = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, data }) => userService.updateUser(id, data),
    onMutate: async ({ id, data }) => {
      await queryClient.cancelQueries(queryKeys.users.detail(id))

      const previousUser = queryClient.getQueryData(queryKeys.users.detail(id))

      queryClient.setQueryData(
        queryKeys.users.detail(id),
        old => ({ ...old, ...data })
      )

      return { previousUser }
    },
    onError: (err, { id }, context) => {
      queryClient.setQueryData(
        queryKeys.users.detail(id),
        context?.previousUser
      )
    },
    onSettled: (_, __, { id }) => {
      queryClient.invalidateQueries(queryKeys.users.detail(id))
      queryClient.invalidateQueries(queryKeys.users.lists())
    },
  })
}

export const useDeleteUser = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (id) => userService.deleteUser(id),
    onSuccess: () => {
      queryClient.invalidateQueries(queryKeys.users.lists())
    },
  })
}

export const useUserRoles = (filters = {}) => {
  return useQuery({
    queryKey: queryKeys.users.roles.list(filters),
    queryFn: () => userRolesService.getUserRoles(filters),
    staleTime: 5 * 60 * 1000,
  })
}

export const useAssignUserRole = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ userId, roleId }) => userRolesService.assignUserRole(userId, roleId),
    onSuccess: (_, { userId }) => {
      queryClient.invalidateQueries(queryKeys.users.detail(userId))
      queryClient.invalidateQueries(queryKeys.users.roles.lists())
    },
  })
}

export const useRemoveUserRole = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ userId, roleId }) => userRolesService.removeUserRole(userId, roleId),
    onSuccess: (_, { userId }) => {
      queryClient.invalidateQueries(queryKeys.users.detail(userId))
      queryClient.invalidateQueries(queryKeys.users.roles.lists())
    },
  })
}

export const useUpdateUserRoles = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ userId, roleIds }) => userRolesService.updateUserRoles(userId, roleIds),
    onMutate: async ({ userId, roleIds }) => {
      await queryClient.cancelQueries(queryKeys.users.detail(userId))

      const previousUser = queryClient.getQueryData(queryKeys.users.detail(userId))

      queryClient.setQueryData(
        queryKeys.users.detail(userId),
        old => ({
          ...old,
          roles: roleIds.map(id => ({ id }))
        })
      )

      return { previousUser }
    },
    onError: (err, { userId }, context) => {
      queryClient.setQueryData(
        queryKeys.users.detail(userId),
        context?.previousUser
      )
    },
    onSettled: (_, __, { userId }) => {
      queryClient.invalidateQueries(queryKeys.users.detail(userId))
      queryClient.invalidateQueries(queryKeys.users.roles.lists())
    },
  })
} 