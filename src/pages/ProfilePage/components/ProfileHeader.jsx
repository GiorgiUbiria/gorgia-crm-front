import React from "react"
import PropTypes from "prop-types"
import { useTranslation } from "react-i18next"
import NoAvatarIcon from "../../../assets/images/no-avatar.jpg"

const roleNameMapping = {
  admin: "ადმინისტრატორი",
  hr: "HR მენეჯერი",
  vip: "VIP მომხმარებელი",
  user: "მომხმარებელი",
  department_head: "დეპარტამენტის უფროსი",
  department_head_assistant: "დეპარტამენტის უფროსის ასისტენტი",
  manager: "მენეჯერი",
  ceo: "გენერალური დირექტორი",
  ceo_assistant: "გენერალური დირექტორის ასისტენტი",
}

const ProfileHeader = ({ userData, onImageChange }) => {
  const { t } = useTranslation()
  const profileImageSrc = userData?.profile_image
    ? `${process.env.REACT_APP_BASE_URL}/${userData.profile_image}`
    : NoAvatarIcon

  return (
    <header className="relative bg-gradient-to-br from-blue-500 to-blue-700 dark:from-blue-600 dark:to-blue-900 rounded-2xl p-6 sm:p-8 shadow-xl overflow-hidden group">
      {/* Background pattern */}
      <div className="absolute inset-0 bg-white/5 opacity-50" />

      {/* Content */}
      <div className="relative flex flex-col sm:flex-row items-center gap-6 w-full">
        <div className="relative group/photo">
          <div className="relative w-28 h-28 sm:w-36 sm:h-36 rounded-2xl overflow-hidden ring-4 ring-white/20 transition-all duration-300 group-hover/photo:ring-white/40 transform group-hover/photo:scale-[1.02]">
            <img
              src={profileImageSrc}
              alt={`${userData?.name} ${userData?.sur_name}`}
              className="w-full h-full object-cover"
            />
            <label
              htmlFor="profile-image-upload"
              className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover/photo:opacity-100 transition-all duration-300 cursor-pointer backdrop-blur-sm"
            >
              <span className="text-white text-sm font-medium">
                {t("შეცვლა")}
              </span>
            </label>
            <input
              id="profile-image-upload"
              type="file"
              className="hidden"
              accept="image/*"
              onChange={onImageChange}
            />
          </div>

          {/* Photo upload indicator */}
          <div className="absolute -bottom-1 -right-1 w-8 h-8 bg-blue-400 rounded-full flex items-center justify-center shadow-lg transform scale-0 group-hover/photo:scale-100 transition-transform duration-200">
            <svg
              className="w-4 h-4 text-white"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 6v6m0 0v6m0-6h6m-6 0H6"
              />
            </svg>
          </div>
        </div>

        <div className="flex flex-col items-center sm:items-start text-center sm:text-left">
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white mb-3 tracking-tight">
            {userData?.name} {userData?.sur_name}
          </h1>
          <div className="flex flex-wrap justify-center sm:justify-start gap-2">
            <span className="px-4 py-2 rounded-xl text-sm font-medium bg-white/20 text-white backdrop-blur-sm hover:bg-white/30 transition-all duration-200 shadow-inner-lg">
              {userData?.department?.name}
            </span>
            {userData?.roles?.map(role => (
              <span
                key={role.id}
                className="px-4 py-2 rounded-xl text-sm font-medium bg-blue-400/30 text-white backdrop-blur-sm hover:bg-blue-400/40 transition-all duration-200 shadow-inner-lg"
              >
                {roleNameMapping[role.slug] || role.name}
              </span>
            ))}
          </div>
        </div>
      </div>
    </header>
  )
}

ProfileHeader.propTypes = {
  userData: PropTypes.object,
  onImageChange: PropTypes.func.isRequired,
}

export default ProfileHeader
