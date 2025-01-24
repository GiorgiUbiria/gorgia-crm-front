import React, { useState, useEffect } from "react"
import { useTranslation } from "react-i18next"
import {
  useGetUser,
  useChangePassword,
  useUpdateUser,
} from "../../queries/user"
import { toast } from "store/zustand/toastStore"
import ProfileHeader from "./components/ProfileHeader"
import GeneralInfo from "./components/GeneralInfo"
import UpdateProfile from "./components/UpdateProfile"
import ChangePassword from "./components/ChangePassword"

const ProfilePage = () => {
  const { t } = useTranslation()
  const { data: userData } = useGetUser()
  const { mutateAsync: changePasswordMutation } = useChangePassword()
  const { mutateAsync: updateUserMutation } = useUpdateUser()
  const [activeTab, setActiveTab] = useState("profile")

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

  const handleImageChange = e => {
    setProfileForm({
      ...profileForm,
      profile_image: e.target.files[0],
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
      const res = await changePasswordMutation(passForm)
      if (res.data.status === 401) {
        setPassError({ old_password: res.data.message })
      } else {
        toast.success(res.data.message, "წარმატება", {
          duration: 2000,
          size: "small",
        })
      }
    } catch (err) {
      for (const [key, value] of Object.entries(err.response.data)) {
        setPassError(prev => ({ ...prev, [key]: value[0] }))
        toast.error(value[0], "შეცდომა", {
          duration: 2000,
          size: "small",
        })
      }
    }
  }

  const submitProfileForm = async e => {
    e.preventDefault()

    const formData = new FormData()

    const fieldsToUpdate = [
      "name",
      "sur_name",
      "working_start_date",
      "mobile_number",
      "id_number",
      "date_of_birth",
    ]

    fieldsToUpdate.forEach(key => {
      if (profileForm[key]) {
        formData.append(key, profileForm[key])
      }
    })

    if (profileForm.profile_image) {
      formData.append("profile_image", profileForm.profile_image)
    }

    try {
      const res = await updateUserMutation(formData)
      if (res.data.status === 401) {
        setPassError({ old_password: res.data.message })
      } else {
        const authUser = JSON.parse(sessionStorage.getItem("authUser"))
        if (authUser) {
          const updatedUser = {
            ...authUser,
            name: profileForm.name,
            sur_name: profileForm.sur_name,
            working_start_date: profileForm.working_start_date,
            mobile_number: profileForm.mobile_number,
            id_number: profileForm.id_number,
            date_of_birth: profileForm.date_of_birth,
            updated_at: new Date().toISOString(),
          }
          sessionStorage.setItem("authUser", JSON.stringify(updatedUser))
        }

        toast.success(t("პროფილი წარმატებით განახლდა"), "წარმატება", {
          duration: 2000,
          size: "small",
        })
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
        setProfileError(prev => ({ ...prev, [key]: value[0] }))
        toast.error(value[0], "შეცდომა", {
          duration: 2000,
          size: "small",
        })
      }
    }
  }

  const isProfileFormChanged = () => {
    return (
      profileForm.name !== userData?.name ||
      profileForm.sur_name !== userData?.sur_name ||
      profileForm.working_start_date !== userData?.working_start_date ||
      profileForm.mobile_number !== userData?.mobile_number ||
      profileForm.id_number !== userData?.id_number ||
      profileForm.date_of_birth !== userData?.date_of_birth ||
      profileForm.profile_image
    )
  }

  return (
    <div className="min-h-screen bg-white dark:!bg-gray-900 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-8">
        <div className="space-y-6 animate-fade-in">
          <ProfileHeader
            userData={userData}
            onImageChange={handleImageChange}
          />

          <div className="bg-white dark:!bg-gray-800 rounded-2xl shadow-lg overflow-hidden">
            <div className="border-b border-gray-200 dark:!border-gray-700">
              <nav className="flex -mb-px">
                <button
                  onClick={() => setActiveTab("profile")}
                  className={`flex-1 px-4 py-4 text-center border-b-2 font-medium text-sm sm:text-base transition-colors duration-200 ${
                    activeTab === "profile"
                      ? "border-blue-500 text-blue-600 dark:!text-blue-400"
                      : "border-transparent text-gray-500 hover:text-gray-700 dark:!text-gray-400 dark:!hover:!text-gray-300"
                  }`}
                >
                  {t("პროფილის პარამეტრები")}
                </button>
                <button
                  onClick={() => setActiveTab("security")}
                  className={`flex-1 px-4 py-4 text-center border-b-2 font-medium text-sm sm:text-base transition-colors duration-200 ${
                    activeTab === "security"
                      ? "border-blue-500 text-blue-600 dark:!text-blue-400"
                      : "border-transparent text-gray-500 hover:text-gray-700 dark:!text-gray-400 dark:!hover:!text-gray-300"
                  }`}
                >
                  {t("უსაფრთხოება")}
                </button>
              </nav>
            </div>

            <div className="p-4 sm:p-6 lg:p-8">
              {activeTab === "profile" ? (
                <div className="space-y-8">
                  <GeneralInfo userData={userData} />
                  <div className="h-px bg-gray-200 dark:!bg-gray-700" />
                  <UpdateProfile
                    profileForm={profileForm}
                    profileError={profileError}
                    handleChangeProfile={handleChangeProfile}
                    onSubmit={submitProfileForm}
                    isFormChanged={isProfileFormChanged()}
                  />
                </div>
              ) : (
                <ChangePassword
                  passForm={passForm}
                  passError={passError}
                  handleChangePass={handleChangePass}
                  onSubmit={submitPassForm}
                />
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ProfilePage
