import * as React from "react"
import PropTypes from "prop-types"
import Box from "@mui/material/Box"
import Collapse from "@mui/material/Collapse"
import IconButton from "@mui/material/IconButton"
import Table from "@mui/material/Table"
import TableBody from "@mui/material/TableBody"
import TableCell from "@mui/material/TableCell"
import TableContainer from "@mui/material/TableContainer"
import TableHead from "@mui/material/TableHead"
import TableRow from "@mui/material/TableRow"
import Typography from "@mui/material/Typography"
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
} from "@mui/material"
import SearchIcon from "@mui/icons-material/Search"
import Select from "@mui/material/Select"
import MenuItem from "@mui/material/MenuItem"
import FormControl from "@mui/material/FormControl"
import InputLabel from "@mui/material/InputLabel"
import FirstPageIcon from "@mui/icons-material/FirstPage"
import LastPageIcon from "@mui/icons-material/LastPage"
import KeyboardArrowLeft from "@mui/icons-material/KeyboardArrowLeft"
import KeyboardArrowRight from "@mui/icons-material/KeyboardArrowRight"

const MuiTable = ({
  columns = [],
  data = [],
  initialPageSize = 10,
  pageSizeOptions = [5, 10, 20, 50],
  onRowClick,
  enableSearch = false,
  searchableFields = [],
  actions = [],
  renderRowDetails,
  filterOptions = [],
}) => {
  const [openRows, setOpenRows] = React.useState({})
  const [filterValue, setFilterValue] = React.useState("")
  const [filterField, setFilterField] = React.useState("")
  const [currentFilters, setCurrentFilters] = React.useState([])
  const [globalFilterValue, setGlobalFilterValue] = React.useState("")
  const [searchTerm, setSearchTerm] = React.useState("")
  const [selectedSearchField, setSelectedSearchField] = React.useState(
    searchableFields[0] || ""
  )

  const memoizedData = React.useMemo(() => data, [data])
  const memoizedColumns = React.useMemo(() => columns, [columns])

  const customGlobalFilter = React.useCallback(
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
      },
      globalFilter: customGlobalFilter,
      autoResetPage: false,
      autoResetFilters: false,
      autoResetGlobalFilter: false,
    },
    useFilters,
    useGlobalFilter,
    useSortBy,
    usePagination
  )

  React.useEffect(() => {
    if (tableInstance.state.filters) {
      setCurrentFilters(tableInstance.state.filters)
    }
  }, [tableInstance.state.filters])

  React.useEffect(() => {
    if (tableInstance.state.globalFilter !== undefined) {
      setGlobalFilterValue(tableInstance.state.globalFilter)
    }
  }, [tableInstance.state.globalFilter])

  const {
    gotoPage,
    setPageSize,
    state: { pageIndex, pageSize },
  } = tableInstance

  const handlePageChange = React.useCallback(
    (event, newPage) => {
      gotoPage(newPage)
    },
    [gotoPage]
  )

  const handleChangeRowsPerPage = React.useCallback(
    event => {
      const newSize = parseInt(event.target.value, 10)
      setPageSize(newSize)
      gotoPage(0)
    },
    [setPageSize, gotoPage]
  )

  const handleFilterChange = React.useCallback(
    event => {
      const { name, value } = event.target
      if (name === "field") {
        setFilterField(value)
        setFilterValue("")
        if (!value) {
          const newFilters = []
          setCurrentFilters(newFilters)
          tableInstance.setAllFilters(newFilters)
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

  const handleToggleRow = rowId => {
    setOpenRows(prev => ({
      ...prev,
      [rowId]: !prev[rowId],
    }))
  }

  const getFilterValues = () => {
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
  }

  const handleSearch = React.useCallback(
    value => {
      setSearchTerm(value)
      tableInstance.setGlobalFilter(value)
    },
    [tableInstance]
  )

  const CustomPaginationActions = React.memo(function CustomPaginationActions(
    props
  ) {
    const { count, page, rowsPerPage, onPageChange } = props

    const handleFirstPageButtonClick = React.useCallback(() => {
      onPageChange(null, 0)
    }, [onPageChange])

    const handleBackButtonClick = React.useCallback(() => {
      onPageChange(null, page - 1)
    }, [onPageChange, page])

    const handleNextButtonClick = React.useCallback(() => {
      onPageChange(null, page + 1)
    }, [onPageChange, page])

    const handleLastPageButtonClick = React.useCallback(() => {
      onPageChange(null, Math.max(0, Math.ceil(count / rowsPerPage) - 1))
    }, [onPageChange, count, rowsPerPage])

    return (
      <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
        <IconButton
          onClick={handleFirstPageButtonClick}
          disabled={page === 0}
          aria-label="პირველ გვერდზე გადასვლა"
          size="small"
        >
          <FirstPageIcon />
        </IconButton>
        <IconButton
          onClick={handleBackButtonClick}
          disabled={page === 0}
          aria-label="წინა გვერდზე გადასვლა"
          size="small"
        >
          <KeyboardArrowLeft />
        </IconButton>
        <IconButton
          onClick={handleNextButtonClick}
          disabled={page >= Math.ceil(count / rowsPerPage) - 1}
          aria-label="შემდეგ გვერდზე გადასვლა"
          size="small"
        >
          <KeyboardArrowRight />
        </IconButton>
        <IconButton
          onClick={handleLastPageButtonClick}
          disabled={page >= Math.ceil(count / rowsPerPage) - 1}
          aria-label="ბოლო გვერდზე გადასვლა"
          size="small"
        >
          <LastPageIcon />
        </IconButton>
      </Box>
    )
  })

  return (
    <Paper elevation={2} sx={{ borderRadius: 2, overflow: "hidden" }}>
      {(enableSearch || filterOptions.length > 0) && (
        <Box
          sx={{
            p: 2,
            borderBottom: "1px solid rgba(0, 0, 0, 0.08)",
            display: "flex",
            gap: 2,
          }}
        >
          {enableSearch && searchableFields.length > 0 && (
            <Box sx={{ display: "flex", gap: 2, flex: 1 }}>
              <FormControl size="small" sx={{ minWidth: 200 }}>
                <InputLabel>ძიების ველი</InputLabel>
                <Select
                  value={selectedSearchField}
                  onChange={e => setSelectedSearchField(e.target.value)}
                  label="ძიების ველი"
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
                      <SearchIcon />
                    </InputAdornment>
                  ),
                }}
                sx={{ flex: 1 }}
              />
            </Box>
          )}
          {filterOptions.length > 0 && (
            <Box sx={{ display: "flex", gap: 1, minWidth: 300 }}>
              <FormControl size="small" sx={{ minWidth: 140 }}>
                <InputLabel>ფილტრაცია</InputLabel>
                <Select
                  name="field"
                  value={filterField}
                  onChange={handleFilterChange}
                  label="ფილტრაცია"
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
                <FormControl size="small" sx={{ minWidth: 140 }}>
                  <InputLabel>მნიშვნელობა</InputLabel>
                  <Select
                    name="value"
                    value={filterValue}
                    onChange={handleFilterChange}
                    label="მნიშვნელობა"
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
          sx={{ minWidth: 650 }}
        >
          <TableHead>
            {tableInstance.headerGroups.map(headerGroup => (
              <TableRow
                {...headerGroup.getHeaderGroupProps()}
                key={headerGroup.id}
                sx={{ backgroundColor: "rgba(0, 0, 0, 0.02)" }}
              >
                {renderRowDetails && (
                  <TableCell sx={{ width: 48, padding: "0 4px" }} />
                )}
                {headerGroup.headers.map((column, index) => (
                  <TableCell
                    {...column.getHeaderProps(column.getSortByToggleProps())}
                    sx={{
                      fontWeight: 600,
                      cursor: column.canSort ? "pointer" : "default",
                      "&:hover": column.canSort
                        ? {
                            backgroundColor: "rgba(0, 0, 0, 0.04)",
                          }
                        : {},
                      transition: "background-color 0.2s",
                    }}
                    key={index}
                  >
                    <Box
                      sx={{ display: "flex", alignItems: "center", gap: 0.5 }}
                    >
                      {column.render("Header")}
                      {column.canSort && (
                        <Box
                          sx={{ color: "text.secondary", fontSize: "1.1rem" }}
                        >
                          {column.isSorted
                            ? column.isSortedDesc
                              ? "↓"
                              : "↑"
                            : "↕"}
                        </Box>
                      )}
                    </Box>
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </TableHead>
          <TableBody {...tableInstance.getTableBodyProps()}>
            {tableInstance.page.map(row => {
              tableInstance.prepareRow(row)
              const isOpen = openRows[row.original.id] || false

              return (
                <React.Fragment key={row.original.id}>
                  <TableRow
                    {...row.getRowProps()}
                    hover
                    onClick={event => {
                      if (event.target.closest(".collapse-button")) return
                      onRowClick && onRowClick(row.original)
                    }}
                    sx={{
                      cursor: onRowClick ? "pointer" : "default",
                      "&:hover": {
                        backgroundColor: "rgba(0, 0, 0, 0.04) !important",
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
                        sx={{ py: 1.5 }}
                      >
                        {cell.render("Cell")}
                      </TableCell>
                    ))}
                  </TableRow>
                  {renderRowDetails && (
                    <TableRow>
                      <TableCell
                        sx={{
                          py: 0,
                          borderBottom: isOpen
                            ? "1px solid rgba(224, 224, 224, 1)"
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
          borderTop: "1px solid rgba(224, 224, 224, 1)",
        }}
      >
        <TablePagination
          component="div"
          count={tableInstance.rows.length}
          page={pageIndex}
          onPageChange={handlePageChange}
          rowsPerPage={pageSize}
          onRowsPerPageChange={handleChangeRowsPerPage}
          rowsPerPageOptions={pageSizeOptions}
          labelRowsPerPage="სტრიქონები გვერდზე:"
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
            },
            ".MuiTablePagination-displayedRows": {
              margin: 0,
              display: "flex",
              alignItems: "center",
            },
            ".MuiTablePagination-select": {
              paddingTop: 0,
              paddingBottom: 0,
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
  actions: PropTypes.array,
  renderRowDetails: PropTypes.func,
  filterOptions: PropTypes.arrayOf(
    PropTypes.shape({
      field: PropTypes.string.isRequired,
      label: PropTypes.string.isRequired,
      valueLabels: PropTypes.object,
    })
  ),
}

export default MuiTable
