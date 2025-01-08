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

  useEffect(() => {
    if (department) {
      setFormData({
        name: department.name || "",
        description: department.description || "",
        department_head: department.department_head?.id || "",
      })
    }
  }, [department])

  const handleChange = e => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }))
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
            <Input
              id="department_head"
              type="select"
              name="department_head"
              value={formData.department_head}
              onChange={handleChange}
            >
              <option value="">აირჩიეთ დეპარტამენტის უფროსი</option>
              {users.map(user => (
                <option key={user.id} value={user.id}>
                  {user.name} {user.sur_name}
                </option>
              ))}
            </Input>
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
