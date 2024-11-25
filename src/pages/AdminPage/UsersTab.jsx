import React from "react"
import { Button, Input, Badge, Container, Row, Col } from "reactstrap"
import {
  FaSearch,
  FaPlus,
  FaTrash,
  FaFileDownload,
  FaEdit,
} from "react-icons/fa"
import ModernTable from "components/ModernTable"
import Breadcrumbs from "components/Common/Breadcrumb"

const UsersTab = ({
  searchTerm,
  setSearchTerm,
  openUserModal,
  filteredUsers,
  handleDeleteUser,
  exportUsersToExcel,
  isAdmin,
  searchInputStyle,
  searchIconStyle,
}) => {
  return (
    <>
      <div className="flex-column flex-sm-row d-flex gap-3 align-items-stretch align-items-sm-center mb-4">
        <div className="search-box w-100">
          <div className="position-relative">
            <Input
              type="text"
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              placeholder="მოძებნეთ მომხმარებელი..."
              style={searchInputStyle}
            />
            <FaSearch style={searchIconStyle} />
          </div>
        </div>
        <div className="d-flex gap-2 flex-shrink-0">
          {isAdmin && (
            <div className="d-flex gap-2 flex-wrap">
              <Button
                color="success"
                onClick={exportUsersToExcel}
                className="d-flex align-items-center"
                size="sm"
              >
                <FaFileDownload className="me-1" />
                <span className="d-none d-sm-inline">ექსპორტი</span>
              </Button>
              <Button
                color="primary"
                onClick={() => openUserModal(null)}
                className="d-flex align-items-center"
                size="sm"
              >
                <FaPlus className="me-1" />
                <span className="d-none d-sm-inline">
                  მომხმარებლის დამატება
                </span>
              </Button>
            </div>
          )}
        </div>
      </div>

      <div className="table-responsive">
        <ModernTable
          data={filteredUsers}
          columns={[
            {
              header: "#",
              field: "index",
              render: (_, index) => index + 1,
              style: { width: "5%" },
              cellClassName: "text-center",
            },
            {
              header: "გვარი",
              field: "sur_name",
              style: { width: "25%" },
              render: item => (
                <div className="d-flex align-items-center">
                  <div className="avatar-xs me-2">
                    <span className="avatar-title rounded-circle bg-info text-white">
                      {item.sur_name?.charAt(0)}
                    </span>
                  </div>
                  {item.sur_name}
                </div>
              ),
            },
            {
              header: "სახელი",
              field: "name",
              style: { width: "25%" },
            },
            {
              header: "ელ-ფოსტა",
              field: "email",
              style: { width: "25%" },
            },
            {
              header: "დეპარტამენტი",
              field: "department",
              style: { width: "20%" },
              className: "d-none d-md-table-cell",
              render: item =>
                item.department?.name || (
                  <Badge color="warning" pill>
                    არ არის მითითებული
                  </Badge>
                ),
            },
            {
              header: "როლი",
              field: "role",
              style: { width: "10%" },
              className: "d-none d-md-table-cell",
              render: item => (
                <Badge color="info" pill>
                  {item.role}
                </Badge>
              ),
            },
            {
              header: "მოქმედება",
              style: { width: "15%" },
              cellClassName: "text-center",
              render: item => (
                <div className="d-flex justify-content-center">
                  <Button
                    color="primary"
                    size="sm"
                    className="me-2"
                    onClick={() => openUserModal(item)}
                  >
                    <FaEdit />
                  </Button>
                  <Button
                    color="danger"
                    size="sm"
                    onClick={() => handleDeleteUser(item)}
                  >
                    <FaTrash />
                  </Button>
                </div>
              ),
            },
          ]}
          currentPage={1}
          itemsPerPage={10}
          totalItems={filteredUsers.length}
          onPageChange={() => {}}
        />
      </div>
    </>
  )
}

export default UsersTab
