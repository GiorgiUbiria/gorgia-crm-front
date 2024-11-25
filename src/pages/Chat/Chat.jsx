import ModernTable from "components/ModernTable"
import React from "react"

export default function Chat() {
  const columns = [
    { key: "id", label: "ID" },
    { key: "name", label: "Name" },
  ]

  const data = [
    { id: 1, name: "John Doe" },
    { id: 2, name: "Jane Doe" },
  ]

  // columns,
  // data,
  // expandedRows,
  // onToggleRow,
  // expandedContent,
  // currentPage,
  // itemsPerPage,
  // totalItems,
  // onPageChange,
  // isLoading,
  // emptyMessage = "No data available",

  const expandedRows = []
  const onToggleRow = () => {}
  const expandedContent = () => {}
  const currentPage = 1
  const itemsPerPage = 10
  const totalItems = 20
  const onPageChange = () => {}
  const isLoading = false
  const emptyMessage = "No data available"

  return (
    <div className="page-content">
      <ModernTable
        columns={columns}
        data={data}
        expandedRows={expandedRows}
        onToggleRow={onToggleRow}
        expandedContent={expandedContent}
        currentPage={currentPage}
        itemsPerPage={itemsPerPage}
        totalItems={totalItems}
        onPageChange={onPageChange}
        isLoading={isLoading}
        emptyMessage={emptyMessage}
      />
    </div>
  )
}
