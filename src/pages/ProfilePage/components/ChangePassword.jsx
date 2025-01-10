import React from "react"
import { FiLock } from "react-icons/fi"
import { useTranslation } from "react-i18next"

const ChangePassword = ({ passError, handleChangePass, onSubmit }) => {
  const { t } = useTranslation()

  return (
    <section className="bg-white rounded-lg p-4 sm:p-6 shadow-sm hover:shadow-md transition-shadow">
      <h2 className="flex items-center gap-2.5 text-base sm:text-lg font-semibold text-gray-800 mb-4 pb-3 border-b border-gray-100">
        <FiLock className="text-blue-600" size={20} />
        <span>{t("პაროლის შეცვლა")}</span>
      </h2>
      <p className="text-gray-600 text-xs sm:text-sm mb-6">
        {t("უსაფრთხოების მიზნით, შეცვალეთ თქვენი პაროლი პერიოდულად")}
      </p>

      <form onSubmit={onSubmit}>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium text-gray-700">
              {t("ძველი პაროლი")}
            </label>
            <input
              type="password"
              name="old_password"
              onChange={handleChangePass}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            />
            {passError?.old_password && (
              <p className="text-sm text-red-600">
                {passError.old_password}
              </p>
            )}
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium text-gray-700">
              {t("ახალი პაროლი")}
            </label>
            <input
              type="password"
              name="password"
              onChange={handleChangePass}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            />
            {passError?.password && (
              <p className="text-sm text-red-600">{passError.password}</p>
            )}
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium text-gray-700">
              {t("გაიმეორე პაროლი")}
            </label>
            <input
              type="password"
              name="confirm_password"
              onChange={handleChangePass}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            />
            {passError?.confirm_password && (
              <p className="text-sm text-red-600">
                {passError.confirm_password}
              </p>
            )}
          </div>
        </div>

        <div className="mt-4">
          <button
            type="submit"
            className="w-full flex items-center justify-center rounded-md border border-transparent bg-blue-600 py-2 px-4 text-sm font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
          >
            {t("შეცვლა")}
          </button>
        </div>
      </form>
    </section>
  )
}

export default ChangePassword 