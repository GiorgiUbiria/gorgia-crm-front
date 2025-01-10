import React, { useState, useRef } from 'react';
import styles from './datePicker.module.css'

const DatePicker = ({startDate, handleStartedDate, initialValue = null}) => {
  const [inputValue, setInputValue] = useState('');
  const dateInputRef = useRef(null);

  // Convert YYYY-MM-DD to DD/MM/YYYY format
  const formatToDisplay = (dateString) => {
    const [year, month, day] = dateString.split('-');
    return `${day}/${month}/${year}`;
  };

  // Convert DD/MM/YYYY to YYYY-MM-DD format
  const formatToDateInput = (dateString) => {
    const [day, month, year] = dateString.split('/');
    return `${year}-${month}-${day}`;
  };

  // Handle input change and validation
  const handleInputChange = (e) => {
    const value = e.target.value;
    setInputValue(value);

    // Basic validation for DD/MM/YYYY format
    const datePattern = /^\d{2}\/\d{2}\/\d{4}$/;
    if (datePattern.test(value)) {
      const formattedDate = formatToDateInput(value);
      handleStartedDate(data => ({...data, started_date: formattedDate}))
    }
  };

  // Trigger the hidden input click to show the date picker
  const handleFocus = () => {
    dateInputRef.current?.showPicker();
  };

  // Handle date selection from the hidden input
  const handleDateSelect = (e) => {
    const selectedDate = e.target.value;
    handleStartedDate(data => ({...data, started_date: selectedDate}))
    setInputValue(formatToDisplay(selectedDate)); // Update input value with DD/MM/YYYY format
  };

  return (
    <div style={{ position: 'relative'}} className={styles['date-input-div']}>
      {/* Input for Date (type text) */}
      <input
        type="text"
        value={initialValue ? formatToDisplay(initialValue) : inputValue}
        onChange={handleInputChange}
        onFocus={handleFocus}
        placeholder="DD/MM/YYYY"
        className={styles['date-input-text']}
      />

      {/* Hidden input for date picker */}
      <input
        type="date"
        ref={dateInputRef}
        value={startDate}
        onChange={handleDateSelect}
        style={{
          position: 'absolute',
          top: '0',
          left: '0',
          opacity: 0, // Hide the input, but it will trigger the date picker
          pointerEvents: 'none', // Disable interaction with the hidden input
        }}
      />
    </div>
  );
};

export default DatePicker;
