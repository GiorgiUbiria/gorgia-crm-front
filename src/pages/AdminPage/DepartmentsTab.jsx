import React, { useMemo } from "react"
import MuiTable from "components/Mui/MuiTable"
import { Button, Input } from "reactstrap"
import { FaSearch, FaPlus } from "react-icons/fa"

const DepartmentsTab = ({
  departmentSearchTerm,
  setDepartmentSearchTerm,
  openDepartmentModal,
  filteredDepartments,
  handleDeleteDepartment,
  searchInputStyle,
  searchIconStyle,
}) => {
  const columns = useMemo(
    () => [
      {
        Header: "#",
        accessor: "id",
      },
      {
        Header: "დეპარტამენტის სახელი",
        accessor: "name",
      },
      {
        Header: "მენეჯერი",
        accessor: "manager",
      },
      {
        Header: "აქცია",
        accessor: "actions",
        Cell: ({ row }) => (
          <div>
            <Button
              color="primary"
              size="sm"
              onClick={() => openDepartmentModal(row.original)}
            >
              რედაქტირება
            </Button>
            <Button
              color="danger"
              size="sm"
              onClick={() => handleDeleteDepartment(row.original)}
            >
              წაშლა
            </Button>
          </div>
        ),
      },
    ],
    [openDepartmentModal, handleDeleteDepartment]
  );

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
        <MuiTable
          columns={columns}
          data={filteredDepartments}
          initialPageSize={10}
          pageSizeOptions={[5, 10, 15, 20]}
          enableSearch={true}
          onRowClick={(row) => {}}
        />
      </div>
    </>
  )
}

export default DepartmentsTab
