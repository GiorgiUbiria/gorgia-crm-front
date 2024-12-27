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
      user_id: task?.user_id || currentUser?.id,
      task_title: task?.task_title || "",
      description: task?.description || "",
      priority: task?.priority || "Medium",
      status: task?.status || "Pending",
      ip_address: task?.ip_address || "",
      assigned_to: task?.assigned_to || "",
      due_date: task?.due_date || new Date().toISOString().split("T")[0],
    },
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
      ip_address: Yup.string()
        .required("მიუთითეთ IP მისამართი")
        .matches(
          /^(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)(\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)){3}$/,
          "Invalid IP address format"
        ),
      assigned_to: Yup.string().nullable(),
      due_date: Yup.date().nullable(),
    }),
    onSubmit: async values => {
      try {
        if (isEdit) {
          await updateTaskMutation.mutateAsync({ id: task.id, data: values })
        } else {
          await createTaskMutation.mutateAsync(values)
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

  return (
    <Modal
      isOpen={isOpen}
      toggle={() => toggle(false)}
      className="modal-dialog-centered"
    >
      <ModalHeader toggle={() => toggle(false)} tag="h4">
        {isEdit ? "რედაქტირება" : "ახალი თასქის დამატება"}
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
                    <FormFeedback>{validation.errors.ip_address}</FormFeedback>
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
                  <Label className="form-label">პასუხისმგებელი პირი</Label>
                  <Input
                    name="assigned_to"
                    type="select"
                    className="form-select"
                    onChange={validation.handleChange}
                    onBlur={validation.handleBlur}
                    value={validation.values.assigned_to || ""}
                    invalid={
                      validation.touched.assigned_to &&
                      validation.errors.assigned_to
                    }
                  >
                    <option value="" disabled>
                      აირჩიეთ პასუხისმგებელი პირი
                    </option>
                    {!usersLoading &&
                      usersList.map(user => (
                        <option key={user.id} value={user.id}>
                          {`${user.name} ${user.sur_name}`}
                        </option>
                      ))}
                  </Input>
                  {validation.touched.assigned_to &&
                    validation.errors.assigned_to && (
                      <FormFeedback>
                        {validation.errors.assigned_to}
                      </FormFeedback>
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
