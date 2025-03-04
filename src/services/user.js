import defaultInstance from "../plugins/axios"

export const changePassword = async data => {
  return defaultInstance.post("/api/change-password", data)
}

export const updateUser = async data => {
  return defaultInstance.post("/api/update-profile", data, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  })
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

export const fetchUsers = async () => {
  const response = await defaultInstance.get("/api/admin/users")
  return response
}

export const listUsers = async () => {
  const response = await defaultInstance.get("/api/list-users")
  console.log("List users response", response)
  return response
}
