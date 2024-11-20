import React, { useState, useEffect } from "react";
import { Modal, ModalHeader, ModalBody, Label, Input, Button, Form } from "reactstrap";
import { getUsers } from "services/admin/department";

const DepartmentForm = ({
  isOpen,
  toggle,
  isEditMode,
  department,
  onSave,
  onAssignHead,
}) => {
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    user_id: "", // for assigning head
    type: "department", // default type
    department_id: "", // include department_id for edit mode
  });
  const [users, setUsers] = useState([]);

  useEffect(() => {
    if (isEditMode && department) {
      setFormData({
        name: department.name || "",
        description: department.description || "",
        user_id: department.head ? department.head.id : "", // If department has a head
        type: department.type || "department", // Existing department type
        department_id: department.id, // Add department_id for assigning head
      });
    }
  }, [isEditMode, department]);

  useEffect(() => {
    if (isEditMode) {
      fetchUsers();
    }
  }, [isEditMode]);

  const fetchUsers = async () => {
    try {
      const res = await getUsers();
      setUsers(res.data.users);
    } catch (err) {
      console.error(err);
    }
  };

  const handleInputChange = (e) => {  
    const { name, value } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  // Handle checkbox changes for the type field
  const handleCheckboxChange = (e) => {
    const isChecked = e.target.checked;

    setFormData((prevState) => ({
      ...prevState,
      type: isChecked ? "purchase_head" : "department", 
    }));
  };

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    if (isEditMode) {
      onAssignHead(formData); // Call the function to assign a head if editing
    } else {
      onSave(formData); // Call the function to save the new department
      setFormData({
        name: "",
        description: "",
        user_id: "", // for assigning head
        type: "department", // default type
        department_id: "", // include department_id for edit mode
      })
    }
  };

  return (
    <Modal isOpen={isOpen} toggle={toggle} className="modal-dialog-centered">
      <ModalHeader toggle={toggle} className="border-bottom pb-3">
        {isEditMode ? "დეპარტამენტის რედაქტირება" : "დეპარტამენტის დამატება"}
      </ModalHeader>
      <ModalBody className="p-4">
        <Form onSubmit={handleSubmit}>
          <div className="mb-3">
            <Label className="form-label">დეპარტამენტის დასახელება</Label>
            <Input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              className="form-control"
              placeholder="შეიყვანეთ დასახელება"
              required
            />
          </div>

          <div className="mb-3">
            <Label className="form-label">აღწერა</Label>
            <Input
              type="textarea"
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              className="form-control"
              placeholder="შეიყვანეთ აღწერა"
              rows="3"
              required
            />
          </div>

          {isEditMode && (
            <div className="mb-3">
              <Label className="form-label">დეპარტამენტის ხელმძღვანელი</Label>
              <Input
                type="select"
                name="user_id"
                value={formData.user_id}
                onChange={handleInputChange}
                className="form-control"
              >
                <option value="">აირჩიეთ ხელმძღვანელი</option>
                {users.map((user) => (
                  <option key={user.id} value={user.id}>
                    {user.name}
                  </option>
                ))}
              </Input>
            </div>
          )}

          <div className="mb-4">
            <div className="form-check">
              <Input
                type="checkbox"
                className="form-check-input"
                id="purchaseHeadCheck"
                onChange={handleCheckboxChange}
                checked={formData.type === "purchase_head"}
              />
              <Label className="form-check-label" for="purchaseHeadCheck">
                შესყიდვების განყოფილება
              </Label>
            </div>
          </div>

          <div className="d-flex justify-content-end gap-2">
            <Button type="button" color="light" onClick={toggle}>
              გაუქმება
            </Button>
            <Button type="submit" color="primary">
              {isEditMode ? "განახლება" : "დამატება"}
            </Button>
          </div>
        </Form>
      </ModalBody>
    </Modal>
  );
};

export default DepartmentForm;
