import React from "react"
import { Link } from "react-router-dom"
import { useVacancyRequests } from "../../queries/vacancyRequests"
import { CrmTable } from "../../components/CrmTable"

const MyVacancyRequests = () => {
  const { data: vacancyRequests, isLoading } = useVacancyRequests({
    my_requests: true,
  })

  const getStatusBadge = status => {
    const statusColors = {
      pending: "warning",
      approved: "success",
      rejected: "danger",
    }
    return <div className={`badge bg-${statusColors[status]}`}>{status}</div>
  }


  const columns = React.useMemo(
    () => [
      {
        accessorKey: "position_title",
        header: "პოზიციის დასახელება",
        meta: {
          filterVariant: "text",
        },
      },
      {
        accessorKey: "department",
        header: "დეპარტამენტი",
        meta: {
          filterVariant: "text",
        },
      },
      {
        accessorKey: "location",
        header: "მდებარეობა",
        meta: {
          filterVariant: "text",
        },
      },
      {
        accessorKey: "number_of_vacancies",
        header: "ვაკანსიების რაოდენობა",
      },
      {
        accessorKey: "status",
        header: "სტატუსი",
        cell: info => getStatusBadge(info.getValue()),
        meta: {
          filterVariant: "select",
          filterOptions: [
            { value: "pending", label: "მოლოდინში" },
            { value: "approved", label: "დამტკიცებული" },
            { value: "rejected", label: "უარყოფილი" },
          ],
        },
      },
      {
        accessorKey: "submission_date",
        header: "შექმნის თარიღი",
        cell: info => new Date(info.getValue()).toLocaleDateString(),
      },
      {
        id: "actions",
        header: "მოქმედებები",
        cell: ({ row }) => (
          <div className="flex gap-2">
            <Link
              to={`/vacancy-requests/${row.original.id}`}
              className="px-3 py-1 text-sm font-medium text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300"
            >
              ნახვა
            </Link>
            {row.original.status === "pending" && (
              <Link
                to={`/vacancy-requests/${row.original.id}/edit`}
                className="px-3 py-1 text-sm font-medium text-green-600 hover:text-green-700 dark:text-green-400 dark:hover:text-green-300"
              >
                რედაქტირება
              </Link>
            )}
          </div>
        ),
      },
    ],
    []
  )

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-6 flex justify-between items-center">
        <h1 className="text-2xl font-semibold text-gray-900 dark:text-white">
          ჩემი ვაკანსიის მოთხოვნები
        </h1>
        <Link
          to="/vacancy-requests/create"
          className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 dark:bg-blue-500 dark:hover:bg-blue-600"
        >
          ახალი მოთხოვნა
        </Link>
      </div>

      <CrmTable
        columns={columns}
        data={vacancyRequests?.data || []}
        isLoading={isLoading}
      />
    </div>
  )
}

export default MyVacancyRequests 