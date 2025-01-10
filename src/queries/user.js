import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import {
  changePassword,
  updateUser,
  updateUserIdNumberById,
  updateUserIdNumber,
  fetchUser,
  fetchUsers,
} from "../services/user"

// Query keys
export const userKeys = {
  all: ["user"],
  profile: () => [...userKeys.all, "profile"],
  users: () => [...userKeys.all, "list"],
}

// Queries
export const useGetUser = (options = {}) => {
  return useQuery({
    queryKey: userKeys.profile(),
    queryFn: fetchUser,
    select: response => response.data,
    ...options,
  })
}

export const useGetUsers = (options = {}) => {
  return useQuery({
    queryKey: userKeys.users(),
    queryFn: fetchUsers,
    select: response => response.data?.data || [],
    ...options,
  })
}

// Mutations
export const useChangePassword = () => {
  return useMutation({
    mutationFn: data => changePassword(data),
  })
}

export const useUpdateUser = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: data => updateUser(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: userKeys.profile() })
    },
  })
}

export const useUpdateUserIdNumberById = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ data, id }) => updateUserIdNumberById(data, id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: userKeys.all })
    },
  })
}

export const useUpdateUserIdNumber = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: data => updateUserIdNumber(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: userKeys.profile() })
    },
  })
}
