import defaultInstance from "../plugins/axios"

export const getSuperAdminRoles = () => {
  return defaultInstance.get("/api/super-admin/roles")
}

export const getSuperAdminDepartments = () => {
  return defaultInstance.get("/api/super-admin/departments")
}

export const updateSuperAdminRoles = roles => {
  return defaultInstance.put("/api/super-admin/my-roles", { roles })
}

export const updateSuperAdminDepartment = departmentId => {
  return defaultInstance.put("/api/super-admin/my-department", {
    department_id: departmentId,
  })
}

export const getSuperAdminAccess = () => {
  return defaultInstance.get("/api/super-admin/my-access")
}
