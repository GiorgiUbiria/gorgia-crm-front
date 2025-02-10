import React, { useState, useEffect } from "react"

const getUserRoles = async userId => {
  const response = await api.get(`/users/${userId}/roles`)
  return response.data
}

const updateUserRoles = async (userId, roleIds) => {
  const response = await api.put(`/users/${userId}/roles`, {
    roles: roleIds,
  })
  return response.data
}

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
