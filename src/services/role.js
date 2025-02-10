import defaultInstance from "../plugins/axios"

export const getRoles = async () => {
  return defaultInstance.get("/api/roles")
}

export const getUserRoles = async userId => {
  return defaultInstance.get(`/api/users/${userId}/roles`)
}

export const updateUserRoles = async (userId, roles) => {
  return defaultInstance.put(`/api/users/${userId}/roles`, { roles })
}

export const updateUserIdNumberById = async (data, id) => {
  return defaultInstance.put(`/api/hr-documents/update_user/${id}`, data)
}

export const updateUserIdNumber = async data => {
  return defaultInstance.put(`/api/hr-documents/update_user`, data)
}

export const fetchUser = async () => {
  return defaultInstance.get("/api/user")
}
