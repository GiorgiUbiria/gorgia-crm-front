import React, { useState, useEffect } from "react"

// Function to get user roles
const getUserRoles = async userId => {
  const response = await api.get(`/users/${userId}/roles`)
  return response.data
}

// Function to update user roles
const updateUserRoles = async (userId, roleIds) => {
  const response = await api.put(`/users/${userId}/roles`, {
    roles: roleIds,
  })
  return response.data
}

// Example usage in a component
const UserRoleManager = ({ userId }) => {
  const [roles, setRoles] = useState([])
  const [availableRoles, setAvailableRoles] = useState([])

  useEffect(() => {
    const loadRoles = async () => {
      const { roles, available_roles } = await getUserRoles(userId)
      setRoles(roles)
      setAvailableRoles(available_roles)
    }
    loadRoles()
  }, [userId])

  const handleRoleChange = async selectedRoleIds => {
    await updateUserRoles(userId, selectedRoleIds)
    // Refresh roles after update
    const { roles } = await getUserRoles(userId)
    setRoles(roles)
  }

  return (
    <div>
      <h2>User Roles</h2>
      <select
        multiple
        value={roles}
        onChange={e => {
          const selectedRoles = Array.from(
            e.target.selectedOptions,
            option => option.value
          )
          handleRoleChange(selectedRoles)
        }}
      >
        {availableRoles.map(role => (
          <option key={role.id} value={role.id}>
            {role.name}
          </option>
        ))}
      </select>
    </div>
  )
}

export default UserRoleManager
