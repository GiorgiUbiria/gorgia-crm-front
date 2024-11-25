import React from "react"
import { Button, Input, Badge, Container, Row, Col } from "reactstrap"
import { FaSearch, FaPlus, FaTrash, FaEdit } from "react-icons/fa"
import ModernTable from "components/ModernTable"

const DepartmentsTab = ({
  departmentSearchTerm,
  setDepartmentSearchTerm,
  openDepartmentModal,
  filteredDepartments,
  handleDeleteDepartment,
  searchInputStyle,
  searchIconStyle,
}) => {
  return (
    <>
      <div className="page-title-box">
        <h4 className="mb-4">დეპარტამენტების სია</h4>
      </div>

      <div className="flex-column flex-sm-row d-flex gap-3 align-items-stretch align-items-sm-center mb-4">
        <div className="search-box w-100">
          <div className="position-relative">
            <Input
              type="text"
              value={departmentSearchTerm}
              onChange={e => setDepartmentSearchTerm(e.target.value)}
              placeholder="მოძებნეთ დეპარტამენტი..."
              style={searchInputStyle}
            />
            <FaSearch style={searchIconStyle} />
          </div>
        </div>
        <Button
          color="info"
          style={{ backgroundColor: "#105D8D", borderColor: "#105D8D" }}
          onClick={() => openDepartmentModal(null)}
          className="d-flex align-items-center flex-shrink-0"
          size="sm"
        >
          <FaPlus className="me-1" />
          <span className="d-none d-sm-inline">დეპარტამენტის დამატება</span>
        </Button>
      </div>

      <div className="table-responsive">
        <ModernTable
          data={filteredDepartments}
          columns={[
            {
              header: "#",
              field: "index",
              render: (_, index) => index + 1,
              style: { width: "5%" },
              cellClassName: "text-center",
            },
            {
              header: "დეპარტამენტი",
              field: "name",
              style: { width: "25%" },
            },
            {
              header: "ხელმძღვანელი",
              field: "head",
              style: { width: "50%" },
              className: "d-md-table-cell",
              render: item =>
                item.head ? (
                  <div className="d-flex align-items-center">
                    <div className="avatar-xs me-2">
                      <span className="avatar-title rounded-circle bg-info text-white">
                        {item.head.name.charAt(0)}
                      </span>
                    </div>
                    {item.head.name}
                  </div>
                ) : (
                  <Badge color="warning" pill>
                    არ არის მითითებული
                  </Badge>
                ),
            },
            {
              header: "მოქმედება",
              style: { width: "20%" },
              cellClassName: "text-center",
              render: item => (
                <div className="d-flex justify-content-center">
                  <Button
                    color="info"
                    style={{ backgroundColor: "#105D8D", borderColor: "#105D8D" }}
                    size="sm"
                    className="me-2"
                    onClick={() => openDepartmentModal(item)}
                  >
                    <FaEdit />
                  </Button>
                  <Button
                    color="danger"
                    size="sm"
                    onClick={() => handleDeleteDepartment(item.id, item.name)}
                  >
                    <FaTrash />
                  </Button>
                </div>
              ),
            },
          ]}
          currentPage={1}
          itemsPerPage={10}
          totalItems={filteredDepartments.length}
          onPageChange={() => {}}
        />
      </div>
    </>
  )
}

export default DepartmentsTab
