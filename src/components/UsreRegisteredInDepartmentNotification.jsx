import React, { useEffect } from "react"
import echo from "../plugins/echo"
import PropTypes from "prop-types"
import { toast } from "react-toastify"
import "react-toastify/dist/ReactToastify.css"

const UserRegisteredInDepartmentNotification = ({ departmentId }) => {
  useEffect(() => {
    if (!departmentId) return

    const channel = echo.private(`department.${departmentId}`)

    channel.subscribed(() => {
      console.debug(
        `Successfully subscribed to department.${departmentId} channel`
      )
    })

    channel.error(error => {
      console.debug("Channel subscription error:", error)
    })

    channel.listen(".user.registered.in.department", data => {
      console.log("New user registration notification received:", data)

      toast(
        <div>
          <h4 className="font-bold">New Team Member</h4>
          <p>{`${data.user.name} ${data.user.sur_name}`}</p>
          <p className="text-sm">Position: {data.user.position}</p>
        </div>,
        {
          position: "top-right",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
        }
      )
    })

    return () => {
      console.debug("Cleaning up department notification listener")
      channel.stopListening(".user.registered.in.department")
      channel.unsubscribe()
      echo.leave(`department.${departmentId}`)
    }
  }, [departmentId])

  return null
}

UserRegisteredInDepartmentNotification.propTypes = {
  departmentId: PropTypes.number.isRequired,
}

export default UserRegisteredInDepartmentNotification
