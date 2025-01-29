import React, { useState, useEffect } from "react"
import { Modal, ModalHeader, ModalBody, Form, Button, Label } from "reactstrap"
import useAuth from "hooks/useAuth"
import CustomSelect from "components/Select"
import { toast } from "store/zustand/toastStore"

const AssignModal = ({ isOpen, toggle, onAssign, task, usersList }) => {
  const [selectedUsers, setSelectedUsers] = useState([])
  const { user, isAdmin, getUserDepartmentId, isDepartmentHead, isITSupport } =
    useAuth()

  const isITMember = getUserDepartmentId() === 5

  useEffect(() => {
    if (
      task?.assigned_users &&
      (isAdmin() || isDepartmentHead() || isITSupport() || isITMember)
    ) {
      const currentlyAssigned = task.assigned_users.map(user => ({
        value: user.id,
        label: `${user.name} ${user.sur_name}`,
      }))
      setSelectedUsers(currentlyAssigned)
    }
  }, [task, isAdmin, isDepartmentHead, isITSupport, isITMember])

  const handleClose = () => {
    setSelectedUsers([])
    toggle(false)
  }

  const handleSubmit = async e => {
    e.preventDefault()
    try {
      const assignedUserIds =
        isAdmin() || isDepartmentHead() || isITSupport()
          ? selectedUsers.map(user => user.value)
          : [user.id]

      await onAssign(assignedUserIds)
      toast.success("დავალება მიღებულია", "წარმატება", {
        duration: 2000,
        size: "small",
      })
      handleClose()
    } catch (error) {
      console.error("AssignModal - Assignment Error:", error)
      toast.error(
        error.response?.data?.message ||
          "დავალების მიღების დროს დაფიქსირდა შეცდომა",
        "შეცდომა",
        {
          duration: 2000,
          size: "small",
        }
      )
    }
  }

  const userOptions = usersList?.map(user => ({
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
            {isAdmin() || isDepartmentHead() || isITSupport() ? (
              <h5 className="mt-3">აირჩიეთ პასუხისმგებელი პირები</h5>
            ) : (
              <h5 className="mt-3">გსურთ დავალების მიღება?</h5>
            )}
          </div>

          {(isAdmin() || isDepartmentHead() || isITSupport()) && (
            <div className="mb-4">
              <Label className="form-label">პასუხისმგებელი პირები</Label>
              <CustomSelect
                isMulti
                isLoading={() => usersList.length === 0}
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
                (isAdmin() || isDepartmentHead() || isITSupport()) &&
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
