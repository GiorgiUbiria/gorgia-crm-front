import React from "react"
import PropTypes from "prop-types"
import { useTranslation } from "react-i18next"

const ChangePassword = ({ passForm, passError, handleChangePass, onSubmit }) => {
  const { t } = useTranslation()

  return (
    <div>
      <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
        {t("პაროლის შეცვლა")}
      </h2>
      <form onSubmit={onSubmit} className="space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              {t("ძველი პაროლი")}
            </label>
            <input
              type="password"
              name="old_password"
              value={passForm.old_password}
              onChange={handleChangePass}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-800 dark:text-gray-200 transition-colors duration-200"
            />
            {passError.old_password && (
              <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                {passError.old_password}
              </p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              {t("ახალი პაროლი")}
            </label>
            <input
              type="password"
              name="password"
              value={passForm.password}
              onChange={handleChangePass}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-800 dark:text-gray-200 transition-colors duration-200"
            />
            {passError.password && (
              <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                {passError.password}
              </p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              {t("გაიმეორეთ პაროლი")}
            </label>
            <input
              type="password"
              name="confirm_password"
              value={passForm.confirm_password}
              onChange={handleChangePass}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-800 dark:text-gray-200 transition-colors duration-200"
            />
            {passError.confirm_password && (
              <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                {passError.confirm_password}
              </p>
            )}
          </div>
        </div>

        <div className="flex justify-end">
          <button
            type="submit"
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors duration-200"
          >
            {t("შეცვლა")}
          </button>
        </div>
      </form>
    </div>
  )
}

ChangePassword.propTypes = {
  passForm: PropTypes.object.isRequired,
  passError: PropTypes.object.isRequired,
  handleChangePass: PropTypes.func.isRequired,
  onSubmit: PropTypes.func.isRequired,
}

export default ChangePassword
