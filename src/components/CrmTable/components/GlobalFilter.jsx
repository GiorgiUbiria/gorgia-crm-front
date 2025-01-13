import React from "react"
import PropTypes from "prop-types"
import { Search } from "react-feather"

const GlobalFilter = ({
  globalFilter,
  setGlobalFilter,
  searchableFields = [],
  selectedSearchField,
  setSelectedSearchField,
  placeholder = "ძიება...",
}) => {
  const baseInputClasses = `transition-colors duration-200
    border-gray-200 dark:!border-gray-700 !bg-white dark:!bg-gray-800 
    text-gray-900 dark:!text-gray-100 placeholder-gray-400 dark:!placeholder-gray-500 
    focus:ring-2 focus:ring-primary-500 dark:!focus:ring-primary-400 
    focus:border-gray-300 dark:!focus:border-gray-600 focus:outline-none`

  return (
    <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
      {searchableFields.length > 0 && (
        <select
          value={selectedSearchField}
          onChange={e => setSelectedSearchField(e.target.value)}
          className={`min-w-[180px] px-4 py-2.5 text-sm rounded-lg border ${baseInputClasses}`}
        >
          <option value="" className="!bg-white dark:!bg-gray-800 dark:!text-gray-100">
            ყველა ველი
          </option>
          {searchableFields.map(field => (
            <option 
              key={field.value} 
              value={field.value}
              className="!bg-white dark:!bg-gray-800 dark:!text-gray-100"
            >
              {field.label}
            </option>
          ))}
        </select>
      )}
      <div className="relative flex-1 w-full sm:max-w-md">
        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
          <Search
            className="text-gray-500 dark:!text-gray-400"
            size={18}
          />
        </div>
        <input
          type="text"
          value={globalFilter ?? ""}
          onChange={e => setGlobalFilter(e.target.value)}
          placeholder={placeholder}
          className={`w-full pl-11 pr-4 py-2.5 text-sm rounded-lg border ${baseInputClasses}`}
        />
      </div>
    </div>
  )
}

GlobalFilter.propTypes = {
  globalFilter: PropTypes.string,
  setGlobalFilter: PropTypes.func.isRequired,
  searchableFields: PropTypes.arrayOf(
    PropTypes.shape({
      value: PropTypes.string.isRequired,
      label: PropTypes.string.isRequired,
    })
  ),
  selectedSearchField: PropTypes.string,
  setSelectedSearchField: PropTypes.func,
  placeholder: PropTypes.string,
}

export default React.memo(GlobalFilter)
