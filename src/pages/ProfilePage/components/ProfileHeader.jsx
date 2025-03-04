import React from "react"
import PropTypes from "prop-types"
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
  const profileImageSrc = userData?.profile_image
    ? `${process.env.REACT_APP_BASE_URL}/${userData.profile_image}`
    : NoAvatarIcon

  return (
    <header className="relative bg-gradient-to-br from-blue-500 to-blue-700 dark:!from-blue-600 dark:!to-blue-900 rounded-xl sm:rounded-2xl p-4 sm:p-6 md:p-8 shadow-xl overflow-hidden group">
      <div className="absolute inset-0 bg-white/5 opacity-50" />

      <div className="relative flex flex-col items-center gap-4 sm:gap-6 w-full">
        <div className="relative group/photo">
          <div className="relative w-24 h-24 sm:w-28 sm:h-28 md:w-36 md:h-36 rounded-xl sm:rounded-2xl overflow-hidden ring-4 ring-white/20 transition-all duration-300 group-hover/photo:ring-white/40 transform group-hover/photo:scale-[1.02]">
            <img
              src={profileImageSrc}
              alt={`${userData?.name} ${userData?.sur_name}`}
              className="w-full h-full object-cover"
            />
            <label
              htmlFor="profile-image-upload"
              className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover/photo:opacity-100 transition-all duration-300 cursor-pointer backdrop-blur-sm"
            >
              <span className="text-white text-sm font-medium">{"შეცვლა"}</span>
            </label>
            <input
              id="profile-image-upload"
              type="file"
              className="hidden"
              accept="image/*"
              onChange={onImageChange}
            />
          </div>

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

        <div className="flex flex-col items-center text-center w-full">
          <h1 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold text-white mb-2 sm:mb-3 tracking-tight">
            {userData?.name} {userData?.sur_name}
          </h1>
          <div className="flex flex-wrap justify-center gap-2 max-w-full px-2">
            <span className="px-3 sm:px-4 py-1.5 sm:py-2 rounded-lg sm:rounded-xl text-xs sm:text-sm font-medium bg-white/20 text-white backdrop-blur-sm hover:bg-white/30 transition-all duration-200 shadow-inner-lg">
              {userData?.department?.name}
            </span>
            {userData?.roles?.map(role => (
              <span
                key={role.id}
                className="px-3 sm:px-4 py-1.5 sm:py-2 rounded-lg sm:rounded-xl text-xs sm:text-sm font-medium bg-blue-400/30 text-white backdrop-blur-sm hover:bg-blue-400/40 transition-all duration-200 shadow-inner-lg"
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
