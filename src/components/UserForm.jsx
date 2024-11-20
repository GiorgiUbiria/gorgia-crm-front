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
    <Modal isOpen={isOpen} toggle={toggle} className="modal-dialog-centered modal-lg">
      <ModalHeader toggle={toggle} className="border-bottom pb-3">
        {isEditMode ? "მომხმარებლის რედაქტირება" : "მომხმარებლის დამატება"}
      </ModalHeader>
      <ModalBody className="p-4">
        <Form onSubmit={handleSubmit}>
          <div className="row">
            <div className="col-md-6 mb-3">
              <Label className="form-label">სახელი და გვარი</Label>
              <Input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="form-control"
                placeholder="შეიყვანეთ სახელი"
                required
              />
            </div>

            <div className="col-md-6 mb-3">
              <Label className="form-label">ელ-ფოსტა</Label>
              <Input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="form-control"
                placeholder="შეიყვანეთ ელ-ფოსტა"
                required
              />
            </div>

            <div className="col-md-6 mb-3">
              <Label className="form-label">პირადი ნომერი</Label>
              <Input
                type="text"
                name="id_number"
                value={formData.id_number}
                onChange={handleChange}
                className="form-control"
                placeholder="შეიყვანეთ პირადი ნომერი"
                required
              />
            </div>

            <div className="col-md-6 mb-3">
              <Label className="form-label">დეპარტამენტი</Label>
              <Input
                type="select"
                name="department_id"
                value={formData.department_id}
                onChange={handleChange}
                className="form-control"
              >
                <option value="">აირჩიეთ დეპარტამენტი</option>
                {departments.map(dep => (
                  <option key={dep.id} value={dep.id}>{dep.name}</option>
                ))}
              </Input>
            </div>

            <div className="col-md-6 mb-3">
              <Label className="form-label">პოზიცია</Label>
              <Input
                type="text"
                name="position"
                value={formData.position}
                onChange={handleChange}
                className="form-control"
                placeholder="შეიყვანეთ პოზიცია"
              />
            </div>

            <div className="col-md-6 mb-3">
              <Label className="form-label">მობილური</Label>
              <Input
                type="text"
                name="mobile_number"
                value={formData.mobile_number}
                onChange={handleChange}
                className="form-control"
                placeholder="შეიყვანეთ მობილური"
              />
            </div>

            <div className="col-md-6 mb-3">
              <Label className="form-label">დაბადების თარიღი</Label>
              <Input
                type="date"
                name="date_of_birth"
                value={formData.date_of_birth}
                onChange={handleChange}
                className="form-control"
                placeholder="შეიყვანეთ დაბადების თარიღი"
              />
            </div>

            <div className="col-md-6 mb-3">
              <Label className="form-label">სრული სახელი</Label>
              <Input
                type="text"
                name="location"
                value={formData.location}
                onChange={handleChange}
                className="form-control"
                placeholder="შეიყვანეთ სრული სახელი"
              />
            </div>

            <div className="col-md-6 mb-3">
              <Label className="form-label">სამუშაოის დაწყების თარიღი</Label>
              <Input
                type="date"
                name="working_start_date"
                value={formData.working_start_date}
                onChange={handleChange}
                className="form-control"
                placeholder="შეიყვანეთ სამუშაოის დაწყების თარიღი"
              />
            </div>

            <div className="col-md-6 mb-3">
              <Label className="form-label">პროფილის სურათი</Label>
              <Input
                type="file"
                name="profile_image"
                onChange={handleFileChange}
                className="form-control"
              />
            </div>
          </div>

          <div className="d-flex justify-content-end gap-2">
            <Button type="button" color="light" onClick={toggle}>
              გაუქმება
            </Button>
            <Button type="submit" color="primary">
              {isEditMode ? "განახლება" : "დამატება"}
            </Button>
          </div>
        </Form>
      </ModalBody>
    </Modal>
  )
}

export default UserForm
