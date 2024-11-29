import React, { useState, useMemo, useEffect } from "react"
import { getDailyList } from "services/daily"
import { getDepartments } from "services/auth"
import Button from "@mui/material/Button"
import MuiTable from "components/Mui/MuiTable"
import useIsAdmin from "hooks/useIsAdmin"
import { Row, Col } from "reactstrap"
import AddDailyModal from "./AddDailyModal"
import Breadcrumbs from "components/Common/Breadcrumb"

const Dailies = () => {
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
      },
      {
        Header: "დეპარტამენტი",
        accessor: "user.department.name",
      },
      {
        Header: "სახელი/გვარი",
        accessor: "user.name",
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

  const exportToCSV = () => {
    const csvRows = []
    const headers = columns.map(col => col.Header)
    csvRows.push(headers.join(","))

    dailiesData.data.forEach(row => {
      const values = columns.map(col => {
        const accessor = col.accessor.split(".")
        let value = row
        accessor.forEach(key => {
          value = value ? value[key] : ""
        })
        return `"${value || ""}"`
      })
      csvRows.push(values.join(","))
    })

    const csvContent = `data:text/csv;charset=utf-8,${csvRows.join("\n")}`
    const link = document.createElement("a")
    link.href = encodeURI(csvContent)
    link.setAttribute("download", "დღიური_შეფასებები.csv")
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
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
                    onClick={exportToCSV}
                  >
                    <i className="bx bx-export me-1"></i>
                    CSV გადმოწერა
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
