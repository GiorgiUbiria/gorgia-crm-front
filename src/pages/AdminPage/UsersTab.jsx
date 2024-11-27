import React, { useState, useMemo } from "react"
import { deleteUser } from "services/admin/department"
import Button from "@mui/material/Button"
import MuiTable from "components/Mui/MuiTable"
import useIsAdmin from "hooks/useIsAdmin"
import Dialog from "@mui/material/Dialog"
import DialogActions from "@mui/material/DialogActions"
import DialogContent from "@mui/material/DialogContent"
import DialogContentText from "@mui/material/DialogContentText"
import DialogTitle from "@mui/material/DialogTitle"
import * as XLSX from "xlsx"
import { Row, Col } from "reactstrap"
import AddUserModal from "./AddUserModal"
import EditUserModal from "./EditUserModal"

const UsersTab = ({ users = [], onUserDeleted }) => {
  const isAdmin = useIsAdmin()
  const [confirmModal, setConfirmModal] = useState({
    isOpen: false,
    type: null,
    userId: null,
  })
  const [addUserModal, setAddUserModal] = useState(false)
  const [editUserModal, setEditUserModal] = useState({ isOpen: false, user: null })

  const handleModalOpen = (type, userId) => {
    setConfirmModal({
      isOpen: true,
      type,
      userId,
    })
  }

  const handleModalClose = () => {
    setConfirmModal({
      isOpen: false,
      type: null,
      userId: null,
    })
  }

  const handleConfirmAction = async () => {
    const { type, userId } = confirmModal
    await deleteUser(userId)
    handleModalClose()
  }

  const handleAddUserClick = () => {
    setAddUserModal(true)
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
        Cell: ({ value }) => (
          <div className="d-flex align-items-center">
            <span className="user-name">{value}</span>
          </div>
        ),
      },
      {
        Header: "ელ-ფოსტა",
        accessor: "email",
        disableSortBy: true,
      },
      {
        Header: "დეპარტამენტი",
        accessor: "department",
        disableSortBy: true,
      },
      {
        Header: "მობილური ნომერი",
        accessor: "mobile_number",
        disableSortBy: true,
      },
      {
        Header: "დაწყების თარიღი",
        accessor: "working_start_date",
        Cell: ({ value }) => (
          <div className="date-wrapper">
            <i className="bx bx-calendar me-2"></i>
            {new Date(value).toLocaleDateString()}
          </div>
        ),
      },
      {
        Header: "როლი",
        accessor: "role",
        Cell: ({ value }) => (
          <span
            style={{
              padding: "6px 12px",
              borderRadius: "4px",
              display: "inline-flex",
              alignItems: "center",
              fontSize: "0.875rem",
              fontWeight: 500,
              backgroundColor:
                value === "Administrator"
                  ? "#fff3e0"
                  : value === "VIP User"
                  ? "#ffebee"
                  : value === "Regular User"
                  ? "#e8f5e9"
                  : "#f5f5f5",
              color:
                value === "Administrator"
                  ? "#e65100"
                  : value === "VIP User"
                  ? "#c62828"
                  : value === "Regular User"
                  ? "#2e7d32"
                  : "#757575",
            }}
          >
            {value}
          </span>
        ),
      },
      {
        Header: "მოქმედებები",
        accessor: "actions",
        disableSortBy: true,
        Cell: ({ row }) =>
          isAdmin && (
            <div className="d-flex gap-2">
              <Button
                onClick={() => setEditUserModal({ isOpen: true, user: row.original })}
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
    []
  )

  const transformedUsers = useMemo(() => {
    if (!Array.isArray(users)) return []

    return users.map(user => ({
      id: user.id,
      role:
        user.roles?.length > 0
          ? user.roles?.map(role => role.name).join(", ")
          : "არ აქვს როლი მინიჭებული",
      position: user.position,
      name: user.name + " " + user.sur_name,
      email: user.email,
      department: user.department?.name || "არ არის მითითებული",
      id_number: user.id_number,
      mobile_number: user.mobile_number,
      working_start_date: user.working_start_date
        ? new Date(user.working_start_date).toLocaleDateString()
        : "",
    }))
  }, [users])

  const filterOptions = [
    {
      field: "role",
      label: "როლი",
      valueLabels: {
        admin: "ადმინისტრატორი",
        user: "ჩვეულებრივი",
        vip: "VIP",
      },
    },
  ]

  const exportToExcel = () => {
    const data = [
      [
        "სახელი",
        "ელ-ფოსტა",
        "დეპარტამენტი",
        "მობილური",
        "დაწყების თარიღი",
        "როლი",
      ],
      ...transformedUsers.map(user => [
        user.name,
        user.email,
        user.department,
        user.mobile_number,
        user.working_start_date,
        user.role,
      ]),
    ]

    const ws = XLSX.utils.aoa_to_sheet(data)
    const wb = XLSX.utils.book_new()
    XLSX.utils.book_append_sheet(wb, ws, "Users")
    XLSX.writeFile(wb, "მომხმარებლები.xlsx")
  }

  return (
    <div>
      <Row className="mb-3">
        <Col className="d-flex justify-content-end gap-2">
          <Button
            variant="contained"
            color="primary"
            onClick={handleAddUserClick}
          >
            <i className="bx bx-plus me-1"></i>
            მომხმარებლის დამატება
          </Button>
          <Button variant="outlined" color="primary" onClick={exportToExcel}>
            <i className="bx bx-download me-1"></i>
            ექსპორტი Excel-ში
          </Button>
        </Col>
      </Row>

      <MuiTable
        columns={columns}
        data={transformedUsers}
        filterOptions={filterOptions}
        searchableFields={["name", "email", "department", "role"]}
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
          {"მომხმარებლის წაშლა"}
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            დარწმუნებული ხართ, რომ გსურთ მომხმარებლის წაშლა?
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

      <AddUserModal
        isOpen={addUserModal}
        toggle={() => setAddUserModal(false)}
        onUserAdded={onUserDeleted}
      />

      <EditUserModal
        isOpen={editUserModal.isOpen}
        user={editUserModal.user}
        toggle={() => setEditUserModal({ isOpen: false, user: null })}
        onUserUpdated={onUserDeleted}
      />
    </div>
  )
}

export default UsersTab
