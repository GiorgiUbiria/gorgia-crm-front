import React from "react"
import { Modal, ModalHeader, ModalBody, Button } from "reactstrap"
import { toast } from "react-toastify"

const DeleteModal = ({ show, onDeleteClick, onCloseClick }) => {
  const handleDelete = async () => {
    try {
      await onDeleteClick()
      toast.success("დავალება წაშლილია")
      onCloseClick()
    } catch (error) {
      toast.error(error.response?.data?.message || "დავალების წაშლის დროს დაფიქსირდა შეცდომა")
    }
  }

  return (
    <Modal
      isOpen={show}
      toggle={onCloseClick}
      className="modal-dialog-centered"
    >
      <ModalHeader toggle={onCloseClick} tag="h4">
        დავალების წაშლა
      </ModalHeader>
      <ModalBody>
        <div className="text-center mb-4">
          <i
            className="mdi mdi-alert-circle-outline text-danger"
            style={{ fontSize: "3rem" }}
          ></i>
          <h5 className="mt-3">
            დარწმუნებული ხართ, რომ გსურთ ამ დავალების წაშლა?
          </h5>
          <p className="text-muted">
            ამ დავალების წაშლის შემდეგ, მისი აღდგენა შეუძლებელი იქნება.
          </p>
        </div>
        <div className="d-flex justify-content-center gap-2">
          <Button type="button" color="secondary" onClick={onCloseClick}>
            გაუქმება
          </Button>
          <Button type="button" color="danger" onClick={handleDelete}>
            წაშლა
          </Button>
        </div>
      </ModalBody>
    </Modal>
  )
}

export default DeleteModal
