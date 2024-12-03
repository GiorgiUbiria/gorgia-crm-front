import React, { memo } from "react"
import { Link } from "react-router-dom"
import { BsChevronDown, BsChevronUp } from "react-icons/bs"

const styles = {
  link: {
    display: "flex",
    alignItems: "center",
    gap: "0.15rem",
  },
  icon: {
    fontSize: "1.25rem",
    marginRight: "0.5rem",
    verticalAlign: "middle",
  },
  arrow: {
    fontSize: "0.8rem",
    marginLeft: "auto",
  },
  submenu: {
    overflow: "hidden",
    transition: "all 0.4s cubic-bezier(0.4, 0, 0.2, 1)",
    maxHeight: 0,
    opacity: 0,
    transform: "translateY(-10px)",
    "& > li:not(:last-child)": {
      borderBottom: "1px solid rgba(255, 255, 255, 0.1)",
      paddingBottom: "0.5rem",
      marginBottom: "0.5rem",
    },
  },
  submenuExpanded: {
    maxHeight: "500px",
    opacity: 1,
    transform: "translateY(0)",
  },
}

const MenuItem = memo(
  ({ to, icon: Icon, label, hasSubmenu, isExpanded, onClick, children }) => (
    <li>
      <Link
        to={hasSubmenu ? "/#" : to}
        style={styles.link}
        onClick={
          hasSubmenu
            ? e => {
                e.preventDefault()
                onClick()
              }
            : undefined
        }
      >
        {Icon && <Icon style={styles.icon} />}
        <span>{label}</span>
        {hasSubmenu &&
          (isExpanded ? (
            <BsChevronUp style={styles.arrow} />
          ) : (
            <BsChevronDown style={styles.arrow} />
          ))}
      </Link>
      {hasSubmenu && (
        <ul
          className="sub-menu"
          style={{
            ...styles.submenu,
            ...(isExpanded ? styles.submenuExpanded : {}),
          }}
        >
          {children}
        </ul>
      )}
    </li>
  )
)

MenuItem.displayName = "MenuItem"

export default MenuItem
