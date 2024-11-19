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
import { Modal, ModalHeader, ModalBody, ModalFooter } from "reactstrap"
import "./index.css" // Make sure the relevant styles are in this file
import { useSelector } from "react-redux"

const ProfilePage = () => {
  const { t } = useTranslation()
  // useFetchUser()
  const userData = useSelector((state) => state.user.user); 

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
        id_number: userData?.id_number || "", // Initialize id_number
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
        password: "", // Keep password field empty for security reasons
        profile_image: "",
      });
    }
  }, [userData]);

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
        setModal(true) // Show modal on success
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
          id_number: "", // Reset id_number error
          password: "",
          profile_image: "",
        })
        setModal(true) // Show modal on success
      }
    } catch (err) {
      for (const [key, value] of Object.entries(err.response.data)) {
        setProfileError({ ...profileError, [key]: value[0] })
        toast.error(value[0])
      }
    }
  }

  useEffect(() => {
    const fetchDepartments = async () => {
      let departmentsArray = []
      try {
        const res = await getDeps()
        departmentsArray = [...departmentsArray, ...res.data.departments]
      } catch (err) {
        console.error(err)
      } finally {
        setDepartments(departmentsArray)
      }
    }

    const fetchPurchaseDepartments = async () => {
      try {
        const res = await getPurchaseDepartments()
        setDepartments(prev => [...prev, ...res.data.departments])
      } catch (err) {
        console.error(err)
      }
    }

    fetchDepartments()
    fetchPurchaseDepartments()
  }, [])

  const toggleModal = () => {
    setModal(!modal) // Toggle modal visibility
  }

  return (
    <div className="profile-dashboard-container">
      <div className="profile-main-content">
        <div className="profile">
          <main className="profile-content">
            <div className="profile grid grid-cols-1 lg:grid-cols-2 gap-12">
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
                      />
                      <p className="error-text">{profileError?.sur_name}</p>
                    </div>
                  </div>

                  <div className="form-row">
                    <div className="profile-form-wrapper">
                      <label>{t("პოზიცია")}</label>
                      <input
                        type="text"
                        name="position"
                        onChange={handleChangeProfile}
                        value={profileForm.position}
                      />
                      <p className="error-text">{profileError?.position}</p>
                    </div>

                    <div className="profile-form-wrapper">
                      <label>{t("დეპარტამენტი")}</label>
                      <select
                        name="department_id"
                        onChange={handleChangeProfile}
                      >
                        {departments.map(dep => (
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

                  <div className="form-row">
                    <div className="profile-form-wrapper">
                      <label>{t("ლოკაცია")}</label>
                      <input
                        type="text"
                        name="location"
                        onChange={handleChangeProfile}
                        value={profileForm.location}
                      />
                      <p className="error-text">{profileError?.location}</p>
                    </div>

                    <div className="profile-form-wrapper">
                      <label>{t("სამსახურის დაწყების თარიღი")}</label>
                      <input
                        type="date"
                        name="working_start_date"
                        onChange={handleChangeProfile}
                        value={profileForm.working_start_date}
                      />
                      <p className="error-text">
                        {profileError?.working_start_date}
                      </p>
                    </div>
                  </div>

                  <div className="form-row">
                    <div className="profile-form-wrapper">
                      <label>{t("დაბადების თარიღი")}</label>
                      <input
                        type="date"
                        name="date_of_birth"
                        onChange={handleChangeProfile}
                        value={profileForm.date_of_birth}
                      />
                      <p className="error-text">
                        {profileError?.date_of_birth}
                      </p>
                    </div>

                    <div className="profile-form-wrapper">
                      <label>{t("Email")}</label>
                      <input
                        type="email"
                        name="email"
                        onChange={handleChangeProfile}
                        value={profileForm.email}
                      />
                      <p className="error-text">{profileError?.email}</p>
                    </div>
                  </div>

                  <div className="form-row">
                    <div className="profile-form-wrapper">
                      <label>{t("მობილურის ნომერი")}</label>
                      <input
                        type="text"
                        name="mobile_number"
                        onChange={handleChangeProfile}
                        value={profileForm.mobile_number}
                      />
                      <p className="error-text">
                        {profileError?.mobile_number}
                      </p>
                    </div>
                    <div className="profile-form-wrapper">
                      <label>{t("პირადი ნომერი")}</label>
                      <input
                        type="text"
                        name="id_number"
                        onChange={handleChangeProfile}
                        value={profileForm.id_number}
                      />
                      <p className="error-text">{profileError?.id_number}</p>
                    </div>
                  </div>

                  <div className="form-row">
                    <div className="profile-form-wrapper">
                      <label>{t("პროფილის სურათი")}</label>
                      <input
                        type="file"
                        name="profile_image"
                        onChange={e => {
                          const file = e.target.files[0]
                          setProfileForm({
                            ...profileForm,
                            profile_image: file,
                          })
                        }}
                      />
                      <p className="error-text">
                        {profileError?.profile_image}
                      </p>
                    </div>
                  </div>

                  <button className="save-button">{t("შენახვა")}</button>
                </form>
              </div>

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
                      />
                      <p className="error-text">{passError?.old_password}</p>
                    </div>

                    <div className="profile-form-wrapper">
                      <label>{t("ახალი პაროლი")}</label>
                      <input
                        type="password"
                        name="password"
                        onChange={handleChangePass}
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
                      />
                      <p className="error-text">
                        {passError?.confirm_password}
                      </p>
                    </div>
                  </div>

                  <button className="save-button">{t("შეცვლა")}</button>
                </form>
              </div>
            </div>
          </main>
        </div>
      </div>

      {/* Modal for Success Message */}
      <Modal isOpen={modal} toggle={toggleModal}>
        <ModalHeader toggle={toggleModal}>{t("პროფილის განახლება")}</ModalHeader>
        <ModalBody>{t("პროფილი წარმატებით განახლდა")}</ModalBody>
        <ModalFooter>
          <button className="save-button" onClick={toggleModal}>
            {t("დახურვა")}
          </button>
        </ModalFooter>
      </Modal>
    </div>
  )
}

export default ProfilePage
