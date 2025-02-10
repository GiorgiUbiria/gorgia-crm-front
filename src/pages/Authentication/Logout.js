import React, { useEffect } from "react"
import PropTypes from "prop-types"
import { logoutUser } from "services/auth"
import { useNavigate } from "react-router-dom"
import useAuth from "hooks/useAuth"
import { toast } from "store/zustand/toastStore"

const Logout = () => {
  const navigate = useNavigate()
  const { clearUser } = useAuth()

  useEffect(() => {
    const handleLogout = async () => {
      try {
        const res = await logoutUser()

        clearUser()
        sessionStorage.clear()

        if (res?.status === 200) {
          toast.success("წარმატებით გამოხვედი", "წარმატება", {
            duration: 2000,
            size: "small",
          })
        }

        navigate("/auth/login", { replace: true })
      } catch (err) {
        console.error("Logout failed:", err)
        toast.error("გამოსვლის დროს დაფიქსირდა შეცდომა", "შეცდომა", {
          duration: 2000,
          size: "small",
        })
        clearUser()
        sessionStorage.clear()
        navigate("/auth/login", { replace: true })
      }
    }

    handleLogout()
  }, [navigate, clearUser])

  return <></>
}

Logout.propTypes = {
  history: PropTypes.object,
}

export default Logout
