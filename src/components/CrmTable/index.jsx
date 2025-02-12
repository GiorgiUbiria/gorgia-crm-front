import React, { Fragment } from "react"
import {
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getSortedRowModel,
  getPaginationRowModel,
  getFacetedMinMaxValues,
  getFacetedRowModel,
  getFacetedUniqueValues,
  useReactTable,
  getExpandedRowModel,
} from "@tanstack/react-table"
import {
  ChevronDown,
  ChevronUp,
  ChevronsLeft,
  ChevronsRight,
  ChevronLeft,
  ChevronRight,
} from "lucide-react"

const sizeVariants = {
  sm: {
    headerPadding: "px-2 py-1.5 sm:px-3 sm:py-2",
    cellPadding: "px-2 py-1.5 sm:px-3 sm:py-2",
    text: "text-xs sm:text-sm",
    paginationPadding: "px-2 py-1.5 sm:px-3 sm:py-2",
  },
  md: {
    headerPadding: "px-3 py-2 sm:px-4 sm:py-3",
    cellPadding: "px-3 py-2 sm:px-4 sm:py-3",
    text: "text-xs sm:text-sm",
    paginationPadding: "px-3 py-2 sm:px-4 sm:py-3",
  },
  lg: {
    headerPadding: "px-3 py-2 sm:px-6 sm:py-4",
    cellPadding: "px-3 py-2 sm:px-5 sm:py-4",
    text: "text-xs sm:text-sm",
    paginationPadding: "px-3 py-2 sm:px-6 sm:py-4",
  },
}

export function CrmTable({
  columns,
  data,
  renderSubComponent,
  onRowClick,
  size = "lg",
}) {
  const [sorting, setSorting] = React.useState([])
  const [columnFilters, setColumnFilters] = React.useState([])
  const [expanded, setExpanded] = React.useState({})
  const [pagination, setPagination] = React.useState({
    pageIndex: 0,
    pageSize: 10,
  })

  const sizeClasses = sizeVariants[size]

  const table = useReactTable({
    columns,
    data,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getExpandedRowModel: getExpandedRowModel(),
    getFacetedRowModel: getFacetedRowModel(),
    getFacetedUniqueValues: getFacetedUniqueValues(),
    getFacetedMinMaxValues: getFacetedMinMaxValues(),
    getSortedRowModel: getSortedRowModel(),
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    onExpandedChange: setExpanded,
    onPaginationChange: setPagination,
    getRowCanExpand: () => true,
    autoResetPageIndex: false,
    state: {
      sorting,
      columnFilters,
      expanded,
      pagination,
    },
  })

  return (
    <div className="w-full overflow-hidden bg-white dark:!bg-gray-800 rounded-lg shadow-xl border border-gray-200 dark:!border-gray-700">
      <div className="overflow-x-auto -mx-3 sm:mx-0">
        <div className="min-w-full inline-block align-middle">
          <div className="overflow-hidden">
            <table className="min-w-full">
              <thead>
                {table.getHeaderGroups().map(headerGroup => (
                  <tr key={headerGroup.id} className="dark:!bg-gray-800">
                    {headerGroup.headers.map(header => (
                      <th
                        key={header.id}
                        colSpan={header.colSpan}
                        className={`${sizeClasses.headerPadding} bg-[#105D8D] dark:!bg-gray-900 border-b border-gray-200 dark:!border-gray-700 whitespace-nowrap`}
                      >
                        {header.isPlaceholder ? null : (
                          <>
                            <div
                              {...{
                                className: header.column.getCanSort()
                                  ? `flex items-center gap-2 cursor-pointer select-none text-gray-100 dark:!text-gray-300 font-medium hover:text-gray-900 dark:!hover:text-gray-100 ${sizeClasses.text}`
                                  : `text-gray-100 dark:!text-gray-300 font-medium ${sizeClasses.text}`,
                                onClick:
                                  header.column.getToggleSortingHandler(),
                              }}
                            >
                              {flexRender(
                                header.column.columnDef.header,
                                header.getContext()
                              )}
                              {header.column.getCanSort() && (
                                <span className="inline-flex">
                                  {header.column.getIsSorted() === "asc" ? (
                                    <ChevronUp className="w-4 h-4" />
                                  ) : header.column.getIsSorted() === "desc" ? (
                                    <ChevronDown className="w-4 h-4" />
                                  ) : (
                                    <ChevronDown className="w-4 h-4 opacity-30" />
                                  )}
                                </span>
                              )}
                            </div>
                            {header.column.getCanFilter() && (
                              <div className="mt-2">
                                <Filter column={header.column} size={size} />
                              </div>
                            )}
                          </>
                        )}
                      </th>
                    ))}
                  </tr>
                ))}
              </thead>
              <tbody className="divide-y divide-gray-200 dark:!divide-gray-700">
                {table.getRowModel().rows.map(row => {
                  return (
                    <Fragment key={row.id}>
                      <tr
                        className={`${
                          row.index % 2 === 0
                            ? "bg-white dark:!bg-gray-800"
                            : "bg-gray-50 dark:!bg-gray-700"
                        } hover:bg-gray-100 dark:!hover:bg-gray-600/50 ${
                          onRowClick ? "cursor-pointer" : ""
                        }`}
                        onClick={() => onRowClick?.(row)}
                      >
                        {row.getVisibleCells().map(cell => {
                          return (
                            <td
                              key={cell.id}
                              className={`${sizeClasses.cellPadding} ${sizeClasses.text} text-gray-700 dark:!text-gray-200 border-r border-gray-200 dark:!border-gray-700 last:border-r-0 whitespace-nowrap`}
                            >
                              {flexRender(
                                cell.column.columnDef.cell,
                                cell.getContext()
                              )}
                            </td>
                          )
                        })}
                      </tr>
                      {row.getIsExpanded() && (
                        <tr>
                          <td colSpan={row.getVisibleCells().length}>
                            {renderSubComponent({ row })}
                          </td>
                        </tr>
                      )}
                    </Fragment>
                  )
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <div
        className={`${sizeClasses.paginationPadding} border-t border-gray-200 dark:!border-gray-700 bg-white dark:!bg-gray-800`}
      >
        <div className="flex flex-col space-y-4 sm:space-y-0 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4">
            <div className="flex items-center gap-1 sm:gap-2">
              <button
                className="inline-flex items-center justify-center w-7 h-7 sm:w-8 sm:h-8 rounded-lg border border-gray-200 dark:!border-gray-600 hover:bg-gray-50 dark:!hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed text-gray-700 dark:!text-gray-200"
                onClick={() => table.setPageIndex(0)}
                disabled={!table.getCanPreviousPage()}
              >
                <ChevronsLeft className="w-3 h-3 sm:w-4 sm:h-4" />
              </button>
              <button
                className="inline-flex items-center justify-center w-7 h-7 sm:w-8 sm:h-8 rounded-lg border border-gray-200 dark:!border-gray-600 hover:bg-gray-50 dark:!hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed text-gray-700 dark:!text-gray-200"
                onClick={() => table.previousPage()}
                disabled={!table.getCanPreviousPage()}
              >
                <ChevronLeft className="w-3 h-3 sm:w-4 sm:h-4" />
              </button>
              <span className="text-xs sm:text-sm text-gray-700 dark:!text-gray-200 min-w-[4rem] text-center">
                {table.getState().pagination.pageIndex + 1} /{" "}
                {table.getPageCount()}
              </span>
              <button
                className="inline-flex items-center justify-center w-7 h-7 sm:w-8 sm:h-8 rounded-lg border border-gray-200 dark:!border-gray-600 hover:bg-gray-50 dark:!hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed text-gray-700 dark:!text-gray-200"
                onClick={() => table.nextPage()}
                disabled={!table.getCanNextPage()}
              >
                <ChevronRight className="w-3 h-3 sm:w-4 sm:h-4" />
              </button>
              <button
                className="inline-flex items-center justify-center w-7 h-7 sm:w-8 sm:h-8 rounded-lg border border-gray-200 dark:!border-gray-600 hover:bg-gray-50 dark:!hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed text-gray-700 dark:!text-gray-200"
                onClick={() => table.setPageIndex(table.getPageCount() - 1)}
                disabled={!table.getCanNextPage()}
              >
                <ChevronsRight className="w-3 h-3 sm:w-4 sm:h-4" />
              </button>
            </div>

            <select
              value={table.getState().pagination.pageSize}
              onChange={e => table.setPageSize(Number(e.target.value))}
              className="px-2 py-1 text-xs sm:text-sm rounded-md border border-gray-200 dark:!border-gray-600 bg-white dark:!bg-gray-800 text-gray-900 dark:!text-gray-100 focus:ring-2 focus:ring-blue-500 dark:!focus:ring-blue-400"
            >
              {[10, 20, 30, 40, 50].map(pageSize => (
                <option key={pageSize} value={pageSize}>
                  {pageSize} ხაზი
                </option>
              ))}
            </select>
          </div>

          <div className="text-xs sm:text-sm text-gray-600 dark:!text-gray-300">
            სულ {table.getPrePaginationRowModel().rows.length} ხაზი
          </div>
        </div>
      </div>
    </div>
  )
}

function Filter({ column, size = "lg" }) {
  const sizeClasses = sizeVariants[size]
  const { filterVariant } = column.columnDef.meta ?? {}

  const columnFilterValue = column.getFilterValue()

  const sortedUniqueValues = React.useMemo(
    () =>
      filterVariant === "range"
        ? []
        : Array.from(column.getFacetedUniqueValues().keys())
            .sort()
            .slice(0, 5000),
    [column, filterVariant]
  )

  return filterVariant === "range" ? (
    <div>
      <div className="flex space-x-2">
        <DebouncedInput
          type="number"
          min={Number(column.getFacetedMinMaxValues()?.[0] ?? "")}
          max={Number(column.getFacetedMinMaxValues()?.[1] ?? "")}
          value={columnFilterValue?.[0] ?? ""}
          onChange={value => column.setFilterValue(old => [value, old?.[1]])}
          placeholder={`Min ${
            column.getFacetedMinMaxValues()?.[0] !== undefined
              ? `(${column.getFacetedMinMaxValues()?.[0]})`
              : ""
          }`}
          className={`w-24 px-2 py-1 border border-gray-200 dark:!border-gray-600 rounded-md ${sizeClasses.text} bg-white dark:!bg-gray-800 text-gray-900 dark:!text-gray-100 placeholder-gray-500 dark:!placeholder-gray-400`}
        />
        <DebouncedInput
          type="number"
          min={Number(column.getFacetedMinMaxValues()?.[0] ?? "")}
          max={Number(column.getFacetedMinMaxValues()?.[1] ?? "")}
          value={columnFilterValue?.[1] ?? ""}
          onChange={value => column.setFilterValue(old => [old?.[0], value])}
          placeholder={`Max ${
            column.getFacetedMinMaxValues()?.[1]
              ? `(${column.getFacetedMinMaxValues()?.[1]})`
              : ""
          }`}
          className={`w-24 px-2 py-1 border border-gray-200 dark:!border-gray-600 rounded-md ${sizeClasses.text} bg-white dark:!bg-gray-800 text-gray-900 dark:!text-gray-100 placeholder-gray-500 dark:!placeholder-gray-400`}
        />
      </div>
      <div className="h-1" />
    </div>
  ) : filterVariant === "select" ? (
    <select
      onChange={e => column.setFilterValue(e.target.value)}
      value={columnFilterValue?.toString()}
      className={`w-full px-2 py-1 border border-gray-200 dark:!border-gray-600 rounded-md ${sizeClasses.text} bg-white dark:!bg-gray-800 text-gray-900 dark:!text-gray-100`}
    >
      <option value="">ყველა</option>
      {column.columnDef.meta?.filterOptions
        ?.filter(option =>
          sortedUniqueValues.some(
            value =>
              value?.toString().toLowerCase() ===
              option.value.toString().toLowerCase()
          )
        )
        .map(({ value, label }) => (
          <option value={value} key={value}>
            {label}
          </option>
        ))}
      {sortedUniqueValues
        .filter(value => {
          if (!value) return false
          const lowerValue = value.toString().toLowerCase()
          return !column.columnDef.meta?.filterOptions?.some(
            opt => opt.value.toString().toLowerCase() === lowerValue
          )
        })
        .map(value => (
          <option value={value} key={value}>
            {value}
          </option>
        ))}
    </select>
  ) : (
    <>
      <datalist id={column.id + "list"}>
        {sortedUniqueValues.map(value => (
          <option value={value} key={value} />
        ))}
      </datalist>
      <DebouncedInput
        type="text"
        value={columnFilterValue ?? ""}
        onChange={value => column.setFilterValue(value)}
        placeholder={`მოძებნე... (${column.getFacetedUniqueValues().size})`}
        className={`w-full px-2 py-1 border border-gray-200 dark:!border-gray-600 rounded-md ${sizeClasses.text} bg-white dark:!bg-gray-800 text-gray-900 dark:!text-gray-100 placeholder-gray-500 dark:!placeholder-gray-400`}
        list={column.id + "list"}
      />
      <div className="h-1" />
    </>
  )
}

function DebouncedInput({
  value: initialValue,
  onChange,
  debounce = 500,
  ...props
}) {
  const [value, setValue] = React.useState(initialValue)

  React.useEffect(() => {
    setValue(initialValue)
  }, [initialValue])

  React.useEffect(() => {
    const timeout = setTimeout(() => {
      onChange(value)
    }, debounce)

    return () => clearTimeout(timeout)
  }, [debounce, onChange, value])

  return (
    <input
      {...props}
      value={value}
      onChange={e => setValue(e.target.value)}
      placeholder="მოძებნე"
    />
  )
}
