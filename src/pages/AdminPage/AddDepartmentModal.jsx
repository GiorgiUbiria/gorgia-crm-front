import React, { useState } from "react"
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
import { useCreateDepartment } from "../../queries/admin"

const AddDepartmentModal = ({ isOpen, toggle, onDepartmentAdded }) => {
  const { mutateAsync: createDepartmentMutation } = useCreateDepartment()

  const [formData, setFormData] = useState({
    name: "",
    description: "",
  })

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
      await createDepartmentMutation(formData)
      onDepartmentAdded()
      toggle()
      setFormData({
        name: "",
        description: "",
      })
    } catch (error) {
      console.error("Error creating department:", error)
      alert("დეპარტამენტის შექმნა ვერ მოხერხდა")
    }
  }

  return (
    <Modal isOpen={isOpen} toggle={toggle}>
      <ModalHeader toggle={toggle}>დეპარტამენტის დამატება</ModalHeader>
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
        </ModalBody>
        <ModalFooter>
          <Button color="secondary" onClick={toggle}>
            გაუქმება
          </Button>
          <Button color="primary" type="submit">
            დამატება
          </Button>
        </ModalFooter>
      </Form>
    </Modal>
  )
}

export default AddDepartmentModal
