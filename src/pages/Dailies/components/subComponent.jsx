import React from "react"

const DailySubComponent = ({ row }) => {
  return (
    <div className="p-3 sm:p-4 bg-gray-50 dark:!bg-gray-700/50">
      <div className="text-xs sm:text-sm text-black dark:!text-gray-100 space-y-2 sm:space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-3">
          <strong>სახელი/გვარი:</strong>
          <span>
            {row.original.user.name} {row.original.user.sur_name}
          </span>
        </div>
        <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-3">
          <strong>თარიღი:</strong>
          <span>{row.original.date}</span>
        </div>
        <div className="flex flex-col gap-1 sm:gap-2">
          <strong>აღწერა:</strong>
          <p className="whitespace-pre-wrap">{row.original.description}</p>
        </div>
      </div>
    </div>
  )
}

DailySubComponent.displayName = "DailySubComponent"

export const renderSubComponent = ({ row }) => <DailySubComponent row={row} />
