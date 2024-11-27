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
  Row,
  Col,
} from "reactstrap"
import Button from "@mui/material/Button"
import { updateUserById } from "services/admin/department"

const EditUserModal = ({ isOpen, toggle, user, onUserUpdated }) => {
  const [formData, setFormData] = useState({
    name: "",
    sur_name: "",
    email: "",
    mobile_number: "",
    password: "",
    confirm_password: "",
  })

  useEffect(() => {
    if (user) {
      const [firstName, ...lastName] = user.name.split(" ")
      setFormData({
        name: firstName,
        sur_name: lastName.join(" "),
        email: user.email,
        mobile_number: user.mobile_number,
        password: "",
        confirm_password: "",
      })
    }
  }, [user])

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (formData.password !== formData.confirm_password) {
      alert("პაროლები არ ემთხვევა")
      return
    }

    try {
      const updateData = {
        ...formData,
        id: user.id,
      }
      
      // Only include password if it was changed
      if (!formData.password) {
        delete updateData.password
        delete updateData.confirm_password
      }

      await updateUserById(user.id, updateData)
      onUserUpdated()
      toggle()
    } catch (error) {
      console.error("Error updating user:", error)
      alert("მომხმარებლის განახლება ვერ მოხერხდა")
    }
  }

  return (
    <Modal isOpen={isOpen} toggle={toggle} size="lg">
      <ModalHeader toggle={toggle}>მომხმარებლის რედაქტირება</ModalHeader>
      <Form onSubmit={handleSubmit}>
        <ModalBody>
          <Row>
            <Col md={6}>
              <FormGroup>
                <Label for="name">სახელი</Label>
                <Input
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                />
              </FormGroup>
            </Col>
            <Col md={6}>
              <FormGroup>
                <Label for="sur_name">გვარი</Label>
                <Input
                  id="sur_name"
                  name="sur_name"
                  value={formData.sur_name}
                  onChange={handleChange}
                  required
                />
              </FormGroup>
            </Col>
          </Row>
          <Row>
            <Col md={6}>
              <FormGroup>
                <Label for="email">ელ-ფოსტა</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                />
              </FormGroup>
            </Col>
            <Col md={6}>
              <FormGroup>
                <Label for="mobile_number">მობილური</Label>
                <Input
                  id="mobile_number"
                  name="mobile_number"
                  value={formData.mobile_number}
                  onChange={handleChange}
                  required
                />
              </FormGroup>
            </Col>
          </Row>
          <Row>
            <Col md={6}>
              <FormGroup>
                <Label for="password">ახალი პაროლი (არასავალდებულო)</Label>
                <Input
                  id="password"
                  name="password"
                  type="password"
                  value={formData.password}
                  onChange={handleChange}
                />
              </FormGroup>
            </Col>
            <Col md={6}>
              <FormGroup>
                <Label for="confirm_password">გაიმეორეთ პაროლი</Label>
                <Input
                  id="confirm_password"
                  name="confirm_password"
                  type="password"
                  value={formData.confirm_password}
                  onChange={handleChange}
                  disabled={!formData.password}
                />
              </FormGroup>
            </Col>
          </Row>
        </ModalBody>
        <ModalFooter>
          <Button onClick={toggle} color="secondary">
            გაუქმება
          </Button>
          <Button type="submit" variant="contained" color="primary">
            შენახვა
          </Button>
        </ModalFooter>
      </Form>
    </Modal>
  )
}

export default EditUserModal 