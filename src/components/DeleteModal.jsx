import React from "react"
import { Modal, ModalHeader, ModalBody, ModalFooter, Button } from "reactstrap"
import { Typography } from "@mui/material"

const DeleteModal = ({ isOpen, toggle, onDelete }) => (
  <Modal isOpen={isOpen} toggle={toggle}>
    <ModalHeader toggle={toggle}>
      <Typography variant="h6">ჩანაწერის წაშლა</Typography>
    </ModalHeader>
    <ModalBody>
      დარწმუნებული ხართ, რომ გსურთ ამ ჩანაწერის წაშლა? ეს მოქმედება ვერ
      დაბრუნდება.
    </ModalBody>
    <ModalFooter>
      <Button color="secondary" onClick={toggle}>
        გაუქმება
      </Button>
      <Button color="danger" onClick={onDelete}>
        წაშლა
      </Button>
    </ModalFooter>
  </Modal>
)

export default DeleteModal
