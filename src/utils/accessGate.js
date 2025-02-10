export const checkAccess = (user, conditions) => {
  if (!user) return false

  const conditionGroups = conditions.split("|")

  return conditionGroups.some(group => {
    const conditionsArray = group.split(",")

    return conditionsArray.every(condition => {
      if (condition.includes(":")) {
        const [key, value] = condition.split(":").map(part => part.trim())

        switch (key.toLowerCase()) {
          case "role":
            return user.roles?.some(role => role.slug === value)
          case "department":
          case "department_id":
            return user.department_id === parseInt(value)
          default:
            console.error("Unsupported condition key:", key)
            return false
        }
      } else {
        const roleToCheck = condition.trim()
        return user.roles?.some(role => role.slug === roleToCheck)
      }
    })
  })
}

export const useAccess = conditions => {
  const user = JSON.parse(sessionStorage.getItem("authUser"))
  return checkAccess(user, conditions)
}
