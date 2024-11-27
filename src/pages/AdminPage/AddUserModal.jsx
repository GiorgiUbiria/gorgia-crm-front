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
import { createUser } from "services/admin/department"

const AddUserModal = ({ isOpen, toggle, onUserAdded }) => {
  const [formData, setFormData] = useState({
    name: "",
    sur_name: "",
    email: "",
    password: "",
    mobile_number: "",
    position: "",
    department_id: "",
    location: "",
    working_start_date: "",
    date_of_birth: "",
    id_number: "",
  })

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      await createUser(formData)
      onUserAdded()
      toggle()
      setFormData({}) // Reset form
    } catch (error) {
      console.error("Error creating user:", error)
    }
  }

  return (
    <Modal isOpen={isOpen} toggle={toggle} size="lg">
      <ModalHeader toggle={toggle}>მომხმარებლის დამატება</ModalHeader>
      <Form onSubmit={handleSubmit}>
        <ModalBody>
          <div className="row">
            <div className="col-md-6">
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
            </div>
            <div className="col-md-6">
              <FormGroup>
                <Label>გვარი</Label>
                <Input
                  type="text"
                  name="sur_name"
                  value={formData.sur_name || ""}
                  onChange={handleChange}
                  required
                />
              </FormGroup>
            </div>
          </div>

          <div className="row">
            <div className="col-md-6">
              <FormGroup>
                <Label>ელ-ფოსტა</Label>
                <Input
                  type="email"
                  name="email"
                  value={formData.email || ""}
                  onChange={handleChange}
                  required
                />
              </FormGroup>
            </div>
            <div className="col-md-6">
              <FormGroup>
                <Label>პაროლი</Label>
                <Input
                  type="password"
                  name="password"
                  value={formData.password || ""}
                  onChange={handleChange}
                  required
                />
              </FormGroup>
            </div>
          </div>

          <div className="row">
            <div className="col-md-6">
              <FormGroup>
                <Label>მობილური</Label>
                <Input
                  type="text"
                  name="mobile_number"
                  value={formData.mobile_number || ""}
                  onChange={handleChange}
                />
              </FormGroup>
            </div>
            <div className="col-md-6">
              <FormGroup>
                <Label>პოზიცია</Label>
                <Input
                  type="text"
                  name="position"
                  value={formData.position || ""}
                  onChange={handleChange}
                />
              </FormGroup>
            </div>
          </div>

          <div className="row">
            <div className="col-md-6">
              <FormGroup>
                <Label>დაწყების თარიღი</Label>
                <Input
                  type="date"
                  name="working_start_date"
                  value={formData.working_start_date || ""}
                  onChange={handleChange}
                />
              </FormGroup>
            </div>
            <div className="col-md-6">
              <FormGroup>
                <Label>დაბადების თარიღი</Label>
                <Input
                  type="date"
                  name="date_of_birth"
                  value={formData.date_of_birth || ""}
                  onChange={handleChange}
                />
              </FormGroup>
            </div>
          </div>

          <FormGroup>
            <Label>პირადი ნომერი</Label>
            <Input
              type="text"
              name="id_number"
              value={formData.id_number || ""}
              onChange={handleChange}
            />
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

export default AddUserModal 