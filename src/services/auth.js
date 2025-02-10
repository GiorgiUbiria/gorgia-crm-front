import defaultInstance from "plugins/axios"

export const getDepartments = async () => {
  return defaultInstance.get("/api/departments")
}

export const getPurchaseDepartments = async () => {
  return defaultInstance.get("/api/departments/purchase")
}

export const registerUser = async data => {
  return defaultInstance.post("/api/register", data)
}

export const loginUser = async data => {
  return defaultInstance.post("/api/login", data)
}

export const login = async data => {
  const response = await defaultInstance.post("/api/login", data)
  if (response.data?.token) {
    sessionStorage.setItem("authUser", JSON.stringify(response.data.user))
    sessionStorage.setItem("token", response.data.token)
  }
  return response
}

export const logout = async () => {
  const response = await defaultInstance.post("/api/logout")
  sessionStorage.removeItem("authUser")
  sessionStorage.removeItem("token")
  return response
}

export const getCurrentUser = async () => {
  return defaultInstance.get("/api/user")
}

export const forgotPassword = async data => {
  return defaultInstance.post("/api/forgot-password", data)
}

export const resetPassword = async data => {
  return defaultInstance.post("/api/reset-password", data)
}

export const updatePassword = async data => {
  return defaultInstance.post("/api/update-password", data)
}

export const logoutUser = async () => {
  const response = await defaultInstance.post("/api/logout")
  sessionStorage.removeItem("authUser")
  sessionStorage.removeItem("token")
  return response
}
