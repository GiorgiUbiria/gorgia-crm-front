import React from "react"
import { FiUser } from "react-icons/fi"
import { useTranslation } from "react-i18next"

const InfoItem = ({ label, value }) => (
  <div className="flex flex-col gap-2 p-3 sm:p-4 bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors">
    <span className="text-xs sm:text-sm text-gray-600 font-medium">
      {label}
    </span>
    <span className="text-sm sm:text-base text-gray-800 font-medium">
      {value}
    </span>
  </div>
)

const GeneralInfo = ({ userData }) => {
  const { t } = useTranslation()

  return (
    <section className="bg-white rounded-lg p-4 sm:p-6 shadow-sm hover:shadow-md transition-shadow">
      <h2 className="flex items-center gap-2.5 text-base sm:text-lg font-semibold text-gray-800 mb-4 pb-3 border-b border-gray-100">
        <FiUser className="text-blue-600" size={20} />
        <span>{t("ზოგადი ინფორმაცია")}</span>
      </h2>
      <p className="text-gray-600 text-xs sm:text-sm mb-6">
        {t("თქვენი პროფილის ძირითადი ინფორმაცია")}
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <InfoItem label={t("სახელი")} value={userData?.name} />
        <InfoItem label={t("გვარი")} value={userData?.sur_name} />
        <InfoItem
          label={t("პირადი ნომერი")}
          value={userData?.id_number || "-"}
        />
        <InfoItem
          label={t("დაბადების თარიღი")}
          value={userData?.date_of_birth || "-"}
        />
        <InfoItem 
          label={t("პოზიცია")} 
          value={userData?.position || "-"} 
        />
        <InfoItem
          label={t("მდებარეობა")}
          value={userData?.location || "-"}
        />
        <InfoItem
          label={t("დაწყების თარიღი")}
          value={userData?.working_start_date || "-"}
        />
        <InfoItem
          label={t("მობილური")}
          value={userData?.mobile_number || "-"}
        />
        <InfoItem 
          label={t("ელ-ფოსტა")} 
          value={userData?.email} 
        />
      </div>
    </section>
  )
}

export default GeneralInfo 