import React, { useState, useEffect } from "react"
import {
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Form,
  FormGroup,
  Label,
  Input,
  Button,
} from "reactstrap"
import { useUpdateDepartment, useAssignHead } from "../../queries/admin"
import Select from "react-select"

const EditDepartmentModal = ({
  isOpen,
  toggle,
  department,
  onDepartmentUpdated,
  users,
}) => {
  const { mutateAsync: updateDepartmentMutation } = useUpdateDepartment()
  const { mutateAsync: assignHeadMutation } = useAssignHead()

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    department_head: "",
  })

  // Convert users array to react-select format
  const userOptions = users.map(user => ({
    value: user.id,
    label: `${user.name} ${user.sur_name}`,
  }))

  useEffect(() => {
    if (department) {
      setFormData({
        name: department.name || "",
        description: department.description || "",
        department_head: department.department_head?.id || "",
      })
    }
  }, [department])

  // Modified handleChange to work with react-select
  const handleChange = e => {
    if (e?.target) {
      // Handle regular input changes
      const { name, value } = e.target
      setFormData(prev => ({
        ...prev,
        [name]: value,
      }))
    } else if (e?.value) {
      // Handle react-select changes
      setFormData(prev => ({
        ...prev,
        department_head: e.value,
      }))
    }
  }

  const handleSubmit = async e => {
    e.preventDefault()
    try {
      await updateDepartmentMutation({
        id: department.id,
        name: formData.name,
        description: formData.description,
      })

      if (formData.department_head !== department.department_head?.id) {
        await assignHeadMutation({
          departmentId: department.id,
          userId: formData.department_head,
        })
      }

      onDepartmentUpdated()
      toggle()
    } catch (error) {
      console.error("Error updating department:", error)
      alert("დეპარტამენტის განახლება ვერ მოხერხდა")
    }
  }

  return (
    <Modal isOpen={isOpen} toggle={toggle}>
      <ModalHeader toggle={toggle}>დეპარტამენტის რედაქტირება</ModalHeader>
      <Form onSubmit={handleSubmit}>
        <ModalBody>
          <FormGroup>
            <Label for="name">სახელი</Label>
            <Input
              id="name"
              name="name"
              type="text"
              value={formData.name}
              onChange={handleChange}
              required
            />
          </FormGroup>
          <FormGroup>
            <Label for="description">აღწერა</Label>
            <Input
              id="description"
              name="description"
              type="textarea"
              value={formData.description}
              onChange={handleChange}
            />
          </FormGroup>
          <FormGroup>
            <Label for="department_head">დეპარტამენტის უფროსი</Label>
            <Select
              id="department_head"
              name="department_head"
              value={userOptions.find(
                option => option.value === formData.department_head
              )}
              onChange={handleChange}
              options={userOptions}
              isClearable
              placeholder="აირჩიეთ დეპარტამენტის უფროსი"
              noOptionsMessage={() => "მომხმარებელი ვერ მოიძებნა"}
              styles={{
                menu: provided => ({
                  ...provided,
                  backgroundColor: "white",
                }),
                option: (provided, state) => ({
                  ...provided,
                  backgroundColor: state.isSelected
                    ? "#0d6efd"
                    : state.isFocused
                    ? "#e9ecef"
                    : "white",
                  color: state.isSelected ? "white" : "black",
                  "&:active": {
                    backgroundColor: "#0d6efd",
                  },
                }),
                control: (provided, state) => ({
                  ...provided,
                  borderColor: state.isFocused ? "#0d6efd" : "#ced4da",
                  "&:hover": {
                    borderColor: "#0d6efd",
                  },
                  boxShadow: state.isFocused
                    ? "0 0 0 0.25rem rgba(13, 110, 253, 0.25)"
                    : "none",
                }),
              }}
            />
          </FormGroup>
        </ModalBody>
        <ModalFooter>
          <Button color="secondary" onClick={toggle}>
            გაუქმება
          </Button>
          <Button color="primary" type="submit">
            განახლება
          </Button>
        </ModalFooter>
      </Form>
    </Modal>
  )
}

export default EditDepartmentModal
