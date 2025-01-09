import React from "react"
import {
  Modal,
  ModalHeader,
  ModalBody,
  Form,
  Row,
  Col,
  Label,
  Input,
  FormFeedback,
  Button,
  Spinner,
} from "reactstrap"
import { useFormik } from "formik"
import * as Yup from "yup"
import useCurrentUser from "../../../hooks/useCurrentUser"
import Select from "react-select"

const TaskModal = ({
  isOpen,
  toggle,
  isEdit,
  task,
  userRoles,
  usersList,
  usersLoading,
  createTaskMutation,
  updateTaskMutation,
}) => {
  const { currentUser, isLoading: userLoading } = useCurrentUser()

  const validation = useFormik({
    enableReinitialize: true,
    initialValues: {
      user_id: task?.data?.user?.id || currentUser?.id,
      task_title: task?.data?.task_title || "",
      description: task?.data?.description || "",
      priority: task?.data?.priority || "Medium",
      phone_number: task?.data?.phone_number || "",
      assigned_users:
        task?.data?.assigned_users?.map(user => ({
          value: user.id,
          label: `${user.name} ${user.sur_name}`,
        })) || [],
      due_date: task?.data?.due_date || new Date().toISOString().split("T")[0],
    },
    validationSchema: Yup.object({
      user_id: Yup.number().required("User ID is required"),
      task_title: Yup.string().required("მიუთითეთ პრობლემის ტიპი"),
      description: Yup.string().nullable(),
      priority: Yup.string()
        .required("მიუთითეთ პრიორიტეტი")
        .oneOf(["Low", "Medium", "High"]),
      phone_number: Yup.string()
        .required("მიუთითეთ ტელეფონის ნომერი")
        .matches(/^[0-9+\-\s()]*$/, "Invalid phone number format"),
      assigned_users: Yup.array().of(
        Yup.object().shape({
          value: Yup.number().required(),
          label: Yup.string().required(),
        })
      ),
      due_date: Yup.date().nullable(),
    }),
    onSubmit: async values => {
      try {
        const formData = {
          ...values,
          assigned_users: values.assigned_users.map(user => user.value),
        }

        if (isEdit) {
          await updateTaskMutation.mutateAsync({ id: task.id, data: formData })
        } else {
          await createTaskMutation.mutateAsync(formData)
        }

        validation.resetForm()
        toggle(false)
      } catch (error) {
        console.error("Error submitting form:", error)
      }
    },
  })

  if (userLoading) {
    return (
      <Modal isOpen={isOpen} className="modal-dialog-centered">
        <ModalBody>
          <div className="text-center p-4">
            <Spinner color="primary" />
          </div>
        </ModalBody>
      </Modal>
    )
  }

  if (!currentUser) {
    toggle(false)
    return null
  }

  const userOptions =
    usersList?.map(user => ({
      value: user.id,
      label: `${user.name} ${user.sur_name}`,
    })) || []

  return (
    <Modal
      isOpen={isOpen}
      toggle={() => toggle(false)}
      className="modal-dialog-centered"
    >
      <ModalHeader toggle={() => toggle(false)} tag="h4">
        {isEdit ? "რედაქტირება" : "ახალი თილეთის გახსნა"}
      </ModalHeader>
      <ModalBody>
        <Form
          onSubmit={e => {
            e.preventDefault()
            validation.handleSubmit()
            return false
          }}
        >
          <Row>
            <Col xs="12">
              <div className="mb-3">
                <Label className="form-label">აირჩიეთ პრობლემის ტიპი</Label>
                <Input
                  name="task_title"
                  type="select"
                  className="form-select"
                  onChange={validation.handleChange}
                  onBlur={validation.handleBlur}
                  value={validation.values.task_title || ""}
                  invalid={
                    validation.touched.task_title &&
                    validation.errors.task_title
                  }
                >
                  <option value="" disabled hidden>
                    აირჩიეთ პრობლემის ტიპი
                  </option>
                  <option value="პრინტერის პრობლემა">პრინტერის პრობლემა</option>
                  <option value="სერვისი">სერვისი</option>
                  <option value="პაროლის აღდგენა">პაროლის აღდგენა</option>
                  <option value="ელ-ფოსტის პრობლემა">ელ-ფოსტის პრობლემა</option>
                  <option value="ტექნიკური პრობლემა">ტექნიკური პრობლემა</option>
                  <option value="სერვისის პრობლემა">სერვისის პრობლემა</option>
                  <option value="ფაილების აღდგენა">ფაილების აღდგენა</option>
                  <option value="სხვა">სხვა</option>
                </Input>
                {validation.touched.task_title &&
                  validation.errors.task_title && (
                    <FormFeedback>{validation.errors.task_title}</FormFeedback>
                  )}
              </div>
              <div className="mb-3">
                <Label className="form-label">აღწერა</Label>
                <Input
                  name="description"
                  type="textarea"
                  className="form-control"
                  placeholder="აღწერეთ პრობლემა"
                  rows="4"
                  onChange={validation.handleChange}
                  onBlur={validation.handleBlur}
                  value={validation.values.description || ""}
                  invalid={
                    validation.touched.description &&
                    validation.errors.description
                  }
                />
                {validation.touched.description &&
                  validation.errors.description && (
                    <FormFeedback>{validation.errors.description}</FormFeedback>
                  )}
              </div>
              <div className="mb-3">
                <Label className="form-label">ტელეფონის ნომერი</Label>
                <Input
                  name="phone_number"
                  type="text"
                  className="form-control"
                  placeholder="ჩაწერეთ თელეფონის ნომერი"
                  onChange={validation.handleChange}
                  onBlur={validation.handleBlur}
                  value={validation.values.phone_number || ""}
                  invalid={
                    validation.touched.phone_number &&
                    validation.errors.phone_number
                  }
                />
                {validation.touched.phone_number &&
                  validation.errors.phone_number && (
                    <FormFeedback>
                      {validation.errors.phone_number}
                    </FormFeedback>
                  )}
              </div>
              <div className="mb-3">
                <Label className="form-label">პრიორიტეტი</Label>
                <Input
                  name="priority"
                  type="select"
                  className="form-select"
                  onChange={validation.handleChange}
                  onBlur={validation.handleBlur}
                  value={validation.values.priority || ""}
                  invalid={
                    validation.touched.priority && validation.errors.priority
                  }
                >
                  <option value="Low">დაბალი</option>
                  <option value="Medium">საშუალო</option>
                  <option value="High">მაღალი</option>
                </Input>
                {validation.touched.priority && validation.errors.priority && (
                  <FormFeedback>{validation.errors.priority}</FormFeedback>
                )}
              </div>
              {userRoles.includes("admin") && (
                <div className="mb-3">
                  <Label className="form-label">პასუხისმგებელი პირები</Label>
                  <Select
                    isMulti
                    name="assigned_users"
                    options={userOptions}
                    className="basic-multi-select"
                    classNamePrefix="select"
                    value={validation.values.assigned_users}
                    onChange={selectedOptions => {
                      validation.setFieldValue(
                        "assigned_users",
                        selectedOptions || []
                      )
                    }}
                    onBlur={() =>
                      validation.setFieldTouched("assigned_users", true)
                    }
                    isLoading={usersLoading}
                  />
                  {validation.touched.assigned_users &&
                    validation.errors.assigned_users && (
                      <div className="text-danger mt-1">
                        {validation.errors.assigned_users}
                      </div>
                    )}
                </div>
              )}
              <div className="mb-3">
                <Label className="form-label">შესრულების ვადა</Label>
                <Input
                  name="due_date"
                  type="date"
                  className="form-control"
                  onChange={validation.handleChange}
                  onBlur={validation.handleBlur}
                  value={validation.values.due_date || ""}
                  invalid={
                    validation.touched.due_date && validation.errors.due_date
                  }
                />
                {validation.touched.due_date && validation.errors.due_date && (
                  <FormFeedback>{validation.errors.due_date}</FormFeedback>
                )}
              </div>
            </Col>
          </Row>
          <Row>
            <Col>
              <div className="text-end mt-4">
                <Button
                  color="success"
                  type="submit"
                  className="w-full sm:w-auto"
                >
                  გაგზავნა
                </Button>
              </div>
            </Col>
          </Row>
        </Form>
      </ModalBody>
    </Modal>
  )
}

export default TaskModal
