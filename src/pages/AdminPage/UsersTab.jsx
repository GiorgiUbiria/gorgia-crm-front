import React, { useState, useMemo } from "react"
import Button from "@mui/material/Button"
import MuiTable from "components/Mui/MuiTable"
import Dialog from "@mui/material/Dialog"
import DialogActions from "@mui/material/DialogActions"
import DialogContent from "@mui/material/DialogContent"
import DialogContentText from "@mui/material/DialogContentText"
import DialogTitle from "@mui/material/DialogTitle"
import * as XLSX from "xlsx"
import { Row, Col } from "reactstrap"
import AddUserModal from "./AddUserModal"
import EditUserModal from "./EditUserModal"
import { usePermissions } from "hooks/usePermissions"
import {
  useDeleteUser,
  useApproveDepartmentMember,
  useRejectDepartmentMember,
} from "../../queries/admin"

const UsersTab = ({
  users = [],
  onUserDeleted,
  isDepartmentHead = false,
  currentUserDepartmentId,
}) => {
  const { isAdmin, isHrMember } = usePermissions()
  const { mutateAsync: deleteUserMutation } = useDeleteUser()
  const { mutateAsync: approveMemberMutation } = useApproveDepartmentMember()
  const { mutateAsync: rejectMemberMutation } = useRejectDepartmentMember()

  const [confirmModal, setConfirmModal] = useState({
    isOpen: false,
    type: null,
    userId: null,
  })
  const [addUserModal, setAddUserModal] = useState(false)
  const [editUserModal, setEditUserModal] = useState({
    isOpen: false,
    user: null,
  })

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
    try {
      const { type, userId } = confirmModal

      if ((isDepartmentHead || isHrMember) && currentUserDepartmentId) {
        if (type === "delete") {
          await deleteUserMutation(userId)
        } else if (type === "approve") {
          await approveMemberMutation({
            departmentId: currentUserDepartmentId,
            userId,
          })
        } else if (type === "reject") {
          await rejectMemberMutation({
            departmentId: currentUserDepartmentId,
            userId,
          })
        }
      }

      if (type === "delete") {
        await deleteUserMutation(userId)
      } else if (type === "approve") {
        await approveMemberMutation({
          departmentId: currentUserDepartmentId,
          userId,
        })
      } else if (type === "reject") {
        await rejectMemberMutation({
          departmentId: currentUserDepartmentId,
          userId,
        })
      }

      onUserDeleted()
      handleModalClose()
    } catch (error) {
      console.error("Error performing action:", error)
    }
  }

  const handleAddUserClick = () => {
    setAddUserModal(true)
  }

  const canManageUser = user => {
    if (isAdmin) return true
    if (isDepartmentHead && user.department_id === currentUserDepartmentId)
      return true
    if (isHrMember) return true
    return false
  }

  const columns = useMemo(
    () => [
      {
        Header: "#",
        accessor: "id",
      },
      {
        Header: "სახელი/გვარი",
        accessor: "name.fullName",
      },
      {
        Header: "პირადი ნომერი",
        accessor: "user_id",
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
        Cell: ({ value }) =>
          value ? (
            <div className="date-wrapper">
              <i className="bx bx-calendar me-2"></i>
              {new Date(value).toLocaleDateString()}
            </div>
          ) : (
            "-"
          ),
      },
      {
        Header: "სპერაცია",
        accessor: "status",
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
                value === "accepted"
                  ? "#e8f5e9"
                  : value === "pending"
                  ? "#fff3e0"
                  : value === "rejected"
                  ? "#ffebee"
                  : "#f5f5f5",
              color:
                value === "accepted"
                  ? "#2e7d32"
                  : value === "pending"
                  ? "#e65100"
                  : value === "rejected"
                  ? "#c62828"
                  : "#757575",
            }}
          >
            {value === "accepted"
              ? "აქტიური"
              : value === "pending"
              ? "მოლოდინში"
              : value === "rejected"
              ? "უარყოფილი"
              : value}
          </span>
        ),
      },
      {
        Header: "მოქმედებები",
        accessor: "actions",
        disableSortBy: true,
        Cell: ({ row }) => {
          const user = row.original
          if (!canManageUser(user)) return null

          return (
            <div className="d-flex flex-column gap-2">
              {(isDepartmentHead || isAdmin || isHrMember) &&
                user.status === "pending" && (
                  <div className="d-flex gap-2 mb-2">
                    <Button
                      onClick={() => handleModalOpen("approve", user.id)}
                      color="success"
                      variant="contained"
                      size="small"
                      startIcon={<i className="bx bx-check" />}
                      style={{ width: "100%" }}
                    >
                      დადასტურება
                    </Button>
                    <Button
                      onClick={() => handleModalOpen("reject", user.id)}
                      color="error"
                      variant="contained"
                      size="small"
                      startIcon={<i className="bx bx-x" />}
                      style={{ width: "100%" }}
                    >
                      უარყოფა
                    </Button>
                  </div>
                )}
              <div className="d-flex gap-2">
                <Button
                  onClick={() =>
                    setEditUserModal({ isOpen: true, user: row.original })
                  }
                  color="primary"
                  variant="contained"
                  size="small"
                  startIcon={<i className="bx bx-edit" />}
                  style={{ width: "100%" }}
                >
                  რედაქტირება
                </Button>
                {(isAdmin || isHrMember) && (
                  <Button
                    onClick={() => handleModalOpen("delete", user.id)}
                    color="error"
                    variant="outlined"
                    size="small"
                    startIcon={<i className="bx bx-trash" />}
                    style={{ width: "100%" }}
                  >
                    წაშლა
                  </Button>
                )}
              </div>
            </div>
          )
        },
      },
    ],
    [canManageUser, isDepartmentHead, isAdmin, isHrMember]
  )

  const transformedUsers = useMemo(() => {
    if (!Array.isArray(users)) return []

    return users.map(user => ({
      ...user,
      id: user.id,
      role:
        user.roles?.length > 0
          ? user.roles?.map(role => role.name).join(", ")
          : "არ აქვს როლი მინიჭებული",
      position: user.position || "-",
      name: {
        fullName: `${user.name || ""} ${user.sur_name || ""}`.trim() || "-",
        firstName: user.name || "-",
        lastName: user.sur_name || "-",
      },
      email: user.email || "-",
      department: user.department?.name || "არ არის მითითებული",
      mobile_number: user.mobile_number || "-",
      working_start_date: user.working_start_date || null,
      status: user.status || "pending",
      user_id: user.id_number || "-",
    }))
  }, [users])

  const exportToExcel = () => {
    const data = [
      [
        "სახელი/გვარი",
        "პირადი ნომერი",
        "ელ-ფოსტა",
        "დეპარტამენტი",
        "მობილური",
        "დაწყების თარიღი",
        "როლი",
      ],
      ...transformedUsers.map(user => [
        user.name.fullName,
        user.user_id,
        user.email,
        user.department,
        user.mobile_number,
        user.working_start_date
          ? new Date(user.working_start_date).toLocaleDateString()
          : "-",
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
          {(isAdmin || isDepartmentHead || isHrMember) && (
            <Button
              variant="contained"
              color="primary"
              onClick={handleAddUserClick}
            >
              <i className="bx bx-plus me-1"></i>
              მომხმარებლის დამატება
            </Button>
          )}
          <Button variant="outlined" color="primary" onClick={exportToExcel}>
            <i className="bx bx-download me-1"></i>
            ექსპორტი Excel-ში
          </Button>
        </Col>
      </Row>

      <MuiTable
        columns={columns}
        data={transformedUsers}
        filterOptions={[
          {
            field: "status",
            label: "სტატუსი",
            valueLabels: {
              accepted: "აქტიური",
              pending: "მოლოდინში",
              rejected: "უარყოფილი",
            },
          },
        ]}
        searchableFields={["name.fullName", "email"]}
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
          {confirmModal.type === "delete"
            ? "მომხმარებლის წაშლა"
            : confirmModal.type === "approve"
            ? "მომხმარებლის დადასტურება"
            : "მომხმარებლის უარყოფა"}
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            {confirmModal.type === "delete"
              ? "დარწმუნებული ხართ, რომ გსურთ მომხმარებლის წაშლა?"
              : confirmModal.type === "approve"
              ? "დარწმუნებული ხართ, რომ გსურთ მომხმარებლის დადასტურება?"
              : "დარწმუნებული ხართ, რომ გსურთ მომხმარებლის უარყოფა?"}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleModalClose} color="primary">
            გაუქმება
          </Button>
          <Button
            onClick={handleConfirmAction}
            color={confirmModal.type === "approve" ? "success" : "error"}
            autoFocus
          >
            {confirmModal.type === "delete"
              ? "წაშლა"
              : confirmModal.type === "approve"
              ? "დადასტურება"
              : "უარყოფა"}
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
        isDepartmentHead={isDepartmentHead}
        currentUserDepartmentId={currentUserDepartmentId}
      />
    </div>
  )
}

export default UsersTab
