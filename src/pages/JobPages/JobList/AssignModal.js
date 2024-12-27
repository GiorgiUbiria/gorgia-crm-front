import React from "react"
import { Modal, ModalHeader, ModalBody, Form, Button } from "reactstrap"
import { toast } from "react-toastify"

const AssignModal = ({ isOpen, toggle, onAssign }) => {
  const handleClose = () => {
    toggle(false)
  }

  const handleSubmit = async e => {
    e.preventDefault()
    try {
      await onAssign()
      toast.success("დავალება მიღებულია")
      handleClose()
    } catch (error) {
      toast.error(error.response?.data?.message || "დავალების მიღების დროს დაფიქსირდა შეცდომა")
    }
  }

  return (
    <Modal
      isOpen={isOpen}
      toggle={handleClose}
      className="modal-dialog-centered"
    >
      <ModalHeader toggle={handleClose} tag="h4">
        დავალების მიღება
      </ModalHeader>
      <ModalBody>
        <Form onSubmit={handleSubmit}>
          <div className="text-center mb-4">
            <i
              className="mdi mdi-check-circle-outline text-success"
              style={{ fontSize: "3rem" }}
            ></i>
            <h5 className="mt-3">
              დარწმუნებული ხართ, რომ გსურთ ამ დავალების მიღება?
            </h5>
            <p className="text-muted">
              დავალების მიღების შემდეგ თქვენ გახდებით პასუხისმგებელი მის
              შესრულებაზე
            </p>
          </div>
          <div className="d-flex justify-content-center gap-2">
            <Button type="button" color="secondary" onClick={handleClose}>
              გაუქმება
            </Button>
            <Button type="submit" color="primary">
              დავალების მიღება
            </Button>
          </div>
        </Form>
      </ModalBody>
    </Modal>
  )
}

export default AssignModal
