import React from "react"

const CrmSpinner = ({ size = "md" }) => {
  const sizeClasses = {
    sm: "w-4 h-4",
    md: "w-8 h-8",
    lg: "w-12 h-12",
  }

  return (
    <div className="flex items-center justify-center">
      <div
        className={`
          ${sizeClasses[size]}
          rounded-full
          bg-gradient-to-tr from-blue-500 to-purple-500
          animate-spin
          relative
          shadow-lg
          before:content-['']
          before:absolute
          before:inset-0
          before:rounded-full
          before:bg-gradient-to-br
          before:from-transparent
          before:to-black/30
          after:content-['']
          after:absolute
          after:inset-[3px]
          after:rounded-full
          after:bg-white
        `}
      />
    </div>
  )
}

export default CrmSpinner
