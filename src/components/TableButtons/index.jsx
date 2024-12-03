import React from "react"
import Button from "@mui/material/Button"
import PropTypes from "prop-types"

const buttonVariants = {
  edit: {
    color: "primary",
    variant: "contained",
    icon: "bx bx-edit",
    label: "რედაქტირება",
  },
  delete: {
    color: "error",
    variant: "outlined",
    icon: "bx bx-trash",
    label: "წაშლა",
  },
  approve: {
    color: "success",
    variant: "contained",
    icon: "bx bx-check",
    label: "დადასტურება",
  },
  reject: {
    color: "error",
    variant: "contained",
    icon: "bx bx-x",
    label: "უარყოფა",
  },
  add: {
    color: "primary",
    variant: "contained",
    icon: "bx bx-plus",
    label: "დამატება",
  },
  export: {
    color: "primary",
    variant: "outlined",
    icon: "bx bx-download",
    label: "ექსპორტი",
  },
}

export function TableButton({ type, onClick, label, className = "", size = "small", fullWidth = false }) {
  const variant = buttonVariants[type] || buttonVariants.edit

  return (
    <Button
      onClick={onClick}
      color={variant.color}
      variant={variant.variant}
      size={size}
      className={className}
      startIcon={<i className={variant.icon} />}
      style={fullWidth ? { width: "100%" } : {}}
    >
      {label || variant.label}
    </Button>
  )
}

export function TableActionButtons({ actions, className = "" }) {
  return (
    <div className={`d-flex gap-2 ${className}`}>
      {actions.map((action, index) => (
        <TableButton key={index} {...action} />
      ))}
    </div>
  )
}

TableButton.propTypes = {
  type: PropTypes.oneOf(Object.keys(buttonVariants)).isRequired,
  onClick: PropTypes.func.isRequired,
  label: PropTypes.string,
  className: PropTypes.string,
  size: PropTypes.string,
  fullWidth: PropTypes.bool,
}

TableActionButtons.propTypes = {
  actions: PropTypes.arrayOf(
    PropTypes.shape({
      type: PropTypes.oneOf(Object.keys(buttonVariants)).isRequired,
      onClick: PropTypes.func.isRequired,
      label: PropTypes.string,
      className: PropTypes.string,
      size: PropTypes.string,
      fullWidth: PropTypes.bool,
    })
  ).isRequired,
  className: PropTypes.string,
}

export default TableActionButtons 