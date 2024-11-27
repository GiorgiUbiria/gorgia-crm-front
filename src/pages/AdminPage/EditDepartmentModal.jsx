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
import Select from "react-select"
import { updateDepartment } from "services/admin/department"

const EditDepartmentModal = ({
  isOpen,
  toggle,
  department,
  onDepartmentUpdated,
  users,
}) => {
  const [formData, setFormData] = useState({
    name: "",
    department_head: null,
  })

  useEffect(() => {
    if (department) {
      const headUser = users.find(
        user => `${user.name} ${user.sur_name}` === department.department_head
      )

      setFormData({
        name: department.name,
        department_head: headUser?.id || null,
      })
    }
  }, [department, users])

  const userOptions = users.map(user => ({
    value: user.id,
    label: `${user.name} ${user.sur_name}`,
  }))

  const handleChange = e => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    })
  }

  const handleHeadChange = selectedOption => {
    setFormData({
      ...formData,
      department_head: selectedOption ? selectedOption.value : null,
    })
  }

  const handleSubmit = async e => {
    e.preventDefault()

    try {
      const updateData = {
        ...formData,
        id: department.id,
      }

      await updateDepartment(updateData)
      onDepartmentUpdated()
      toggle()
    } catch (error) {
      console.error("Error updating department:", error)
      alert("დეპარტამენტის განახლება ვერ მოხერხდა")
    }
  }

  const selectedHead =
    userOptions.find(option => option.value === formData.department_head) ||
    null

  const customStyles = {
    control: base => ({
      ...base,
      backgroundColor: "white",
      borderColor: "#dee2e6",
      "&:hover": {
        borderColor: "#ced4da",
      },
    }),
    menu: base => ({
      ...base,
      backgroundColor: "white",
      zIndex: 9999,
    }),
    option: (base, state) => ({
      ...base,
      backgroundColor: state.isFocused ? "#f8f9fa" : "white",
      color: "#333",
      "&:hover": {
        backgroundColor: "#f8f9fa",
      },
    }),
  }

  return (
    <Modal isOpen={isOpen} toggle={toggle}>
      <ModalHeader toggle={toggle}>დეპარტამენტის რედაქტირება</ModalHeader>
      <Form onSubmit={handleSubmit}>
        <ModalBody>
          <Row>
            <Col>
              <FormGroup>
                <Label for="name">დეპარტამენტის სახელი</Label>
                <Input
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                />
              </FormGroup>
            </Col>
          </Row>
          <Row>
            <Col>
              <FormGroup>
                <Label for="department_head">დეპარტამენტის უფროსი</Label>
                <Select
                  value={selectedHead}
                  onChange={handleHeadChange}
                  options={userOptions}
                  isClearable
                  placeholder="აირჩიეთ დეპარტამენტის უფროსი"
                  styles={customStyles}
                  className="basic-single"
                  classNamePrefix="select"
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

export default EditDepartmentModal
