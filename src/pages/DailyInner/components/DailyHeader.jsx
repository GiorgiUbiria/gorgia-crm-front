import React, { memo } from "react"
import { Avatar } from "@mui/material"
import { formatDate, formatTime } from "utils/dateUtils"

export const DailyHeader = memo(({ daily }) => {
  return (
    <div className="border-b border-gray-200 dark:!border-gray-700 pb-3 sm:pb-4 mb-4 sm:mb-6">
      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3 sm:gap-4">
        <div className="flex items-center space-x-3 sm:space-x-4">
          <Avatar
            src={daily.user?.profile_image}
            alt={daily.user?.name}
            className="w-10 h-10 sm:w-12 sm:h-12"
          >
            {daily.user?.name?.[0]}
          </Avatar>

          <div>
            <div className="flex flex-col sm:flex-row flex-wrap gap-2 sm:gap-3 text-xs sm:text-sm text-gray-600 dark:!text-gray-400">
              <div className="flex items-center">
                <i className="bx bx-user mr-1" />
                <span>
                  {daily.user?.name} {daily.user?.sur_name}
                </span>
              </div>
              <div className="flex items-center">
                <i className="bx bx-building mr-1" />
                <span>{daily.department?.name}</span>
              </div>
              <div className="flex items-center">
                <i className="bx bx-calendar mr-1" />
                <span>{formatDate(daily.date)}</span>
              </div>
            </div>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2 sm:gap-3">
          <span
            className={`
              px-2 sm:px-3 py-1 rounded-full text-xs sm:text-sm
              ${
                daily.type === "department_head"
                  ? "bg-blue-100 text-blue-800 dark:!bg-blue-900/30 dark:!text-blue-300"
                  : "bg-green-100 text-green-800 dark:!bg-green-900/30 dark:!text-green-300"
              }
            `}
          >
            {daily.type === "department_head"
              ? "დეპარტამენტის ხელმძღვანელი"
              : "რეგულარული"}
          </span>
          <span className="text-xs sm:text-sm text-gray-500 dark:!text-gray-400">
            {formatTime(daily.created_at)}
          </span>
        </div>
      </div>
    </div>
  )
})

DailyHeader.displayName = "DailyHeader"
