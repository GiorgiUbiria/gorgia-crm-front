/**
 * Checks if user meets the required conditions
 * @param {Object} user - User object from session storage
 * @param {string} conditions - Condition string in format "role:admin|department:5|role:manager,department:3"
 * @returns {boolean}
 */
export const checkAccess = (user, conditions) => {
  if (!user) return false

  // Split the conditions by OR (`|`)
  const conditionGroups = conditions.split("|")

  // Check each group (OR conditions)
  return conditionGroups.some(group => {
    // Split each group by AND (`,`)
    const conditionsArray = group.split(",")

    // Check if all conditions in the group are met (AND conditions)
    return conditionsArray.every(condition => {
      // Check if condition contains a colon (key:value format)
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
        // Direct role check
        const roleToCheck = condition.trim()
        return user.roles?.some(role => role.slug === roleToCheck)
      }
    })
  })
}

/**
 * Custom hook for checking access conditions
 * @param {string} conditions - Condition string
 * @returns {boolean}
 */
export const useAccess = conditions => {
  const user = JSON.parse(sessionStorage.getItem("authUser"))
  return checkAccess(user, conditions)
}
