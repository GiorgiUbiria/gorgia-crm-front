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
    <Modal isOpen={isOpen} toggle={toggle}>
      <ModalHeader toggle={toggle}>
        {isEditMode ? "Edit Department" : "Add Department"}
      </ModalHeader>
      <ModalBody>
        <Form onSubmit={handleSubmit}>
          <Label for="name">Department Name</Label>
          <Input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleInputChange}
            required
          />
          <Label for="description" className="mt-3">Department Description</Label>
          <Input
            type="textarea"
            name="description"
            value={formData.description}
            onChange={handleInputChange}
            required
          />

          {isEditMode && (
            <>
              <Label for="user_id" className="mt-3">Assign Department Head</Label>
              <Input
                type="select"
                name="user_id"
                value={formData.user_id}
                onChange={handleInputChange}
              >
                <option value="">-- Select a User --</option>
                {users.map((user) => (
                  <option key={user.id} value={user.id}>
                    {user.name} - {user.email}
                  </option>
                ))}
              </Input>
            </>
          )}

          {/* Type Checkbox */}
          <div className="mt-3">
            <Label check>
              <Input
                type="checkbox"
                onChange={handleCheckboxChange}
              />
              {" "}
              Mark as Purchase Head
            </Label>
          </div>

          <Button type="submit" color="success" className="mt-3 ">
            {isEditMode ? "Update Department" : "Add Department"}
          </Button>
        </Form>
      </ModalBody>
    </Modal>
  );
};

export default DepartmentForm;
