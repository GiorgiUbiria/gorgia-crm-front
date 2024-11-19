import React from 'react';
import { Link } from 'react-router-dom'
import Edit from '../../assets/images/profile-edit.svg'
import { useSelector } from 'react-redux'

import './index.css'
import { useTranslation } from 'react-i18next'

export default function Profile() {
    const { t } = useTranslation()
    const userData = useSelector((state) => state.user.data)

    return <div className='profile-component'>
        <div className='bg-white mt-16 rounded-3xl p-4 relative border-[3px] border-[#105D8D] max-h-[95vh] hide-scrollbar overflow-y-auto'>
            <Link to="/profile"><img src={Edit} alt="edit" className='absolute right-4'/></Link>
            <h1 className='text-xl font-bold' >{t("main_info")}</h1>
            <form className='profile-form'>
            <div className='profile-form-wrapper'>
                <label>{t("position")}</label>
                <input type="text" name="position" disabled value={userData?.position} />
            </div> 

            <div className='profile-form-wrapper'>
                <label>{t("department")}</label>
                <input type="text" name="department" value={userData?.department?.name} disabled/>
            </div>
          

            <div className='profile-form-wrapper'>
                <label>{t("location")}</label>
                <input type="text" name="location" value={userData?.location} disabled/>
            </div>
           
            <div className='profile-form-wrapper'>
                <label>{t("work_start_date")}</label>
                <input type="date" name="start_date" value={userData?.working_start_date} disabled />
            </div>
            

            <div className='profile-form-wrapper'>
                <label>{t("birth_date")}</label>
                <input type="date" name="date_of_birth" value={userData?.date_of_birth} disabled/>    
            </div>
            
            <h1 className='text-xl font-bold mt-4' >{t("contact_info")}</h1>

            <div className='profile-form-wrapper'>
                <label>{t("email")}</label>
                <input type="email" name="email" value={userData?.email} disabled/>
            </div>
          
            <div className='profile-form-wrapper'>
                <label>{t("mobile_number")}</label>
                <input type="text" name="mobile" value={userData?.mobile_number} disabled/>    
            </div>
          </form>
        </div>
    </div>
}