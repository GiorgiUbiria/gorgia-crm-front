import React from "react"
import PropTypes from "prop-types"
import { useTranslation } from "react-i18next"

const UpdateProfile = ({
  profileForm,
  profileError,
  handleChangeProfile,
  onSubmit,
  isFormChanged,
}) => {
  const { t } = useTranslation()

  return (
    <div>
      <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
        {t("პროფილის განახლება")}
      </h2>
      <form onSubmit={onSubmit} className="space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              {t("სახელი")}
            </label>
            <input
              type="text"
              name="name"
              value={profileForm.name}
              onChange={handleChangeProfile}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-800 dark:text-gray-200 transition-colors duration-200"
            />
            {profileError.name && (
              <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                {profileError.name}
              </p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              {t("გვარი")}
            </label>
            <input
              type="text"
              name="sur_name"
              value={profileForm.sur_name}
              onChange={handleChangeProfile}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-800 dark:text-gray-200 transition-colors duration-200"
            />
            {profileError.sur_name && (
              <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                {profileError.sur_name}
              </p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              {t("მობილური")}
            </label>
            <input
              type="text"
              name="mobile_number"
              value={profileForm.mobile_number}
              onChange={handleChangeProfile}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-800 dark:text-gray-200 transition-colors duration-200"
            />
            {profileError.mobile_number && (
              <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                {profileError.mobile_number}
              </p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              {t("პირადი ნომერი")}
            </label>
            <input
              type="text"
              name="id_number"
              value={profileForm.id_number}
              onChange={handleChangeProfile}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-800 dark:text-gray-200 transition-colors duration-200"
            />
            {profileError.id_number && (
              <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                {profileError.id_number}
              </p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              {t("დაბადების თარიღი")}
            </label>
            <input
              type="date"
              name="date_of_birth"
              value={profileForm.date_of_birth}
              onChange={handleChangeProfile}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-800 dark:text-gray-200 transition-colors duration-200"
            />
            {profileError.date_of_birth && (
              <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                {profileError.date_of_birth}
              </p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              {t("მუშაობის დაწყების თარიღი")}
            </label>
            <input
              type="date"
              name="working_start_date"
              value={profileForm.working_start_date}
              onChange={handleChangeProfile}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-800 dark:text-gray-200 transition-colors duration-200"
            />
            {profileError.working_start_date && (
              <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                {profileError.working_start_date}
              </p>
            )}
          </div>
        </div>

        <div className="flex justify-end">
          <button
            type="submit"
            disabled={!isFormChanged}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
          >
            {t("განახლება")}
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
