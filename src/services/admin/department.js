import defaultInstance from "../../plugins/axios"

export const getDepartments = async () => {
  return defaultInstance.get("/api/admin/department")
}

export const getPublicDepartments = async () => {
  return defaultInstance.get("/api/departments")
}

export const getDepartmentMembers = async id => {
  return defaultInstance.get(`/api/department/${id}/members`)
}

export const createDepartment = async data => {
  const { name, description } = data
  return defaultInstance.post("/api/admin/department", { name, description })
}

export const updateDepartment = async departmentData => {
  const { id, name, description } = departmentData
  return defaultInstance.put(`/api/admin/department/${id}/update`, {
    name,
    description,
  })
}

export const assignHead = async (departmentId, userId) => {
  return defaultInstance.post("/api/admin/department/assign-head", {
    department_id: departmentId,
    user_id: userId,
  })
}

export const deleteDepartment = async id => {
  return defaultInstance.delete("/api/admin/department/" + id + "/delete")
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

export const approveDepartmentMember = async (departmentId, userId) => {
  return defaultInstance.post(
    `/api/department/${departmentId}/members/${userId}/approve`
  )
}

export const rejectDepartmentMember = async (departmentId, userId) => {
  return defaultInstance.post(
    `/api/department/${departmentId}/members/${userId}/reject`
  )
}

export const updateDepartmentMember = async (departmentId, userId, data) => {
  return defaultInstance.put(
    `/api/department/${departmentId}/members/${userId}`,
    data
  )
}
