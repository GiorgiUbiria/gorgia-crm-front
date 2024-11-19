import React, { useEffect, useState } from "react"
import {
  Modal,
  ModalHeader,
  ModalBody,
  Button,
  Form,
  Label,
  Input,
} from "reactstrap"

const UserForm = ({
  isOpen,
  toggle,
  isEditMode,
  user,
  onSave,
  departments,
}) => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    department_id: "", // Use department_id to store the selected department
    position: "",
    location: "",
    working_start_date: "",
    date_of_birth: "",
    mobile_number: "",
    id_number: "",
    status: "active",
    profile_image: null,
  })

  useEffect(() => {
    if (user) {
      setFormData({
        name: user?.name || "",
        email: user.email || "",
        department_id: user.department ? user.department.id : "", // Set the department_id from user data
        position: user.position || "",
        location: user.location || "",
        working_start_date: user.working_start_date || "",
        date_of_birth: user.date_of_birth || "",
        mobile_number: user.mobile_number || "",
        id_number: user.id_number || "",
        status: user.status || "active",
        profile_image: null,
      })
    }
  }, [user])

  const handleChange = e => {
    const { name, value } = e.target
    setFormData(prevData => ({
      ...prevData,
      [name]: value,
    }))
  }

  const handleFileChange = e => {
    setFormData(prevData => ({
      ...prevData,
      profile_image: e.target.files[0],
    }))
  }

  const handleSubmit = e => {
    e.preventDefault()
    onSave(formData) // Send formData containing department_id
  }

  return (
    <Modal isOpen={isOpen} toggle={toggle}>
      <ModalHeader toggle={toggle}>
        {isEditMode ? "Edit User" : "Add User"}
      </ModalHeader>
      <ModalBody>
        <Form onSubmit={handleSubmit}>
          <Label for="name">Name</Label>
          <Input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            
          />

          <Label for="email" className="mt-3">
            Email
          </Label>
          <Input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            
          />

          <Label for="id_number" className="mt-3">
            ID Number
          </Label>
          <Input
            type="text"
            id="id_number"
            name="id_number"
            value={formData.id_number}
            onChange={handleChange}
            
          />

          <Label for="department_id" className="mt-3">
            Department
          </Label>
          <Input
            type="select"
            id="department_id"
            name="department_id"
            value={formData.department_id}
            onChange={handleChange}
            
          >
            <option value="">Select Department</option>
            {departments.map(dep => (
              <option key={dep.id} value={dep.id}>
                {dep.name}
              </option>
            ))}
          </Input>

          <Label for="position" className="mt-3">
            Position
          </Label>
          <Input
            type="text"
            id="position"
            name="position"
            value={formData.position}
            onChange={handleChange}
          />

          <Label for="location" className="mt-3">
            Location
          </Label>
          <Input
            type="text"
            id="location"
            name="location"
            value={formData.location}
            onChange={handleChange}
          />

          <Label for="working_start_date" className="mt-3">
            Working Start Date
          </Label>
          <Input
            type="date"
            id="working_start_date"
            name="working_start_date"
            value={formData.working_start_date}
            onChange={handleChange}
          />

          <Label for="date_of_birth" className="mt-3">
            Date of Birth
          </Label>
          <Input
            type="date"
            id="date_of_birth"
            name="date_of_birth"
            value={formData.date_of_birth}
            onChange={handleChange}
          />

          <Label for="mobile_number" className="mt-3">
            Mobile Number
          </Label>
          <Input
            type="text"
            id="mobile_number"
            name="mobile_number"
            value={formData.mobile_number}
            onChange={handleChange}
          />

          <Label for="profile_image" className="mt-3">
            Profile Image
          </Label>
          <Input
            type="file"
            id="profile_image"
            name="profile_image"
            onChange={handleFileChange}
          />

          <Button color="success" type="submit" className="mt-3">
            {isEditMode ? "Update User" : "Add User"}
          </Button>
        </Form>
      </ModalBody>
    </Modal>
  )
}

export default UserForm
