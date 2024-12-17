import React, { useState, useMemo, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { getRegularDailies, getMyRegularDailies } from "services/daily"
import { getDepartments } from "services/auth"
import Button from "@mui/material/Button"
import MuiTable from "components/Mui/MuiTable"
import useIsAdmin from "hooks/useIsAdmin"
import { Row, Col } from "reactstrap"
import AddDailyModal from "./AddDailyModal"
import Breadcrumbs from "components/Common/Breadcrumb"
import useUserRoles from "hooks/useUserRoles"
import * as XLSX from "xlsx"

const INITIAL_STATE = {
  currentPage: 1,
  pageSize: 10,
  dailiesData: { data: [], total: 0 },
  departments: [],
  isLoading: false,
  addDailyModal: false,
}

const PAGE_SIZE_OPTIONS = [5, 10, 15, 20]

const DailiesInner = () => {
  const navigate = useNavigate()
  const isAdmin = useIsAdmin()
  const user = JSON.parse(sessionStorage.getItem("authUser"))
  const userRoles = useUserRoles()

  const [state, setState] = useState(INITIAL_STATE)
  const {
    currentPage,
    pageSize,
    dailiesData,
    departments,
    isLoading,
    addDailyModal,
  } = state

  const updateState = newState => {
    setState(prev => ({ ...prev, ...newState }))
  }

  const fetchDailies = async () => {
    try {
      updateState({ isLoading: true })
      const params = { page: currentPage, limit: pageSize }

      let dailiesResponse

      if (userRoles.includes("admin") || userRoles.includes("department_head")) {
        dailiesResponse = await getRegularDailies(params)
      } else {
        dailiesResponse = await getMyRegularDailies(params)
      }
      updateState({
        dailiesData: {
          data: dailiesResponse.dailies,
          total: dailiesResponse.dailies.length,
        },
      })
    } catch (error) {
      console.error("Error fetching department head dailies:", error)
    } finally {
      updateState({ isLoading: false })
    }
  }

  const fetchDepartments = async () => {
    try {
      const response = await getDepartments()
      updateState({ departments: response.data.departments })
    } catch (error) {
      console.error("Error fetching departments:", error)
    }
  }

  useEffect(() => {
    fetchDailies()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentPage, pageSize])

  useEffect(() => {
    fetchDepartments()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const handleRowClick = row => {
    navigate(`/tools/inner-daily-results/${row.id}`)
  }

  const transformedDailies = useMemo(() => {
    return dailiesData.data.map(daily => ({
      ...daily,
      user_full_name: `${daily.user.name} ${daily.user.sur_name}`,
    }))
  }, [dailiesData])

  const columns = useMemo(
    () => [
      {
        Header: "საკითხის ნომერი",
        accessor: "id",
      },
      {
        Header: "თარიღი",
        accessor: "date",
        Cell: ({ value }) => (
          <div className="date-wrapper">
            <i className="bx bx-calendar me-2"></i>
            {new Date(value).toLocaleDateString()}
          </div>
        ),
      },
      {
        Header: "საკითხი",
        accessor: "name",
        disableSortBy: true,
      },
      {
        Header: "დეპარტამენტი",
        accessor: "department.name",
        disableSortBy: true,
      },
      {
        Header: "სახელი/გვარი",
        accessor: "user_full_name",
        disableSortBy: true,
      },
    ],
    []
  )

  const filterOptions = useMemo(() => {
    const departmentOptions = departments
      .filter(dept => dept.type === "department")
      .map(department => ({
        value: department.name,
        label: department.name,
      }))
      .sort((a, b) => a.label.localeCompare(b.label))

    return [
      {
        field: "department.name",
        label: "დეპარტამენტი",
        options: [{ value: "", label: "ყველა" }, ...departmentOptions],
      },
    ]
  }, [departments])

  const exportToExcel = () => {
    const headers = [
      "დეპარტამენტი",
      "საკითხის ნომერი",
      "თარიღი",
      "საკითხი",
      "სახელი/გვარი",
    ]
    const data = [
      headers,
      ...transformedDailies.map(daily => [
        daily.department.name,
        daily.id,
        daily.date,
        daily.description,
        (daily.user && `${daily.user.name} ${daily.user.sur_name}`) || "-",
      ]),
    ]

    const ws = XLSX.utils.aoa_to_sheet(data)
    const wb = XLSX.utils.book_new()
    XLSX.utils.book_append_sheet(wb, ws, "Department Head Dailies")
    XLSX.writeFile(wb, "Department_Head_Dailies.xlsx")
  }

  const renderExpandedRow = row => (
    <div className="p-4 bg-white rounded shadow-sm">
      <div className="d-flex flex-column">
        <h5 className="mb-2 text-primary">საკითხის დეტალები</h5>
        <div className="d-flex justify-content-between align-items-center mb-2">
          <span className="fw-bold text-secondary">საკითხი:</span>
          <span className="text-dark">{row.description}</span>
        </div>
        <div className="d-flex justify-content-between align-items-center">
          <span className="fw-bold text-secondary">თარიღი:</span>
          <span className="text-dark">
            {new Date(row.date).toLocaleDateString()}
          </span>
        </div>
      </div>
    </div>
  )

  return (
    <div className="page-content bg-gray-100">
      <div className="container-fluid max-w-7xl mx-auto px-4 py-8">
        <Breadcrumbs title="დღიური შეფასება" breadcrumbItem="დეპარტამენტის დღის შედეგები" />

        <div className="bg-white rounded-xl shadow p-6">
          <Row className="mb-3">
            <Col className="d-flex justify-content-between align-items-center">
              <div style={{ display: "flex", gap: "1rem" }}>
                {isAdmin && (
                  <Button
                    variant="outlined"
                    color="primary"
                    onClick={exportToExcel}
                  >
                    <i className="bx bx-export me-1"></i>
                    Excel გადმოწერა
                  </Button>
                )}
                <Button
                  variant="contained"
                  color="primary"
                  onClick={() => updateState({ addDailyModal: true })}
                >
                  <i className="bx bx-plus me-1"></i>
                  შეფასების დამატება
                </Button>
              </div>
            </Col>
          </Row>

          <MuiTable
            columns={columns}
            data={transformedDailies}
            filterOptions={filterOptions}
            searchableFields={["name", "department.name"]}
            enableSearch={true}
            initialPageSize={pageSize}
            pageSizeOptions={PAGE_SIZE_OPTIONS}
            currentPage={currentPage}
            totalItems={dailiesData.total}
            onPageChange={page => updateState({ currentPage: page })}
            onPageSizeChange={size => updateState({ pageSize: size })}
            isLoading={isLoading}
            onRowClick={handleRowClick}
            renderRowDetails={renderExpandedRow}
            rowClassName="cursor-pointer hover:bg-gray-50"
          />
        </div>

        <AddDailyModal
          isOpen={addDailyModal}
          toggle={() => updateState({ addDailyModal: false })}
          onDailyAdded={fetchDailies}
          departmentId={user.department_id}
          type="department_head"
        />
      </div>
    </div>
  )
}

export default DailiesInner
