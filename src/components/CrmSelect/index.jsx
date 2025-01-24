import React, { useState, useRef, useEffect, forwardRef } from "react"
import { ChevronDownIcon, CheckIcon } from "@radix-ui/react-icons"
import classNames from "classnames"
import { createPortal } from "react-dom"

const CrmSelect = forwardRef(
  (
    {
      options = [],
      value: propValue,
      onChange,
      placeholder = "აირჩიეთ...",
      className,
      error,
      label,
      disabled,
      searchable = false,
    },
    ref
  ) => {
    const [isOpen, setIsOpen] = useState(false)
    const [searchQuery, setSearchQuery] = useState("")
    const [isFocused, setIsFocused] = useState(false)
    const triggerRef = useRef(null)
    const dropdownRef = useRef(null)

    // Normalize value to handle both string and object values
    const value = propValue?.value || propValue || ""

    // Find selected option
    const selectedOption = options.find(option => {
      const optionValue = option.value?.toString() || option.value
      const compareValue = value?.toString() || value
      return optionValue === compareValue
    })

    // Forward the ref to the trigger input
    React.useImperativeHandle(ref, () => ({
      focus: () => triggerRef.current?.focus(),
      blur: () => triggerRef.current?.blur(),
    }))

    // Close dropdown when clicking outside
    useEffect(() => {
      const handleClickOutside = event => {
        // Get the portal element
        const portalElement = document.querySelector('[data-select-dropdown]');
        
        if (
          dropdownRef.current &&
          !dropdownRef.current.contains(event.target) &&
          !triggerRef.current?.contains(event.target) &&
          !portalElement?.contains(event.target)
        ) {
          setIsOpen(false);
          setIsFocused(false);
          // Restore selected option's label when clicking outside
          if (selectedOption) {
            setSearchQuery(selectedOption.label);
          } else {
            setSearchQuery("");
          }
        }
      };

      document.addEventListener("mousedown", handleClickOutside);
      return () => document.removeEventListener("mousedown", handleClickOutside);
    }, [selectedOption]);

    // Set initial search query when component mounts or selected option changes
    useEffect(() => {
      if (selectedOption && !isFocused) {
        setSearchQuery(selectedOption.label)
      }
    }, [selectedOption, isFocused])

    const filteredOptions =
      searchable && searchQuery && isFocused
        ? options.filter(option =>
            option.label.toLowerCase().includes(searchQuery.toLowerCase())
          )
        : options

    // Always ensure selected option is at the top of filtered results if it exists
    const sortedOptions = selectedOption
      ? [
          selectedOption,
          ...filteredOptions.filter(
            option => option.value !== selectedOption.value
          ),
        ]
      : filteredOptions

    const handleSelect = option => {
      onChange(option.value)
      setSearchQuery(option.label)
      setIsOpen(false)
      setIsFocused(false)
    }

    const handleInputChange = e => {
      const value = e.target.value
      if (searchable) {
        setSearchQuery(value)
        if (!isOpen) {
          setIsOpen(true)
        }
      }
    }

    const handleInputFocus = () => {
      if (searchable) {
        setIsFocused(true)
        setSearchQuery("")
        setIsOpen(true)
      }
    }

    const handleKeyDown = e => {
      if (e.key === "Enter" && filteredOptions.length === 1) {
        handleSelect(filteredOptions[0])
      }
    }

    const toggleDropdown = () => {
      if (!disabled) {
        const newIsOpen = !isOpen
        setIsOpen(newIsOpen)
        if (newIsOpen) {
          triggerRef.current?.focus()
          if (searchable) {
            setIsFocused(true)
            setSearchQuery("")
          }
        } else {
          setIsFocused(false)
          if (selectedOption) {
            setSearchQuery(selectedOption.label)
          }
        }
      }
    }

    // Determine what to display in the input
    const displayValue = searchable
      ? isFocused
        ? searchQuery
        : selectedOption?.label || ""
      : selectedOption?.label || ""

    // Add this effect after other useEffects
    useEffect(() => {
      if (isOpen) {
        const updatePosition = () => {
          // Force a re-render to update dropdown position
          setIsOpen(true)
        }

        window.addEventListener("scroll", updatePosition)
        window.addEventListener("resize", updatePosition)

        return () => {
          window.removeEventListener("scroll", updatePosition)
          window.removeEventListener("resize", updatePosition)
        }
      }
    }, [isOpen])

    return (
      <div className="relative w-full" ref={dropdownRef}>
        <div className="flex flex-col gap-1">
          {label && (
            <label className="text-sm font-medium text-gray-700 dark:!text-gray-300">
              {label}
            </label>
          )}
          <div className="relative">
            <input
              ref={triggerRef}
              type="text"
              value={displayValue}
              onChange={handleInputChange}
              onKeyDown={handleKeyDown}
              onClick={() => !disabled && setIsOpen(true)}
              onFocus={handleInputFocus}
              placeholder={placeholder}
              readOnly={!searchable}
              disabled={disabled}
              className={classNames(
                "flex h-10 w-full items-center rounded-md border bg-white px-3 pr-8 text-sm text-gray-900",
                "focus:outline-none focus:ring-2 focus:ring-blue-500",
                "dark:!bg-gray-800 dark:!text-gray-100",
                {
                  "border-red-500": error,
                  "border-gray-300 dark:!border-gray-600": !error,
                  "opacity-50 cursor-not-allowed": disabled,
                  "cursor-pointer": !searchable,
                },
                className
              )}
            />
            <div
              onClick={toggleDropdown}
              className="absolute right-0 top-0 flex h-full w-8 cursor-pointer items-center justify-center"
            >
              <ChevronDownIcon
                className={classNames(
                  "h-4 w-4 text-gray-500 transition-transform dark:!text-gray-400",
                  { "rotate-180": isOpen }
                )}
              />
            </div>
          </div>
          {error && <span className="text-sm text-red-500">{error}</span>}
        </div>

        {isOpen &&
          createPortal(
            <div
              data-select-dropdown
              style={{
                position: 'absolute',
                zIndex: 9999,
                width: dropdownRef.current?.offsetWidth,
                left: dropdownRef.current?.getBoundingClientRect().left,
                top: dropdownRef.current?.getBoundingClientRect().bottom + window.scrollY,
              }}
            >
              <div 
                className="w-full overflow-hidden rounded-md border border-gray-200 bg-white shadow-lg dark:!border-gray-700 dark:!bg-gray-800"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="max-h-[300px] overflow-y-auto p-1">
                  {sortedOptions.length > 0 ? (
                    sortedOptions.map(option => (
                      <div
                        key={option.value}
                        onClick={(e) => {
                          e.stopPropagation();
                          handleSelect(option);
                        }}
                        className={classNames(
                          "relative flex h-9 cursor-pointer select-none items-center rounded-sm px-2 py-1.5 text-sm text-gray-900",
                          "hover:bg-gray-100 dark:!text-gray-100 dark:!hover:bg-gray-700",
                          {
                            "bg-gray-100 dark:!bg-gray-700": option.value === value,
                          }
                        )}
                      >
                        <span className="truncate">{option.label}</span>
                        {option.value === value && (
                          <CheckIcon className="absolute right-2 h-4 w-4 text-blue-500" />
                        )}
                      </div>
                    ))
                  ) : (
                    <div className="px-2 py-4 text-center text-sm text-gray-500 dark:!text-gray-400">
                      მონაცემები არ მოიძებნა
                    </div>
                  )}
                </div>
              </div>
            </div>,
            document.body
          )}
      </div>
    )
  }
)

CrmSelect.displayName = "CrmSelect"

export default CrmSelect
