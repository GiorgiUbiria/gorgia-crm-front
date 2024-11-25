import React, { memo } from "react"
import { Link } from "react-router-dom"
import { BsChevronDown, BsChevronUp } from "react-icons/bs"

const styles = {
  link: {
    display: "flex",
    alignItems: "center",
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
      {hasSubmenu && isExpanded && <ul className="sub-menu">{children}</ul>}
    </li>
  )
)

MenuItem.displayName = "MenuItem"

export default MenuItem
