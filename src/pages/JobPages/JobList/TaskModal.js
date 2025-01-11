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
import { SearchableSelect } from "../../../components/Select"

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

  const initialValues = {
    user_id: currentUser?.id || "",
    task_title: task?.task_title || "",
    description: task?.description || "",
    priority: task?.priority || "Low",
    status: task?.status || "Pending",
    ip_address: task?.ip_address || "",
    phone_number: task?.phone_number || "",
    assigned_users:
      task?.assigned_users?.map(user => ({
        value: user.id,
        label: `${user.name} ${user.sur_name}`,
      })) || [],
    due_date: task?.due_date || null,
  }

  const validation = useFormik({
    enableReinitialize: true,
    initialValues,
    validationSchema: Yup.object({
      user_id: Yup.number().required("User ID is required"),
      task_title: Yup.string().required("მიუთითეთ პრობლემის ტიპი"),
      description: Yup.string().nullable(),
      priority: Yup.string()
        .required("მიუთითეთ პრიორიტეტი")
        .oneOf(["Low", "Medium", "High"]),
      status: Yup.string()
        .required("მიუთითეთ სტატუსი")
        .oneOf(["Pending", "In Progress", "Completed", "Cancelled"]),
      ip_address: Yup.string().when("task_title", {
        is: task_title =>
          [
            "პრინტერის პრობლემა",
            "ელ-ფოსტის პრობლემა",
            "ფაილების აღდგენა",
          ].includes(task_title),
        then: schema =>
          schema
            .required("მიუთითეთ IP მისამართი")
            .matches(
              /^(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)(\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)){3}$/,
              "Invalid IP address format"
            ),
        otherwise: schema => schema.nullable(),
      }),
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
        const isAdmin = userRoles.includes("admin")
        const isITSupport = userRoles.includes("it_support")
        const isDepartmentHead =
          userRoles.includes("department_head") &&
          currentUser?.department_id === 5

        const formData = {
          ...values,
          assigned_users:
            isAdmin || isITSupport || isDepartmentHead
              ? values.assigned_users.map(user => user.value)
              : [currentUser.id],
        }

        if (isEdit && task?.id) {
          await updateTaskMutation.mutateAsync({
            id: task.id,
            data: formData,
          })
        } else if (isEdit) {
          console.error("Cannot update task: missing task ID")
          return
        } else {
          await createTaskMutation.mutateAsync(formData)
        }

        validation.resetForm()
        toggle(false)
      } catch (error) {
        console.error("TaskModal - Submission Error:", error)
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

  const userOptions = usersLoading
    ? []
    : usersList?.map(user => ({
        value: user.id,
        label: `${user.name} ${user.sur_name}`,
      })) || []

  return (
    <Modal
      isOpen={isOpen}
      toggle={() => toggle(false)}
      className="modal-dialog-centered"
    >
      <style>
        {`
          .select__menu {
            background-color: white !important;
            border: 1px solid #e5e7eb;
            box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
          }
          .select__option {
            background-color: white;
            color: #374151;
          }
          .select__option--is-focused {
            background-color: #f3f4f6 !important;
          }
          .select__option--is-selected {
            background-color: #e5e7eb !important;
            color: #111827;
          }
        `}
      </style>
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
              {[
                "პრინტერის პრობლემა",
                "ელ-ფოსტის პრობლემა",
                "ფაილების აღდგენა",
              ].includes(validation.values.task_title) && (
                <div className="mb-3">
                  <Label className="form-label">IP მისამართი</Label>
                  <Input
                    name="ip_address"
                    type="text"
                    className="form-control"
                    placeholder="ჩაწერეთ თქვენი იპ მისამართი"
                    onChange={validation.handleChange}
                    onBlur={validation.handleBlur}
                    value={validation.values.ip_address || ""}
                    invalid={
                      validation.touched.ip_address &&
                      validation.errors.ip_address
                    }
                  />
                  {validation.touched.ip_address &&
                    validation.errors.ip_address && (
                      <FormFeedback>
                        {validation.errors.ip_address}
                      </FormFeedback>
                    )}
                </div>
              )}
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
              {(userRoles.includes("admin") ||
                userRoles.includes("it_support")) && (
                <div className="mb-3">
                  <Label className="form-label">პასუხისმგებელი პირები</Label>
                  <SearchableSelect
                    isMulti
                    name="assigned_users"
                    options={userOptions}
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
                    error={validation.errors.assigned_users}
                    touched={validation.touched.assigned_users}
                    placeholder="აირჩიეთ პასუხისმგებელი პირები"
                  />
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
