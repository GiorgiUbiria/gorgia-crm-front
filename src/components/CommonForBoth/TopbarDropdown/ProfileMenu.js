import React, { useState } from "react"
import {
  Dropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem,
} from "reactstrap"
import useAuth from "hooks/useAuth"

import { Link } from "react-router-dom"

import NoAvatarIcon from "../../../assets/images/no-avatar.jpg"

const ProfileMenu = () => {
  const [menu, setMenu] = useState(false)
  const { user } = useAuth()

  const profileImageSrc = user?.profile_image
    ? `${process.env.REACT_APP_BASE_URL}/${user.profile_image}`
    : NoAvatarIcon

  return (
    <React.Fragment>
      <Dropdown
        isOpen={menu}
        toggle={() => setMenu(!menu)}
        className="d-inline-block"
      >
        <DropdownToggle
          className="flex items-center justify-center h-16 px-4 hover:bg-blue-100 dark:hover:bg-gray-800 transition-colors duration-200"
          id="page-header-user-dropdown"
          tag="button"
        >
          <img
            className="w-8 h-8 rounded-full object-cover"
            src={profileImageSrc}
            alt="Header Avatar"
          />
          <span className="hidden xl:inline-block ml-2 mr-1 text-gray-700 dark:text-gray-200">
            {user?.name}
          </span>
          <i className="mdi mdi-chevron-down hidden xl:inline-block text-gray-600 dark:text-gray-400" />
        </DropdownToggle>
        <DropdownMenu className="!bg-white dark:!bg-gray-900 border border-gray-200 dark:border-gray-700 !shadow-lg rounded-lg mt-1">
          <DropdownItem
            tag="a"
            href="/profile"
            className="!bg-transparent hover:!bg-gray-100 dark:hover:!bg-gray-800 text-gray-700 dark:text-gray-200 transition-colors duration-200"
          >
            <i className="bx bx-user font-size-16 align-middle me-1" />
            პროფილი
          </DropdownItem>
          <div className="border-t border-gray-200 dark:border-gray-700 my-1" />
          <Link
            to="/auth/logout"
            className="block px-4 py-2 !bg-transparent hover:!bg-gray-100 dark:hover:!bg-gray-800 text-red-600 dark:text-red-400 transition-colors duration-200"
          >
            <i className="bx bx-power-off font-size-16 align-middle me-1" />
            <span>გასვლა</span>
          </Link>
        </DropdownMenu>
      </Dropdown>
    </React.Fragment>
  )
}

export default ProfileMenu
