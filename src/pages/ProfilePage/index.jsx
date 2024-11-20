import React, { useEffect, useState } from "react"
import { toast } from "react-toastify"
import { changePassword, updateUser } from "../../services/user"
import useFetchUser from "../../hooks/useFetchUser"
import { getDepartments } from "../../services/admin/department"
import {
  getDepartments as getDeps,
  getPurchaseDepartments,
} from "../../services/auth"
import { useTranslation } from "react-i18next"
import store from "../../store"
import {
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
} from "reactstrap"
import "./index.css"
import { useSelector } from "react-redux"

const ProfilePage = () => {
  const { t } = useTranslation()
  const userData = useSelector((state) => state.user.user)

  console.log(userData)

  const [departments, setDepartments] = useState([])
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
    department: userData?.department?.name || "",
    location: userData?.location || "",
    working_start_date: userData?.working_start_date || "",
    date_of_birth: userData?.date_of_birth || "",
    email: userData?.email || "",
    mobile_number: userData?.mobile_number || "",
    id_number: userData?.id_number || "",
    password: "",
    profile_image: "",
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
  })

  const [modal, setModal] = useState(false)

  useEffect(() => {
    if (userData) {
      setProfileForm({
        name: userData.name || "",
        sur_name: userData.sur_name || "",
        position: userData.position || "",
        department: userData.department?.name || "",
        location: userData.location || "",
        working_start_date: userData.working_start_date || "",
        date_of_birth: userData.date_of_birth || "",
        email: userData.email || "",
        mobile_number: userData.mobile_number || "",
        id_number: userData.id_number || "",
        password: "",
        profile_image: "",
      })
    }
  }, [userData])

  useEffect(() => {
    const fetchDepartments = async () => {
      try {
        const res = await getDepartments()
        setDepartments(res.data.departments || [])
      } catch (err) {
        console.error(err)
      }
    }
    fetchDepartments()
  }, [])

  const handleChangePass = (e) => {
    const { name, value } = e.target
    setPassForm({
      ...passForm,
      [name]: value,
    })
  }

  const handleChangeProfile = (e) => {
    const { name, value } = e.target
    setProfileForm({
      ...profileForm,
      [name]: value,
    })
  }

  const submitPassForm = async (e) => {
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

  const submitProfileForm = async (e) => {
    e.preventDefault()

    const formData = new FormData()

    Object.keys(profileForm).forEach((key) => {
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
        toast.success(res.data.message)
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
        setModal(true)
      }
    } catch (err) {
      for (const [key, value] of Object.entries(err.response.data)) {
        setProfileError({ ...profileError, [key]: value[0] })
        toast.error(value[0])
      }
    }
  }

  const toggleModal = () => {
    setModal(!modal)
  }

  return (
    <div className="profile-dashboard-container">
      <div className="profile-main-content">
        <div className="profile">
          <main className="profile-content">
            <div className="profile grid grid-cols-1 lg:grid-cols-2 gap-12">
              {/* Profile Section */}
              <div className="profile-section">
                <div className="section-header mb-6">
                  <h2>{t("პროფილი")}</h2>
                </div>
                <form onSubmit={submitProfileForm}>
                  <div className="form-row">
                    <div className="profile-form-wrapper">
                      <label>{t("სახელი")}</label>
                      <input
                        type="text"
                        name="name"
                        onChange={handleChangeProfile}
                        value={profileForm.name}
                        className="form-control"
                      />
                      <p className="error-text">{profileError?.name}</p>
                    </div>

                    <div className="profile-form-wrapper">
                      <label>{t("გვარი")}</label>
                      <input
                        type="text"
                        name="sur_name"
                        onChange={handleChangeProfile}
                        value={profileForm.sur_name}
                        className="form-control"
                      />
                      <p className="error-text">{profileError?.sur_name}</p>
                    </div>
                  </div>

                  <div className="form-row">
                    <div className="profile-form-wrapper">
                      <label>{t("დეპარტამენტი")}</label>
                      <select
                        name="department_id"
                        onChange={handleChangeProfile}
                        className="form-select"
                        value={profileForm.department_id}
                      >
                        {departments.map((dep) => (
                          <option
                            key={dep.id}
                            selected={dep.id === userData?.department_id}
                            value={dep.id}
                          >
                            {dep?.name}
                          </option>
                        ))}
                      </select>
                      <p className="error-text">{profileError?.department}</p>
                    </div>
                  </div>

                  <button className="btn btn-primary save-button">
                    {t("შენახვა")}
                  </button>
                </form>
              </div>

              {/* Password Change Section */}
              <div className="profile-section">
                <div className="section-header mb-6">
                  <h2>{t("შეცვალე პაროლი")}</h2>
                </div>
                <form onSubmit={submitPassForm}>
                  <div className="form-row">
                    <div className="profile-form-wrapper">
                      <label>{t("ძველი პაროლი")}</label>
                      <input
                        type="password"
                        name="old_password"
                        onChange={handleChangePass}
                        className="form-control"
                      />
                      <p className="error-text">{passError?.old_password}</p>
                    </div>

                    <div className="profile-form-wrapper">
                      <label>{t("ახალი პაროლი")}</label>
                      <input
                        type="password"
                        name="password"
                        onChange={handleChangePass}
                        className="form-control"
                      />
                      <p className="error-text">{passError?.password}</p>
                    </div>
                  </div>

                  <div className="form-row">
                    <div className="profile-form-wrapper">
                      <label>{t("გაიმეორე ახალი პაროლი")}</label>
                      <input
                        type="password"
                        name="confirm_password"
                        onChange={handleChangePass}
                        className="form-control"
                      />
                      <p className="error-text">
                        {passError?.confirm_password}
                      </p>
                    </div>
                  </div>

                  <button className="btn btn-primary save-button">
                    {t("შეცვლა")}
                  </button>
                </form>
              </div>
            </div>
          </main>
        </div>
      </div>

      {/* Modal for Success Message */}
      <Modal isOpen={modal} toggle={toggleModal} centered>
        <ModalHeader toggle={toggleModal}>
          {t("პროფილის განახლება")}
        </ModalHeader>
        <ModalBody>{t("პროფილი წარმატებით განახლდა")}</ModalBody>
        <ModalFooter>
          <Button color="primary" onClick={toggleModal}>
            {t("დახურვა")}
          </Button>
        </ModalFooter>
      </Modal>
    </div>
  )
}

export default ProfilePage
