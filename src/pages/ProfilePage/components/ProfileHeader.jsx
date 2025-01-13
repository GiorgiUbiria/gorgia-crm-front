import React from "react"
import { FiCamera } from "react-icons/fi"
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
    <header className="bg-gradient-to-br from-blue-500 to-blue-900 rounded-lg p-4 sm:p-8 mb-8 shadow-lg">
      <div className="flex flex-col sm:flex-row items-center gap-4 sm:gap-6 w-full">
        <div className="relative">
          <div className="relative w-[80px] sm:w-[100px] h-[80px] sm:h-[100px] rounded-lg overflow-hidden border-3 border-white/20 transition-transform hover:scale-[1.03]">
            <img
              src={profileImageSrc}
              alt={`${userData?.name} ${userData?.sur_name}`}
              className="w-full h-full object-cover"
            />
            <label
              htmlFor="profile-image-upload"
              className="absolute inset-0 bg-black/30 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity cursor-pointer"
            >
              <FiCamera size={16} className="text-white" />
            </label>
            <input
              id="profile-image-upload"
              type="file"
              className="hidden"
              accept="image/*"
              onChange={onImageChange}
            />
          </div>
        </div>

        <div className="flex flex-col items-center sm:items-start text-center sm:text-left">
          <h1 className="text-xl sm:text-2xl font-semibold text-white m-0 shadow-sm">
            {userData?.name} {userData?.sur_name}
          </h1>
          <div className="flex flex-wrap justify-center sm:justify-start gap-2 mt-1.5">
            <span className="px-2.5 py-1.5 rounded-xl text-xs sm:text-sm font-medium bg-blue-400 text-white hover:-translate-y-0.5 transition-transform">
              {userData?.department?.name}
            </span>
            {userData?.roles?.map(role => (
              <span
                key={role.id}
                className="px-2.5 py-1.5 rounded-xl text-xs sm:text-sm font-medium bg-green-500 text-white hover:-translate-y-0.5 transition-transform"
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

export default ProfileHeader
