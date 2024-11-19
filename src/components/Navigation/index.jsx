import React from 'react';
import { Link } from 'react-router-dom'
import './index.css'
import { useTranslation } from 'react-i18next'

export default function Navigation({ link }) {
    const { t } = useTranslation();
    
    return (
        <div className='bg-white flex items-center justify-between py-3 border-[3px] border-[#105D8D] px-6 rounded-3xl mt-8 w-[100%] navigation'>
            <Link to="#" className={`text-lg text-[#018AD1] font-medium animate-link `}>{t("notes")}</Link>
            <Link to="/vacation" className={`text-lg ${link == '/vacation' ? 'text-[#105D8D] font-bold' : 'text-[#018AD1] animate-link font-medium'} `}>{t("vacation")}</Link>
            <Link to="/business" className={`text-lg ${link == '/business' ? 'text-[#105D8D] font-bold' : 'text-[#018AD1] animate-link font-medium'} `}>{t('business_trip')}</Link>
            <Link to="/procurement" className={`text-lg ${link == '/procurement' ? 'text-[#105D8D] font-bold' : 'text-[#018AD1] animate-link font-medium'} `}>{t("internal_purchasment")}</Link>
            <Link to="#" className='text-lg font-medium animate-link text-[#018AD1]'>{t("my_discount")}</Link>
        </div>
    )
}