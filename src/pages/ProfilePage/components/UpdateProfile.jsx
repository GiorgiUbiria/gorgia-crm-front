import React from "react"
import PropTypes from "prop-types"

const UpdateProfile = ({
  profileForm,
  profileError,
  handleChangeProfile,
  onSubmit,
  isFormChanged,
}) => {
  return (
    <div className="animate-fade-in">
      <h2 className="text-lg sm:text-xl font-bold text-gray-900 dark:!text-white mb-4 sm:mb-6">
        {"პროფილის განახლება"}
      </h2>
      <form onSubmit={onSubmit} className="space-y-4 sm:space-y-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
          {[
            { name: "name", label: "სახელი", type: "text" },
            { name: "sur_name", label: "გვარი", type: "text" },
            { name: "mobile_number", label: "მობილური", type: "text" },
            { name: "id_number", label: "პირადი ნომერი", type: "text" },
            {
              name: "date_of_birth",
              label: "დაბადების თარიღი",
              type: "date",
            },
            {
              name: "working_start_date",
              label: "მუშაობის დაწყების თარიღი",
              type: "date",
            },
          ].map(field => (
            <div key={field.name} className="group">
              <label className="block text-xs sm:text-sm font-medium text-gray-700 dark:!text-gray-300 mb-1.5 sm:mb-2">
                {field.label}
              </label>
              <input
                type={field.type}
                name={field.name}
                value={profileForm[field.name]}
                onChange={handleChangeProfile}
                className="w-full px-3 sm:px-4 py-2 sm:py-3 rounded-lg sm:rounded-xl border border-gray-300 dark:!border-gray-600 bg-white dark:!bg-gray-700 text-gray-900 dark:!text-white text-sm sm:text-base shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:!focus:!ring-blue-400 dark:!focus:!border-blue-400 transition-all duration-200"
              />
              {profileError[field.name] && (
                <p className="mt-1.5 text-xs sm:text-sm text-red-600 dark:!text-red-400 animate-fade-in">
                  {profileError[field.name]}
                </p>
              )}
            </div>
          ))}
        </div>

        <div className="flex justify-end">
          <button
            type="submit"
            disabled={!isFormChanged}
            className="px-4 sm:px-6 py-2 sm:py-3 text-sm sm:text-base bg-blue-500 text-white rounded-lg sm:rounded-xl font-medium hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:!focus:!ring-offset-gray-800 disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-[1.02] active:scale-[0.98] transition-all duration-200"
          >
            {"განახლება"}
          </button>
        </div>
      </form>
    </div>
  )
}

UpdateProfile.propTypes = {
  profileForm: PropTypes.object.isRequired,
  profileError: PropTypes.object.isRequired,
  handleChangeProfile: PropTypes.func.isRequired,
  onSubmit: PropTypes.func.isRequired,
  isFormChanged: PropTypes.bool.isRequired,
}

export default UpdateProfile
