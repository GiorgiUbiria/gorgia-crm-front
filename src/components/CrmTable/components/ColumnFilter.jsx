import React, { useState, useEffect } from "react"
import PropTypes from "prop-types"

const ColumnFilter = ({ column }) => {
  // Local state to track input value
  const [value, setValue] = useState("")

  // Sync local state with column filter value
  useEffect(() => {
    if (column) {
      setValue(column.getFilterValue() ?? "")
    }
  }, [column?.getFilterValue()])

  if (!column) return null

  const baseInputClasses = `w-full px-3 py-2 text-sm rounded-lg border transition-colors duration-200
    border-gray-200 dark:!border-gray-700 !bg-white dark:!bg-gray-800 
    text-gray-900 dark:!text-gray-100 placeholder-gray-400 dark:!placeholder-gray-500 
    focus:ring-2 focus:ring-primary-500 dark:!focus:ring-primary-400 
    focus:border-gray-300 dark:!focus:border-gray-600 focus:outline-none
    shadow-sm hover:border-gray-300 dark:hover:border-gray-600`

  const handleFilterChange = newValue => {
    console.log("Filter value changing:", {
      columnId: column.id,
      oldValue: value,
      newValue: newValue,
      type: column.columnDef.filterOptions ? "select" : "text",
    })

    setValue(newValue)

    // For select, undefined means "all"
    if (column.columnDef.filterOptions && newValue === "") {
      column.setFilterValue(undefined)
    } else {
      column.setFilterValue(newValue || undefined)
    }
  }

  // If filterOptions are provided, render select
  if (column.columnDef.filterOptions?.length > 0) {
    return (
      <select
        value={value}
        onChange={e => handleFilterChange(e.target.value)}
        className={baseInputClasses}
      >
        <option
          value=""
          className="!bg-white dark:!bg-gray-800 dark:!text-gray-100"
        >
          ყველა
        </option>
        {column.columnDef.filterOptions.map(option => (
          <option
            key={option.value}
            value={option.value}
            className="!bg-white dark:!bg-gray-800 dark:!text-gray-100"
          >
            {option.label}
          </option>
        ))}
      </select>
    )
  }

  // Otherwise render text input
  return (
    <input
      type="text"
      value={value}
      onChange={e => handleFilterChange(e.target.value)}
      placeholder={column.columnDef.filterPlaceholder || "ფილტრი..."}
      className={baseInputClasses}
    />
  )
}

ColumnFilter.propTypes = {
  column: PropTypes.object,
}

export default React.memo(ColumnFilter)
