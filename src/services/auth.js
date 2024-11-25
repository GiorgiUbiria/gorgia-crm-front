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

export const forgotPassword = async data => {
  return defaultInstance.post("/api/forgot-password", data)
}

export const logoutUser = async () => {
  return defaultInstance.post("/api/logout")
}
