import React, { useEffect } from "react"
import PropTypes from "prop-types"
import withRouter from "components/Common/withRouter"
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
          toast.success(res.data.message, "წარმატება", {
            duration: 2000,
            size: "small",
          })
        }

        navigate("/auth/login", { replace: true })
      } catch (err) {
        console.error("Logout failed:", err)
        toast.error("Failed to logout properly", "შეცდომა", {
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

export default withRouter(Logout)
