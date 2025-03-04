import React from "react"
import PropTypes from "prop-types"

const GeneralInfo = ({ userData }) => {
  const infoItems = [
    { label: "ელ-ფოსტა", value: userData?.email, icon: "📧" },
    { label: "მობილური", value: userData?.mobile_number, icon: "📱" },
    { label: "პირადი ნომერი", value: userData?.id_number, icon: "🆔" },
    {
      label: "დაბადების თარიღი",
      value: userData?.date_of_birth,
      icon: "🎂",
    },
    {
      label: "მუშაობის დაწყების თარიღი",
      value: userData?.working_start_date,
      icon: "💼",
    },
    { label: "დეპარტამენტი", value: userData?.department?.name, icon: "🏢" },
  ]

  return (
    <div className="animate-fade-in">
      <h2 className="text-lg sm:text-xl font-bold text-gray-900 dark:!text-white mb-4 sm:mb-6 flex items-center gap-2">
        <svg
          className="w-4 h-4 sm:w-5 sm:h-5 text-blue-500"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
        {"ზოგადი ინფორმაცია"}
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 md:gap-6">
        {infoItems.map((item, index) => (
          <div
            key={index}
            className="group p-3 sm:p-4 bg-gray-50 dark:!bg-gray-800 rounded-lg sm:rounded-xl hover:shadow-md transition-all duration-300 border border-transparent hover:border-blue-500/20"
          >
            <dt className="flex items-center gap-2 text-xs sm:text-sm font-medium text-gray-500 dark:!text-gray-400 mb-1">
              <span className="transform group-hover:scale-110 transition-transform duration-200">
                {item.icon}
              </span>
              {item.label}
            </dt>
            <dd className="text-sm sm:text-base font-semibold text-gray-900 dark:!text-white">
              {item.value || "-"}
            </dd>
          </div>
        ))}
      </div>
    </div>
  )
}

GeneralInfo.propTypes = {
  userData: PropTypes.object,
}

export default GeneralInfo
