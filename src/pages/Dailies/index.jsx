import React from "react"
import { CrmTableTest } from "components/CrmTableTest"
import {
  useGetMyDepartmentHeadDailies,
  useGetDepartmentHeadDailies,
} from "queries/daily"
import useUserRoles from "hooks/useUserRoles"

const Dailies = () => {
  const roles = useUserRoles()
  const isAdminOrDepartmentHead =
    roles.includes("admin") || roles.includes("department_head")

  const { data: adminDailiesData, isLoading: adminIsLoading } =
    useGetDepartmentHeadDailies()

  const { data: userDailiesData, isLoading: userIsLoading } =
    useGetMyDepartmentHeadDailies()

  const dailiesData = isAdminOrDepartmentHead
    ? adminDailiesData
    : userDailiesData
  const isLoading = isAdminOrDepartmentHead ? adminIsLoading : userIsLoading

  const transformedDailies = React.useMemo(() => {
    return (
      dailiesData?.dailies?.map(daily => ({
        ...daily,
        user_full_name: `${daily.user.name} ${daily.user.sur_name}`,
      })) || []
    )
  }, [dailiesData])

  console.log(transformedDailies)

  const columns = React.useMemo(
    () => [
      {
        accessorFn: row => row.id,
        id: "id",
        cell: info => info.getValue(),
        header: () => <span>#</span>,
      },
      {
        accessorFn: row => row.user_full_name,
        id: "user_full_name",
        cell: info => info.getValue(),
        header: () => <span>სახელი/გვარი</span>,
      },
      {
        accessorKey: "date",
        header: () => "თარიღი",
      },
      {
        accessorKey: "description",
        header: () => <span>აღწერა</span>,
      },
      {
        accessorFn: row => row.department.name,
        header: "დეპარტამენტი",
        meta: {
          filterVariant: "select",
        },
      },
    ],
    []
  )

  if (isLoading) {
    return "..."
  }

  return <CrmTableTest columns={columns} data={transformedDailies} />
}

export default Dailies

export function IndeterminateCheckbox({
  indeterminate,
  className = "",
  ...rest
}) {
  const ref = React.useRef(null)

  React.useEffect(() => {
    if (typeof indeterminate === "boolean") {
      ref.current.indeterminate = !rest.checked && indeterminate
    }
  }, [ref, indeterminate])

  return (
    <input
      type="checkbox"
      ref={ref}
      className={className + " cursor-pointer"}
      {...rest}
    />
  )
}
