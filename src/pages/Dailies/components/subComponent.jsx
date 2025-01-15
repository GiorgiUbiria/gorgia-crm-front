import React from "react"

const DailySubComponent = ({ row }) => {
  return (
    <div className="p-4 bg-gray-50 dark:!bg-gray-700/50">
      <div className="text-sm text-black dark:!text-gray-100">
        <div className="mb-2">
          <strong>სახელი/გვარი:</strong> {row.original.user.name}{" "}
          {row.original.user.sur_name}
        </div>
        <div className="mb-2">
          <strong>თარიღი:</strong> {row.original.date}
        </div>
        <div>
          <strong>აღწერა:</strong>
          <p className="mt-1 whitespace-pre-wrap">{row.original.description}</p>
        </div>
      </div>
    </div>
  )
}

DailySubComponent.displayName = "DailySubComponent"

export const renderSubComponent = ({ row }) => <DailySubComponent row={row} />
