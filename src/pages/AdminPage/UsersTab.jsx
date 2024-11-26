import React from "react"
import { Button, Input } from "reactstrap"
import {
  FaSearch,
  FaPlus,
  FaTrash,
  FaFileDownload,
  FaEdit,
} from "react-icons/fa"
import MuiTable from "components/Mui/MuiTable"

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
        <MuiTable />
      </div>
    </>
  )
}

export default UsersTab
