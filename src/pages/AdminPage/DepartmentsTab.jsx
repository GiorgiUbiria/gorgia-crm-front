import React, { useMemo } from "react"
import { CrmTable } from "components/CrmTable"
import CrmDialog, { DialogButton } from "components/CrmDialogs/Dialog"
import { AssignDepartmentHeadForm } from "./components/department/assign"
import { AddDepartmentForm } from "./components/department/add"
import { EditDepartmentForm } from "./components/department/edit"
import { DeleteDepartmentForm } from "./components/department/delete"
import useModalStore from "store/zustand/modalStore"
import * as XLSX from "xlsx"

const DepartmentsTab = ({ departments = [], users }) => {
  const { openModal, closeModal, isModalOpen, getModalData } = useModalStore()

  const transformedDepartments = useMemo(() => {
    if (!Array.isArray(departments)) return []

    return departments.map(department => ({
      id: department.id,
      name: department.name,
      description: department.description || "არ არის მითითებული",
      department_head: department.department_head
        ? department.department_head?.name ||
          "" + " " + department.department_head?.sur_name ||
          ""
        : "არ არის მითითებული",
      department_head_id: department.department_head_id,
    }))
  }, [departments])

  const columns = React.useMemo(
    () => [
      {
        id: "id",
        accessorFn: row => row.id,
        cell: info => info.getValue(),
        header: () => <span>#</span>,
        enableColumnFilter: false,
        sortingFn: "basic",
        sortDescFirst: true,
      },
      {
        id: "name",
        accessorFn: row => row.name,
        cell: info => info.getValue(),
        header: () => <span>დეპარტამენტის დასახელება</span>,
        meta: {
          filterVariant: "text",
        },
        enableSorting: false,
      },
      {
        id: "description",
        accessorKey: "description",
        header: () => <span>აღწერა</span>,
        enableColumnFilter: false,
        enableSorting: false,
      },
      {
        id: "department_head",
        accessorKey: "department_head",
        header: () => <span>დეპარტამენტის ხელმძღვანელი</span>,
        meta: {
          filterVariant: "text",
        },
        enableSorting: false,
      },
      {
        id: "actions",
        enableColumnFilter: false,
        enableSorting: false,
        header: "მოქმედებები",
        cell: ({ row }) => {
          return (
            <div className="flex items-center gap-x-1 max-w-full">
              <DialogButton
                actionType="assign"
                size="sm"
                label="მიბმა"
                onClick={() =>
                  openModal("assignHead", {
                    departmentId: row.original.id,
                    currentHeadId: row.original.department_head_id,
                  })
                }
              />
              <DialogButton
                actionType="edit"
                size="sm"
                onClick={() =>
                  openModal("editDepartment", {
                    department: row.original,
                  })
                }
              />
              <DialogButton
                actionType="delete"
                size="sm"
                onClick={() =>
                  openModal("deleteDepartment", {
                    department_id: row.original.id,
                  })
                }
              />
            </div>
          )
        },
      },
    ],
    [openModal]
  )

  const exportToExcel = () => {
    const data = [
      ["სახელი", "დეპარტამენტის უფროსი"],
      ...transformedDepartments.map(department => [
        department.name,
        department.department_head,
      ]),
    ]

    const ws = XLSX.utils.aoa_to_sheet(data)
    const wb = XLSX.utils.book_new()
    XLSX.utils.book_append_sheet(wb, ws, "Departments")
    XLSX.writeFile(wb, "დეპარტამენტები.xlsx")
  }

  return (
    <>
      <div className="mb-4 flex gap-x-2">
        <DialogButton actionType="add" size="sm" onClick={() => openModal("addDepartment")} />
        <DialogButton actionType="downloadExcel" size="sm" onClick={exportToExcel} />
      </div>
      <CrmDialog
        isOpen={isModalOpen("addDepartment")}
        onOpenChange={open => !open && closeModal("addDepartment")}
        title="დღის შედეგის დამატება"
        description="შეავსეთ ფორმა დღის შედეგის დასამატებლად"
        footer={
          <>
            <DialogButton
              variant="secondary"
              onClick={() => closeModal("addDepartment")}
            >
              გაუქმება
            </DialogButton>
            <DialogButton type="submit" form="addDepartmentForm">
              დამატება
            </DialogButton>
          </>
        }
      >
        <AddDepartmentForm onSuccess={() => closeModal("addDepartment")} />
      </CrmDialog>

      <CrmDialog
        isOpen={isModalOpen("assignHead")}
        onOpenChange={open => !open && closeModal("assignHead")}
        title="ხელმძღვანელის მიბმა"
        description="აირჩიეთ დეპარტამენტის ხელმძღვანელი"
        footer={
          <>
            <DialogButton
              variant="secondary"
              onClick={() => closeModal("assignHead")}
            >
              გაუქმება
            </DialogButton>
            <DialogButton type="submit" form="assignHeadForm">
              ხელმძღვანელის მიბმა
            </DialogButton>
          </>
        }
      >
        <AssignDepartmentHeadForm
          onSuccess={() => closeModal("assignHead")}
          users={users}
          department_id={getModalData("assignHead")?.departmentId}
          currentHeadId={getModalData("assignHead")?.currentHeadId}
        />
      </CrmDialog>

      <CrmDialog
        isOpen={isModalOpen("editDepartment")}
        onOpenChange={open => !open && closeModal("editDepartment")}
        title="დეპარტამენტის რედაქტირება"
        description="შეცვალეთ დეპარტამენტის საბაზისო ინფორმაცია"
        footer={
          <>
            <DialogButton
              variant="secondary"
              onClick={() => closeModal("editDepartment")}
            >
              გაუქმება
            </DialogButton>
            <DialogButton type="submit" form="editDepartmentForm">
              რედაქტირება
            </DialogButton>
          </>
        }
      >
        <EditDepartmentForm
          onSuccess={() => closeModal("editDepartment")}
          department={getModalData("editDepartment")?.department}
        />
      </CrmDialog>

      <CrmDialog
        isOpen={isModalOpen("deleteDepartment")}
        onOpenChange={open => !open && closeModal("deleteDepartment")}
        title="დეპარტამენტის წაშლა"
        description="დარწმუნებული ხართ, რომ გსურთ დეპარტამენტის წაშლა?"
        footer={
          <>
            <DialogButton
              variant="secondary"
              onClick={() => closeModal("deleteDepartment")}
            >
              გაუქმება
            </DialogButton>
            <DialogButton type="submit" form="deleteDepartmentForm">
              წაშლა
            </DialogButton>
          </>
        }
      >
        <DeleteDepartmentForm
          onSuccess={() => closeModal("deleteDepartment")}
          department_id={getModalData("deleteDepartment")?.department_id}
        />
      </CrmDialog>

      <CrmTable columns={columns} data={transformedDepartments} />
    </>
  )
}

export default DepartmentsTab
