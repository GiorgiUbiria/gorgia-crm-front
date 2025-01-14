import React, { useState, useEffect } from "react"
import { Modal, ModalHeader, ModalBody, Form, Button, Label } from "reactstrap"
import { toast } from "react-toastify"
import useCurrentUser from "../../../hooks/useCurrentUser"
import useUserRoles from "../../../hooks/useUserRoles"
import useFetchUsers from "../../../hooks/useFetchUsers"
import CustomSelect from "../../../components/Select"

const AssignModal = ({ isOpen, toggle, onAssign, task }) => {
  const [selectedUsers, setSelectedUsers] = useState([])
  const { currentUser } = useCurrentUser()
  const userRoles = useUserRoles()
  const { users: allUsers, loading: usersLoading } = useFetchUsers()

  const isAdmin = userRoles.includes("admin")
  const isDepartmentHead =
    userRoles.includes("department_head") && currentUser?.department_id === 5
  const isITSupport = userRoles.includes("it_support")
  const isITMember = currentUser?.department_id === 5

  useEffect(() => {
    if (task?.assigned_users && (isAdmin || isDepartmentHead || isITSupport)) {
      const currentlyAssigned = task.assigned_users.map(user => ({
        value: user.id,
        label: `${user.name} ${user.sur_name}`,
      }))
      setSelectedUsers(currentlyAssigned)
    }
  }, [task, isAdmin, isDepartmentHead, isITSupport])
  const usersList = allUsers?.filter(user => user.department_id === 5)

  const handleClose = () => {
    setSelectedUsers([])
    toggle(false)
  }

  const handleSubmit = async e => {
    e.preventDefault()
    try {
      const assignedUserIds =
        isAdmin || isDepartmentHead || isITSupport
          ? selectedUsers.map(user => user.value)
          : [currentUser.id]

      console.log("AssignModal - Submitting Assignment:", {
        assignedUserIds,
        selectedUsers,
        isAdmin,
        isDepartmentHead,
        isITSupport,
        isITMember,
      })

      await onAssign(assignedUserIds)
      toast.success("დავალება მიღებულია")
      handleClose()
    } catch (error) {
      console.error("AssignModal - Assignment Error:", error)
      toast.error(
        error.response?.data?.message ||
          "დავალების მიღების დროს დაფიქსირდა შეცდომა"
      )
    }
  }

  const userOptions = usersLoading
    ? []
    : usersList?.map(user => ({
        value: user.id,
        label: `${user.name} ${user.sur_name}`,
      })) || []

  return (
    <Modal
      isOpen={isOpen}
      toggle={handleClose}
      className="modal-dialog-centered"
    >
      <ModalHeader toggle={handleClose} tag="h4">
        დავალების მიღება
      </ModalHeader>
      <ModalBody>
        <Form onSubmit={handleSubmit}>
          <div className="text-center mb-4">
            <i
              className="mdi mdi-check-circle-outline text-success"
              style={{ fontSize: "3rem" }}
            ></i>
            {isAdmin || isDepartmentHead || isITSupport ? (
              <h5 className="mt-3">აირჩიეთ პასუხისმგებელი პირები</h5>
            ) : (
              <h5 className="mt-3">გსურთ დავალების მიღება?</h5>
            )}
          </div>

          {(isAdmin || isDepartmentHead || isITSupport) && (
            <div className="mb-4">
              <Label className="form-label">პასუხისმგებელი პირები</Label>
              <CustomSelect
                isMulti
                isLoading={usersLoading}
                options={userOptions}
                value={selectedUsers}
                onChange={setSelectedUsers}
                placeholder="აირჩიეთ პასუხისმგებელი პირები"
              />
            </div>
          )}

          <div className="d-flex justify-content-center gap-2">
            <Button type="button" color="secondary" onClick={handleClose}>
              გაუქმება
            </Button>
            <Button
              type="submit"
              color="primary"
              disabled={
                (isAdmin || isDepartmentHead || isITSupport) &&
                selectedUsers.length === 0
              }
            >
              დავალების მიღება
            </Button>
          </div>
        </Form>
      </ModalBody>
    </Modal>
  )
}

export default AssignModal