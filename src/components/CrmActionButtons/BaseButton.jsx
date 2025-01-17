import React from "react"
import { twMerge } from "tailwind-merge"

const sizeClasses = {
  xs: "px-1.5 py-0.5 text-xs",
  sm: "px-2 py-1 text-sm",
  md: "px-3 py-1.5 text-sm",
  lg: "px-4 py-2 text-base",
}

const variantClasses = {
  primary: "bg-blue-600 hover:bg-blue-700 text-white",
  secondary: "bg-gray-600 hover:bg-gray-700 text-white",
  success: "bg-green-600 hover:bg-green-700 text-white",
  danger: "bg-red-600 hover:bg-red-700 text-white",
  warning: "bg-yellow-600 hover:bg-yellow-700 text-white",
  info: "bg-cyan-600 hover:bg-cyan-700 text-white",
  ghost:
    "bg-transparent hover:bg-gray-100 text-gray-700 dark:text-gray-200 dark:hover:bg-gray-700",
  destructive: "bg-destructive hover:bg-destructive/90 text-white",
}

export const BaseButton = ({
  children,
  className,
  size = "md",
  variant = "primary",
  icon: Icon,
  iconPosition = "left",
  disabled = false,
  ...props
}) => {
  const baseClasses =
    "inline-flex items-center justify-center gap-2 font-medium rounded-lg transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-offset-2 dark:focus:ring-offset-gray-800"

  return (
    <button
      className={twMerge(
        baseClasses,
        sizeClasses[size],
        variantClasses[variant],
        className
      )}
      disabled={disabled}
      {...props}
    >
      {Icon && iconPosition === "left" && <Icon className="w-4 h-4" />}
      {children}
      {Icon && iconPosition === "right" && <Icon className="w-4 h-4" />}
    </button>
  )
}
