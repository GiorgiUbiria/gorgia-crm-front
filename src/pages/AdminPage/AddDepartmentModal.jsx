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
} from "reactstrap"
import Button from "@mui/material/Button"
import { createDepartment } from "services/admin/department"

const AddDepartmentModal = ({ isOpen, toggle, onDepartmentAdded, users }) => {
  const [formData, setFormData] = useState({
    name: "",
    department_head: "",
  })

  const handleChange = e => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    })
  }

  const handleSubmit = async e => {
    e.preventDefault()
    try {
      await createDepartment(formData)
      onDepartmentAdded()
      toggle()
      setFormData({})
    } catch (error) {
      console.error("Error creating department:", error)
    }
  }

  return (
    <Modal isOpen={isOpen} toggle={toggle}>
      <ModalHeader toggle={toggle}>დეპარტამენტის დამატება</ModalHeader>
      <Form onSubmit={handleSubmit}>
        <ModalBody>
          <FormGroup>
            <Label>სახელი</Label>
            <Input
              type="text"
              name="name"
              value={formData.name || ""}
              onChange={handleChange}
              required
            />
          </FormGroup>

          <FormGroup>
            <Label>დეპარტამენტის უფროსი</Label>
            <Input
              type="select"
              name="department_head"
              value={formData.department_head || ""}
              onChange={handleChange}
              required
            >
              <option value="">აირჩიეთ დეპარტამენტი</option>
              {users.map(user => (
                <option value={user.id} key={user.id}>
                  {user.name}
                </option>
              ))}
            </Input>
          </FormGroup>
        </ModalBody>
        <ModalFooter>
          <Button onClick={toggle} color="secondary">
            გაუქმება
          </Button>
          <Button type="submit" variant="contained" color="primary">
            დამატება
          </Button>
        </ModalFooter>
      </Form>
    </Modal>
  )
}

export default AddDepartmentModal
