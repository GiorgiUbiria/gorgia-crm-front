import React, { useState } from "react"
import { Modal, ModalHeader, ModalBody, Form, Button, Label } from "reactstrap"
import { toast } from "react-toastify"
import Select from "react-select"
import useCurrentUser from "../../../hooks/useCurrentUser"
import useUserRoles from "../../../hooks/useUserRoles"

const AssignModal = ({ isOpen, toggle, onAssign, usersList }) => {
  const [selectedUsers, setSelectedUsers] = useState([])
  const { currentUser } = useCurrentUser()
  const userRoles = useUserRoles()

  const isAdmin = userRoles.includes("admin")
  const isDepartmentHead =
    userRoles.includes("department_head") && currentUser?.department_id === 38
  const isFarmMember = currentUser?.department_id === 38

  const handleClose = () => {
    setSelectedUsers([])
    toggle(false)
  }

  const handleSubmit = async e => {
    e.preventDefault()
    try {
      // If regular IT member, just assign to self
      if (isFarmMember && !isAdmin && !isDepartmentHead) {
        await onAssign([currentUser.id])
      } else {
        // For admin and department head, use selected users
        await onAssign(selectedUsers.map(user => user.value))
      }
      toast.success("დავალება მიღებულია")
      handleClose()
    } catch (error) {
      toast.error(
        error.response?.data?.message ||
          "დავალების მიღების დროს დაფიქსირდა შეცდომა"
      )
    }
  }

  const userOptions =
    usersList?.map(user => ({
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
            {isAdmin || isDepartmentHead ? (
              <h5 className="mt-3">აირჩიეთ პასუხისმგებელი პირები</h5>
            ) : (
              <h5 className="mt-3">გსურთ დავალების მიღება?</h5>
            )}
          </div>

          {(isAdmin || isDepartmentHead) && (
            <div className="mb-4">
              <Label className="form-label">პასუხისმგებელი პირები</Label>
              <Select
                isMulti
                options={userOptions}
                value={selectedUsers}
                onChange={setSelectedUsers}
                className="basic-multi-select"
                classNamePrefix="select"
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
                (isAdmin || isDepartmentHead) && selectedUsers.length === 0
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