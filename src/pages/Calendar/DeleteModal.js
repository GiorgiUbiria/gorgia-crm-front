import PropTypes from "prop-types"
import React from "react"
import { Modal, ModalBody, ModalHeader, ModalFooter, Button } from "reactstrap"

const DeleteModal = ({
  show,
  onDeleteClick,
  onCloseClick,
  isRecurring,
  onDeleteAllClick,
}) => {
  return (
    <Modal isOpen={show} toggle={onCloseClick}>
      <ModalHeader toggle={onCloseClick}>წაშლის დადასტურება</ModalHeader>
      <ModalBody>
        <div className="text-center">
          <div className="avatar-sm mb-4 mx-auto">
            <div className="avatar-title bg-danger text-danger bg-opacity-10 font-size-20 rounded-3">
              <i className="mdi mdi-trash-can-outline"></i>
            </div>
          </div>
          <p className="text-muted font-size-16">
            დარწმუნებული ხართ რომ გსურთ შეხვედრის წაშლა?
          </p>
          {isRecurring && (
            <p className="text-muted font-size-14 mt-2">
              ეს არის განმეორებადი შეხვედრა. გსურთ მხოლოდ ამ შეხვედრის წაშლა თუ
              ყველა მომავალი შეხვედრის?
            </p>
          )}
        </div>
      </ModalBody>
      <ModalFooter>
        <Button color="danger" onClick={onDeleteClick}>
          <i className="bx bx-trash me-1"></i>
          {isRecurring ? "წაშალე მხოლოდ ეს" : "წაშლა"}
        </Button>
        {isRecurring && (
          <Button color="warning" onClick={onDeleteAllClick}>
            <i className="bx bx-trash-alt me-1"></i>
            წაშალე ყველა
          </Button>
        )}
        <Button color="secondary" onClick={onCloseClick}>
          გაუქმება
        </Button>
      </ModalFooter>
    </Modal>
  )
}

DeleteModal.propTypes = {
  onCloseClick: PropTypes.func,
  onDeleteClick: PropTypes.func,
  onDeleteAllClick: PropTypes.func,
  show: PropTypes.bool,
  isRecurring: PropTypes.bool,
}

export default DeleteModal
