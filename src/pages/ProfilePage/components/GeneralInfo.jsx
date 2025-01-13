import React from "react"
import PropTypes from "prop-types"
import { useTranslation } from "react-i18next"

const GeneralInfo = ({ userData }) => {
  const { t } = useTranslation()

  const infoItems = [
    { label: t("პოზიცია"), value: userData?.position },
    { label: t("დეპარტამენტი"), value: userData?.department?.name },
    { label: t("ლოკაცია"), value: userData?.location },
    { label: t("მუშაობის დაწყების თარიღი"), value: userData?.working_start_date },
    { label: t("დაბადების თარიღი"), value: userData?.date_of_birth },
    { label: t("ელ-ფოსტა"), value: userData?.email },
    { label: t("მობილური"), value: userData?.mobile_number },
    { label: t("პირადი ნომერი"), value: userData?.id_number },
  ]

  return (
    <div>
      <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
        {t("ზოგადი ინფორმაცია")}
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {infoItems.map((item, index) => (
          <div key={index} className="space-y-1">
            <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">
              {item.label}
            </dt>
            <dd className="text-sm text-gray-900 dark:text-gray-200">
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
