import defaultInstance from "../plugins/axios"

/**
 * Fetches all roles.
 */
export const getRoles = async () => {
  return defaultInstance.get("/api/roles")
}

/**
 * Fetches roles for a specific user.
 *
 * @param {number|string} userId - The ID of the user.
 */
export const getUserRoles = async userId => {
  return defaultInstance.get(`/api/users/${userId}/roles`)
}

/**
 * Updates roles for a specific user.
 *
 * @param {number|string} userId - The ID of the user.
 * @param {Array<number|string>} roles - An array of role IDs to assign to the user.
 */
export const updateUserRoles = async (userId, roles) => {
  return defaultInstance.put(`/api/users/${userId}/roles`, { roles })
}

/**
 * Updates the user ID number by ID.
 *
 * @param {Object} data - The data to update.
 * @param {number|string} id - The ID of the user.
 */
export const updateUserIdNumberById = async (data, id) => {
  return defaultInstance.put(`/api/hr-documents/update_user/${id}`, data)
}

/**
 * Updates the user ID number.
 *
 * @param {Object} data - The data to update.
 */
export const updateUserIdNumber = async data => {
  return defaultInstance.put(`/api/hr-documents/update_user`, data)
}

/**
 * Fetches the current user.
 */
export const fetchUser = async () => {
  return defaultInstance.get("/api/user")
}
