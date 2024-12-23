import React, { useState, useMemo } from "react"
import { deleteDepartment } from "services/admin/department"
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

const DepartmentsTab = ({ departments = [], onDepartmentDeleted, users }) => {
  const { isAdmin } = usePermissions()
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
      await deleteDepartment(departmentId)
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

  const columns = useMemo(
    () => [
      {
        Header: "#",
        accessor: "id",
      },
      {
        Header: "სახელი",
        accessor: "name",
        disableSortBy: true,
        Cell: ({ value }) => (
          <div className="d-flex align-items-center">
            <span className="user-name">{value}</span>
          </div>
        ),
      },
      {
        Header: "დეპარტამენტის უფროსი",
        accessor: "department_head",
        disableSortBy: true,
      },
      {
        Header: "მოქმედებები",
        accessor: "actions",
        disableSortBy: true,
        Cell: ({ row }) =>
          isAdmin && (
            <div className="d-flex gap-2">
              <Button
                onClick={() =>
                  setEditDepartmentModal({
                    isOpen: true,
                    department: row.original,
                  })
                }
                color="primary"
                variant="contained"
              >
                რედაქტირება
              </Button>
              <Button
                onClick={() => handleModalOpen("delete", row.original.id)}
                color="error"
                variant="contained"
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
      department_head: department.head
        ? `${department.head.name || ""} ${
            department.head.sur_name || ""
          }`.trim() || "არ არის მითითებული"
        : "არ არის მითითებული",
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
