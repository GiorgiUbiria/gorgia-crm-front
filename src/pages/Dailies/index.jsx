import React, { useState, useMemo, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { getDailies } from "services/daily"
import { getDepartments } from "services/auth"
import Button from "@mui/material/Button"
import MuiTable from "components/Mui/MuiTable"
import { usePermissions } from "hooks/usePermissions"
import AddDailyModal from "./AddDailyModal"
import * as XLSX from "xlsx"

const INITIAL_STATE = {
  currentPage: 1,
  pageSize: 10,
  dailiesData: { data: [], total: 0 },
  isLoading: false,
  addDailyModal: false,
}

const PAGE_SIZE_OPTIONS = [5, 10, 15, 20]

const Dailies = () => {
  const navigate = useNavigate()
  const { isAdmin } = usePermissions()
  const user = JSON.parse(sessionStorage.getItem("authUser"))

  const [state, setState] = useState(INITIAL_STATE)
  const { currentPage, pageSize, dailiesData, isLoading, addDailyModal } = state

  const updateState = newState => {
    setState(prev => ({ ...prev, ...newState }))
  }

  const fetchDailies = async () => {
    try {
      updateState({ isLoading: true })
      const params = { page: currentPage, limit: pageSize }
      const { dailies } = await getDailies("department_head", params)
      updateState({
        dailiesData: {
          data: dailies,
          total: dailies.length,
        },
      })
    } catch (error) {
      console.error("Error fetching regular dailies:", error)
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
    console.log(dailiesData)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentPage, pageSize])

  useEffect(() => {
    fetchDepartments()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const handleRowClick = row => {
    navigate(`/tools/daily-results/${row.id}`)
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
    const uniqueDepartments = [
      ...new Set(dailiesData.data.map(daily => daily.department?.id)),
    ]
      .filter(Boolean)
      .map(deptId => {
        const daily = dailiesData.data.find(d => d.department?.id === deptId)
        return {
          value: deptId,
          label: daily?.department?.name || "",
        }
      })
      .sort((a, b) => a.label.localeCompare(b.label))

    console.log("Unique Departments:", uniqueDepartments)

    return [
      {
        field: "department.id",
        label: "დეპარტამენტი",
        options: [{ value: "", label: "ყველა" }, ...uniqueDepartments],
      },
    ]
  }, [dailiesData.data])

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
    XLSX.utils.book_append_sheet(wb, ws, "Regular Dailies")
    XLSX.writeFile(wb, "Regular_Dailies.xlsx")
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
    <>
      <div className="max-w-9xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="p-4 sm:p-6">
          <div className="mb-4">
            <div className="flex gap-3">
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
          </div>

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
      </div>

      <AddDailyModal
        isOpen={addDailyModal}
        toggle={() => updateState({ addDailyModal: false })}
        onDailyAdded={fetchDailies}
        departmentId={user.department_id}
        type="regular"
      />
    </>
  )
}

export default Dailies
