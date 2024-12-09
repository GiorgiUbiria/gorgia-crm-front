import React, { useState, useMemo, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { getDailyList } from "services/daily"
import { getDepartments } from "services/auth"
import Button from "@mui/material/Button"
import MuiTable from "components/Mui/MuiTable"
import useIsAdmin from "hooks/useIsAdmin"
import { Row, Col } from "reactstrap"
import AddDailyModal from "./AddDailyModal"
import Breadcrumbs from "components/Common/Breadcrumb"
import * as XLSX from "xlsx"

const Dailies = () => {
  const navigate = useNavigate()
  const isAdmin = useIsAdmin()
  const [addDailyModal, setAddDailyModal] = useState(false)
  const [currentPage, setCurrentPage] = useState(1)
  const [pageSize, setPageSize] = useState(10)
  const [dailiesData, setDailiesData] = useState({ data: [], total: 0 })
  const [departments, setDepartments] = useState([])
  const [isLoading, setIsLoading] = useState(false)

  const fetchDailies = async () => {
    try {
      setIsLoading(true)
      const response = await getDailyList(currentPage, pageSize)
      const sortedData = response.data.data.sort(
        (a, b) => new Date(b.created_at) - new Date(a.created_at)
      )
      setDailiesData({
        data: sortedData,
        total: response.data.total,
      })
    } catch (error) {
      console.error("Error fetching dailies:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const fetchDepartments = async () => {
    try {
      const response = await getDepartments()
      setDepartments(response.data.departments)
    } catch (error) {
      console.error("Error fetching departments:", error)
    }
  }

  useEffect(() => {
    fetchDailies()
  }, [currentPage, pageSize])

  useEffect(() => {
    fetchDepartments()
  }, [])

  const handleRowClick = row => {
    console.log(row)
    navigate(`/tools/daily-results/${row.id}`)
  }

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
        accessor: "user.department.name",
        disableSortBy: true,
      },
      {
        Header: "სახელი/გვარი",
        accessor: "user",
        disableSortBy: true,
        Cell: ({ value }) => value.name + " " + value.sur_name || "-",
      },
    ],
    []
  )

  const filterOptions = [
    {
      field: "user.department.name",
      label: "დეპარტამენტი",
    },
  ]

  const exportToExcel = () => {
    const data = [
      ["დეპარტამენტი", "საკითხის ნომერი", "თარიღი", "საკ��თხი", "სახელი/გვარი"],
      ...dailiesData.data.map(daily => [
        daily.user.department.name,
        daily.id,
        daily.date,
        daily.description,
        daily.user.name + " " + daily.user.sur_name || "-",
      ]),
    ]

    const ws = XLSX.utils.aoa_to_sheet(data)
    const wb = XLSX.utils.book_new()
    XLSX.utils.book_append_sheet(wb, ws, "Users")
    XLSX.writeFile(wb, "დღის საკითხები.xlsx")
  }

  return (
    <div className="page-content bg-gray-50">
      <div className="container-fluid max-w-7xl mx-auto px-4 py-8">
        <Breadcrumbs title="დღიური შეფასება" breadcrumbItem="შეფასებები" />

        <div className="bg-white rounded-xl shadow-sm p-6">
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
                  onClick={() => setAddDailyModal(true)}
                >
                  <i className="bx bx-plus me-1"></i>
                  შეფასების დამატება
                </Button>
              </div>
            </Col>
          </Row>

          <MuiTable
            columns={columns}
            data={dailiesData.data}
            filterOptions={filterOptions}
            searchableFields={["name", "user.department.name", "user.name"]}
            enableSearch={true}
            initialPageSize={pageSize}
            pageSizeOptions={[5, 10, 15, 20]}
            currentPage={currentPage}
            totalItems={dailiesData.total}
            onPageChange={setCurrentPage}
            onPageSizeChange={setPageSize}
            isLoading={isLoading}
            onRowClick={handleRowClick}
            rowClassName="cursor-pointer hover:bg-gray-50"
          />
        </div>

        <AddDailyModal
          isOpen={addDailyModal}
          toggle={() => setAddDailyModal(false)}
          onDailyAdded={fetchDailies}
          departments={departments}
        />
      </div>
    </div>
  )
}

export default Dailies
