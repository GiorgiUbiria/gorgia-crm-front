import React from "react"

const SubComponent = ({ row }) => {
  return (
    <div className="p-4 bg-white rounded-lg shadow-sm">
      <div className="flex flex-col space-y-4">
        <h5 className="text-lg font-medium text-primary">საკითხის დეტალები</h5>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <span className="font-medium text-gray-600">საკითხი:</span>
            <p className="mt-1 text-gray-900">{row.original.description}</p>
          </div>
          <div>
            <span className="font-medium text-gray-600">თარიღი:</span>
            <p className="mt-1 text-gray-900">
              {new Date(row.original.date).toLocaleDateString()}
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

SubComponent.displayName = "SubComponent"

export const renderSubComponent = ({ row }) => <SubComponent row={row} /> 