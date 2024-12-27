import { useState, useEffect } from "react"

const useCurrentUser = () => {
  const [currentUser, setCurrentUser] = useState(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const loadUser = () => {
      try {
        const user = JSON.parse(sessionStorage.getItem("authUser"))
        setCurrentUser(user)
      } catch (error) {
        console.error("Error loading user data:", error)
        setCurrentUser(null)
      } finally {
        setIsLoading(false)
      }
    }

    loadUser()

    // Listen for storage changes
    const handleStorageChange = (e) => {
      if (e.key === "authUser") {
        loadUser()
      }
    }

    window.addEventListener("storage", handleStorageChange)
    return () => window.removeEventListener("storage", handleStorageChange)
  }, [])

  return { currentUser, isLoading }
}

export default useCurrentUser 