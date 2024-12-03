import React from "react"
import PropTypes from "prop-types"

const statusVariants = {
  pending: {
    label: "განხილვაში",
    icon: "bx bx-time",
    backgroundColor: "#fff3e0",
    color: "#e65100",
  },
  approved: {
    label: "დამტკიცებული",
    icon: "bx bx-check-circle",
    backgroundColor: "#e8f5e9",
    color: "#2e7d32",
  },
  rejected: {
    label: "უარყოფილი",
    icon: "bx bx-x-circle",
    backgroundColor: "#ffebee",
    color: "#c62828",
  },
  accepted: {
    label: "აქტიური",
    icon: "bx bx-check-circle",
    backgroundColor: "#e8f5e9",
    color: "#2e7d32",
  },
}

export function TableStatus({
  status,
  customLabel,
  customIcon,
  customStyle = {},
}) {
  const variant = statusVariants[status] || {
    label: customLabel || status,
    icon: customIcon || "bx bx-question-mark",
    backgroundColor: "#f5f5f5",
    color: "#757575",
  }

  return (
    <span
      style={{
        padding: "6px 12px",
        borderRadius: "4px",
        display: "inline-flex",
        alignItems: "center",
        fontSize: "0.875rem",
        fontWeight: 500,
        backgroundColor: variant.backgroundColor,
        color: variant.color,
        ...customStyle,
      }}
    >
      <i className={`${variant.icon} me-2`} />
      {variant.label}
    </span>
  )
}

TableStatus.propTypes = {
  status: PropTypes.string.isRequired,
  customLabel: PropTypes.string,
  customIcon: PropTypes.string,
  customStyle: PropTypes.object,
}

export default TableStatus
