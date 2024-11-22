import React from 'react';
import { Modal, ModalBody, Button } from 'reactstrap';

const DeleteConfirmationModal = ({ isOpen, toggle, onConfirm }) => {
  return (
    <Modal isOpen={isOpen} toggle={toggle} centered size="sm">
      <ModalBody className="text-center p-4">
        <div className="mb-3">
          <i className="fas fa-exclamation-circle text-danger" style={{ fontSize: '3rem' }}></i>
        </div>
        <h5 className="mb-3">კომენტარის წაშლა</h5>
        <p className="text-muted mb-4">
          ნამდვილად გსურთ კომენტარის წაშლა?
          ეს მოქმედება შეუქცევადია.
        </p>
        <div className="d-flex justify-content-center gap-2">
          <Button
            color="secondary"
            onClick={toggle}
            size="sm"
            className="px-3"
          >
            გაუქმება
          </Button>
          <Button
            color="danger"
            onClick={() => {
              onConfirm();
              toggle();
            }}
            size="sm"
            className="px-3"
          >
            წაშლა
          </Button>
        </div>
      </ModalBody>
    </Modal>
  );
};

export default DeleteConfirmationModal; 