import React from "react"
import PropTypes from "prop-types"
import GlobalFilter from "./GlobalFilter"

const Toolbar = ({
  table,
  enableGlobalFilter,
  searchableFields,
  selectedSearchField,
  setSelectedSearchField,
  renderCustomActions,
}) => {
  const { setGlobalFilter, getState } = table
  const { globalFilter } = getState()

  return (
    <div className="p-6 border-b border-gray-200 dark:!border-gray-700 !bg-white dark:!bg-gray-900 text-gray-900 dark:!text-gray-100 transition-colors duration-200">
      <div className="flex flex-col sm:flex-row gap-6 items-start sm:items-center justify-between">
        {/* Left side - Global filter */}
        <div className="flex-1 w-full">
          {enableGlobalFilter && (
            <GlobalFilter
              globalFilter={globalFilter}
              setGlobalFilter={setGlobalFilter}
              searchableFields={searchableFields}
              selectedSearchField={selectedSearchField}
              setSelectedSearchField={setSelectedSearchField}
            />
          )}
        </div>

        {/* Right side - Custom actions */}
        {renderCustomActions && (
          <div className="flex items-center gap-3 shrink-0">
            {renderCustomActions(table)}
          </div>
        )}
      </div>
    </div>
  )
}

Toolbar.propTypes = {
  table: PropTypes.object.isRequired,
  enableGlobalFilter: PropTypes.bool,
  searchableFields: PropTypes.array,
  selectedSearchField: PropTypes.string,
  setSelectedSearchField: PropTypes.func,
  renderCustomActions: PropTypes.func,
}

export default React.memo(Toolbar)
