import React, { useState, useCallback } from "react"
import { CrmTable } from "components/CrmTable"
import { useGetDepartmentHeadDailies } from "queries/daily"
import CrmDialog, { DialogButton } from "components/CrmDialogs/Dialog"
import { AddDailyForm } from "./components/form"
import { renderSubComponent } from "./components/subComponent"
import CrmSpinner from "components/CrmSpinner"
import { useNavigate } from "react-router-dom"
import * as XLSX from "xlsx"

const Dailies = () => {
  const [isAddModalOpen, setIsAddModalOpen] = useState(false)
  const navigate = useNavigate()
  const { data: dailiesData, isLoading: isLoading } =
    useGetDepartmentHeadDailies()

  const handleRowClick = React.useCallback(
    row => {
      navigate(`/tools/daily-results/${row.original.id}`)
    },
    [navigate]
  )

  const transformedDailies = React.useMemo(() => {
    return (
      dailiesData?.dailies?.map(daily => ({
        ...daily,
        user_full_name: `${daily.user.name} ${daily.user.sur_name}`,
      })) || []
    )
  }, [dailiesData])

  const columns = React.useMemo(
    () => [
      {
        id: "expander",
        header: () => null,
        cell: ({ row }) => {
          return row.getCanExpand() ? (
            <button
              {...{
                onClick: e => {
                  e.stopPropagation()
                  row.getToggleExpandedHandler()(e)
                },
                style: { cursor: "pointer" },
              }}
            >
              {row.getIsExpanded() ? "👇" : "👉"}
            </button>
          ) : (
            "🔵"
          )
        },
        enableColumnFilter: false,
        enableSorting: false,
      },
      {
        accessorFn: row => row.id,
        id: "id",
        cell: info => info.getValue(),
        header: () => <span>საკითხის ნომერი</span>,
        enableColumnFilter: false,
        sortingFn: "basic",
        sortDescFirst: true,
      },
      {
        accessorKey: "date",
        header: () => "თარიღი",
        cell: info => (
          <div className="flex items-center gap-2">
            <span className="i-bx-calendar" />
            {new Date(info.getValue()).toLocaleDateString()}
          </div>
        ),
        enableColumnFilter: false,
        sortingFn: "datetime",
        sortDescFirst: true,
      },
      {
        accessorKey: "name",
        header: () => <span>საკითხი</span>,
        meta: {
          filterVariant: "text",
        },
        enableSorting: false,
      },
      {
        accessorFn: row => row.department.name,
        id: "department",
        header: "დეპარტამენტი",
        meta: {
          filterVariant: "select",
        },
        enableSorting: false,
      },
      {
        accessorFn: row => row.user_full_name,
        id: "user_full_name",
        header: () => <span>სახელი/გვარი</span>,
        meta: {
          filterVariant: "text",
        },
        enableSorting: false,
      },
    ],
    []
  )

  const exportToExcel = useCallback(() => {
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
        daily.user_full_name || "-",
      ]),
    ]

    const ws = XLSX.utils.aoa_to_sheet(data)
    const wb = XLSX.utils.book_new()
    XLSX.utils.book_append_sheet(wb, ws, "Regular Dailies")
    XLSX.writeFile(wb, "Regular_Dailies.xlsx")
  }, [transformedDailies])

  if (isLoading) {
    return <CrmSpinner />
  }

  return (
    <div className="max-w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
      <div className="p-4 sm:p-6">
        <div className="mb-4 flex gap-3">
          <DialogButton
            actionType="downloadExcel"
            onClick={exportToExcel}
            label="Excel გადმოწერა"
          />
          <DialogButton
            actionType="add"
            onClick={() => setIsAddModalOpen(true)}
            label="შეფასების დამატება"
          />
        </div>

        <CrmTable
          columns={columns}
          size="lg"
          data={transformedDailies}
          renderSubComponent={renderSubComponent}
          getRowCanExpand={() => true}
          onRowClick={handleRowClick}
        />
      </div>
      <CrmDialog
        isOpen={isAddModalOpen}
        onOpenChange={setIsAddModalOpen}
        title="დღის შედეგის დამატება"
        description="შეავსეთ ფორმა დღის შედეგის დასამატებლად"
        footer={
          <>
            <DialogButton
              variant="secondary"
              onClick={() => setIsAddModalOpen(false)}
            >
              გაუქმება
            </DialogButton>
            <DialogButton type="submit" form="dailyForm">
              დამატება
            </DialogButton>
          </>
        }
      >
        <AddDailyForm onSuccess={() => setIsAddModalOpen(false)} />
      </CrmDialog>
    </div>
  )
}

export default Dailies
