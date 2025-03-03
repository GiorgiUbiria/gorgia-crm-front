import React from "react"

const CrmSpinner = ({
  size = "md",
  color = "blue",
  speed = "normal",
  shadow = true,
  thickness = "normal",
}) => {
  const sizeClasses = {
    sm: "w-4 h-4",
    md: "w-8 h-8",
    lg: "w-12 h-12",
    xl: "w-16 h-16",
  }

  const colorClasses = {
    blue: "from-blue-500 to-purple-500",
    green: "from-green-500 to-teal-500",
    red: "from-red-500 to-pink-500",
    yellow: "from-yellow-400 to-orange-500",
    gray: "from-gray-500 to-gray-700",
  }

  const speedClasses = {
    slow: "animate-[spin_2s_linear_infinite]",
    normal: "animate-spin",
    fast: "animate-[spin_0.5s_linear_infinite]",
  }

  const thicknessClasses = {
    thin: "after:inset-[4px]",
    normal: "after:inset-[3px]",
    thick: "after:inset-[2px]",
  }

  return (
    <div className="flex items-center justify-center">
      <div
        className={`
          ${sizeClasses[size]}
          rounded-full
          bg-gradient-to-tr ${colorClasses[color]}
          ${speedClasses[speed]}
          relative
          ${shadow && "shadow-lg"}
          before:content-['']
          before:absolute
          before:inset-0
          before:rounded-full
          before:bg-gradient-to-br
          before:from-transparent
          before:to-black/30
          after:content-['']
          after:absolute
          ${thicknessClasses[thickness]}
          after:rounded-full
          after:bg-white
          transition-all duration-300
        `}
      />
    </div>
  )
}

export default CrmSpinner
