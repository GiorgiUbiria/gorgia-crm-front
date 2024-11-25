import PropTypes from "prop-types"
import React from "react"
import { Modal, ModalBody, ModalHeader, ModalFooter, Button } from "reactstrap"

const DeleteModal = ({ show, onDeleteClick, onCloseClick }) => {
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
            დარწმუნებული ხართ რომ გსურთ ჩანაწერის წაშლა?
          </p>
        </div>
      </ModalBody>
      <ModalFooter>
        <Button color="danger" onClick={onDeleteClick}>
          <i className="bx bx-trash me-1"></i>
          წაშლა
        </Button>
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
  show: PropTypes.any,
}

export default DeleteModal
