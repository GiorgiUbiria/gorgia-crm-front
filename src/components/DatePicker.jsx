import React, { useState, useRef } from "react"
import styles from "./datePicker.module.css"

const DatePicker = ({ startDate, handleStartedDate, initialValue = null }) => {
  const [inputValue, setInputValue] = useState("")
  const dateInputRef = useRef(null)

  const formatToDisplay = dateString => {
    const [year, month, day] = dateString.split("-")
    return `${day}/${month}/${year}`
  }

  const formatToDateInput = dateString => {
    const [day, month, year] = dateString.split("/")
    return `${year}-${month}-${day}`
  }

  const handleInputChange = e => {
    const value = e.target.value
    setInputValue(value)

    const datePattern = /^\d{2}\/\d{2}\/\d{4}$/
    if (datePattern.test(value)) {
      const formattedDate = formatToDateInput(value)
      handleStartedDate(data => ({ ...data, started_date: formattedDate }))
    }
  }

  const handleFocus = () => {
    dateInputRef.current?.showPicker()
  }

  const handleDateSelect = e => {
    const selectedDate = e.target.value
    handleStartedDate(data => ({ ...data, started_date: selectedDate }))
    setInputValue(formatToDisplay(selectedDate))
  }

  return (
    <div style={{ position: "relative" }} className={styles["date-input-div"]}>
      <input
        type="text"
        value={initialValue ? formatToDisplay(initialValue) : inputValue}
        onChange={handleInputChange}
        onFocus={handleFocus}
        placeholder="DD/MM/YYYY"
        className={styles["date-input-text"]}
      />

      <input
        type="date"
        ref={dateInputRef}
        value={startDate}
        onChange={handleDateSelect}
        style={{
          position: "absolute",
          top: "0",
          left: "0",
          opacity: 0,
          pointerEvents: "none",
        }}
      />
    </div>
  )
}

export default DatePicker
