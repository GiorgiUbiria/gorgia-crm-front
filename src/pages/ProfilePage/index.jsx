import React, { useEffect, useState } from "react"
import { changePassword, updateUser } from "../../services/user"
import { getPublicDepartments } from "../../services/admin/department"
import { useTranslation } from "react-i18next"
import { useSelector } from "react-redux"
import { FiCamera, FiUser, FiMail, FiLock } from "react-icons/fi"
import styled from "@emotion/styled"
import { toast, ToastContainer } from "react-toastify"
import "react-toastify/dist/ReactToastify.css"
import "./index.css"
import NoAvatarIcon from "../../assets/images/no-avatar.jpg"

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
  border-radius: 10px;
  padding: 2rem;
  margin-bottom: 2rem;
  box-shadow: var(--shadow-md);
`

const HeaderContent = styled.div`
  display: flex;
  align-items: center;
  gap: 1.5rem;
  max-width: 1200px;
  width: 100%;
`

const ImageSection = styled.div`
  position: relative;
  margin-right: 15px;
`

const ProfileImageWrapper = styled.div`
  position: relative;
  width: 100px;
  height: 100px;
  border-radius: 10px;
  overflow: hidden;
  border: 3px solid rgba(255, 255, 255, 0.2);
  transition: transform 0.3s ease;

  &:hover {
    transform: scale(1.03);
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
  font-size: 24px;
  font-weight: 600;
  color: #fff;
  margin: 0;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
`

const UserRole = styled.p`
  display: flex;
  gap: 8px;
  margin-top: 6px;
`

const Badge = styled.span`
  padding: 5px 10px;
  border-radius: 12px;
  font-size: 13px;
  font-weight: 500;
  transition: transform 0.2s ease;

  &:hover {
    transform: translateY(-1px);
  }
`

const RoleBadge = styled(Badge)`
  background-color: var(--success-color);
  color: white;
`

const DepartmentBadge = styled(Badge)`
  background-color: var(--primary-color);
  color: white;
`

const ContentGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  gap: 1.5rem;
  padding: 15px;

  @media (min-width: 1024px) {
    grid-template-columns: 1fr;
    > * {
      height: 100%;
    }
  }
`

const InfoGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 1rem;
  margin-bottom: 1rem;

  @media (max-width: 1024px) {
    grid-template-columns: repeat(2, 1fr);
  }

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`

const InfoItem = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  padding: 1rem;
  background: #f8f9fa;
  border-radius: 8px;
`

const InfoLabel = styled.span`
  font-size: 0.875rem;
  color: #6c757d;
  font-weight: 500;
`

const InfoValue = styled.span`
  font-size: 1rem;
  color: #2c3e50;
  font-weight: 500;
`

const Section = styled.div`
  background-color: white;
  border-radius: 8px;
  padding: 1.5rem;
  box-shadow: var(--shadow-sm);
  transition: transform 0.2s ease;
  display: flex;
  flex-direction: column;

  &:hover {
    transform: translateY(-1px);
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
  gap: 10px;
  font-size: 18px;
  font-weight: 600;
  color: #2c3e50;
  margin-bottom: 1rem;
  padding-bottom: 0.8rem;
  border-bottom: 1px solid #f0f0f0;
`

const FormGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1rem;
  margin-bottom: 1rem;
`

const PasswordFormGrid = styled(FormGrid)`
  @media (min-width: 1024px) {
    grid-template-columns: 1fr;
  }
`

const FormField = styled.div`
  display: flex;
  flex-direction: column;
  gap: 6px;
  margin-bottom: 0.8rem;
`

const Label = styled.label`
  font-weight: 500;
  color: #4a5568;
`

const Input = styled.input`
  padding: 10px;
  border: 1px solid var(--border-color);
  border-radius: 4px;
  font-size: 14px;
  transition: all 0.2s ease;

  &:focus {
    border-color: var(--primary-color);
    box-shadow: 0 0 0 2px rgba(16, 93, 141, 0.2);
    outline: none;
  }
`

const Select = styled.select`
  padding: 10px;
  border: 1px solid var(--border-color);
  border-radius: 4px;
  font-size: 14px;
  background-color: white;
  cursor: pointer;
  transition: all 0.2s ease;

  &:focus {
    border-color: var(--primary-color);
    box-shadow: 0 0 0 2px rgba(16, 93, 141, 0.2);
    outline: none;
  }
`

const ErrorText = styled.p`
  color: var(--error-color);
  font-size: 13px;
`

const ActionButton = styled.button`
  padding: 10px 20px;
  background-color: ${props =>
    props.disabled ? "#ccc" : "var(--primary-color)"};
  color: white;
  border: none;
  border-radius: 4px;
  font-weight: 500;
  cursor: ${props => (props.disabled ? "not-allowed" : "pointer")};
  transition: all 0.2s ease;

  &:hover {
    background-color: ${props => (props.disabled ? "#ccc" : "#0f4a6a")};
    transform: ${props => (props.disabled ? "none" : "translateY(-1px)")};
  }

  &:active {
    transform: ${props => (props.disabled ? "none" : "translateY(0)")};
  }
`

const ButtonContainer = styled.div`
  margin-top: 0.8rem;
  padding-top: 0.8rem;
`

const SectionDivider = styled.div`
  height: 1px;
  background: #e9ecef;
  margin: 2rem 0;
  width: 100%;
`

const SectionDescription = styled.p`
  color: #6c757d;
  font-size: 0.875rem;
  margin-bottom: 1.5rem;
`

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
    <Container className="mb-4">
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
              <DepartmentBadge>{userData?.department?.name}</DepartmentBadge>
              {userData?.roles?.map(role => (
                <RoleBadge key={role.id}>{role.name}</RoleBadge>
              ))}
            </UserRole>
          </UserInfo>
        </HeaderContent>
      </PageHeader>

      <ContentGrid>
        <Section>
          <SectionTitle>
            <FiUser size={20} />
            <span>{t("ზოგადი ინფორმაცია")}</span>
          </SectionTitle>
          <SectionDescription>
            {t("თქვენი პროფილის ძირითადი ინფორმაცია")}
          </SectionDescription>

          <InfoGrid>
            <InfoItem>
              <InfoLabel>{t("სახელი")}</InfoLabel>
              <InfoValue>{userData?.name}</InfoValue>
            </InfoItem>
            <InfoItem>
              <InfoLabel>{t("გვარი")}</InfoLabel>
              <InfoValue>{userData?.sur_name}</InfoValue>
            </InfoItem>
            <InfoItem>
              <InfoLabel>{t("პირადი ნომერი")}</InfoLabel>
              <InfoValue>{userData?.id_number || "-"}</InfoValue>
            </InfoItem>
            <InfoItem>
              <InfoLabel>{t("დაბადების თარიღი")}</InfoLabel>
              <InfoValue>{userData?.date_of_birth || "-"}</InfoValue>
            </InfoItem>
            <InfoItem>
              <InfoLabel>{t("პოზიცია")}</InfoLabel>
              <InfoValue>{userData?.position || "-"}</InfoValue>
            </InfoItem>
            <InfoItem>
              <InfoLabel>{t("მდებარეობა")}</InfoLabel>
              <InfoValue>{userData?.location || "-"}</InfoValue>
            </InfoItem>
            <InfoItem>
              <InfoLabel>{t("დაწყების თარიღი")}</InfoLabel>
              <InfoValue>{userData?.working_start_date || "-"}</InfoValue>
            </InfoItem>
            <InfoItem>
              <InfoLabel>{t("მობილური")}</InfoLabel>
              <InfoValue>{userData?.mobile_number || "-"}</InfoValue>
            </InfoItem>
            <InfoItem>
              <InfoLabel>{t("ელ-ფოსტა")}</InfoLabel>
              <InfoValue>{userData?.email}</InfoValue>
            </InfoItem>
          </InfoGrid>
        </Section>

        <SectionDivider />

        <Section>
          <SectionTitle>
            <FiMail size={20} />
            <span>{t("პროფილის განახლება")}</span>
          </SectionTitle>
          <SectionDescription>
            {t("განაახლეთ თქვენი პროფილის ინფორმაცია")}
          </SectionDescription>

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
                <Label>{t("ელ-ფოსტა")}</Label>
                <Input
                  type="email"
                  name="email"
                  value={profileForm.email}
                  onChange={handleChangeProfile}
                />
                {profileError?.email && (
                  <ErrorText>{profileError.email}</ErrorText>
                )}
              </FormField>

              <FormField>
                <Label>{t("მობილური")}</Label>
                <Input
                  type="text"
                  name="mobile_number"
                  value={profileForm.mobile_number}
                  onChange={handleChangeProfile}
                />
                {profileError?.mobile_number && (
                  <ErrorText>{profileError.mobile_number}</ErrorText>
                )}
              </FormField>
            </FormGrid>

            <ButtonContainer>
              <ActionButton type="submit" disabled={!isProfileFormChanged()}>
                {t("შენახვა")}
              </ActionButton>
            </ButtonContainer>
          </form>
        </Section>

        <SectionDivider />

        <Section>
          <SectionTitle>
            <FiLock size={20} />
            <span>{t("პაროლის შეცვლა")}</span>
          </SectionTitle>
          <SectionDescription>
            {t("უსაფრთხოების მიზნით, შეცვალეთ თქვენი პაროლი პერიოდულად")}
          </SectionDescription>

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
              <ActionButton type="submit">{t("შეცვლა")}</ActionButton>
            </ButtonContainer>
          </form>
        </Section>
      </ContentGrid>
      <ToastContainer />
    </Container>
  )
}

export default ProfilePage
