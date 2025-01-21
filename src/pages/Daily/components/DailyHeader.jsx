import React, { memo } from "react"
import { Avatar } from "@mui/material"
import { formatDate, formatTime } from "utils/dateUtils"

export const DailyHeader = memo(({ daily }) => {
  return (
    <div className="border-b border-gray-200 dark:!border-gray-700 pb-4 mb-6">
      <div className="flex items-start justify-between">
        <div className="flex items-center space-x-4 justify-center">
          <Avatar
            src={daily.user?.profile_image}
            alt={daily.user?.name}
            className="w-12 h-12"
          >
            {daily.user?.name?.[0]}
          </Avatar>

          <div>
            <div className="flex items-center space-x-3 text-sm text-gray-600 dark:!text-gray-400">
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

        <div className="flex items-center space-x-2">
          <span
            className={`
            px-3 py-1 rounded-full text-sm
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
          <span className="text-sm text-gray-500 dark:!text-gray-400">
            {formatTime(daily.created_at)}
          </span>
        </div>
      </div>
    </div>
  )
})

DailyHeader.displayName = "DailyHeader"
