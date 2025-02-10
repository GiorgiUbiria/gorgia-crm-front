import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import * as authService from "../services/auth"
import { queryKeys } from "./keys"

export const useCurrentUser = () => {
  return useQuery({
    queryKey: queryKeys.auth.user(),
    queryFn: () => authService.getCurrentUser(),
    staleTime: 5 * 60 * 1000,
  })
}

export const useLogin = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (credentials) => authService.login(credentials),
    onSuccess: (data) => {
      queryClient.setQueryData(queryKeys.auth.user(), data.user)
    },
  })
}

export const useLogout = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: () => authService.logout(),
    onSuccess: () => {
      queryClient.setQueryData(queryKeys.auth.user(), null)
      queryClient.clear()
    },
  })
}

export const useUpdatePassword = () => {
  return useMutation({
    mutationFn: (data) => authService.updatePassword(data),
  })
}

export const useResetPassword = () => {
  return useMutation({
    mutationFn: (data) => authService.resetPassword(data),
  })
}

export const useForgotPassword = () => {
  return useMutation({
    mutationFn: (data) => authService.forgotPassword(data),
  })
} 