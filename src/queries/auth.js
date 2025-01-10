import { useQuery, useMutation } from "@tanstack/react-query"
import {
  getDepartments,
  getPurchaseDepartments,
  registerUser,
  loginUser,
  forgotPassword,
  logoutUser,
} from "../services/auth"

// Query keys
export const authKeys = {
  all: ["auth"],
  departments: () => [...authKeys.all, "departments"],
  purchaseDepartments: () => [...authKeys.all, "purchase-departments"],
}

// Queries
export const useGetDepartments = (options = {}) => {
  return useQuery({
    queryKey: authKeys.departments(),
    queryFn: getDepartments,
    select: response => response.data,
    ...options,
  })
}

export const useGetPurchaseDepartments = (options = {}) => {
  return useQuery({
    queryKey: authKeys.purchaseDepartments(),
    queryFn: getPurchaseDepartments,
    select: response => response.data,
    ...options,
  })
}

// Mutations
export const useRegister = () => {
  return useMutation({
    mutationFn: data => registerUser(data),
  })
}

export const useLogin = () => {
  return useMutation({
    mutationFn: data => loginUser(data),
  })
}

export const useForgotPassword = () => {
  return useMutation({
    mutationFn: data => forgotPassword(data),
  })
}

export const useLogout = () => {
  return useMutation({
    mutationFn: logoutUser,
  })
} 