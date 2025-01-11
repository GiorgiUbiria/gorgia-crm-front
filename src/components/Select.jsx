import React from "react"
import Select from "react-select"
import { FormFeedback } from "reactstrap"

const customStyles = {
  menu: provided => ({
    ...provided,
    backgroundColor: "white",
    border: "1px solid #edf2f7",
    borderRadius: "0.5rem",
    boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)",
    marginTop: "0.5rem",
    padding: "0.5rem",
    overflow: "hidden",
  }),
  menuList: provided => ({
    ...provided,
    padding: "0",
  }),
  option: (provided, state) => ({
    ...provided,
    backgroundColor: state.isSelected
      ? "#007bff"
      : state.isFocused
      ? "#f8f9fa"
      : "white",
    color: state.isSelected ? "white" : "#333",
    cursor: "pointer",
    padding: "0.75rem 1rem",
    fontSize: "0.875rem",
    transition: "all 0.15s ease",
    "&:active": {
      backgroundColor: "#007bff",
      color: "white",
    },
    "&:hover": {
      backgroundColor: state.isSelected ? "#007bff" : "#f8f9fa",
      color: state.isSelected ? "white" : "#333",
    },
  }),
  control: (provided, state) => ({
    ...provided,
    backgroundColor: "white",
    borderColor: state.isFocused ? "#007bff" : "#e2e8f0",
    borderRadius: "0.5rem",
    minHeight: "2.75rem",
    boxShadow: state.isFocused 
      ? "0 0 0 3px rgba(0, 123, 255, 0.15)" 
      : "0 1px 2px rgba(0, 0, 0, 0.05)",
    transition: "all 0.15s ease",
    "&:hover": {
      borderColor: state.isFocused ? "#007bff" : "#cbd5e0",
      boxShadow: "0 2px 4px rgba(0, 0, 0, 0.05)",
    },
  }),
  multiValue: provided => ({
    ...provided,
    backgroundColor: "#e9ecef",
    borderRadius: "0.375rem",
    margin: "0.25rem",
    padding: "0.125rem",
  }),
  multiValueLabel: provided => ({
    ...provided,
    color: "#333",
    fontSize: "0.875rem",
    padding: "0.125rem 0.375rem",
  }),
  multiValueRemove: provided => ({
    ...provided,
    color: "#666",
    cursor: "pointer",
    borderRadius: "0 0.375rem 0.375rem 0",
    transition: "all 0.15s ease",
    "&:hover": {
      backgroundColor: "#dc3545",
      color: "white",
    },
  }),
  placeholder: provided => ({
    ...provided,
    color: "#a0aec0",
    fontSize: "0.875rem",
  }),
  input: provided => ({
    ...provided,
    color: "#333",
    fontSize: "0.875rem",
  }),
  singleValue: provided => ({
    ...provided,
    color: "#333",
    fontSize: "0.875rem",
  }),
  dropdownIndicator: provided => ({
    ...provided,
    color: "#a0aec0",
    padding: "0.5rem",
    transition: "all 0.15s ease",
    "&:hover": {
      color: "#007bff",
    },
  }),
  clearIndicator: provided => ({
    ...provided,
    color: "#a0aec0",
    padding: "0.5rem",
    transition: "all 0.15s ease",
    "&:hover": {
      color: "#dc3545",
    },
  }),
  valueContainer: provided => ({
    ...provided,
    padding: "0.375rem 0.75rem",
  }),
  menuPortal: provided => ({
    ...provided,
    zIndex: 9999,
  }),
  indicatorSeparator: provided => ({
    ...provided,
    backgroundColor: "#e2e8f0",
  }),
}

const baseSelectProps = {
  styles: customStyles,
  classNamePrefix: "select",
}

export const RegularSelect = ({
  name,
  options,
  value,
  onChange,
  onBlur,
  isMulti = false,
  isLoading = false,
  placeholder,
  error,
  touched,
  className,
  ...props
}) => {
  return (
    <div className="w-full">
      <Select
        {...baseSelectProps}
        isSearchable={false}
        name={name}
        options={options}
        value={value}
        onChange={onChange}
        onBlur={onBlur}
        isMulti={isMulti}
        isLoading={isLoading}
        placeholder={placeholder}
        className={`${className} react-select`}
        {...props}
      />
      {touched && error && (
        <FormFeedback className="d-block mt-1">{error}</FormFeedback>
      )}
    </div>
  )
}

export const SearchableSelect = ({
  name,
  options,
  value,
  onChange,
  onBlur,
  isMulti = false,
  isLoading = false,
  placeholder,
  error,
  touched,
  className,
  ...props
}) => {
  return (
    <div className="w-full">
      <Select
        {...baseSelectProps}
        isSearchable={true}
        name={name}
        options={options}
        value={value}
        onChange={onChange}
        onBlur={onBlur}
        isMulti={isMulti}
        isLoading={isLoading}
        placeholder={placeholder}
        className={`${className} react-select`}
        noOptionsMessage={() => "მონაცემები არ მოიძებნა"}
        loadingMessage={() => "იტვირთება..."}
        {...props}
      />
      {touched && error && (
        <FormFeedback className="d-block mt-1">{error}</FormFeedback>
      )}
    </div>
  )
}

// For backward compatibility
const CustomSelect = SearchableSelect
export default CustomSelect
