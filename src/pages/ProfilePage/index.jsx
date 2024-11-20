import React, { useEffect, useState } from "react"
import { toast } from "react-toastify"
import { changePassword, updateUser } from "../../services/user"
import { getDepartments } from "../../services/admin/department"
import { useTranslation } from "react-i18next"
import { Modal, ModalHeader, ModalBody, ModalFooter, Button } from "reactstrap"
import { useSelector } from "react-redux"
import { FiCamera, FiUser, FiMail, FiPhone, FiCalendar, FiMapPin, FiLock } from 'react-icons/fi'
import styled from '@emotion/styled'
import "./index.css"

const Container = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem;
  padding-top: 80px;
  background: var(--bg-primary);
  min-height: 100vh;
`;

const PageHeader = styled.header`
  background: linear-gradient(135deg, var(--bg-secondary) 0%, #2a3f54 100%);
  border-radius: 20px;
  padding: 2.5rem;
  margin-bottom: 2.5rem;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
`;

const HeaderContent = styled.div`
  display: flex;
  align-items: center;
  gap: 2rem;
  max-width: 1200px;
  width: 100%;
`;

const ImageSection = styled.div`
  position: relative;
  margin-right: 20px;
`;

const ProfileImageWrapper = styled.div`
  position: relative;
  width: 120px;
  height: 120px;
  border-radius: 50%;
  overflow: hidden;
  border: 4px solid rgba(255, 255, 255, 0.2);
  transition: transform 0.3s ease;

  &:hover {
    transform: scale(1.05);
  }
`;

const ProfileImage = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
`;

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
`;

const UserInfo = styled.div`
  display: flex;
  flex-direction: column;
`;

const UserName = styled.h1`
  font-size: 28px;
  font-weight: 600;
  color: #fff;
  margin: 0;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
`;

const UserRole = styled.p`
  display: flex;
  gap: 10px;
  margin-top: 8px;
`;

const Badge = styled.span`
  padding: 6px 12px;
  border-radius: 20px;
  font-size: 14px;
  font-weight: 500;
  transition: transform 0.2s ease;

  &:hover {
    transform: translateY(-1px);
  }
`;

const RoleBadge = styled(Badge)`
  background-color: #4CAF50;
  color: white;
`;

const DepartmentBadge = styled(Badge)`
  background-color: #2196F3;
  color: white;
`;

const ContentGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  gap: 2rem;
  padding: 20px;

  @media (min-width: 1024px) {
    grid-template-columns: 3fr 2fr;
    > * {
      height: 100%;
    }
  }
`;

const Section = styled.div`
  background-color: white;
  border-radius: 16px;
  padding: 2rem;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.06);
  transition: transform 0.2s ease;
  display: flex;
  flex-direction: column;

  &:hover {
    transform: translateY(-2px);
  }

  form {
    display: flex;
    flex-direction: column;
    flex: 1;
    justify-content: space-between;
  }
`;

const SectionTitle = styled.h2`
  display: flex;
  align-items: center;
  gap: 12px;
  font-size: 20px;
  font-weight: 600;
  color: #2c3e50;
  margin-bottom: 1.5rem;
  padding-bottom: 1rem;
  border-bottom: 2px solid #f0f0f0;
`;

const FormGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 1.5rem;
  margin-bottom: 1.5rem;
`;

const PasswordFormGrid = styled(FormGrid)`
  @media (min-width: 1024px) {
    grid-template-columns: 1fr;
  }
`;

const FormField = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
  margin-bottom: 1rem;
`;

const Label = styled.label`
  font-weight: 500;
  color: #4a5568;
`;

const Input = styled.input`
  padding: 12px;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  font-size: 14px;
  transition: all 0.2s ease;

  &:focus {
    border-color: #4299e1;
    box-shadow: 0 0 0 3px rgba(66, 153, 225, 0.1);
    outline: none;
  }
`;

const Select = styled.select`
  padding: 12px;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  font-size: 14px;
  background-color: white;
  cursor: pointer;
  transition: all 0.2s ease;

  &:focus {
    border-color: #4299e1;
    box-shadow: 0 0 0 3px rgba(66, 153, 225, 0.1);
    outline: none;
  }
`;

const ErrorText = styled.p`
  color: #dc3545;
  font-size: 14px;
`;

const ActionButton = styled.button`
  padding: 12px 24px;
  background-color: #4299e1;
  color: white;
  border: none;
  border-radius: 8px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    background-color: #3182ce;
    transform: translateY(-1px);
  }

  &:active {
    transform: translateY(0);
  }
`;

const ButtonContainer = styled.div`
  margin-top: auto;
  padding-top: 1rem;
`;

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
    <Container>
      <PageHeader>
        <HeaderContent>
          <ImageSection>
            <ProfileImageWrapper>
              <ProfileImage 
                src={userData?.profile_image || '/default-avatar.png'} 
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
                onChange={(e) => {
                  setProfileForm({
                    ...profileForm,
                    profile_image: e.target.files[0]
                  })
                }}
              />
            </ProfileImageWrapper>
          </ImageSection>
          <UserInfo>
            <UserName>{userData?.name} {userData?.sur_name}</UserName>
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
                {profileError?.name && <ErrorText>{profileError.name}</ErrorText>}
              </FormField>

              <FormField>
                <Label>{t("გვარი")}</Label>
                <Input
                  type="text"
                  name="sur_name"
                  value={profileForm.sur_name}
                  onChange={handleChangeProfile}
                />
                {profileError?.sur_name && <ErrorText>{profileError.sur_name}</ErrorText>}
              </FormField>

              <FormField>
                <Label>{t("დეპარტამენტი")}</Label>
                <Select
                  name="department_id"
                  value={profileForm.department_id}
                  onChange={handleChangeProfile}
                >
                  {departments.map((dep) => (
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
              <ActionButton type="submit">
                {t("შენახვა")}
              </ActionButton>
            </ButtonContainer>
          </form>
        </Section>

        <Section>
          <SectionTitle>
            <FiLock size={20} />
            <span>{t("პაროლის შეცვლა")}</span>
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
                {passError?.old_password && <ErrorText>{passError.old_password}</ErrorText>}
              </FormField>

              <FormField>
                <Label>{t("ახალი პაროლი")}</Label>
                <Input
                  type="password"
                  name="password"
                  onChange={handleChangePass}
                />
                {passError?.password && <ErrorText>{passError.password}</ErrorText>}
              </FormField>

              <FormField>
                <Label>{t("გაიმეორე პაროლი")}</Label>
                <Input
                  type="password"
                  name="confirm_password"
                  onChange={handleChangePass}
                />
                {passError?.confirm_password && <ErrorText>{passError.confirm_password}</ErrorText>}
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
