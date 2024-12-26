import React, { useEffect, useState } from "react"
import { changePassword, updateUser } from "../../services/user"
import { useTranslation } from "react-i18next"
import { useSelector } from "react-redux"
import { FiCamera, FiUser, FiMail, FiLock } from "react-icons/fi"
import { toast, ToastContainer } from "react-toastify"
import "react-toastify/dist/ReactToastify.css"
import NoAvatarIcon from "../../assets/images/no-avatar.jpg"

const ProfilePage = () => {
  const { t } = useTranslation()
  const userData = useSelector(state => state.user.user)
  const [passForm, setPassForm] = useState({
    old_password: "",
    password: "",
    confirm_password: "",
  })
  const [passError, setPassError] = useState({
    old_password: "",
    password: "",
    confirm_password: "",
  })

  const [profileForm, setProfileForm] = useState({
    name: userData?.name || "",
    sur_name: userData?.sur_name || "",
    position: userData?.position || "",
    department: userData?.department || "",
    location: userData?.location || "",
    working_start_date: userData?.working_start_date || "",
    date_of_birth: userData?.date_of_birth || "",
    email: userData?.email || "",
    mobile_number: userData?.mobile_number || "",
    id_number: userData?.id_number || "",
    password: "",
    profile_image: "",
    roles: userData?.roles || "",
  })

  const [profileError, setProfileError] = useState({
    name: "",
    sur_name: "",
    position: "",
    department: "",
    location: "",
    working_start_date: "",
    date_of_birth: "",
    email: "",
    mobile_number: "",
    id_number: "",
    password: "",
    profile_image: "",
    roles: "",
  })

  useEffect(() => {
    if (userData) {
      setProfileForm({
        name: userData.name || "",
        sur_name: userData.sur_name || "",
        position: userData.position || "",
        department: userData.department || "",
        location: userData.location || "",
        working_start_date: userData.working_start_date || "",
        date_of_birth: userData.date_of_birth || "",
        email: userData.email || "",
        mobile_number: userData.mobile_number || "",
        id_number: userData.id_number || "",
        password: "",
        profile_image: "",
        roles: userData.roles || "",
      })
    }
  }, [userData])

  const handleChangePass = e => {
    const { name, value } = e.target
    setPassForm({
      ...passForm,
      [name]: value,
    })
  }

  const handleChangeProfile = e => {
    const { name, value } = e.target
    setProfileForm({
      ...profileForm,
      [name]: value,
    })
  }

  const submitPassForm = async e => {
    e.preventDefault()
    try {
      setPassError({
        old_password: "",
        password: "",
        confirm_password: "",
      })
      const res = await changePassword(passForm)
      if (res.data.status === 401) {
        setPassError({ old_password: res.data.message })
      } else {
        toast.success(res.data.message)
        setModal(true)
      }
    } catch (err) {
      for (const [key, value] of Object.entries(err.response.data)) {
        setPassError({ ...passError, [key]: value[0] })
        toast.error(value[0])
      }
    }
  }

  const submitProfileForm = async e => {
    e.preventDefault()

    const formData = new FormData()

    Object.keys(profileForm).forEach(key => {
      formData.append(key, profileForm[key])
    })

    if (profileForm.profile_image) {
      formData.append("profile_image", profileForm.profile_image)
    }

    try {
      const res = await updateUser(formData)
      if (res.data.status === 401) {
        setPassError({ old_password: res.data.message })
      } else {
        toast.success(t("პროფილი წარმატებით განახლდა"))
        setProfileError({
          name: "",
          sur_name: "",
          position: "",
          department: "",
          location: "",
          working_start_date: "",
          date_of_birth: "",
          email: "",
          mobile_number: "",
          id_number: "",
          password: "",
          profile_image: "",
        })
      }
    } catch (err) {
      for (const [key, value] of Object.entries(err.response.data)) {
        setProfileError({ ...profileError, [key]: value[0] })
        toast.error(value[0])
      }
    }
  }

  const profileImageSrc = userData?.profile_image
    ? `${process.env.REACT_APP_BASE_URL}/${userData.profile_image}`
    : NoAvatarIcon

  const isProfileFormChanged = () => {
    return (
      profileForm.name !== userData?.name ||
      profileForm.sur_name !== userData?.sur_name ||
      profileForm.email !== userData?.email ||
      profileForm.mobile_number !== userData?.mobile_number ||
      profileForm.profile_image
    )
  }

  return (
    <>
      <header className="bg-gradient-to-br from-gray-400 to-gray-900 rounded-lg p-4 sm:p-8 mb-8 shadow-md">
        <div className="flex flex-col sm:flex-row items-center gap-4 sm:gap-6 max-w-7xl w-full">
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
                onChange={e => {
                  setProfileForm({
                    ...profileForm,
                    profile_image: e.target.files[0],
                  })
                }}
              />
            </div>
          </div>

          <div className="flex flex-col items-center sm:items-start text-center sm:text-left">
            <h1 className="text-xl sm:text-2xl font-semibold text-white m-0 shadow-sm">
              {userData?.name} {userData?.sur_name}
            </h1>
            <div className="flex flex-wrap justify-center sm:justify-start gap-2 mt-1.5">
              <span className="px-2.5 py-1.5 rounded-xl text-xs sm:text-sm font-medium bg-blue-600 text-white hover:-translate-y-0.5 transition-transform">
                {userData?.department?.name}
              </span>
              {userData?.roles?.map(role => (
                <span
                  key={role.id}
                  className="px-2.5 py-1.5 rounded-xl text-xs sm:text-sm font-medium bg-green-600 text-white hover:-translate-y-0.5 transition-transform"
                >
                  {role.name}
                </span>
              ))}
            </div>
          </div>
        </div>
      </header>

      <div className="grid gap-6 p-2 sm:p-4">
        <section className="bg-white rounded-lg p-4 sm:p-6 shadow-sm hover:-translate-y-0.5 transition-transform">
          <h2 className="flex items-center gap-2.5 text-base sm:text-lg font-semibold text-gray-800 mb-4 pb-3 border-b border-gray-100">
            <FiUser size={20} />
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
            <InfoItem label={t("პოზიცია")} value={userData?.position || "-"} />
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
            <InfoItem label={t("ელ-ფოსტა")} value={userData?.email} />
          </div>
        </section>

        <div className="h-px bg-gray-200 my-4 sm:my-8" />

        <section className="bg-white rounded-lg p-4 sm:p-6 shadow-sm hover:-translate-y-0.5 transition-transform">
          <h2 className="flex items-center gap-2.5 text-base sm:text-lg font-semibold text-gray-800 mb-4 pb-3 border-b border-gray-100">
            <FiMail size={20} />
            <span>{t("პროფილის განახლება")}</span>
          </h2>
          <p className="text-gray-600 text-xs sm:text-sm mb-6">
            {t("განაახლეთ თქვენი პროფილის ინფორმაცია")}
          </p>

          <form onSubmit={submitProfileForm}>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              <div className="flex flex-col gap-2">
                <label className="text-sm font-medium text-gray-700">
                  {t("სახელი")}
                </label>
                <input
                  type="text"
                  name="name"
                  value={profileForm.name}
                  onChange={handleChangeProfile}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                />
                {profileError?.name && (
                  <p className="text-sm text-red-600">{profileError.name}</p>
                )}
              </div>

              <div className="flex flex-col gap-2">
                <label className="text-sm font-medium text-gray-700">
                  {t("გვარი")}
                </label>
                <input
                  type="text"
                  name="sur_name"
                  value={profileForm.sur_name}
                  onChange={handleChangeProfile}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                />
                {profileError?.sur_name && (
                  <p className="text-sm text-red-600">
                    {profileError.sur_name}
                  </p>
                )}
              </div>

              <div className="flex flex-col gap-2">
                <label className="text-sm font-medium text-gray-700">
                  {t("ელ-ფოსტა")}
                </label>
                <input
                  type="email"
                  name="email"
                  value={profileForm.email}
                  onChange={handleChangeProfile}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                />
                {profileError?.email && (
                  <p className="text-sm text-red-600">{profileError.email}</p>
                )}
              </div>

              <div className="flex flex-col gap-2">
                <label className="text-sm font-medium text-gray-700">
                  {t("მობილური")}
                </label>
                <input
                  type="text"
                  name="mobile_number"
                  value={profileForm.mobile_number}
                  onChange={handleChangeProfile}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                />
                {profileError?.mobile_number && (
                  <p className="text-sm text-red-600">
                    {profileError.mobile_number}
                  </p>
                )}
              </div>
            </div>

            <div className="mt-4">
              <button
                type="submit"
                disabled={!isProfileFormChanged()}
                className="w-full flex items-center justify-center rounded-md border border-transparent bg-indigo-600 py-2 px-4 text-sm font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                {t("შენახვა")}
              </button>
            </div>
          </form>
        </section>

        <div className="h-px bg-gray-200 my-4 sm:my-8" />

        <section className="bg-white rounded-lg p-4 sm:p-6 shadow-sm hover:-translate-y-0.5 transition-transform">
          <h2 className="flex items-center gap-2.5 text-base sm:text-lg font-semibold text-gray-800 mb-4 pb-3 border-b border-gray-100">
            <FiLock size={20} />
            <span>{t("პაროლის შეცვლა")}</span>
          </h2>
          <p className="text-gray-600 text-xs sm:text-sm mb-6">
            {t("უსაფრთხოების მიზნით, შეცვალეთ თქვენი პაროლი პერიოდულად")}
          </p>

          <form onSubmit={submitPassForm}>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              <div className="flex flex-col gap-2">
                <label className="text-sm font-medium text-gray-700">
                  {t("ძველი პაროლი")}
                </label>
                <input
                  type="password"
                  name="old_password"
                  onChange={handleChangePass}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
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
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
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
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
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
                className="w-full flex items-center justify-center rounded-md border border-transparent bg-indigo-600 py-2 px-4 text-sm font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                {t("შეცვლა")}
              </button>
            </div>
          </form>
        </section>
      </div>
      <ToastContainer />
    </>
  )
}

const InfoItem = ({ label, value }) => (
  <div className="flex flex-col gap-2 p-3 sm:p-4 bg-gray-50 rounded-lg">
    <span className="text-xs sm:text-sm text-gray-600 font-medium">
      {label}
    </span>
    <span className="text-sm sm:text-base text-gray-800 font-medium">
      {value}
    </span>
  </div>
)

export default ProfilePage
