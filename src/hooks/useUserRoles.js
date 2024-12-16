import { useMemo } from "react"

const useUserRoles = () => {
  const roles = useMemo(() => {
    const user = JSON.parse(sessionStorage.getItem("authUser"))
    return user && user.roles ? user.roles.map(role => role.slug) : []
  }, [])

  return roles
}

export default useUserRoles
