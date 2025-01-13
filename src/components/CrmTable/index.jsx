import React, { useState, useMemo, useCallback } from "react"
import PropTypes from "prop-types"
import {
  useReactTable,
  getCoreRowModel,
  getSortedRowModel,
  getFilteredRowModel,
  getExpandedRowModel,
  getPaginationRowModel,
  flexRender,
} from "@tanstack/react-table"
import {
  ChevronDown,
  ChevronUp,
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  Search,
} from "react-feather"
import Toolbar from "./components/Toolbar"
import ColumnFilter from "./components/ColumnFilter"
import {
  tableStyles,
  getTableStyle,
  getThemeStyles,
  getSizeStyles,
} from "./styles"

const CrmTable = ({
  columns = [],
  data = [],
  initialState = {},
  enableRowSelection = false,
  enableMultiRowSelection = false,
  enableColumnResizing = false,
  enableSorting = true,
  enableFilters = true,
  enableGlobalFilter = true,
  enablePagination = true,
  enableExpanding = false,
  manualPagination = false,
  manualSorting = false,
  manualFiltering = false,
  pageSize = 10,
  pageSizeOptions = [5, 10, 20, 50],
  onRowClick,
  renderSubComponent,
  renderTopToolbar,
  renderBottomToolbar,
  searchableFields = [],
  filterOptions = [],
  size = "md",
  theme = "light",
  customStyles = {},
  onPageChange,
  onPageSizeChange,
  onSortingChange,
  expandClickHandler,
}) => {
  const [globalFilter, setGlobalFilter] = useState("")
  const [rowSelection, setRowSelection] = useState({})
  const [expanded, setExpanded] = useState({})
  const [selectedSearchField, setSelectedSearchField] = useState("")
  const [sorting, setSorting] = useState([])
  const [columnFilters, setColumnFilters] = useState([])
  const [activeFilters, setActiveFilters] = useState(new Set())

  const defaultColumn = useMemo(
    () => ({
      minSize: 30,
      size: 150,
      maxSize: 400,
      enableColumnFilter: true,
    }),
    []
  )

  const styles = { ...tableStyles, ...customStyles }
  const sizeStyles = getSizeStyles(size, styles)
  const themeStyles = getThemeStyles(theme, styles)

  const handleGlobalFilterChange = value => {
    setGlobalFilter(value || undefined)
    if (manualFiltering && typeof onGlobalFilterChange === "function") {
      onGlobalFilterChange(value)
    }
  }

  const handleColumnFiltersChange = updater => {
    const newFilters =
      typeof updater === "function" ? updater(columnFilters) : updater
    const cleanedFilters = newFilters
      .map(filter => ({
        ...filter,
        value: filter.value === "" ? undefined : filter.value,
      }))
      .filter(filter => filter.value !== undefined)
    setColumnFilters(cleanedFilters)
    if (manualFiltering && typeof onColumnFiltersChange === "function") {
      onColumnFiltersChange(cleanedFilters)
    }
  }

  const handleSortingChange = updater => {
    const newSorting = typeof updater === 'function' ? updater(sorting) : updater
    setSorting(newSorting)
    
    // If manual sorting is enabled, we expect the parent to handle the sorting
    if (manualSorting && typeof onSortingChange === 'function') {
      onSortingChange(newSorting)
    }
  }

  const table = useReactTable({
    data,
    columns,
    defaultColumn,
    state: {
      globalFilter,
      rowSelection,
      expanded,
      sorting,
      columnFilters,
      ...initialState,
    },
    enableRowSelection,
    enableMultiRowSelection,
    enableColumnResizing,
    enableSorting,
    enableFilters,
    enableExpanding,
    manualPagination,
    manualSorting,
    manualFiltering,
    enableMultiSort: true,
    enableSortingRemoval: true,
    sortDescFirst: false,
    onGlobalFilterChange: handleGlobalFilterChange,
    onColumnFiltersChange: handleColumnFiltersChange,
    onRowSelectionChange: setRowSelection,
    onExpandedChange: setExpanded,
    onSortingChange: handleSortingChange,
    getRowCanExpand: () => enableExpanding,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getExpandedRowModel: getExpandedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    sortingFns: {
      alphanumeric: (rowA, rowB, columnId) => {
        const a = String(rowA.getValue(columnId) || '').toLowerCase()
        const b = String(rowB.getValue(columnId) || '').toLowerCase()
        return a < b ? -1 : a > b ? 1 : 0
      },
      datetime: (rowA, rowB, columnId) => {
        const a = rowA.getValue(columnId) ? new Date(rowA.getValue(columnId)).getTime() : 0
        const b = rowB.getValue(columnId) ? new Date(rowB.getValue(columnId)).getTime() : 0
        return a < b ? -1 : a > b ? 1 : 0
      },
      number: (rowA, rowB, columnId) => {
        const a = Number(rowA.getValue(columnId))
        const b = Number(rowB.getValue(columnId))
        return a < b ? -1 : a > b ? 1 : 0
      },
      text: (rowA, rowB, columnId) => {
        const a = String(rowA.getValue(columnId) || "").toLowerCase()
        const b = String(rowB.getValue(columnId) || "").toLowerCase()
        return a.localeCompare(b)
      },
      basic: (rowA, rowB, columnId) => {
        const a = rowA.getValue(columnId)
        const b = rowB.getValue(columnId)
        return a === b ? 0 : a > b ? 1 : -1
      },
    },
    filterFns: {
      startsWith: (row, columnId, filterValue) => {
        if (!filterValue) return true
        const value = row.getValue(columnId)
        if (value == null) return false
        return String(value)
          .toLowerCase()
          .startsWith(String(filterValue).toLowerCase())
      },
      endsWith: (row, columnId, filterValue) => {
        if (!filterValue) return true
        const value = row.getValue(columnId)
        if (value == null) return false
        return String(value)
          .toLowerCase()
          .endsWith(String(filterValue).toLowerCase())
      },
      includes: (row, columnId, filterValue) => {
        if (!filterValue) return true
        const value = row.getValue(columnId)
        if (value == null) return false
        return String(value)
          .toLowerCase()
          .includes(String(filterValue).toLowerCase())
      },
      equals: (row, columnId, filterValue) => {
        if (!filterValue) return true
        const value = row.getValue(columnId)
        if (value == null) return false
        return String(value) === String(filterValue)
      },
    },
    globalFilterFn: (row, columnId, filterValue) => {
      if (!filterValue) return true
      const value = row.getValue(columnId)
      if (value == null) return false
      return String(value)
        .toLowerCase()
        .includes(String(filterValue).toLowerCase())
    },
    initialState: {
      pagination: {
        pageSize,
      },
      ...initialState,
    },
  })

  React.useEffect(() => {
    console.log("Table state updated:", {
      globalFilter: table.getState().globalFilter,
      columnFilters: table.getState().columnFilters,
      rowCount: table.getRowModel().rows.length,
      filteredRowCount: table.getFilteredRowModel().rows.length,
    })
  }, [table.getState().globalFilter, table.getState().columnFilters])

  const handlePageChange = pageIndex => {
    if (manualPagination && onPageChange) {
      onPageChange(pageIndex)
    } else {
      table.setPageIndex(pageIndex)
    }
  }

  const handlePageSizeChange = newSize => {
    if (manualPagination && onPageSizeChange) {
      onPageSizeChange(newSize)
    } else {
      table.setPageSize(newSize)
    }
  }

  const Pagination = useCallback(() => {
    return (
      <div className={styles.pagination}>
        <div className="flex items-center gap-2">
          <select
            value={table.getState().pagination.pageSize}
            onChange={e => handlePageSizeChange(Number(e.target.value))}
            className={styles.paginationSelect}
          >
            {pageSizeOptions.map(size => (
              <option key={size} value={size}>
                {size} ჩანაწერი
              </option>
            ))}
          </select>
          <span className={styles.paginationText}>
            გვერდი {table.getState().pagination.pageIndex + 1} /{" "}
            {table.getPageCount()}
          </span>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => handlePageChange(0)}
            disabled={!table.getCanPreviousPage()}
            className={styles.paginationButton}
          >
            <ChevronsLeft size={20} />
          </button>
          <button
            onClick={() =>
              handlePageChange(table.getState().pagination.pageIndex - 1)
            }
            disabled={!table.getCanPreviousPage()}
            className={styles.paginationButton}
          >
            <ChevronLeft size={20} />
          </button>
          <button
            onClick={() =>
              handlePageChange(table.getState().pagination.pageIndex + 1)
            }
            disabled={!table.getCanNextPage()}
            className={styles.paginationButton}
          >
            <ChevronRight size={20} />
          </button>
          <button
            onClick={() => handlePageChange(table.getPageCount() - 1)}
            disabled={!table.getCanNextPage()}
            className={styles.paginationButton}
          >
            <ChevronsRight size={20} />
          </button>
        </div>
      </div>
    )
  }, [table, pageSizeOptions, styles, handlePageChange, handlePageSizeChange])

  const toggleColumnFilter = columnId => {
    setActiveFilters(prev => {
      const newSet = new Set(prev)
      if (newSet.has(columnId)) {
        newSet.delete(columnId)
        const column = table.getColumn(columnId)
        if (column) {
          column.setFilterValue(undefined)
        }
      } else {
        newSet.add(columnId)
      }
      return newSet
    })
  }

  return (
    <div className={getTableStyle(styles.container, themeStyles.background)}>
      {renderTopToolbar ? (
        renderTopToolbar({ table })
      ) : (
        <Toolbar
          table={table}
          enableGlobalFilter={enableGlobalFilter}
          searchableFields={searchableFields}
          selectedSearchField={selectedSearchField}
          setSelectedSearchField={setSelectedSearchField}
          filterOptions={filterOptions}
        />
      )}

      <div className="overflow-x-auto">
        <table className={`${styles.table} border-collapse`}>
          <thead className={styles.thead}>
            {table.getHeaderGroups().map(headerGroup => (
              <tr key={headerGroup.id}>
                {enableExpanding && (
                  <th className="w-10 px-4 py-4 border border-gray-200 dark:border-gray-700" />
                )}
                {headerGroup.headers.map(header => (
                  <th
                    key={header.id}
                    colSpan={header.colSpan}
                    style={{ width: header.getSize() }}
                    className={`${getTableStyle(
                      sizeStyles.th,
                      themeStyles.text
                    )} border border-gray-200 dark:border-gray-700`}
                  >
                    {header.isPlaceholder ? null : (
                      <div className="space-y-3">
                        <div
                          className={`${
                            styles.thContent
                          } py-2 flex items-center justify-between ${
                            header.column.getCanSort()
                              ? styles.utils.clickable
                              : ""
                          }`}
                        >
                          <div className="flex items-center gap-2">
                            <span
                              className="text-base font-semibold text-white"
                              onClick={
                                header.column.getCanSort()
                                  ? header.column.getToggleSortingHandler()
                                  : undefined
                              }
                            >
                              {flexRender(
                                header.column.columnDef.header,
                                header.getContext()
                              )}
                            </span>
                            {header.column.getCanFilter() && (
                              <button
                                onClick={() =>
                                  toggleColumnFilter(header.column.id)
                                }
                                className={`p-1 rounded-md hover:bg-white/10 transition-colors ${
                                  activeFilters.has(header.column.id)
                                    ? "text-white"
                                    : "text-white/70"
                                }`}
                              >
                                <Search size={16} />
                              </button>
                            )}
                          </div>
                          {header.column.getCanSort() && (
                            <span
                              className={`${styles.sortIcon} ml-2 flex-shrink-0`}
                            >
                              <ChevronUp
                                size={16}
                                className={
                                  header.column.getIsSorted() === "asc"
                                    ? "text-white"
                                    : "text-white/70"
                                }
                              />
                              <ChevronDown
                                size={16}
                                className={
                                  header.column.getIsSorted() === "desc"
                                    ? "text-white"
                                    : "text-white/70"
                                }
                              />
                            </span>
                          )}
                        </div>
                        {enableFilters &&
                          header.column.getCanFilter() &&
                          activeFilters.has(header.column.id) && (
                            <div className="pb-2">
                              <ColumnFilter column={header.column} />
                            </div>
                          )}
                      </div>
                    )}
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody className={styles.tbody}>
            {table.getRowModel().rows.map(row => (
              <React.Fragment key={row.id}>
                <tr
                  className={`${styles.tr} ${
                    onRowClick ? styles.utils.clickable : ""
                  }`}
                  onClick={
                    onRowClick ? () => onRowClick(row.original) : undefined
                  }
                >
                  {enableExpanding && (
                    <td className="w-10 px-4 py-3 border border-gray-200 dark:border-gray-700">
                      {row.getCanExpand() && (
                        <button
                          onClick={e => {
                            row.getToggleExpandedHandler()(e)
                            expandClickHandler?.(e)
                          }}
                          className={styles.paginationButton}
                        >
                          {row.getIsExpanded() ? (
                            <ChevronUp size={20} />
                          ) : (
                            <ChevronDown size={20} />
                          )}
                        </button>
                      )}
                    </td>
                  )}
                  {row.getVisibleCells().map(cell => (
                    <td
                      key={cell.id}
                      className={`${getTableStyle(
                        sizeStyles.td,
                        themeStyles.text
                      )} border border-gray-200 dark:border-gray-700`}
                    >
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </td>
                  ))}
                </tr>
                {row.getIsExpanded() && renderSubComponent && (
                  <tr className={styles.expandedRow}>
                    <td
                      colSpan={row.getVisibleCells().length + 1}
                      className="border border-gray-200 dark:border-gray-700"
                    >
                      {renderSubComponent({ row })}
                    </td>
                  </tr>
                )}
              </React.Fragment>
            ))}
          </tbody>
        </table>
      </div>

      {renderBottomToolbar
        ? renderBottomToolbar({ table })
        : enablePagination && <Pagination />}
    </div>
  )
}

CrmTable.propTypes = {
  columns: PropTypes.array,
  data: PropTypes.array,
  initialState: PropTypes.object,
  enableRowSelection: PropTypes.bool,
  enableMultiRowSelection: PropTypes.bool,
  enableColumnResizing: PropTypes.bool,
  enableSorting: PropTypes.bool,
  enableFilters: PropTypes.bool,
  enableGlobalFilter: PropTypes.bool,
  enablePagination: PropTypes.bool,
  enableExpanding: PropTypes.bool,
  manualPagination: PropTypes.bool,
  manualFiltering: PropTypes.bool,
  pageSize: PropTypes.number,
  pageSizeOptions: PropTypes.arrayOf(PropTypes.number),
  onRowClick: PropTypes.func,
  renderSubComponent: PropTypes.func,
  renderTopToolbar: PropTypes.func,
  renderBottomToolbar: PropTypes.func,
  searchableFields: PropTypes.array,
  filterOptions: PropTypes.array,
  size: PropTypes.oneOf(["sm", "md", "lg"]),
  theme: PropTypes.oneOf(["light", "dark"]),
  customStyles: PropTypes.object,
  onPageChange: PropTypes.func,
  onPageSizeChange: PropTypes.func,
  onSortingChange: PropTypes.func,
  expandClickHandler: PropTypes.func,
}

export default React.memo(CrmTable)
