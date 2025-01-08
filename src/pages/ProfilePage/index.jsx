import React, { useEffect, useState } from "react"
import { changePassword, updateUser } from "../../services/user"
import { useTranslation } from "react-i18next"
import { useSelector } from "react-redux"
import { toast, ToastContainer } from "react-toastify"
import "react-toastify/dist/ReactToastify.css"

import ProfileHeader from "./components/ProfileHeader"
import GeneralInfo from "./components/GeneralInfo"
import UpdateProfile from "./components/UpdateProfile"
import ChangePassword from "./components/ChangePassword"

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
      const res = await changePassword(passForm)
      if (res.data.status === 401) {
        setPassError({ old_password: res.data.message })
      } else {
        toast.success(res.data.message)
      }
    } catch (err) {
      for (const [key, value] of Object.entries(err.response.data)) {
        setPassError(prev => ({ ...prev, [key]: value[0] }))
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
        setProfileError(prev => ({ ...prev, [key]: value[0] }))
        toast.error(value[0])
      }
    }
  }

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
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <ProfileHeader 
        userData={userData} 
        onImageChange={handleImageChange} 
      />

      <div className="space-y-6">
        <GeneralInfo userData={userData} />

        <div className="h-px bg-gray-200" />

        <UpdateProfile
          profileForm={profileForm}
          profileError={profileError}
          handleChangeProfile={handleChangeProfile}
          onSubmit={submitProfileForm}
          isFormChanged={isProfileFormChanged()}
        />

        <div className="h-px bg-gray-200" />

        <ChangePassword
          passForm={passForm}
          passError={passError}
          handleChangePass={handleChangePass}
          onSubmit={submitPassForm}
        />
      </div>
      <ToastContainer />
    </div>
  )
}

export default ProfilePage
