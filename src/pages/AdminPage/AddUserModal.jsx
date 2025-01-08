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
  FormFeedback,
  Button,
} from "reactstrap"
import Autocomplete from "@mui/material/Autocomplete"
import TextField from "@mui/material/TextField"
import { useCreateUser } from "../../queries/admin"
import { getRoles } from "services/role"
import { getPublicDepartments } from "services/admin/department"

const initialFormData = {
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
  roles: [4],
}

const AddUserModal = ({ isOpen, toggle, onUserAdded }) => {
  const { mutateAsync: createUserMutation } = useCreateUser()
  const [formData, setFormData] = useState(initialFormData)
  const [departments, setDepartments] = useState([])
  const [availableRoles, setAvailableRoles] = useState([])
  const [errors, setErrors] = useState({})

  useEffect(() => {
    const fetchDepartments = async () => {
      try {
        const response = await getPublicDepartments()
        setDepartments(response.data?.data || response.data || [])
      } catch (error) {
        console.error("Error fetching departments:", error)
      }
    }
    fetchDepartments()
  }, [])

  useEffect(() => {
    const fetchRoles = async () => {
      try {
        const rolesResponse = await getRoles()
        setAvailableRoles(rolesResponse.data.roles || [])
      } catch (error) {
        console.error("Error fetching roles:", error)
      }
    }
    fetchRoles()
  }, [])

  const handleChange = e => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }))
  }

  const validateForm = () => {
    const newErrors = {}
    const georgianRegex = /^[\u10A0-\u10FF]{2,30}$/
    const emailRegex = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i
    const phoneRegex = /^[0-9]{9,}$/
    const idNumberRegex = /^[0-9]+$/

    if (!formData.name?.trim()) {
      newErrors.name = "სახელი სავალდებულოა."
    } else if (!georgianRegex.test(formData.name)) {
      newErrors.name =
        "სახელი უნდა შეიცავდეს მხოლოდ ქართულ ასოებს (2-30 სიმბოლო)."
    }

    if (!formData.sur_name?.trim()) {
      newErrors.sur_name = "გვარი სავალდებულოა."
    } else if (!georgianRegex.test(formData.sur_name)) {
      newErrors.sur_name =
        "გვარი უნდა შეიცავდეს მხოლოდ ქართულ ასოებს (2-30 სიმბოლო)."
    }

    if (!formData.email?.trim()) {
      newErrors.email = "ელ-ფოსტა სავალდებულოა."
    } else if (!emailRegex.test(formData.email)) {
      newErrors.email = "ელ-ფოსტა სავალდებულოა."
    } else if (!formData.email.toLowerCase().endsWith("@gorgia.ge")) {
      newErrors.email = "ელ-ფოსტა უნდა მთავრდებოდეს @gorgia.ge-ით."
    }

    if (!formData.password?.trim()) {
      newErrors.password = "პაროლი სავალდებულოა."
    }

    if (!formData.mobile_number?.trim()) {
      newErrors.mobile_number = "მობილურის ნომერი სავალდებულოა."
    } else if (!phoneRegex.test(formData.mobile_number)) {
      newErrors.mobile_number =
        "მობილურის ნომერი უნდა შეიცავდეს მხოლოდ ციფრებს და მინიმუმ 9 ციფრს."
    }

    if (!formData.id_number?.trim()) {
      newErrors.id_number = "პირადი ნომერი სავალდებულოა."
    } else if (!idNumberRegex.test(formData.id_number)) {
      newErrors.id_number = "პირადი ნომერი უნდა შეიცავდეს მხოლოდ ციფრებს."
    }

    if (!formData.department_id) {
      newErrors.department_id = "დეპარტამენტი სავალდებულოა."
    }

    if (!formData.position?.trim()) {
      newErrors.position = "პოზიცია სავალდებულოა."
    }

    if (!formData.roles || formData.roles.length === 0) {
      newErrors.roles = "მინიმუმ ერთი როლის მითითება აუცილებელია."
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async e => {
    e.preventDefault()
    if (!validateForm()) return

    try {
      const userData = {
        name: formData.name,
        sur_name: formData.sur_name,
        email: formData.email,
        password: formData.password,
        mobile_number: formData.mobile_number,
        position: formData.position,
        department_id: Number(formData.department_id),
        location: formData.location,
        working_start_date: formData.working_start_date,
        date_of_birth: formData.date_of_birth,
        id_number: formData.id_number,
        roles: formData.roles,
      }

      await createUserMutation(userData)
      onUserAdded()
      toggle()
      setFormData(initialFormData)
      setErrors({})
    } catch (error) {
      console.error("Error creating user:", error)
      alert("მომხმარებლის შექმნა ვერ მოხერხდა")
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
                {errors.name && <FormFeedback>{errors.name}</FormFeedback>}
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
                  <FormFeedback>{errors.sur_name}</FormFeedback>
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
                {errors.email && <FormFeedback>{errors.email}</FormFeedback>}
              </FormGroup>
            </div>
            <div className="col-md-6">
              <FormGroup>
                <Label for="password">პაროლი</Label>
                <Input
                  type="password"
                  name="password"
                  id="password"
                  value={formData.password}
                  onChange={handleChange}
                  invalid={!!errors.password}
                  required
                />
                {errors.password && (
                  <FormFeedback>{errors.password}</FormFeedback>
                )}
              </FormGroup>
            </div>
          </div>

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
                  <FormFeedback>{errors.mobile_number}</FormFeedback>
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
                  <FormFeedback>{errors.position}</FormFeedback>
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
              <FormFeedback>{errors.id_number}</FormFeedback>
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
              <FormFeedback>{errors.department_id}</FormFeedback>
            )}
          </FormGroup>

          <FormGroup>
            <Label for="roles">როლები</Label>
            <Autocomplete
              multiple
              options={availableRoles}
              getOptionLabel={option => option.name}
              value={availableRoles.filter(role =>
                formData.roles.includes(role.id)
              )}
              onChange={(event, value) => {
                setFormData(prevData => ({
                  ...prevData,
                  roles: value.map(role => role.id),
                }))
              }}
              renderInput={params => (
                <TextField
                  {...params}
                  variant="outlined"
                  placeholder="აირჩიე როლები"
                  error={!!errors.roles}
                  helperText={
                    errors.roles
                      ? errors.roles
                      : "მინიმუმ ერთი რროლის მითითება აუცილებელია"
                  }
                />
              )}
            />
            {errors.roles && (
              <FormFeedback style={{ display: "block" }}>
                {errors.roles}
              </FormFeedback>
            )}
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

export default AddUserModal
