import defaultInstance from "../../plugins/axios"

export const getDepartments = async () => {
  return defaultInstance.get("/api/admin/department/list")
}

export const createDepartment = async data => {
  return defaultInstance.post("/api/admin/department/create", data)
}

export const deleteDepartment = async id => {
  return defaultInstance.delete("/api/admin/department/" + id + "/delete")
}

export const assignHead = async data => {
  return defaultInstance.post("/api/admin/department/assign-head", data)
}

export const getUsers = async () => {
  return defaultInstance.get("/api/admin/users")
}

export const deleteUser = async id => {
  return defaultInstance.delete("/api/admin/delete-user/" + id)
}

export const updateUserById = async (id, data) => {
  return defaultInstance.put(`/api/user/${id}`, data)
}

export const createUser = async data => {
  return defaultInstance.post("/api/admin/create-user", data)
}

export const updateDepartment = async departmentData => {
  return defaultInstance.put(
    `/api/admin/department/${departmentData.id}/update`,
    departmentData
  )
}
