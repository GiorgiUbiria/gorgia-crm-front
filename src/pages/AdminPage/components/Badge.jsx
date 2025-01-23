import React from "react"
import cn from "classnames"

const variantClasses = {
  warning: "bg-yellow-100 text-yellow-800 dark:!bg-yellow-900 dark:!text-yellow-300",
  success: "bg-green-100 text-green-800 dark:!bg-green-900 dark:!text-green-300",
  destructive: "bg-red-100 text-red-800 dark:!bg-red-900 dark:!text-red-300",
  default: "bg-gray-100 text-gray-800 dark:!bg-gray-900 dark:!text-gray-300",
}

export const Badge = ({ children, variant = "default", className }) => {
  const variantClass = variantClasses[variant] || variantClasses.default

  return (
    <span
      className={cn(
        "inline-flex items-center rounded-md px-2 py-1 text-xs font-medium ring-1 ring-inset",
        variantClass,
        className
      )}
    >
      {children}
    </span>
  )
} 