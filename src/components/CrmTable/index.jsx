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

export function CrmTable({ columns, data, renderSubComponent, onRowClick }) {
  const [sorting, setSorting] = React.useState([])
  const [columnFilters, setColumnFilters] = React.useState([])
  const [expanded, setExpanded] = React.useState({})

  const table = useReactTable({
    columns,
    data,
    debugTable: true,
    debugHeaders: true,
    debugColumns: false,
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
    getRowCanExpand: () => true,
    state: {
      sorting,
      columnFilters,
      expanded,
    },
  })

  return (
    <div className="w-full overflow-hidden bg-white dark:!bg-gray-800 rounded-lg shadow-xl border border-gray-200 dark:!border-gray-700">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            {table.getHeaderGroups().map(headerGroup => (
              <tr key={headerGroup.id} className="dark:!bg-gray-800">
                {headerGroup.headers.map(header => (
                  <th
                    key={header.id}
                    colSpan={header.colSpan}
                    className="px-6 py-4 bg-[#105D8D] dark:!bg-gray-900 border-b border-gray-200 dark:!border-gray-700"
                  >
                    {header.isPlaceholder ? null : (
                      <>
                        <div
                          {...{
                            className: header.column.getCanSort()
                              ? "flex items-center gap-2 cursor-pointer select-none text-gray-100 dark:!text-gray-300 font-medium hover:text-gray-900 dark:!hover:text-gray-100"
                              : "text-gray-100 dark:!text-gray-300 font-medium",
                            onClick: header.column.getToggleSortingHandler(),
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
                            <Filter column={header.column} />
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
                    className={`hover:bg-gray-50 dark:!hover:bg-gray-700/50 ${
                      onRowClick ? "cursor-pointer" : ""
                    }`}
                    onClick={() => onRowClick?.(row)}
                  >
                    {row.getVisibleCells().map(cell => {
                      return (
                        <td
                          key={cell.id}
                          className="px-5 py-4 text-sm text-gray-700 dark:!text-gray-200 bg-white dark:!bg-gray-800"
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

      <div className="px-6 py-4 border-t border-gray-200 dark:!border-gray-700 bg-white dark:!bg-gray-800">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <button
              className="inline-flex items-center justify-center w-8 h-8 rounded-lg border border-gray-200 dark:!border-gray-600 hover:bg-gray-50 dark:!hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed text-gray-700 dark:!text-gray-200"
              onClick={() => table.setPageIndex(0)}
              disabled={!table.getCanPreviousPage()}
            >
              <ChevronsLeft className="w-4 h-4" />
            </button>
            <button
              className="inline-flex items-center justify-center w-8 h-8 rounded-lg border border-gray-200 dark:!border-gray-600 hover:bg-gray-50 dark:!hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed text-gray-700 dark:!text-gray-200"
              onClick={() => table.previousPage()}
              disabled={!table.getCanPreviousPage()}
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              className="inline-flex items-center justify-center w-8 h-8 rounded-lg border border-gray-200 dark:!border-gray-600 hover:bg-gray-50 dark:!hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed text-gray-700 dark:!text-gray-200"
              onClick={() => table.nextPage()}
              disabled={!table.getCanNextPage()}
            >
              <ChevronRight className="w-4 h-4" />
            </button>
            <button
              className="inline-flex items-center justify-center w-8 h-8 rounded-lg border border-gray-200 dark:!border-gray-600 hover:bg-gray-50 dark:!hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed text-gray-700 dark:!text-gray-200"
              onClick={() => table.setPageIndex(table.getPageCount() - 1)}
              disabled={!table.getCanNextPage()}
            >
              <ChevronsRight className="w-4 h-4" />
            </button>
          </div>

          <div className="flex flex-wrap items-center gap-4">
            <span className="text-sm text-gray-700 dark:!text-gray-200">
              გვერდი{" "}
              <strong>{table.getState().pagination.pageIndex + 1}</strong> დან{" "}
              <strong>{table.getPageCount()}</strong>
            </span>

            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-700 dark:!text-gray-200">
                გადადი:
              </span>
              <input
                type="number"
                defaultValue={table.getState().pagination.pageIndex + 1}
                onChange={e => {
                  const page = e.target.value ? Number(e.target.value) - 1 : 0
                  table.setPageIndex(page)
                }}
                className="w-16 px-2 py-1 text-sm rounded-md border border-gray-200 dark:!border-gray-600 bg-white dark:!bg-gray-800 text-gray-900 dark:!text-gray-100 focus:ring-2 focus:ring-blue-500 dark:!focus:ring-blue-400"
              />
            </div>

            <select
              value={table.getState().pagination.pageSize}
              onChange={e => table.setPageSize(Number(e.target.value))}
              className="px-2 py-1 text-sm rounded-md border border-gray-200 dark:!border-gray-600 bg-white dark:!bg-gray-800 text-gray-900 dark:!text-gray-100 focus:ring-2 focus:ring-blue-500 dark:!focus:ring-blue-400"
            >
              {[10, 20, 30, 40, 50].map(pageSize => (
                <option key={pageSize} value={pageSize}>
                  აჩვენე {pageSize}
                </option>
              ))}
            </select>
          </div>
        </div>
        <div className="mt-3 text-sm text-gray-600 dark:!text-gray-300">
          სულ {table.getPrePaginationRowModel().rows.length} ხაზი
        </div>
      </div>
    </div>
  )
}

function Filter({ column }) {
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
          className="w-24 px-2 py-1 border border-gray-200 dark:!border-gray-600 rounded-md text-sm bg-white dark:!bg-gray-800 text-gray-900 dark:!text-gray-100 placeholder-gray-500 dark:!placeholder-gray-400"
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
          className="w-24 px-2 py-1 border border-gray-200 dark:!border-gray-600 rounded-md text-sm bg-white dark:!bg-gray-800 text-gray-900 dark:!text-gray-100 placeholder-gray-500 dark:!placeholder-gray-400"
        />
      </div>
      <div className="h-1" />
    </div>
  ) : filterVariant === "select" ? (
    <select
      onChange={e => column.setFilterValue(e.target.value)}
      value={columnFilterValue?.toString()}
      className="w-full px-2 py-1 border border-gray-200 dark:!border-gray-600 rounded-md text-sm bg-white dark:!bg-gray-800 text-gray-900 dark:!text-gray-100"
    >
      <option value="">ყველა</option>
      {sortedUniqueValues.map(value => (
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
        className="w-full px-2 py-1 border border-gray-200 dark:!border-gray-600 rounded-md text-sm bg-white dark:!bg-gray-800 text-gray-900 dark:!text-gray-100 placeholder-gray-500 dark:!placeholder-gray-400"
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
  }, [value])

  return (
    <input
      {...props}
      value={value}
      onChange={e => setValue(e.target.value)}
      placeholder="მოძებნე"
    />
  )
}
