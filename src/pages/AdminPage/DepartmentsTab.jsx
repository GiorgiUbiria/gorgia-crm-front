import React, { useState, useMemo } from "react"
import { CrmTable } from "components/CrmTable"
import CrmDialog, { DialogButton } from "components/CrmDialogs/Dialog"
import {
  AddButton,
  DeleteButton,
  EditButton,
} from "components/CrmActionButtons"
import { AssignDepartmentHeadForm } from "./components/assign"
import { AddDepartmentForm } from "./components/add"
import { EditDepartmentForm } from "./components/edit"
import { DeleteDepartmentForm } from "./components/delete"

const DepartmentsTab = ({ departments = [], users }) => {
  const [isAddModalOpen, setIsAddModalOpen] = useState(false)
  const [isAssignHeadModalOpen, setIsAssignHeadModalOpen] = useState({
    isOpen: false,
    departmentId: null,
  })
  const [isEditModalOpen, setIsEditModalOpen] = useState({
    isOpen: false,
    department: {},
  })
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState({
    isOpen: false,
    department_id: null,
  })

  const transformedDepartments = useMemo(() => {
    if (!Array.isArray(departments)) return []

    return departments.map(department => ({
      id: department.id,
      name: department.name,
      description: department.description || "არ არის მითითებული",
      department_head: department.department_head
        ? department.department_head?.name ||
          "" + department.department_head?.sur_name ||
          ""
        : "არ არის მითითებული",
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
            <div className="flex items-center gap-x-2">
              <DialogButton
                variant="info"
                onClick={() =>
                  setIsAssignHeadModalOpen({
                    isOpen: true,
                    departmentId: row.original.id,
                  })
                }
              >
                <EditButton label="მიბმა" />
              </DialogButton>
              <DialogButton
                variant="info"
                onClick={() =>
                  setIsEditModalOpen({
                    isOpen: true,
                    department: row.original,
                  })
                }
              >
                <EditButton />
              </DialogButton>
              <DialogButton
                variant="danger"
                onClick={() =>
                  setIsDeleteModalOpen({
                    isOpen: true,
                    department_id: row.original.id,
                  })
                }
              >
                <DeleteButton />
              </DialogButton>
            </div>
          )
        },
      },
    ],
    []
  )

  return (
    <>
      <div className="mb-4">
        <DialogButton onClick={() => setIsAddModalOpen(true)}>
          <AddButton />
        </DialogButton>
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
            <DialogButton type="submit" form="addDepartmentForm">
              დამატება
            </DialogButton>
          </>
        }
      >
        <AddDepartmentForm onSuccess={() => setIsAddModalOpen(false)} />
      </CrmDialog>
      <CrmDialog
        isOpen={isAssignHeadModalOpen.isOpen}
        onOpenChange={setIsAssignHeadModalOpen}
        title="ხელმძღვანელის მიბმა"
        description="აირჩიეთ დეპარტამენტის ხელმძღვანელი"
        footer={
          <>
            <DialogButton
              variant="secondary"
              onClick={() =>
                setIsAssignHeadModalOpen({ isOpen: false, departmentId: null })
              }
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
          onSuccess={() =>
            setIsAssignHeadModalOpen({ isOpen: false, departmentId: null })
          }
          users={users}
          department_id={isAssignHeadModalOpen.departmentId}
        />
      </CrmDialog>
      <CrmDialog
        isOpen={isEditModalOpen.isOpen}
        onOpenChange={setIsEditModalOpen}
        title="დეპარტამენტის რედაქტირება"
        description="შეცვალეთ დეპარტამენტის საბაზისო ინფორმაცია"
        footer={
          <>
            <DialogButton
              variant="secondary"
              onClick={() =>
                setIsEditModalOpen({ isOpen: false, department: {} })
              }
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
          onSuccess={() =>
            setIsEditModalOpen({ isOpen: false, department: {} })
          }
          department={isEditModalOpen.department}
        />
      </CrmDialog>
      <CrmDialog
        isOpen={isDeleteModalOpen.isOpen}
        onOpenChange={setIsDeleteModalOpen}
        title="დეპარტამენტის წაშლა"
        description="დარწმუნებული ხართ, რომ გსურთ დეპარტამენტის წაშლა?"
        footer={
          <>
            <DialogButton
              variant="secondary"
              onClick={() =>
                setIsDeleteModalOpen({ isOpen: false, department_id: {} })
              }
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
          onSuccess={() =>
            setIsDeleteModalOpen({ isOpen: false, department_id: null })
          }
          department_id={isDeleteModalOpen.department_id}
        />
      </CrmDialog>

      <CrmTable columns={columns} data={transformedDepartments} />
    </>
  )
}

export default DepartmentsTab
