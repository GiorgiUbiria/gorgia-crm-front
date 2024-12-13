import React, { useState, useMemo, useCallback, useEffect } from "react"
import PropTypes from "prop-types"
import Box from "@mui/material/Box"
import Collapse from "@mui/material/Collapse"
import IconButton from "@mui/material/IconButton"
import TableBody from "@mui/material/TableBody"
import TableCell from "@mui/material/TableCell"
import TableContainer from "@mui/material/TableContainer"
import TableHead from "@mui/material/TableHead"
import TableRow from "@mui/material/TableRow"
import Paper from "@mui/material/Paper"
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown"
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp"
import {
  useTable,
  useSortBy,
  usePagination,
  useFilters,
  useGlobalFilter,
} from "react-table"
import {
  Table as MuiTableComponent,
  TablePagination,
  TextField,
  InputAdornment,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
} from "@mui/material"
import SearchIcon from "@mui/icons-material/Search"
import FirstPageIcon from "@mui/icons-material/FirstPage"
import LastPageIcon from "@mui/icons-material/LastPage"
import KeyboardArrowLeft from "@mui/icons-material/KeyboardArrowLeft"
import KeyboardArrowRight from "@mui/icons-material/KeyboardArrowRight"
import TableSortLabel from "@mui/material/TableSortLabel"

const CustomPaginationActions = React.memo(function CustomPaginationActions(
  props
) {
  const { count, page, rowsPerPage, onPageChange } = props

  const handleFirstPageButtonClick = useCallback(() => {
    onPageChange(null, 0)
  }, [onPageChange])

  const handleBackButtonClick = useCallback(() => {
    onPageChange(null, page - 1)
  }, [onPageChange, page])

  const handleNextButtonClick = useCallback(() => {
    onPageChange(null, page + 1)
  }, [onPageChange, page])

  const handleLastPageButtonClick = useCallback(() => {
    onPageChange(null, Math.max(0, Math.ceil(count / rowsPerPage) - 1))
  }, [onPageChange, count, rowsPerPage])

  return (
    <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
      <IconButton
        onClick={handleFirstPageButtonClick}
        disabled={page === 0}
        aria-label="Go to first page"
        size="small"
        sx={{ color: "primary.main" }}
      >
        <FirstPageIcon />
      </IconButton>
      <IconButton
        onClick={handleBackButtonClick}
        disabled={page === 0}
        aria-label="Go to previous page"
        size="small"
        sx={{ color: "primary.main" }}
      >
        <KeyboardArrowLeft />
      </IconButton>
      <IconButton
        onClick={handleNextButtonClick}
        disabled={page >= Math.ceil(count / rowsPerPage) - 1}
        aria-label="Go to next page"
        size="small"
        sx={{ color: "primary.main" }}
      >
        <KeyboardArrowRight />
      </IconButton>
      <IconButton
        onClick={handleLastPageButtonClick}
        disabled={page >= Math.ceil(count / rowsPerPage) - 1}
        aria-label="Go to last page"
        size="small"
        sx={{ color: "primary.main" }}
      >
        <LastPageIcon />
      </IconButton>
    </Box>
  )
})

const MuiTable = ({
  columns = [],
  data = [],
  initialPageSize = 10,
  pageSizeOptions = [5, 10, 20, 50],
  onRowClick,
  enableSearch = false,
  searchableFields = [],
  renderRowDetails,
  filterOptions = [],
}) => {
  const [openRows, setOpenRows] = useState({})
  const [filterField, setFilterField] = useState("")
  const [filterValue, setFilterValue] = useState("")
  const [currentFilters, setCurrentFilters] = useState([])
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedSearchField, setSelectedSearchField] = useState(
    searchableFields[0] || ""
  )

  const memoizedData = useMemo(() => data, [data])
  const memoizedColumns = useMemo(() => columns, [columns])

  const customGlobalFilter = useCallback(
    (rows, columnIds, filterValue) => {
      if (!filterValue || !selectedSearchField) return rows

      return rows.filter(row => {
        const cellValue = row.values[selectedSearchField]
        if (cellValue == null) return false

        return String(cellValue)
          .toLowerCase()
          .includes(filterValue.toLowerCase())
      })
    },
    [selectedSearchField]
  )

  const tableInstance = useTable(
    {
      columns: memoizedColumns,
      data: memoizedData,
      initialState: {
        pageIndex: 0,
        pageSize: initialPageSize,
        filters: currentFilters,
        globalFilter: searchTerm,
        sortBy: [
          {
            id: "id",
            desc: true,
          },
        ],
      },
      globalFilter: customGlobalFilter,
      autoResetPage: false,
      autoResetFilters: false,
      autoResetGlobalFilter: false,
      autoResetSortBy: false,
    },
    useFilters,
    useGlobalFilter,
    useSortBy,
    usePagination
  )

  const {
    gotoPage,
    setPageSize,
    state: { pageIndex, pageSize },
    setGlobalFilter,
    headerGroups,
    prepareRow,
    page,
    rows,
  } = tableInstance

  useEffect(() => {
    if (tableInstance.state.filters) {
      setCurrentFilters(tableInstance.state.filters)
    }
    if (tableInstance.state.globalFilter !== undefined) {
      setSearchTerm(tableInstance.state.globalFilter)
    }
  }, [tableInstance.state.filters, tableInstance.state.globalFilter])

  const handlePageChange = useCallback(
    (event, newPage) => {
      gotoPage(newPage)
    },
    [gotoPage]
  )

  const handleChangeRowsPerPage = useCallback(
    event => {
      const newSize = parseInt(event.target.value, 10)
      setPageSize(newSize)
      gotoPage(0)
    },
    [setPageSize, gotoPage]
  )

  const handleFilterChange = useCallback(
    event => {
      const { name, value } = event.target
      if (name === "field") {
        setFilterField(value)
        setFilterValue("")
        if (!value) {
          setCurrentFilters([])
          tableInstance.setAllFilters([])
        }
      } else {
        setFilterValue(value)
        if (filterField) {
          const newFilters = [{ id: filterField, value }]
          setCurrentFilters(newFilters)
          tableInstance.setFilter(filterField, value)
        }
      }
    },
    [filterField, tableInstance]
  )

  const handleToggleRow = useCallback(rowId => {
    setOpenRows(prev => ({
      ...prev,
      [rowId]: !prev[rowId],
    }))
  }, [])

  const getFilterValues = useCallback(() => {
    if (!filterField || !data) return []

    const selectedFilter = filterOptions.find(
      option => option.field === filterField
    )
    const uniqueValues = new Set(
      data
        .map(item => item?.[filterField])
        .filter(value => value !== undefined && value !== null)
    )
    const values = Array.from(uniqueValues)

    if (selectedFilter?.valueLabels) {
      return values.map(value => ({
        value,
        label: selectedFilter.valueLabels[value] || value,
      }))
    }

    return values.map(value => ({
      value,
      label: value,
    }))
  }, [filterField, data, filterOptions])

  const handleSearch = useCallback(
    value => {
      setSearchTerm(value)
      setGlobalFilter(value)
    },
    [setGlobalFilter]
  )

  return (
    <Paper
      elevation={4}
      sx={{
        borderRadius: 2,
        overflow: "hidden",
        backgroundColor: "background.paper",
        color: "text.primary",
      }}
    >
      {(enableSearch || filterOptions.length > 0) && (
        <Box
          sx={{
            p: 2,
            borderBottom: "1px solid rgba(255, 255, 255, 0.12)",
            display: "flex",
            flexDirection: { xs: "column", sm: "row" },
            gap: 2,
            backgroundColor: "background.default",
          }}
        >
          {enableSearch && searchableFields.length > 0 && (
            <Box
              sx={{
                display: "flex",
                flexDirection: { xs: "column", sm: "row" },
                gap: 2,
                flex: 1,
              }}
            >
              <FormControl
                size="small"
                sx={{ minWidth: { xs: "100%", sm: 200 } }}
              >
                <InputLabel sx={{ color: "text.secondary" }}>
                  საძიებო ველი
                </InputLabel>
                <Select
                  value={selectedSearchField}
                  onChange={e => setSelectedSearchField(e.target.value)}
                  label="საძიებო ველი"
                  sx={{
                    "& .MuiSelect-icon": { color: "text.secondary" },
                    "& .MuiOutlinedInput-notchedOutline": {
                      borderColor: "divider",
                    },
                    "&:hover .MuiOutlinedInput-notchedOutline": {
                      borderColor: "primary.main",
                    },
                  }}
                >
                  {searchableFields.map(field => (
                    <MenuItem key={field} value={field}>
                      {columns.find(col => col.accessor === field)?.Header ||
                        field}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
              <TextField
                size="small"
                variant="outlined"
                value={searchTerm}
                onChange={e => handleSearch(e.target.value)}
                placeholder="ძიება..."
                disabled={!selectedSearchField}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <SearchIcon sx={{ color: "text.secondary" }} />
                    </InputAdornment>
                  ),
                  sx: { backgroundColor: "background.paper", borderRadius: 1 },
                }}
                sx={{
                  flex: 1,
                  backgroundColor: "background.paper",
                  borderRadius: 1,
                  width: { xs: "100%", sm: "auto" },
                }}
              />
            </Box>
          )}
          {filterOptions.length > 0 && (
            <Box
              sx={{
                display: "flex",
                flexDirection: { xs: "column", sm: "row" },
                gap: 1,
                minWidth: { xs: "100%", sm: 300 },
              }}
            >
              <FormControl
                size="small"
                sx={{ minWidth: { xs: "100%", sm: 140 } }}
              >
                <InputLabel sx={{ color: "text.secondary" }}>ფილტრი</InputLabel>
                <Select
                  name="field"
                  value={filterField}
                  onChange={handleFilterChange}
                  label="გაფილტრე"
                  sx={{
                    "& .MuiSelect-icon": { color: "text.secondary" },
                    "& .MuiOutlinedInput-notchedOutline": {
                      borderColor: "divider",
                    },
                    "&:hover .MuiOutlinedInput-notchedOutline": {
                      borderColor: "primary.main",
                    },
                  }}
                >
                  <MenuItem value="">
                    <em>არცერთი</em>
                  </MenuItem>
                  {filterOptions.map(option => (
                    <MenuItem key={option.field} value={option.field}>
                      {option.label}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
              {filterField && (
                <FormControl
                  size="small"
                  sx={{ minWidth: { xs: "100%", sm: 140 } }}
                >
                  <InputLabel sx={{ color: "text.secondary" }}>
                    ფილტრი
                  </InputLabel>
                  <Select
                    name="value"
                    value={filterValue}
                    onChange={handleFilterChange}
                    label="მნიშვნელობა"
                    sx={{
                      "& .MuiSelect-icon": { color: "text.secondary" },
                      "& .MuiOutlinedInput-notchedOutline": {
                        borderColor: "divider",
                      },
                      "&:hover .MuiOutlinedInput-notchedOutline": {
                        borderColor: "primary.main",
                      },
                    }}
                  >
                    <MenuItem value="">
                      <em>ყველა</em>
                    </MenuItem>
                    {getFilterValues().map(({ value, label }) => (
                      <MenuItem key={value} value={value}>
                        {label}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              )}
            </Box>
          )}
        </Box>
      )}
      <TableContainer>
        <MuiTableComponent
          {...tableInstance.getTableProps()}
          sx={{
            minWidth: 650,
            backgroundColor: "background.paper",
            borderCollapse: "collapse",
            "& .MuiTableCell-head": {
              backgroundColor: "#105d8d",
              color: "primary.contrastText",
              fontWeight: 700,
              borderRight: "1px solid rgba(224, 224, 224, 0.4)",
              borderBottom: "1px solid rgba(224, 224, 224, 0.4)",
              "&:last-child": {
                borderRight: "none",
              },
            },
            "& .MuiTableCell-body": {
              borderRight: "1px solid rgba(224, 224, 224, 0.4)",
              borderBottom: "1px solid rgba(224, 224, 224, 0.4)",
              "&:last-child": {
                borderRight: "none",
              },
            },
            "& .MuiTableRow-root:nth-of-type(even)": {
              backgroundColor: "action.hover",
            },
            "& .MuiTableRow-hover:hover": {
              backgroundColor: "action.selected",
            },
          }}
        >
          <TableHead>
            {headerGroups.map(headerGroup => (
              <TableRow
                key={headerGroup.id}
                {...headerGroup.getHeaderGroupProps()}
              >
                {renderRowDetails && (
                  <TableCell sx={{ width: 48, padding: "0 4px" }} />
                )}
                {headerGroup.headers.map((column, index) => (
                  <TableCell
                    {...column.getHeaderProps(column.getSortByToggleProps())}
                    key={index}
                    sx={{
                      cursor: column.canSort ? "pointer" : "default",
                      "&:hover": column.canSort
                        ? { backgroundColor: "primary.light" }
                        : {},
                      transition: "background-color 0.2s",
                    }}
                  >
                    {column.canSort ? (
                      <TableSortLabel
                        active={column.isSorted}
                        direction={column.isSortedDesc ? "desc" : "asc"}
                        sx={{
                          "& .MuiTableSortLabel-icon": {
                            color: "primary.contrastText !important",
                          },
                        }}
                      >
                        {column.render("Header")}
                      </TableSortLabel>
                    ) : (
                      column.render("Header")
                    )}
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </TableHead>
          <TableBody {...tableInstance.getTableBodyProps()}>
            {page.map(row => {
              prepareRow(row)
              const isOpen = openRows[row.original.id] || false

              return (
                <React.Fragment key={row.original.id}>
                  <TableRow
                    hover
                    onClick={event => {
                      if (event.target.closest(".collapse-button")) return
                      onRowClick && onRowClick(row.original)
                    }}
                    {...row.getRowProps()}
                    sx={{
                      cursor: onRowClick ? "pointer" : "default",
                      "&:hover": {
                        backgroundColor: "action.hover",
                      },
                      transition: "background-color 0.2s",
                    }}
                  >
                    {renderRowDetails && (
                      <TableCell sx={{ width: 48, padding: "0 4px" }}>
                        <IconButton
                          className="collapse-button"
                          aria-label="expand row"
                          size="small"
                          onClick={() => handleToggleRow(row.original.id)}
                          sx={{ color: "primary.main" }}
                        >
                          {isOpen ? (
                            <KeyboardArrowUpIcon />
                          ) : (
                            <KeyboardArrowDownIcon />
                          )}
                        </IconButton>
                      </TableCell>
                    )}
                    {row.cells.map(cell => (
                      <TableCell
                        {...cell.getCellProps()}
                        key={cell.column.id}
                        sx={{ py: 0.75 }}
                      >
                        {cell.render("Cell")}
                      </TableCell>
                    ))}
                  </TableRow>
                  {renderRowDetails && (
                    <TableRow key={`${row.original.id}-collapse`}>
                      <TableCell
                        sx={{
                          py: 0,
                          borderBottom: isOpen
                            ? "1px solid rgba(255, 255, 255, 0.2)"
                            : "none",
                        }}
                        colSpan={columns.length + 1}
                      >
                        <Collapse in={isOpen} timeout="auto" unmountOnExit>
                          <Box sx={{ py: 2, px: 3 }}>
                            {renderRowDetails(row.original)}
                          </Box>
                        </Collapse>
                      </TableCell>
                    </TableRow>
                  )}
                </React.Fragment>
              )
            })}
          </TableBody>
        </MuiTableComponent>
      </TableContainer>

      <Box
        sx={{
          display: "flex",
          justifyContent: "flex-end",
          alignItems: "center",
          borderTop: "1px solid rgba(255, 255, 255, 0.12)",
          backgroundColor: "background.default",
        }}
      >
        <TablePagination
          component="div"
          count={rows.length}
          page={pageIndex}
          onPageChange={handlePageChange}
          rowsPerPage={pageSize}
          onRowsPerPageChange={handleChangeRowsPerPage}
          rowsPerPageOptions={pageSizeOptions}
          labelRowsPerPage="ჩანაწერი გვერდზე:"
          labelDisplayedRows={({ from, to, count }) =>
            `${from}–${to} ${count}-დან`
          }
          ActionsComponent={CustomPaginationActions}
          sx={{
            ".MuiTablePagination-toolbar": {
              minHeight: "52px",
              padding: "0 12px",
              width: "100%",
              justifyContent: "flex-end",
            },
            ".MuiTablePagination-selectLabel": {
              margin: 0,
              display: "flex",
              alignItems: "center",
              color: "text.secondary",
            },
            ".MuiTablePagination-displayedRows": {
              margin: 0,
              display: "flex",
              alignItems: "center",
              color: "text.secondary",
            },
            ".MuiTablePagination-select": {
              paddingTop: 0,
              paddingBottom: 0,
              color: "text.primary",
            },
            ".MuiTablePagination-actions": {
              marginLeft: 2,
              display: "flex",
              alignItems: "center",
            },
          }}
        />
      </Box>
    </Paper>
  )
}

MuiTable.propTypes = {
  columns: PropTypes.array,
  data: PropTypes.array,
  initialPageSize: PropTypes.number,
  pageSizeOptions: PropTypes.arrayOf(PropTypes.number),
  onRowClick: PropTypes.func,
  enableSearch: PropTypes.bool,
  searchableFields: PropTypes.arrayOf(PropTypes.string),
  renderRowDetails: PropTypes.func,
  filterOptions: PropTypes.arrayOf(
    PropTypes.shape({
      field: PropTypes.string.isRequired,
      label: PropTypes.string.isRequired,
      valueLabels: PropTypes.object,
    })
  ),
}

export default React.memo(MuiTable)
