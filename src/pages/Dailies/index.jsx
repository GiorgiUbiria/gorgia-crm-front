import React, { useState, useMemo } from "react"
import { useNavigate } from "react-router-dom"
import Button from "@mui/material/Button"
import CrmTable from "components/CrmTable"
import { usePermissions } from "hooks/usePermissions"
import AddDailyModal from "./AddDailyModal"
import * as XLSX from "xlsx"
import {
  useGetDepartmentHeadDailies,
  useGetMyDepartmentHeadDailies,
} from "queries/daily"
import useUserRoles from "hooks/useUserRoles"
import { useTheme } from "hooks/useTheme"

const INITIAL_STATE = {
  currentPage: 1,
  pageSize: 10,
  addDailyModal: false,
}

const PAGE_SIZE_OPTIONS = [5, 10, 15, 20]

const Dailies = () => {
  const navigate = useNavigate()
  const { isAdmin } = usePermissions()
  const roles = useUserRoles()
  const user = JSON.parse(sessionStorage.getItem("authUser"))

  const [state, setState] = useState(INITIAL_STATE)
  const { currentPage, pageSize, addDailyModal } = state

  const updateState = newState => {
    setState(prev => ({ ...prev, ...newState }))
  }

  const isAdminOrDepartmentHead =
    roles.includes("admin") || roles.includes("department_head")

  const params = {
    page: currentPage,
    limit: pageSize,
  }

  const {
    data: adminDailiesData,
    isLoading: adminIsLoading,
    refetch: adminRefetch,
  } = useGetDepartmentHeadDailies(params, {
    enabled: isAdminOrDepartmentHead,
  })

  const {
    data: userDailiesData,
    isLoading: userIsLoading,
    refetch: userRefetch,
  } = useGetMyDepartmentHeadDailies(params, {
    enabled: !isAdminOrDepartmentHead,
  })

  const dailiesData = isAdminOrDepartmentHead
    ? adminDailiesData
    : userDailiesData
  const isLoading = isAdminOrDepartmentHead ? adminIsLoading : userIsLoading
  const refetch = isAdminOrDepartmentHead ? adminRefetch : userRefetch

  const handleRowClick = row => {
    navigate(`/tools/daily-results/${row.id}`)
  }

  const handleExpandClick = e => {
    e.stopPropagation()
  }

  const transformedDailies = useMemo(() => {
    return (
      dailiesData?.dailies?.map(daily => ({
        ...daily,
        user_full_name: `${daily.user.name} ${daily.user.sur_name}`,
      })) || []
    )
  }, [dailiesData])

  const filterOptions = useMemo(() => {
    const uniqueDepartments = [
      ...new Set(dailiesData?.dailies?.map(daily => daily.department?.id)),
    ]
      .filter(Boolean)
      .map(deptId => {
        const daily = dailiesData?.dailies?.find(
          d => d.department?.id === deptId
        )
        return {
          value: deptId.toString(),
          label: daily?.department?.name || "",
        }
      })
      .sort((a, b) => a.label.localeCompare(b.label))

    return uniqueDepartments
  }, [dailiesData])

  const filteredData = useMemo(() => {
    return [...transformedDailies]
  }, [transformedDailies])

  const columns = useMemo(
    () => [
      {
        header: "საკითხის ნომერი",
        accessorKey: "id",
        enableSorting: true,
        sortingFn: "number",
        enableColumnFilter: false,
      },
      {
        header: "თარიღი",
        accessorKey: "date",
        cell: ({ getValue }) => (
          <div className="date-wrapper">
            <i className="bx bx-calendar me-2"></i>
            {new Date(getValue()).toLocaleDateString()}
          </div>
        ),
        enableSorting: true,
        sortingFn: "datetime",
        enableColumnFilter: false,
      },
      {
        header: "საკითხი",
        accessorKey: "name",
        enableSorting: false,
        enableColumnFilter: true,
        filterFn: "includes",
        meta: { isSearchable: true },
      },
      {
        header: "დეპარტამენტი",
        accessorKey: "department.name",
        accessorFn: row => row.department?.name,
        enableSorting: false,
        enableColumnFilter: true,
        filterFn: "includes",
        filterOptions: filterOptions.map(opt => ({
          value: opt.label,
          label: opt.label,
        })),
        meta: { isSearchable: true },
      },
      {
        header: "სახელი/გვარი",
        accessorKey: "user_full_name",
        enableSorting: false,
        enableColumnFilter: true,
        filterFn: "includes",
        filterPlaceholder: "სახელი/გვარი...",
        meta: { isSearchable: true },
      },
    ],
    [filterOptions]
  )

  const searchableFields = [
    { value: "name", label: "საკითხი" },
    { value: "department.name", label: "დეპარტამენტი" },
    { value: "user_full_name", label: "სახელი/გვარი" },
  ]

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

  const renderSubComponent = ({ row }) => (
    <div className="p-4 bg-white dark:!bg-gray-900 rounded shadow-sm">
      <div className="d-flex flex-column">
        <h5 className="mb-2 text-primary dark:!text-gray-100">
          საკითხის დეტალები
        </h5>
        <div className="d-flex justify-content-between align-items-center mb-2">
          <span className="fw-bold text-secondary dark:!text-gray-100">
            საკითხი:
          </span>
          <span className="text-dark dark:!text-gray-100">
            {row.original.description}
          </span>
        </div>
        <div className="d-flex justify-content-between align-items-center">
          <span className="fw-bold text-secondary dark:!text-gray-100">
            თარიღი:
          </span>
          <span className="text-dark dark:!text-gray-100">
            {new Date(row.original.date).toLocaleDateString()}
          </span>
        </div>
      </div>
    </div>
  )

  const renderTopToolbar = () => (
    <div className="flex justify-between items-center p-4">
      <div className="flex gap-3">
        {isAdmin && (
          <Button variant="outlined" color="primary" onClick={exportToExcel}>
            <i className="bx bx-export me-1"></i>
            Excel გადმოწერა
          </Button>
        )}
        {(roles.includes("admin") || roles.includes("department_head")) && (
          <Button
            variant="contained"
            color="primary"
            onClick={() => updateState({ addDailyModal: true })}
          >
            <i className="bx bx-plus me-1"></i>
            შეფასების დამატება
          </Button>
        )}
      </div>
    </div>
  )

  const { isDarkMode } = useTheme()

  const handlePageChange = newPage => {
    updateState({ currentPage: newPage + 1 })
  }

  const handlePageSizeChange = newSize => {
    updateState({ pageSize: newSize, currentPage: 1 })
  }

  return (
    <>
      <div className="max-w-9xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="p-4 sm:p-6">
          <CrmTable
            columns={columns}
            data={filteredData}
            searchableFields={searchableFields}
            enableGlobalFilter={true}
            enableFilters={true}
            enableSorting={true}
            enableExpanding={true}
            pageSize={pageSize}
            pageSizeOptions={PAGE_SIZE_OPTIONS}
            initialState={{
              pagination: {
                pageIndex: currentPage - 1,
                pageSize: pageSize,
              },
            }}
            onRowClick={handleRowClick}
            renderSubComponent={renderSubComponent}
            renderTopToolbar={renderTopToolbar}
            manualPagination={true}
            manualSorting={false}
            manualFiltering={false}
            size="md"
            theme={isDarkMode ? "dark" : "light"}
            isLoading={isLoading}
            onPageChange={handlePageChange}
            onPageSizeChange={handlePageSizeChange}
            expandClickHandler={handleExpandClick}
          />
        </div>
      </div>

      <AddDailyModal
        isOpen={addDailyModal}
        toggle={() => updateState({ addDailyModal: false })}
        onDailyAdded={refetch}
        departmentId={user.department_id}
        type="department_head"
      />
    </>
  )
}

export default Dailies
