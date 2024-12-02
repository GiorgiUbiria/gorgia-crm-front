import { useMemo } from "react"

const useIsDepartmentHead = () => {
  const isDepartmentHead = useMemo(() => {
    try {
      const authUserString = sessionStorage.getItem("authUser")
      if (!authUserString) return false

      const authUser = JSON.parse(authUserString)
      return authUser?.roles?.some(role => role.slug === "department_head")
    } catch (error) {
      console.error("Error checking department head status:", error)
      return false
    }
  }, [])

  return isDepartmentHead
}

export default useIsDepartmentHead
