import React from "react"
import {
  Table,
  Button,
  Pagination,
  PaginationItem,
  PaginationLink,
} from "reactstrap"
import PropTypes from "prop-types"
import "./ModernTable.scss"

const ModernTable = ({
  columns,
  data,
  expandedRows,
  onToggleRow,
  expandedContent,
  currentPage,
  itemsPerPage,
  totalItems,
  onPageChange,
  isLoading,
  emptyMessage = "No data available",
}) => {
  const totalPages = Math.ceil(totalItems / itemsPerPage)
  const indexOfFirstItem = (currentPage - 1) * itemsPerPage

  const renderPagination = () => {
    if (totalPages <= 1) return null

    return (
      <div className="table-footer">
        <div className="items-per-page">
          <span className="items-info">
            Showing {indexOfFirstItem + 1} to{" "}
            {Math.min(indexOfFirstItem + itemsPerPage, totalItems)} of{" "}
            {totalItems} entries
          </span>
        </div>

        <Pagination className="modern-pagination">
          <PaginationItem disabled={currentPage === 1}>
            <PaginationLink
              previous
              onClick={() => onPageChange(currentPage - 1)}
            >
              <i className="bx bx-chevron-left"></i>
            </PaginationLink>
          </PaginationItem>

          {totalPages <= 5 ? (
            [...Array(totalPages)].map((_, index) => (
              <PaginationItem
                key={index + 1}
                active={currentPage === index + 1}
              >
                <PaginationLink onClick={() => onPageChange(index + 1)}>
                  {index + 1}
                </PaginationLink>
              </PaginationItem>
            ))
          ) : (
            <>
              {[...Array(totalPages)].map((_, index) => {
                const pageNumber = index + 1
                if (
                  pageNumber === 1 ||
                  pageNumber === totalPages ||
                  (pageNumber >= currentPage - 1 &&
                    pageNumber <= currentPage + 1)
                ) {
                  return (
                    <PaginationItem
                      key={pageNumber}
                      active={currentPage === pageNumber}
                    >
                      <PaginationLink onClick={() => onPageChange(pageNumber)}>
                        {pageNumber}
                      </PaginationLink>
                    </PaginationItem>
                  )
                } else if (
                  pageNumber === currentPage - 2 ||
                  pageNumber === currentPage + 2
                ) {
                  return (
                    <PaginationItem key={pageNumber}>
                      <PaginationLink disabled>...</PaginationLink>
                    </PaginationItem>
                  )
                }
                return null
              })}
            </>
          )}

          <PaginationItem disabled={currentPage === totalPages}>
            <PaginationLink next onClick={() => onPageChange(currentPage + 1)}>
              <i className="bx bx-chevron-right"></i>
            </PaginationLink>
          </PaginationItem>
        </Pagination>
      </div>
    )
  }

  return (
    <div className="modern-table-wrapper">
      <div className="table-container">
        <Table hover className="table-modern mb-0">
          <thead>
            <tr>
              {columns.map((column, index) => (
                <th
                  key={index}
                  className={column.className}
                  style={column.style}
                  onClick={column.sortable ? column.onSort : undefined}
                >
                  {column.header}
                  {column.sortable && column.sortDirection && (
                    <span className="sort-icon">
                      {column.sortDirection === "asc" ? "▲" : "▼"}
                    </span>
                  )}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {data.length > 0 ? (
              data.map((item, rowIndex) => (
                <React.Fragment key={item.id || rowIndex}>
                  <tr
                    onClick={() =>
                      onToggleRow && onToggleRow(indexOfFirstItem + rowIndex)
                    }
                    className={`table-row ${item.rowClassName || ""} ${
                      expandedRows?.includes(indexOfFirstItem + rowIndex)
                        ? "expanded"
                        : ""
                    }`}
                  >
                    {columns.map((column, colIndex) => (
                      <td
                        key={colIndex}
                        className={column.cellClassName}
                        style={column.cellStyle}
                      >
                        {column.render
                          ? column.render(item, rowIndex)
                          : item[column.field]}
                      </td>
                    ))}
                  </tr>
                  {expandedRows?.includes(indexOfFirstItem + rowIndex) &&
                    expandedContent && (
                      <tr className="expanded-row">
                        <td colSpan={columns.length}>
                          {expandedContent(item, rowIndex)}
                        </td>
                      </tr>
                    )}
                </React.Fragment>
              ))
            ) : (
              <tr>
                <td colSpan={columns.length} className="text-center">
                  {isLoading ? (
                    <div className="loading-spinner">Loading...</div>
                  ) : (
                    emptyMessage
                  )}
                </td>
              </tr>
            )}
          </tbody>
        </Table>
      </div>
      {renderPagination()}
    </div>
  )
}

ModernTable.propTypes = {
  columns: PropTypes.arrayOf(
    PropTypes.shape({
      header: PropTypes.node.isRequired,
      field: PropTypes.string,
      render: PropTypes.func,
      className: PropTypes.string,
      style: PropTypes.object,
      cellClassName: PropTypes.string,
      cellStyle: PropTypes.object,
      sortable: PropTypes.bool,
      sortDirection: PropTypes.oneOf(["asc", "desc"]),
      onSort: PropTypes.func,
    })
  ).isRequired,
  data: PropTypes.array.isRequired,
  expandedRows: PropTypes.array,
  onToggleRow: PropTypes.func,
  expandedContent: PropTypes.func,
  currentPage: PropTypes.number.isRequired,
  itemsPerPage: PropTypes.number.isRequired,
  totalItems: PropTypes.number.isRequired,
  onPageChange: PropTypes.func.isRequired,
  isLoading: PropTypes.bool,
  emptyMessage: PropTypes.string,
}

export default ModernTable
