import React, { useState } from "react"
import { CrmTable } from "components/CrmTable"
import { useGetDepartmentHeadDailies } from "queries/daily"
import CrmDialog, { DialogButton } from "components/CrmDialogs/Dialog"
import { AddDailyForm } from "./components/form"
import { renderSubComponent } from "./components/subComponent"
import CrmSpinner from "components/CrmSpinner"
import { useNavigate } from "react-router-dom"

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
        header: () => <span>#</span>,
        enableColumnFilter: false,
        sortingFn: "basic",
        sortDescFirst: true,
      },
      {
        accessorFn: row => row.user_full_name,
        id: "user_full_name",
        cell: info => info.getValue(),
        header: () => <span>სახელი/გვარი</span>,
        meta: {
          filterVariant: "text",
        },
        enableSorting: false,
      },
      {
        accessorKey: "date",
        header: () => "თარიღი",
        cell: info => new Date(info.getValue()).toLocaleDateString(),
        enableColumnFilter: false,
        sortingFn: "datetime",
        sortDescFirst: true,
      },
      {
        accessorKey: "description",
        header: () => <span>აღწერა</span>,
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
    ],
    []
  )

  if (isLoading) {
    return <CrmSpinner />
  }

  return (
    <>
      <div className="mb-4">
        <DialogButton 
          actionType="add" 
          onClick={() => setIsAddModalOpen(true)}
          label="დღის შედეგის დამატება"
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

      <CrmTable
        columns={columns}
        data={transformedDailies}
        renderSubComponent={renderSubComponent}
        getRowCanExpand={() => true}
        onRowClick={handleRowClick}
      />
    </>
  )
}

export default Dailies
