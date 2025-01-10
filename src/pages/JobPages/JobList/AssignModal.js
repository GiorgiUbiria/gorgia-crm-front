import React, { useState } from "react"
import { Modal, ModalHeader, ModalBody, Form, Button, Label } from "reactstrap"
import { toast } from "react-toastify"
import Select from "react-select"
import useCurrentUser from "../../../hooks/useCurrentUser"
import useUserRoles from "../../../hooks/useUserRoles"
import useFetchUsers from "../../../hooks/useFetchUsers"

const AssignModal = ({ isOpen, toggle, onAssign }) => {
  const [selectedUsers, setSelectedUsers] = useState([])
  const { currentUser } = useCurrentUser()
  const userRoles = useUserRoles()
  const { users: allUsers, loading: usersLoading } = useFetchUsers()

  const isAdmin = userRoles.includes("admin")
  const isDepartmentHead =
    userRoles.includes("department_head") && currentUser?.department_id === 5
  const isITMember = currentUser?.department_id === 5

  const usersList = allUsers?.filter(user => user.department_id === 5)

  const handleClose = () => {
    setSelectedUsers([])
    toggle(false)
  }

  const handleSubmit = async e => {
    e.preventDefault()
    try {
      if (isITMember && !isAdmin && !isDepartmentHead) {
        await onAssign([currentUser.id])
      } else {
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

  const userOptions = usersLoading
    ? []
    : usersList?.map(user => ({
        value: user.id,
        label: `${user.name} ${user.sur_name}`,
      })) || []

  const customSelectStyles = {
    option: (provided, state) => ({
      ...provided,
      color: "#333", // Dark text color
      backgroundColor: state.isSelected
        ? "#007bff"
        : state.isFocused
        ? "#f8f9fa"
        : "white",
      "&:hover": {
        backgroundColor: "#f8f9fa",
      },
    }),
    control: provided => ({
      ...provided,
      backgroundColor: "white",
    }),
    singleValue: provided => ({
      ...provided,
      color: "#333", // Dark text color
    }),
    multiValue: provided => ({
      ...provided,
      backgroundColor: "#e9ecef",
    }),
    multiValueLabel: provided => ({
      ...provided,
      color: "#333", // Dark text color
    }),
  }

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
                isLoading={usersLoading}
                options={userOptions}
                value={selectedUsers}
                onChange={setSelectedUsers}
                className="basic-multi-select"
                classNamePrefix="select"
                placeholder="აირჩიეთ პასუხისმგებელი პირები"
                styles={customSelectStyles}
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
