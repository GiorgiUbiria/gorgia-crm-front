import React, { useState, useMemo } from "react"
import { useQuery } from "@tanstack/react-query"
import { CrmTable } from "components/CrmTable"
import { useForm } from "@tanstack/react-form"
import UploadEmployeeContactsForm from "./components/upload"
import CrmSpinner from "components/CrmSpinner"
import { Filter, Download } from "lucide-react"
import defaultInstance from "plugins/axios"
import useAuth from "hooks/useAuth"
import { toast } from "store/zustand/toastStore"
import { useNavigate } from "react-router-dom"

const defaultFilters = {
  employee_name: "",
  position: "",
  corporate_number: "",
  personal_number: "",
  email: "",
  city: "",
  branch: "",
  search: "",
}

const EmployeeContacts = () => {
  const navigate = useNavigate()
  const { isAdmin, isHrMember } = useAuth()
  const canManageContacts = isAdmin() || isHrMember()
  const [showUploadForm, setShowUploadForm] = useState(false)
  const [showFilters, setShowFilters] = useState(false)
  const [filters, setFilters] = useState(defaultFilters)
  const [page, setPage] = useState(1)
  const [perPage] = useState(15)

  const form = useForm({
    defaultValues: defaultFilters,
    onSubmit: async ({ value }) => {
      const newFilters = {}
      Object.entries(value).forEach(([key, val]) => {
        if (val) newFilters[key] = val
      })
      setFilters(newFilters)
      setPage(1)
    },
  })

  const { data: citiesData } = useQuery({
    queryKey: ["cities"],
    queryFn: async () => {
      const { data } = await defaultInstance.get(
        "/api/employee-contacts/cities"
      )
      return data
    },
  })

  const { data: employeeContactsData, isLoading: isDataLoading } = useQuery({
    queryKey: ["employee-contacts", filters, page, perPage],
    queryFn: async () => {
      try {
        const { data } = await defaultInstance.get("/api/employee-contacts", {
          params: {
            ...filters,
            page,
            per_page: perPage,
          },
        })
        return data
      } catch (error) {
        if (error.response?.data?.error_type === "ip_restricted") {
          toast.error(
            "თქვენ არ გაქვთ წვდომა ამ გვერდზე კომპანიის ქსელის გარედან"
          )
          navigate("/dashboard")
          return null
        }
        throw error
      }
    },
  })

  const { data: filesData } = useQuery({
    queryKey: ["employee-contacts-files"],
    queryFn: async () => {
      const { data } = await defaultInstance.get(
        "/api/employee-contacts/files",
        {
          params: {
            status: "completed",
            per_page: 1,
          },
        }
      )
      return data
    },
  })

  const handleDownload = async file => {
    try {
      const response = await defaultInstance.get(
        `/api/employee-contacts/files/${file.id}/download`,
        {
          responseType: "blob",
        }
      )

      const url = window.URL.createObjectURL(new Blob([response.data]))
      const link = document.createElement("a")
      link.href = url
      link.setAttribute("download", file.original_name)
      document.body.appendChild(link)
      link.click()
      link.remove()
      window.URL.revokeObjectURL(url)
    } catch (error) {
      toast.error("შეცდომა ფაილის ჩამოტვირთვისას")
    }
  }

  const columns = useMemo(
    () => [
      {
        header: "სახელი/გვარი",
        accessorKey: "employee_name",
        enableColumnFilter: false,
      },
      {
        header: "თანამდებობა",
        accessorKey: "position",
        enableColumnFilter: false,
      },
      {
        header: "კორპორატიული ნომერი",
        accessorKey: "corporate_number",
        enableColumnFilter: false,
      },
      {
        header: "ტელეფონის ნომერი",
        accessorKey: "personal_number",
        enableColumnFilter: false,
      },
      {
        header: "ელ-ფოსტა",
        accessorKey: "email",
        enableColumnFilter: false,
      },
      {
        header: "ქალაქი",
        accessorKey: "city",
        enableColumnFilter: false,
      },
      {
        header: "ფილიალი/დეპარტამენტი",
        accessorKey: "branch",
        enableColumnFilter: false,
      },
    ],
    []
  )

  const isLoading = isDataLoading

  if (isLoading) {
    return <CrmSpinner />
  }

  return (
    <div className="max-w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 bg-white dark:!bg-gray-900">
      <div className="flex justify-between items-center mb-8">
        <div className="flex items-center gap-4">
          <h1 className="text-3xl font-bold text-gray-900 dark:!text-white">
            თანამშრომლების კონტაქტები
          </h1>
          {filesData?.files?.data?.[0] && canManageContacts && (
            <button
              onClick={() => handleDownload(filesData.files.data[0])}
              className="text-blue-600 hover:text-blue-900 dark:!text-blue-400 dark:!hover:text-blue-300"
            >
              <Download className="h-5 w-5" />
            </button>
          )}
        </div>
        <div className="flex gap-4">
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="px-4 py-2 bg-gray-200 dark:!bg-gray-700 text-gray-700 dark:!text-gray-200 rounded-md hover:bg-gray-300 dark:!hover:bg-gray-600 flex items-center gap-2"
          >
            <Filter className="w-4 h-4" />
            {showFilters ? "ფილტრის დახურვა" : "ფილტრი"}
          </button>
          {canManageContacts && (
            <button
              onClick={() => setShowUploadForm(!showUploadForm)}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {showUploadForm ? "დახურვა" : "ატვირთვა"}
            </button>
          )}
        </div>
      </div>

      {showUploadForm && canManageContacts && (
        <div className="mb-8 p-6 bg-white dark:!bg-gray-800 rounded-xl shadow-lg">
          <h2 className="text-xl font-semibold mb-6 text-gray-900 dark:!text-white">
            კონტაქტების ატვირთვა
          </h2>
          <UploadEmployeeContactsForm
            onClose={() => setShowUploadForm(false)}
          />
        </div>
      )}

      {showFilters && (
        <div className="mb-8 p-6 bg-white dark:!bg-gray-800 rounded-xl shadow-lg">
          <h2 className="text-xl font-semibold mb-6 text-gray-900 dark:!text-white">
            ფილტრები
          </h2>
          <form
            onSubmit={e => {
              e.preventDefault()
              e.stopPropagation()
              void form.handleSubmit()
            }}
            className="grid grid-cols-1 md:grid-cols-4 gap-4"
          >
            <form.Field name="employee_name">
              {field => (
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:!text-gray-300 mb-1">
                    სახელი/გვარი
                  </label>
                  <input
                    type="text"
                    value={field.state.value}
                    onChange={e => field.handleChange(e.target.value)}
                    className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 dark:!border-gray-600 dark:!bg-gray-700 dark:!text-white"
                    placeholder="სახელი/გვარი"
                  />
                </div>
              )}
            </form.Field>

            <form.Field name="position">
              {field => (
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:!text-gray-300 mb-1">
                    თანამდებობა
                  </label>
                  <input
                    type="text"
                    value={field.state.value}
                    onChange={e => field.handleChange(e.target.value)}
                    className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 dark:!border-gray-600 dark:!bg-gray-700 dark:!text-white"
                    placeholder="თანამდებობა"
                  />
                </div>
              )}
            </form.Field>

            <form.Field name="email">
              {field => (
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:!text-gray-300 mb-1">
                    ელ-ფოსტა
                  </label>
                  <input
                    type="text"
                    value={field.state.value}
                    onChange={e => field.handleChange(e.target.value)}
                    className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 dark:!border-gray-600 dark:!bg-gray-700 dark:!text-white"
                    placeholder="ელ-ფოსტა"
                  />
                </div>
              )}
            </form.Field>

            <form.Field name="personal_number">
              {field => (
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:!text-gray-300 mb-1">
                    ტელეფონის ნომერი
                  </label>
                  <input
                    type="text"
                    value={field.state.value}
                    onChange={e => field.handleChange(e.target.value)}
                    className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 dark:!border-gray-600 dark:!bg-gray-700 dark:!text-white"
                    placeholder="პირადი ნომერი"
                  />
                </div>
              )}
            </form.Field>

            <form.Field name="corporate_number">
              {field => (
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:!text-gray-300 mb-1">
                    კორპორატიული ნომერი
                  </label>
                  <input
                    type="text"
                    value={field.state.value}
                    onChange={e => field.handleChange(e.target.value)}
                    className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 dark:!border-gray-600 dark:!bg-gray-700 dark:!text-white"
                    placeholder="კორპორატიული ნომერი"
                  />
                </div>
              )}
            </form.Field>

            <form.Field name="city">
              {field => (
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:!text-gray-300 mb-1">
                    ქალაქი
                  </label>
                  <select
                    value={field.state.value}
                    onChange={e => field.handleChange(e.target.value)}
                    className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 dark:!border-gray-600 dark:!bg-gray-700 dark:!text-white"
                  >
                    <option value="">ყველა</option>
                    {citiesData?.cities?.map(city => (
                      <option key={city} value={city}>
                        {city}
                      </option>
                    ))}
                  </select>
                </div>
              )}
            </form.Field>

            <form.Field name="branch">
              {field => (
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:!text-gray-300 mb-1">
                    ფილიალი/დეპარტამენტი
                  </label>
                  <input
                    type="text"
                    value={field.state.value}
                    onChange={e => field.handleChange(e.target.value)}
                    className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 dark:!border-gray-600 dark:!bg-gray-700 dark:!text-white"
                    placeholder="ფილიალი/დეპარტამენტი"
                  />
                </div>
              )}
            </form.Field>

            <div className="md:col-span-4 flex justify-end gap-4">
              <button
                type="button"
                onClick={() => {
                  form.reset()
                  setFilters(defaultFilters)
                }}
                className="px-4 py-2 bg-gray-200 dark:!bg-gray-700 text-gray-700 dark:!text-gray-200 rounded-md hover:bg-gray-300 dark:!hover:bg-gray-600"
              >
                გასუფთავება
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
              >
                ფილტრაცია
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="space-y-8">
        <CrmTable
          data={employeeContactsData?.data || []}
          columns={columns}
          pagination={{
            pageIndex: page - 1,
            pageSize: perPage,
            pageCount: Math.ceil(
              (employeeContactsData?.meta?.total || 0) / perPage
            ),
            total: employeeContactsData?.meta?.total || 0,
            onPageChange: newPage => setPage(newPage + 1),
          }}
        />
      </div>
    </div>
  )
}

export default EmployeeContacts
