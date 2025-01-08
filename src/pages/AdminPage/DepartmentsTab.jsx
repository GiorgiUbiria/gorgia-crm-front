import React, { useState, useMemo } from "react"
import Button from "@mui/material/Button"
import MuiTable from "components/Mui/MuiTable"
import { usePermissions } from "hooks/usePermissions"
import Dialog from "@mui/material/Dialog"
import DialogActions from "@mui/material/DialogActions"
import DialogContent from "@mui/material/DialogContent"
import DialogContentText from "@mui/material/DialogContentText"
import DialogTitle from "@mui/material/DialogTitle"
import * as XLSX from "xlsx"
import { Row, Col } from "reactstrap"
import AddDepartmentModal from "./AddDepartmentModal"
import EditDepartmentModal from "./EditDepartmentModal"
import { useDeleteDepartment } from "../../queries/admin"

const DepartmentsTab = ({ departments = [], onDepartmentDeleted, users }) => {
  const { isAdmin } = usePermissions()
  const { mutateAsync: deleteDepartmentMutation } = useDeleteDepartment()

  const [confirmModal, setConfirmModal] = useState({
    isOpen: false,
    type: null,
    departmentId: null,
  })
  const [addDepartmentModal, setAddDepartmentModal] = useState(false)
  const [editDepartmentModal, setEditDepartmentModal] = useState({
    isOpen: false,
    department: null,
  })

  const handleModalOpen = (type, departmentId) => {
    setConfirmModal({
      isOpen: true,
      type,
      departmentId,
    })
  }

  const handleModalClose = () => {
    setConfirmModal({
      isOpen: false,
      type: null,
      departmentId: null,
    })
  }

  const handleConfirmAction = async () => {
    const { departmentId } = confirmModal
    try {
      await deleteDepartmentMutation(departmentId)
      onDepartmentDeleted()
      handleModalClose()
    } catch (error) {
      console.error("Error deleting department:", error)
      alert("დეპარტამენტის წაშლა ვერ მოხერხდა")
    }
  }

  const handleAddDepartmentClick = () => {
    setAddDepartmentModal(true)
  }

  const handleEditClick = (department) => {
    setEditDepartmentModal({
      isOpen: true,
      department: department,
    });
  };

  const handleDeleteClick = (department) => {
    handleModalOpen("delete", department.id);
  };

  const columns = useMemo(
    () => [
      {
        Header: "სახელი",
        accessor: "name",
      },
      {
        Header: "აღწერა",
        accessor: "description",
        Cell: ({ value }) => value || "-",
      },
      {
        Header: "დეპარტამენტის უფროსი",
        accessor: "department_head",
        Cell: ({ row }) => {
          const head = row.original.department_head;
          if (head) {
            return head.name + (head.sur_name ? ` ${head.sur_name}` : '');
          }
          return "-";
        },
      },
      {
        Header: "მოქმედებები",
        accessor: "actions",
        Cell: ({ row }) => (
          <div className="d-flex gap-2">
            <Button
              variant="contained"
              color="primary"
              size="small"
              onClick={() => handleEditClick(row.original)}
            >
              რედაქტირება
            </Button>
            <Button
              variant="contained"
              color="error"
              size="small"
              onClick={() => handleDeleteClick(row.original)}
            >
              წაშლა
            </Button>
          </div>
        ),
      },
    ],
    [isAdmin]
  )

  const transformedDepartments = useMemo(() => {
    if (!Array.isArray(departments)) return []

    return departments.map(department => ({
      id: department.id,
      name: department.name,
      description: department.description,
      department_head: department.department_head,
      actions: null // placeholder for actions column
    }))
  }, [departments])

  const filterOptions = [
    {
      field: "name",
      label: "სახელი",
    },
    {
      field: "department_head",
      label: "დეპარტამენტის უფროსი",
    },
  ]

  const exportToExcel = () => {
    const data = [
      ["სახელი", "დეპარტამენტის უფროსი"],
      ...transformedDepartments.map(department => [
        department.name,
        department.department_head,
      ]),
    ]

    const ws = XLSX.utils.aoa_to_sheet(data)
    const wb = XLSX.utils.book_new()
    XLSX.utils.book_append_sheet(wb, ws, "Departments")
    XLSX.writeFile(wb, "დეპარტამენტები.xlsx")
  }

  return (
    <div>
      <Row className="mb-3">
        <Col className="d-flex justify-content-end gap-2">
          {isAdmin && (
            <>
              <Button
                variant="contained"
                color="primary"
                onClick={handleAddDepartmentClick}
              >
                <i className="bx bx-plus me-1"></i>
                დეპარტამენტის დამატება
              </Button>
              <Button
                variant="outlined"
                color="primary"
                onClick={exportToExcel}
              >
                <i className="bx bx-download me-1"></i>
                ექსპორტი Excel-ში
              </Button>
            </>
          )}
        </Col>
      </Row>

      <MuiTable
        columns={columns}
        data={transformedDepartments}
        filterOptions={filterOptions}
        searchableFields={["name"]}
        enableSearch={true}
        initialPageSize={10}
        pageSizeOptions={[5, 10, 15, 20]}
      />

      <Dialog
        open={confirmModal.isOpen}
        onClose={handleModalClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">
          {"დეპარტამენტის წაშლა"}
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            დარწმულებული ხართ, რომ გსურთ დეპარტამენტის წაშლა?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleModalClose} color="primary">
            გაუქმება
          </Button>
          <Button onClick={handleConfirmAction} color="error" autoFocus>
            წაშლა
          </Button>
        </DialogActions>
      </Dialog>

      <AddDepartmentModal
        isOpen={addDepartmentModal}
        toggle={() => setAddDepartmentModal(false)}
        onDepartmentAdded={onDepartmentDeleted}
        users={users}
      />

      <EditDepartmentModal
        isOpen={editDepartmentModal.isOpen}
        department={editDepartmentModal.department}
        toggle={() =>
          setEditDepartmentModal({ isOpen: false, department: null })
        }
        onDepartmentUpdated={onDepartmentDeleted}
        users={users}
      />
    </div>
  )
}

export default DepartmentsTab
