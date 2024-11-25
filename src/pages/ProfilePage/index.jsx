import React, { useEffect, useState } from "react"
import { toast } from "react-toastify"
import { changePassword, updateUser } from "../../services/user"
import { getDepartments } from "../../services/admin/department"
import { useTranslation } from "react-i18next"
import { Modal, ModalHeader, ModalBody, ModalFooter, Button } from "reactstrap"
import { useSelector } from "react-redux"
import {
  FiCamera,
  FiUser,
  FiMail,
  FiPhone,
  FiCalendar,
  FiMapPin,
  FiLock,
} from "react-icons/fi"
import styled from "@emotion/styled"
import "./index.css"
import NoAvatarIcon from "../../assets/images/no-avatar.jpg"

// Updated primary color
const PRIMARY_COLOR = "#105D8D"

const Container = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem;
  padding-top: 80px;
  background: var(--bg-primary);
  min-height: 100vh;
`

const PageHeader = styled.header`
  background: linear-gradient(135deg, var(--bg-secondary) 0%, #2a3f54 100%);
  border-radius: 10px; /* Reduced from 20px to 10px */
  padding: 2rem; /* Reduced padding for a sharper look */
  margin-bottom: 2rem; /* Adjusted margin */
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
`

const HeaderContent = styled.div`
  display: flex;
  align-items: center;
  gap: 1.5rem; /* Reduced gap for a more compact layout */
  max-width: 1200px;
  width: 100%;
`

const ImageSection = styled.div`
  position: relative;
  margin-right: 15px; /* Reduced margin */
`

const ProfileImageWrapper = styled.div`
  position: relative;
  width: 100px; /* Reduced size for a sharper appearance */
  height: 100px;
  border-radius: 10px; /* Reduced border-radius for less rounding */
  overflow: hidden;
  border: 3px solid rgba(255, 255, 255, 0.2); /* Adjusted border size */
  transition: transform 0.3s ease;

  &:hover {
    transform: scale(1.03); /* Slight scale for subtle hover effect */
  }
`

const ProfileImage = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
`

const UploadOverlay = styled.label`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.3);
  display: flex;
  align-items: center;
  justify-content: center;
  opacity: 0;
  transition: opacity 0.3s ease;
  cursor: pointer;

  &:hover {
    opacity: 1;
  }
`

const UserInfo = styled.div`
  display: flex;
  flex-direction: column;
`

const UserName = styled.h1`
  font-size: 24px; /* Adjusted font size */
  font-weight: 600;
  color: #fff;
  margin: 0;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
`

const UserRole = styled.p`
  display: flex;
  gap: 8px; /* Reduced gap */
  margin-top: 6px; /* Reduced margin */
`

const Badge = styled.span`
  padding: 5px 10px; /* Reduced padding */
  border-radius: 12px; /* Reduced border-radius */
  font-size: 13px; /* Adjusted font size */
  font-weight: 500;
  transition: transform 0.2s ease;

  &:hover {
    transform: translateY(-1px);
  }
`

const RoleBadge = styled(Badge)`
  background-color: #4caf50;
  color: white;
`

const DepartmentBadge = styled(Badge)`
  background-color: #2196f3;
  color: white;
`

const ContentGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  gap: 1.5rem; /* Reduced gap */
  padding: 15px; /* Reduced padding */

  @media (min-width: 1024px) {
    grid-template-columns: 3fr 2fr;
    > * {
      height: 100%;
    }
  }
`

const Section = styled.div`
  background-color: white;
  border-radius: 8px; /* Reduced border-radius */
  padding: 1.5rem; /* Reduced padding */
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.06);
  transition: transform 0.2s ease;
  display: flex;
  flex-direction: column;

  &:hover {
    transform: translateY(-1px); /* Subtle hover effect */
  }

  form {
    display: flex;
    flex-direction: column;
    flex: 1;
    justify-content: space-between;
  }
`

const SectionTitle = styled.h2`
  display: flex;
  align-items: center;
  gap: 10px; /* Reduced gap */
  font-size: 18px; /* Adjusted font size */
  font-weight: 600;
  color: #2c3e50;
  margin-bottom: 1rem; /* Reduced margin */
  padding-bottom: 0.8rem; /* Reduced padding */
  border-bottom: 1px solid #f0f0f0; /* Thinner border */
`

const FormGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(
    auto-fit,
    minmax(200px, 1fr)
  ); /* Adjusted min-width */
  gap: 1rem; /* Reduced gap */
  margin-bottom: 1rem; /* Reduced margin */
`

const PasswordFormGrid = styled(FormGrid)`
  @media (min-width: 1024px) {
    grid-template-columns: 1fr;
  }
`

const FormField = styled.div`
  display: flex;
  flex-direction: column;
  gap: 6px; /* Reduced gap */
  margin-bottom: 0.8rem; /* Reduced margin */
`

const Label = styled.label`
  font-weight: 500;
  color: #4a5568;
`

const Input = styled.input`
  padding: 10px; /* Reduced padding */
  border: 1px solid #ccc; /* Updated border color */
  border-radius: 4px; /* Reduced border-radius */
  font-size: 14px;
  transition: all 0.2s ease;

  &:focus {
    border-color: ${PRIMARY_COLOR};
    box-shadow: 0 0 0 2px rgba(16, 93, 141, 0.2); /* Updated box-shadow color */
    outline: none;
  }
`

const Select = styled.select`
  padding: 10px; /* Reduced padding */
  border: 1px solid #ccc; /* Updated border color */
  border-radius: 4px; /* Reduced border-radius */
  font-size: 14px;
  background-color: white;
  cursor: pointer;
  transition: all 0.2s ease;

  &:focus {
    border-color: ${PRIMARY_COLOR};
    box-shadow: 0 0 0 2px rgba(16, 93, 141, 0.2); /* Updated box-shadow color */
    outline: none;
  }
`

const ErrorText = styled.p`
  color: #dc3545;
  font-size: 13px; /* Adjusted font size */
`

const ActionButton = styled.button`
  padding: 10px 20px; /* Reduced padding */
  background-color: ${PRIMARY_COLOR};
  color: white;
  border: none;
  border-radius: 4px; /* Reduced border-radius */
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    background-color: #0f4a6a; /* Darker shade for hover */
    transform: translateY(-1px);
  }

  &:active {
    transform: translateY(0);
  }
`

const ButtonContainer = styled.div`
  margin-top: 0.8rem; /* Reduced margin */
  padding-top: 0.8rem; /* Reduced padding */
`

const ProfilePage = () => {
  const { t } = useTranslation()
  const userData = useSelector(state => state.user.user)

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

  const profileImageSrc = userData?.profile_image
    ? `${process.env.REACT_APP_BASE_URL}/${userData.profile_image}`
    : NoAvatarIcon

  return (
    <Container>
      <PageHeader>
        <HeaderContent>
          <ImageSection>
            <ProfileImageWrapper>
              <ProfileImage
                src={profileImageSrc}
                alt={`${userData?.name} ${userData?.sur_name}`}
              />
              <UploadOverlay htmlFor="profile-image-upload">
                <FiCamera size={16} />
              </UploadOverlay>
              <input
                id="profile-image-upload"
                type="file"
                hidden
                accept="image/*"
                onChange={e => {
                  setProfileForm({
                    ...profileForm,
                    profile_image: e.target.files[0],
                  })
                }}
              />
            </ProfileImageWrapper>
          </ImageSection>
          <UserInfo>
            <UserName>
              {userData?.name} {userData?.sur_name}
            </UserName>
            <UserRole>
              <RoleBadge>{userData?.position}</RoleBadge>
              <DepartmentBadge>{userData?.department?.name}</DepartmentBadge>
            </UserRole>
          </UserInfo>
        </HeaderContent>
      </PageHeader>

      <ContentGrid>
        <Section>
          <SectionTitle>
            <FiUser size={20} />
            <span>{t("პირადი ინფორმაცია")}</span>
          </SectionTitle>
          <form onSubmit={submitProfileForm}>
            <FormGrid>
              <FormField>
                <Label>{t("სახელი")}</Label>
                <Input
                  type="text"
                  name="name"
                  value={profileForm.name}
                  onChange={handleChangeProfile}
                />
                {profileError?.name && (
                  <ErrorText>{profileError.name}</ErrorText>
                )}
              </FormField>

              <FormField>
                <Label>{t("გვარი")}</Label>
                <Input
                  type="text"
                  name="sur_name"
                  value={profileForm.sur_name}
                  onChange={handleChangeProfile}
                />
                {profileError?.sur_name && (
                  <ErrorText>{profileError.sur_name}</ErrorText>
                )}
              </FormField>

              <FormField>
                <Label>{t("დეპარტამენტი")}</Label>
                <Select
                  name="department_id"
                  value={profileForm.department_id}
                  onChange={handleChangeProfile}
                >
                  {departments.map(dep => (
                    <option key={dep.id} value={dep.id}>
                      {dep?.name}
                    </option>
                  ))}
                </Select>
              </FormField>

              <FormField>
                <Label>{t("ელ-ფოსტა")}</Label>
                <Input
                  type="email"
                  name="email"
                  value={profileForm.email}
                  onChange={handleChangeProfile}
                />
              </FormField>
            </FormGrid>

            <ButtonContainer>
              <ActionButton type="submit">{t("შენახვა")}</ActionButton>
            </ButtonContainer>
          </form>
        </Section>

        <Section>
          <SectionTitle>
            <FiLock size={20} />
            <span>{t("პაროლის შვლილება")}</span>
          </SectionTitle>
          <form onSubmit={submitPassForm}>
            <PasswordFormGrid>
              <FormField>
                <Label>{t("ძველი პაროლი")}</Label>
                <Input
                  type="password"
                  name="old_password"
                  onChange={handleChangePass}
                />
                {passError?.old_password && (
                  <ErrorText>{passError.old_password}</ErrorText>
                )}
              </FormField>

              <FormField>
                <Label>{t("ახალი პაროლი")}</Label>
                <Input
                  type="password"
                  name="password"
                  onChange={handleChangePass}
                />
                {passError?.password && (
                  <ErrorText>{passError.password}</ErrorText>
                )}
              </FormField>

              <FormField>
                <Label>{t("გაიმეორე პაროლი")}</Label>
                <Input
                  type="password"
                  name="confirm_password"
                  onChange={handleChangePass}
                />
                {passError?.confirm_password && (
                  <ErrorText>{passError.confirm_password}</ErrorText>
                )}
              </FormField>
            </PasswordFormGrid>

            <ButtonContainer>
              <ActionButton type="submit" variant="secondary">
                {t("შეცვლა")}
              </ActionButton>
            </ButtonContainer>
          </form>
        </Section>
      </ContentGrid>

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
    </Container>
  )
}

export default ProfilePage
