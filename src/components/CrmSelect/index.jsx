import React, { forwardRef, useState, useEffect, useMemo } from "react"
import { Combobox, Listbox } from "@headlessui/react"
import { ChevronDownIcon, CheckIcon } from "@radix-ui/react-icons"
import classNames from "classnames"

const CrmSelect = forwardRef(
  (
    {
      isLoading = false,
      touched,
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
    // State for searchable select
    const [query, setQuery] = useState("")
    const [inputValue, setInputValue] = useState("")

    // Normalize options and handle empty arrays
    const normalizedOptions = useMemo(() =>
      (options?.filter(Boolean) || []),
      [options]
    )

    // Handle null/undefined values properly
    const value = propValue?.value ?? propValue ?? ""

    // Find the selected option based on value
    const selectedOption = useMemo(() =>
      normalizedOptions.find(option => {
        const optionValue = option.value?.toString() ?? option.value
        const compareValue = value?.toString() ?? value
        return optionValue === compareValue
      }),
      [normalizedOptions, value]
    )

    // Update input value when selected option changes (for searchable select)
    useEffect(() => {
      if (selectedOption) {
        setInputValue(selectedOption.label)
      } else {
        setInputValue("")
      }
    }, [selectedOption])

    // Filter options based on search query
    const filteredOptions = useMemo(() => {
      if (!searchable || !query) return normalizedOptions

      return normalizedOptions.filter(option =>
        option.label.toLowerCase().includes(query.toLowerCase())
      )
    }, [normalizedOptions, query, searchable])

    // Common styles for both select types
    const buttonStyles = classNames(
      "relative w-full cursor-default rounded-md border py-2 pl-3 pr-10 text-left shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 sm:text-sm",
      "bg-white text-gray-900 dark:!bg-gray-800 dark:!text-gray-100",
      {
        "border-red-500": error,
        "border-gray-300 dark:!border-gray-600": !error,
        "opacity-50 cursor-not-allowed bg-gray-50": disabled,
      },
      className
    )

    const optionsStyles = classNames(
      "absolute z-[100] mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm",
      "dark:!bg-gray-800 dark:!ring-gray-700"
    )

    // Render empty state messages
    const renderEmptyState = () => {
      if (isLoading) {
        return (
          <div className="px-3 py-4 text-center text-sm text-gray-500 dark:!text-gray-400">
            იტვირთება...
          </div>
        )
      }

      if ((searchable ? filteredOptions : normalizedOptions).length === 0) {
        return (
          <div className="px-3 py-4 text-center text-sm text-gray-500 dark:!text-gray-400">
            მონაცემები არ მოიძებნა
          </div>
        )
      }

      return null
    }

    // Render option content (shared between Listbox and Combobox)
    const renderOptionContent = (option, { active, selected }) => (
      <>
        <span
          className={classNames("block truncate", {
            "font-semibold": selected
          })}
        >
          {option.label}
        </span>
        {selected && (
          <span
            className={classNames(
              "absolute inset-y-0 right-0 flex items-center pr-4",
              active ? "text-white" : "text-blue-600"
            )}
          >
            <CheckIcon className="h-5 w-5" aria-hidden="true" />
          </span>
        )}
      </>
    )

    // Render the appropriate select component based on searchable prop
    return (
      <div className="relative w-full">
        <div className="flex flex-col gap-1">
          {label && (
            <label className="text-sm font-medium text-gray-700 dark:!text-gray-300">
              {label}
            </label>
          )}

          {searchable ? (
            // Searchable select using Combobox
            <Combobox
              value={selectedOption}
              onChange={(option) => {
                onChange(option?.value ?? null)
                setQuery("")
              }}
              disabled={disabled}
              nullable
            >
              <div className="relative">
                <Combobox.Input
                  className={buttonStyles}
                  onChange={(event) => {
                    const value = event.target.value
                    setInputValue(value)
                    setQuery(value)
                  }}
                  onFocus={() => {
                    if (!selectedOption) {
                      setInputValue("")
                      setQuery("")
                    }
                  }}
                  value={inputValue}
                  displayValue={(option) => option?.label ?? ""}
                  placeholder={placeholder}
                  ref={ref}
                  autoComplete="off"
                />
                <Combobox.Button className="absolute inset-y-0 right-0 flex items-center px-2">
                  <ChevronDownIcon
                    className="h-5 w-5 text-gray-400"
                    aria-hidden="true"
                  />
                </Combobox.Button>

                <Combobox.Options className={optionsStyles} portal={false}>
                  {renderEmptyState() ||
                    filteredOptions.map((option) => (
                      <Combobox.Option
                        key={option.value}
                        value={option}
                        className={({ active }) =>
                          classNames(
                            "relative cursor-pointer select-none py-2 pl-3 pr-9",
                            {
                              "bg-blue-600 text-white": active,
                              "text-gray-900 dark:!text-gray-100": !active,
                            }
                          )
                        }
                      >
                        {(optionProps) => renderOptionContent(option, optionProps)}
                      </Combobox.Option>
                    ))
                  }
                </Combobox.Options>
              </div>
            </Combobox>
          ) : (
            // Regular select using Listbox
            <Listbox
              value={selectedOption}
              onChange={(option) => onChange(option?.value ?? null)}
              disabled={disabled}
            >
              <div className="relative">
                <Listbox.Button className={buttonStyles}>
                  <span className="block truncate">
                    {selectedOption?.label || placeholder}
                  </span>
                  <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
                    <ChevronDownIcon
                      className="h-5 w-5 text-gray-400"
                      aria-hidden="true"
                    />
                  </span>
                </Listbox.Button>
                <Listbox.Options className={optionsStyles} portal={false}>
                  {renderEmptyState() ||
                    normalizedOptions.map((option) => (
                      <Listbox.Option
                        key={option.value}
                        value={option}
                        className={({ active }) =>
                          classNames(
                            "relative cursor-pointer select-none py-2 pl-3 pr-9",
                            {
                              "bg-blue-600 text-white": active,
                              "text-gray-900 dark:!text-gray-100": !active,
                            }
                          )
                        }
                      >
                        {(optionProps) => renderOptionContent(option, optionProps)}
                      </Listbox.Option>
                    ))
                  }
                </Listbox.Options>
              </div>
            </Listbox>
          )}

          {touched && error && (
            <div className="mt-1 text-sm text-red-500">
              {error}
            </div>
          )}
        </div>
      </div>
    )
  }
)

CrmSelect.displayName = "CrmSelect"

export default CrmSelect
