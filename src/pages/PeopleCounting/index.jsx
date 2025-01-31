import React, { useState, useMemo, useCallback } from "react"
import {
  useGetPeopleCounting,
  useGetCities,
  useGetBranches,
  useDeletePeopleCounting,
  useBulkDeletePeopleCounting,
} from "queries/peopleCounting"
import { CrmTable } from "components/CrmTable"
import { useForm } from "@tanstack/react-form"
import AddPeopleCountingForm from "./components/add"
import EditPeopleCountingForm from "./components/edit"
import CrmSpinner from "components/CrmSpinner"
import { format } from "date-fns"
import useAuth from "hooks/useAuth"
import { Filter } from "lucide-react"
import CrmDialog, { DialogButton } from "components/CrmDialogs/Dialog"
import useModalStore from "store/zustand/modalStore"
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  LineChart,
  Line,
} from "recharts"

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#8884d8"]

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white dark:!bg-gray-800 p-3 border border-gray-200 dark:!border-gray-700 rounded-lg shadow-lg">
        <p className="text-gray-900 dark:!text-gray-100 font-medium">{label}</p>
        {payload.map((entry, index) => (
          <p
            key={index}
            className="text-sm dark:!text-gray-200"
            style={{ color: entry.color || entry.fill }}
          >
            {`${entry.name}: ${entry.value}`}
          </p>
        ))}
      </div>
    )
  }
  return null
}

const defaultFilters = {
  date_from: "",
  date_to: "",
  city: "",
  branch: "",
}

const PeopleCounting = () => {
  const { isAdmin, user } = useAuth()
  const [view, setView] = useState("table")
  const [showAddForm, setShowAddForm] = useState(false)
  const [showFilters, setShowFilters] = useState(false)
  const [filters, setFilters] = useState(defaultFilters)
  const [selectedRows, setSelectedRows] = useState([])
  const { openModal, closeModal, isModalOpen, getModalData } = useModalStore()

  const hasAccess = useMemo(() => {
    const allowedDepartments = [36, 30, 21]
    return isAdmin() || allowedDepartments.includes(user?.department_id)
  }, [isAdmin, user?.department_id])

  const canModifyRecord = useCallback(
    record => {
      return isAdmin() || record.user.id === user?.id
    },
    [isAdmin, user?.id]
  )

  const { data: peopleCountingData, isLoading } = useGetPeopleCounting(filters)
  const { data: citiesData } = useGetCities()
  const { data: branchesData } = useGetBranches(filters.city)
  const deletePeopleCountingMutation = useDeletePeopleCounting()
  const bulkDeletePeopleCountingMutation = useBulkDeletePeopleCounting()

  const form = useForm({
    defaultValues: defaultFilters,
    onSubmit: async ({ value }) => {
      const newFilters = {}
      Object.entries(value).forEach(([key, val]) => {
        if (val) newFilters[key] = val
      })
      setFilters(newFilters)
    },
  })

  const totalVisitors = useMemo(() => {
    if (!peopleCountingData?.data) return 0
    return peopleCountingData.data.reduce(
      (sum, item) => sum + item.visitor_count,
      0
    )
  }, [peopleCountingData?.data])

  const handleDelete = useCallback(
    async ids => {
      if (!window.confirm("ნამდვილად გსურთ წაშლა?")) return

      try {
        if (Array.isArray(ids)) {
          await bulkDeletePeopleCountingMutation.mutateAsync(ids)
        } else {
          await deletePeopleCountingMutation.mutateAsync(ids)
        }
        setSelectedRows([])
      } catch (error) {
        console.error("Error deleting records:", error)
      }
    },
    [bulkDeletePeopleCountingMutation, deletePeopleCountingMutation]
  )

  const columns = useMemo(
    () =>
      [
        hasAccess && {
          id: "select",
          header: ({ table }) => (
            <input
              type="checkbox"
              checked={table.getIsAllRowsSelected()}
              onChange={table.getToggleAllRowsSelectedHandler()}
              className="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500 dark:!border-gray-600 dark:!bg-gray-700"
            />
          ),
          cell: ({ row }) =>
            canModifyRecord(row.original) && (
              <input
                type="checkbox"
                checked={row.getIsSelected()}
                onChange={row.getToggleSelectedHandler()}
                className="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500 dark:!border-gray-600 dark:!bg-gray-700"
              />
            ),
          enableSorting: false,
          size: 40,
        },
        {
          header: "თარიღი",
          accessorKey: "date",
          cell: info => format(new Date(info.getValue()), "dd/MM/yyyy"),
        },
        {
          header: "ვიზიტორების რაოდენობა",
          accessorKey: "visitor_count",
        },
        {
          header: "ქალაქი",
          accessorKey: "city",
        },
        {
          header: "ფილიალი",
          accessorKey: "branch",
        },
        {
          header: "დამატებულია",
          accessorKey: "user.name",
        },
        hasAccess && {
          id: "actions",
          header: "",
          cell: ({ row }) =>
            canModifyRecord(row.original) && (
              <div className="flex gap-2">
                <DialogButton
                  actionType="edit"
                  size="xs"
                  onClick={() =>
                    openModal("editPeopleCounting", { data: row.original })
                  }
                />
                <DialogButton
                  actionType="delete"
                  size="xs"
                  onClick={() => handleDelete(row.original.id)}
                />
              </div>
            ),
          size: 100,
        },
      ].filter(Boolean),
    [handleDelete, hasAccess, canModifyRecord, openModal]
  )

  // Chart data transformations
  const visitorsByCity = useMemo(() => {
    if (!peopleCountingData?.data) return []
    const cityCount = peopleCountingData.data.reduce((acc, item) => {
      acc[item.city] = (acc[item.city] || 0) + item.visitor_count
      return acc
    }, {})
    return Object.entries(cityCount).map(([city, count]) => ({
      name: city,
      visitors: count,
    }))
  }, [peopleCountingData?.data])

  const visitorsByBranch = useMemo(() => {
    if (!peopleCountingData?.data) return []
    const branchCount = peopleCountingData.data.reduce((acc, item) => {
      acc[item.branch] = (acc[item.branch] || 0) + item.visitor_count
      return acc
    }, {})
    return Object.entries(branchCount).map(([branch, count]) => ({
      name: branch,
      visitors: count,
    }))
  }, [peopleCountingData?.data])

  const visitorsTrend = useMemo(() => {
    if (!peopleCountingData?.data) return []
    return peopleCountingData.data
      .sort((a, b) => new Date(a.date) - new Date(b.date))
      .map(item => ({
        date: format(new Date(item.date), "dd/MM/yyyy"),
        visitors: item.visitor_count,
      }))
  }, [peopleCountingData?.data])

  if (!hasAccess) {
    return (
      <div className="flex items-center justify-center h-full">
        <p className="text-lg text-gray-600 dark:!text-gray-400">
          თქვენ არ გაქვთ წვდომა ამ გვერდზე
        </p>
      </div>
    )
  }

  if (isLoading) {
    return <CrmSpinner />
  }

  return (
    <div className="max-w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 bg-white dark:!bg-gray-900">
      <div className="flex justify-between items-center mb-8">
        <div className="flex items-center gap-4">
          <h1 className="text-3xl font-bold text-gray-900 dark:!text-white">
            ვიზიტორების ფორმა
          </h1>
          <div className="text-lg text-gray-600 dark:!text-gray-400">
            სულ: {totalVisitors} ვიზიტორი
          </div>
        </div>
        <div className="flex gap-4">
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="px-4 py-2 bg-gray-200 dark:!bg-gray-700 text-gray-700 dark:!text-gray-200 rounded-md hover:bg-gray-300 dark:!hover:bg-gray-600 flex items-center gap-2"
          >
            <Filter className="w-4 h-4" />
            {showFilters ? "ფილტრის დახურვა" : "ფილტრი"}
          </button>
          <button
            onClick={() => setView(view === "table" ? "charts" : "table")}
            className="px-4 py-2 bg-gray-200 dark:!bg-gray-700 text-gray-700 dark:!text-gray-200 rounded-md hover:bg-gray-300 dark:!hover:bg-gray-600"
          >
            {view === "table" ? "ანალიტიკა" : "ცხრილი"}
          </button>
          <button
            onClick={() => setShowAddForm(!showAddForm)}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            {showAddForm ? "დახურვა" : "დამატება"}
          </button>
        </div>
      </div>

      {showAddForm && (
        <div className="mb-8 p-6 bg-white dark:!bg-gray-800 rounded-xl shadow-lg">
          <h2 className="text-xl font-semibold mb-6 text-gray-900 dark:!text-white">
            ვიზიტორების დამატება
          </h2>
          <AddPeopleCountingForm
            onSuccess={() => {
              setShowAddForm(false)
              setFilters(defaultFilters)
              form.reset(defaultFilters)
            }}
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
              form.handleSubmit()
            }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4"
          >
            <form.Field name="date_from">
              {field => (
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:!text-gray-300 mb-1">
                    თარიღიდან
                  </label>
                  <input
                    type="date"
                    value={field.state.value}
                    onChange={e => field.handleChange(e.target.value)}
                    className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 dark:!border-gray-600 dark:!bg-gray-700 dark:!text-white"
                  />
                </div>
              )}
            </form.Field>

            <form.Field name="date_to">
              {field => (
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:!text-gray-300 mb-1">
                    თარიღამდე
                  </label>
                  <input
                    type="date"
                    value={field.state.value}
                    onChange={e => field.handleChange(e.target.value)}
                    className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 dark:!border-gray-600 dark:!bg-gray-700 dark:!text-white"
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
                    ფილიალი
                  </label>
                  <select
                    value={field.state.value}
                    onChange={e => field.handleChange(e.target.value)}
                    disabled={!filters.city}
                    className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 dark:!border-gray-600 dark:!bg-gray-700 dark:!text-white disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <option value="">ყველა</option>
                    {branchesData?.branches?.map(branch => (
                      <option key={branch} value={branch}>
                        {branch}
                      </option>
                    ))}
                  </select>
                </div>
              )}
            </form.Field>

            <div className="lg:col-span-4 flex justify-end gap-4">
              <button
                type="button"
                onClick={() => {
                  setFilters(defaultFilters)
                  form.reset(defaultFilters)
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

      {view === "table" ? (
        <div className="bg-white dark:!bg-gray-800 rounded-xl shadow-lg">
          {selectedRows.length > 0 && (
            <div className="p-4 border-b border-gray-200 dark:!border-gray-700 flex justify-between items-center">
              <span className="text-sm text-gray-700 dark:!text-gray-200">
                არჩეულია {selectedRows.length} ჩანაწერი
              </span>
              <DialogButton
                actionType="delete"
                size="sm"
                onClick={() => handleDelete(selectedRows)}
              >
                წაშლა
              </DialogButton>
            </div>
          )}
          <CrmTable
            data={peopleCountingData?.data || []}
            columns={columns}
            size="lg"
            enableRowSelection={hasAccess}
            onRowSelectionChange={setSelectedRows}
          />
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Visitors by City */}
          <div className="bg-white dark:!bg-gray-800 p-6 rounded-xl shadow-lg">
            <h2 className="text-xl font-semibold mb-6 text-gray-900 dark:!text-white">
              ვიზიტორები ქალაქების მიხედვით
            </h2>
            <ResponsiveContainer width="100%" height={400}>
              <PieChart>
                <Pie
                  data={visitorsByCity}
                  dataKey="visitors"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  outerRadius={120}
                  label
                >
                  {visitorsByCity.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={COLORS[index % COLORS.length]}
                    />
                  ))}
                </Pie>
                <Tooltip content={<CustomTooltip />} />
                <Legend wrapperStyle={{ color: "currentColor" }} />
              </PieChart>
            </ResponsiveContainer>
          </div>

          {/* Visitors by Branch */}
          <div className="bg-white dark:!bg-gray-800 p-6 rounded-xl shadow-lg">
            <h2 className="text-xl font-semibold mb-6 text-gray-900 dark:!text-white">
              ვიზიტორები ფილიალების მიხედვით
            </h2>
            <ResponsiveContainer width="100%" height={400}>
              <BarChart data={visitorsByBranch}>
                <CartesianGrid
                  strokeDasharray="3 3"
                  className="stroke-gray-300 dark:!stroke-gray-600"
                />
                <XAxis
                  dataKey="name"
                  angle={-45}
                  textAnchor="end"
                  height={100}
                  className="text-gray-700 dark:!text-gray-300"
                />
                <YAxis className="text-gray-700 dark:!text-gray-300" />
                <Tooltip content={<CustomTooltip />} />
                <Legend wrapperStyle={{ color: "currentColor" }} />
                <Bar dataKey="visitors" fill="#8884d8" name="ვიზიტორები" />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Visitors Trend */}
          <div className="bg-white dark:!bg-gray-800 p-6 rounded-xl shadow-lg col-span-2">
            <h2 className="text-xl font-semibold mb-6 text-gray-900 dark:!text-white">
              ვიზიტორების დინამიკა
            </h2>
            <ResponsiveContainer width="100%" height={400}>
              <LineChart data={visitorsTrend}>
                <CartesianGrid
                  strokeDasharray="3 3"
                  className="stroke-gray-300 dark:!stroke-gray-600"
                />
                <XAxis
                  dataKey="date"
                  angle={-45}
                  textAnchor="end"
                  height={100}
                  className="text-gray-700 dark:!text-gray-300"
                />
                <YAxis className="text-gray-700 dark:!text-gray-300" />
                <Tooltip content={<CustomTooltip />} />
                <Legend wrapperStyle={{ color: "currentColor" }} />
                <Line
                  type="monotone"
                  dataKey="visitors"
                  stroke="#8884d8"
                  name="ვიზიტორები"
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}

      <CrmDialog
        isOpen={isModalOpen("editPeopleCounting")}
        onOpenChange={open => !open && closeModal("editPeopleCounting")}
        title="ვიზიტორების რაოდენობის რედაქტირება"
        description="შეავსეთ ფორმა ვიზიტორების რაოდენობის რედაქტირებისთვის"
        footer={
          <>
            <DialogButton
              actionType="cancel"
              onClick={() => closeModal("editPeopleCounting")}
            >
              გაუქმება
            </DialogButton>
            <DialogButton
              actionType="edit"
              type="submit"
              form="editPeopleCountingForm"
            >
              შენახვა
            </DialogButton>
          </>
        }
      >
        {getModalData("editPeopleCounting")?.data && (
          <EditPeopleCountingForm
            data={getModalData("editPeopleCounting").data}
            onSuccess={() => closeModal("editPeopleCounting")}
          />
        )}
      </CrmDialog>
    </div>
  )
}

export default PeopleCounting
