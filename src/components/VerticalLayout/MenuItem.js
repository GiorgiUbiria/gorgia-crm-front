import React, { memo } from "react"
import { Link } from "react-router-dom"
import { BsChevronDown, BsChevronUp } from "react-icons/bs"
import { LuDot } from "react-icons/lu"
import PropTypes from "prop-types"

const MenuItem = memo(
  ({
    to,
    icon: Icon,
    label,
    hasSubmenu,
    isExpanded,
    onClick,
    children,
    isActive,
  }) => (
    <li className="mb-1 w-full">
      <Link
        to={hasSubmenu ? "#!" : to}
        className={`
          flex items-center gap-3 px-4 py-2.5 rounded-md transition-colors min-w-0
          ${
            isActive
              ? "bg-blue-100 text-blue-700"
              : "hover:bg-blue-50 text-gray-700"
          }
          ${hasSubmenu ? "cursor-pointer" : ""}
        `}
        onClick={
          hasSubmenu
            ? e => {
                e.preventDefault()
                onClick()
              }
            : onClick
        }
      >
        <div className="w-5 flex-shrink-0 flex items-center justify-center">
          {Icon ? <Icon className="text-lg" /> : <LuDot className="text-lg" />}
        </div>

        <span className="text-sm font-medium leading-normal flex-1 min-w-0 break-words whitespace-normal">
          {label}
        </span>

        {hasSubmenu && (
          <div className="w-3 flex-shrink-0 flex items-center justify-center">
            {isExpanded ? <BsChevronUp /> : <BsChevronDown />}
          </div>
        )}
      </Link>

      {hasSubmenu && (
        <ul
          className={`
            pl-6 mt-1 overflow-hidden transition-all duration-300
            ${
              isExpanded
                ? "max-h-[1000px] opacity-100 translate-y-0"
                : "max-h-0 opacity-0 -translate-y-2"
            }
          `}
        >
          {children}
        </ul>
      )}
    </li>
  )
)

MenuItem.propTypes = {
  to: PropTypes.string.isRequired,
  icon: PropTypes.elementType,
  label: PropTypes.string.isRequired,
  hasSubmenu: PropTypes.bool,
  isExpanded: PropTypes.bool,
  isActive: PropTypes.bool,
  onClick: PropTypes.func,
  children: PropTypes.node,
}

MenuItem.displayName = "MenuItem"

export default MenuItem
