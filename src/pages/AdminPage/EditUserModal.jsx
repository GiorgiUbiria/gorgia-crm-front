import React, { useState, useEffect, useCallback } from "react"
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
import IconButton from "@mui/material/IconButton"
import Visibility from "@mui/icons-material/Visibility"
import VisibilityOff from "@mui/icons-material/VisibilityOff"
import {
  updateUserById,
  getPublicDepartments,
  updateDepartmentMember,
} from "services/admin/department"

const initialFormData = {
  name: "",
  sur_name: "",
  email: "",
  mobile_number: "",
  department_id: "",
  roles: [],
  password: "",
  confirm_password: "",
  position: "",
  location: "",
  working_start_date: "",
  date_of_birth: "",
  id_number: "",
}

const EditUserModal = ({
  isOpen,
  toggle,
  user,
  onUserUpdated,
  isDepartmentHead,
  currentUserDepartmentId,
}) => {
  const [formData, setFormData] = useState(initialFormData)
  const [showPassword, setShowPassword] = useState(false)
  const [departments, setDepartments] = useState([])
  const [errors, setErrors] = useState({})

  useEffect(() => {
    if (user) {
      console.log(user)
      setFormData({
        name: user.name.firstName || "",
        sur_name: user.name.lastName || "",
        email: user.email || "",
        mobile_number: user.mobile_number || "",
        department_id: user.department_id || "",
        roles: user.roles?.map(role => role.id) || [],
        password: "",
        confirm_password: "",
        position: user.position || "",
        location: user.location || "",
        working_start_date: user.working_start_date || "",
        date_of_birth: user.date_of_birth || "",
        id_number: user.id_number || "",
      })
    }
  }, [user])

  useEffect(() => {
    const fetchDepartments = async () => {
      const departments = await getPublicDepartments()
      setDepartments(departments.data.departments || [])
    }
    fetchDepartments()
  }, [])

  const handleChange = useCallback(e => {
    const { name, value } = e.target
    setFormData(prevData => ({
      ...prevData,
      [name]: value,
    }))
  }, [])

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword)
  }

  const validateForm = () => {
    const newErrors = {}
    const georgianRegex = /^[\u10A0-\u10FF]{2,30}$/
    const emailRegex = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i
    const phoneRegex = /^[0-9]{9,}$/
    const idNumberRegex = /^[0-9]+$/

    // Name Validation
    if (!formData.name.trim()) {
      newErrors.name = "სახელი სავალდებულოა."
    } else if (!georgianRegex.test(formData.name)) {
      newErrors.name =
        "სახელი უნდა შეიცავდეს მხოლოდ ქართულ ასოებს (2-30 სიმბოლო)."
    }

    // Surname Validation
    if (!formData.sur_name.trim()) {
      newErrors.sur_name = "გვარი სავალდებულოა."
    } else if (!georgianRegex.test(formData.sur_name)) {
      newErrors.sur_name =
        "გვარი უნდა შეიცავდეს მხოლოდ ქართულ ასოებს (2-30 სიმბოლო)."
    }

    // Email Validation
    if (!formData.email.trim()) {
      newErrors.email = "ელ-ფოსტა სავალდებულოა."
    } else if (!emailRegex.test(formData.email)) {
      newErrors.email = "ელ-ფოსტა სავალდებულოა."
    } else if (!formData.email.toLowerCase().endsWith("@gorgia.ge")) {
      newErrors.email = "ელ-ფოსტა უნდა მთავრდებოდეს @gorgia.ge-ით."
    }

    // Password Validation
    if (formData.password) {
      if (formData.password.length < 6) {
        newErrors.password = "პაროლი უნდა იყოს მინიმუმ 6 სიმბოლო."
      }
      if (formData.password !== formData.confirm_password) {
        newErrors.confirm_password = "პაროლები არ ემთხვევა."
      }
    }

    // Mobile Number Validation
    if (!formData.mobile_number.trim()) {
      newErrors.mobile_number = "მობილურის ნომერი სავალდებულოა."
    } else if (!phoneRegex.test(formData.mobile_number)) {
      newErrors.mobile_number =
        "მობილურის ნომერი უნდა შეიცავდეს მხოლოდ ციფრებს და მინიმუმ 9 ციფრს."
    }

    // ID Number Validation
    if (!formData.id_number.trim()) {
      newErrors.id_number = "პირადი ნომერი სავალდებულოა."
    } else if (!idNumberRegex.test(formData.id_number)) {
      newErrors.id_number = "პირადი ნომერი უნდა შეიცავდეს მხოლოდ ციფრებს."
    }

    // Department Validation
    if (!formData.department_id) {
      newErrors.department_id = "დეპარტამენტი სავალდებულოა."
    }

    // Position Validation
    if (!formData.position.trim()) {
      newErrors.position = "პოზიცია სავალდებულოა."
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async e => {
    e.preventDefault()
    if (!validateForm()) return
    try {
      const updateData = {
        ...formData,
      }

      if (!formData.password) {
        delete updateData.password
        delete updateData.confirm_password
      }

      if (isDepartmentHead) {
        const allowedFields = [
          "position",
          "mobile_number",
          "working_start_date",
        ]
        Object.keys(updateData).forEach(key => {
          if (!allowedFields.includes(key)) {
            delete updateData[key]
          }
        })
        await updateDepartmentMember(
          currentUserDepartmentId,
          user.id,
          updateData
        )
      } else {
        await updateUserById(user.id, updateData)
      }

      onUserUpdated()
      toggle()
      setFormData(initialFormData)
      setErrors({})
    } catch (error) {
      console.error("Error updating user:", error)
      // Optionally set a global error message here
    }
  }

  return (
    <Modal isOpen={isOpen} toggle={toggle} size="lg">
      <ModalHeader toggle={toggle}>მომხმარებლის რედაქტირება</ModalHeader>
      <Form onSubmit={handleSubmit}>
        <ModalBody>
          <div className="row">
            <div className="col-md-6">
              <FormGroup>
                <Label for="name">სახელი</Label>
                <Input
                  type="text"
                  name="name"
                  id="name"
                  value={formData.name}
                  onChange={handleChange}
                  invalid={!!errors.name}
                  required
                />
                {errors.name && (
                  <div className="text-danger">{errors.name}</div>
                )}
              </FormGroup>
            </div>
            <div className="col-md-6">
              <FormGroup>
                <Label for="sur_name">გვარი</Label>
                <Input
                  type="text"
                  name="sur_name"
                  id="sur_name"
                  value={formData.sur_name}
                  onChange={handleChange}
                  invalid={!!errors.sur_name}
                  required
                />
                {errors.sur_name && (
                  <div className="text-danger">{errors.sur_name}</div>
                )}
              </FormGroup>
            </div>
          </div>

          <div className="row">
            <div className="col-md-6">
              <FormGroup>
                <Label for="email">ელ-ფოსტა</Label>
                <Input
                  type="email"
                  name="email"
                  id="email"
                  value={formData.email}
                  onChange={handleChange}
                  invalid={!!errors.email}
                  required
                />
                {errors.email && (
                  <div className="text-danger">{errors.email}</div>
                )}
              </FormGroup>
            </div>
            <div className="col-md-6">
              <FormGroup>
                <Label for="password">ახალი პაროლი (არასავალდებულო)</Label>
                <div className="position-relative">
                  <Input
                    id="password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    value={formData.password}
                    onChange={handleChange}
                    invalid={!!errors.password}
                  />
                  <IconButton
                    onClick={togglePasswordVisibility}
                    style={{
                      position: "absolute",
                      right: "8px",
                      top: "50%",
                      transform: "translateY(-50%)",
                      padding: "4px",
                    }}
                  >
                    {showPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </div>
                {errors.password && (
                  <div className="text-danger">{errors.password}</div>
                )}
              </FormGroup>
            </div>
          </div>

          {formData.password && (
            <div className="row">
              <div className="col-md-6">
                <FormGroup>
                  <Label for="confirm_password">გაიმეორეთ პაროლი</Label>
                  <div className="position-relative">
                    <Input
                      id="confirm_password"
                      name="confirm_password"
                      type={showPassword ? "text" : "password"}
                      value={formData.confirm_password}
                      onChange={handleChange}
                      invalid={!!errors.confirm_password}
                    />
                    <IconButton
                      onClick={togglePasswordVisibility}
                      style={{
                        position: "absolute",
                        right: "8px",
                        top: "50%",
                        transform: "translateY(-50%)",
                        padding: "4px",
                      }}
                    >
                      {showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </div>
                  {errors.confirm_password && (
                    <div className="text-danger">{errors.confirm_password}</div>
                  )}
                </FormGroup>
              </div>
            </div>
          )}

          <div className="row">
            <div className="col-md-6">
              <FormGroup>
                <Label for="mobile_number">მობილური</Label>
                <Input
                  type="text"
                  name="mobile_number"
                  id="mobile_number"
                  value={formData.mobile_number}
                  onChange={handleChange}
                  invalid={!!errors.mobile_number}
                  required
                />
                {errors.mobile_number && (
                  <div className="text-danger">{errors.mobile_number}</div>
                )}
              </FormGroup>
            </div>
            <div className="col-md-6">
              <FormGroup>
                <Label for="position">პოზიცია</Label>
                <Input
                  type="text"
                  name="position"
                  id="position"
                  value={formData.position}
                  onChange={handleChange}
                  invalid={!!errors.position}
                  required
                />
                {errors.position && (
                  <div className="text-danger">{errors.position}</div>
                )}
              </FormGroup>
            </div>
          </div>

          <div className="row">
            <div className="col-md-6">
              <FormGroup>
                <Label for="working_start_date">დაწყების თარიღი</Label>
                <Input
                  type="date"
                  name="working_start_date"
                  id="working_start_date"
                  value={formData.working_start_date}
                  onChange={handleChange}
                />
              </FormGroup>
            </div>
            <div className="col-md-6">
              <FormGroup>
                <Label for="date_of_birth">დაბადების თარიღი</Label>
                <Input
                  type="date"
                  name="date_of_birth"
                  id="date_of_birth"
                  value={formData.date_of_birth}
                  onChange={handleChange}
                />
              </FormGroup>
            </div>
          </div>

          <FormGroup>
            <Label for="id_number">პირადი ნომერი</Label>
            <Input
              type="text"
              name="id_number"
              id="id_number"
              value={formData.id_number}
              onChange={handleChange}
              invalid={!!errors.id_number}
              required
            />
            {errors.id_number && (
              <div className="text-danger">{errors.id_number}</div>
            )}
          </FormGroup>

          <FormGroup>
            <Label for="department_id">დეპარტამენტი</Label>
            <Input
              type="select"
              name="department_id"
              id="department_id"
              value={formData.department_id}
              onChange={handleChange}
              invalid={!!errors.department_id}
              required
            >
              <option value="">აირჩიე დეპარტამენტი</option>
              {departments.map(dept => (
                <option key={dept.id} value={dept.id}>
                  {dept.name}
                </option>
              ))}
            </Input>
            {errors.department_id && (
              <div className="text-danger">{errors.department_id}</div>
            )}
          </FormGroup>
        </ModalBody>
        <ModalFooter className="d-flex gap-2">
          <Button onClick={toggle} color="error">
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
