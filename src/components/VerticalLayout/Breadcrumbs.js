import React from "react"
import { Link, useLocation } from "react-router-dom"
import { ChevronRightIcon, HomeIcon } from "@heroicons/react/24/outline"
import { getMenuConfig } from "./menuConfig"
import { useTranslation } from "react-i18next"
import { useSelector } from "react-redux"

const findBreadcrumbPath = (items, targetPath, currentPath = [], result = []) => {
  for (const item of items) {
    const newPath = [...currentPath, item]
    
    // Check if this item's path matches
    if (item.to === targetPath) {
      result.push(...newPath)
      return true
    }

    // Check if this is a parent path of the target
    if (item.to && targetPath.startsWith(item.to + '/')) {
      const remainingPath = targetPath.slice(item.to.length)
      // Handle admin dashboard
      if (targetPath === '/admin/dashboard') {
        result.push(...newPath)
        result.push({
          label: 'მთავარი',
          to: targetPath
        })
        return true
      }
      // Handle other special paths
      if (remainingPath === '/approve' || remainingPath === '/archive' || remainingPath === '/my-requests') {
        result.push(...newPath)
        result.push({
          label: remainingPath === '/approve' ? 'ვიზირება' :
                 remainingPath === '/archive' ? 'არქივი' : 
                 'გაგზავნილი',
          to: targetPath
        })
        return true
      }
    }

    // Check submenu if exists
    if (item.submenu) {
      if (findBreadcrumbPath(item.submenu, targetPath, newPath, result)) {
        return true
      }
    }
  }
  return false
}

const getBreadcrumbItems = (path, t, user) => {
  const menuItems = getMenuConfig(t, user)
  const result = []

  // Special case for daily results pages
  if (path === '/tools/daily-results') {
    return [{
      label: t('დეპარტამენტის დღის შედეგები'),
      path: path
    }]
  }
  if (path === '/tools/inner-daily-results') {
    return [{
      label: t('დღის შედეგები'),
      path: path
    }]
  }

  // Special case for admin pages
  if (path === '/admin/dashboard') {
    return [
      {
        label: t('სამართავი პანელი'),
        path: '/admin/dashboard'
      },
      {
        label: t('მთავარი'),
        path: '/admin/dashboard'
      }
    ]
  }

  findBreadcrumbPath(menuItems, path, [], result)
  
  // If no breadcrumbs found but we're on an admin page
  if (result.length === 0 && path.startsWith('/admin/')) {
    return [
      {
        label: t('სამართავი პანელი'),
        path: '/admin/dashboard'
      },
      {
        label: path.includes('archive') ? t('არქივი') :
               path.includes('approvals') ? t('ვიზირება') :
               t('მთავარი'),
        path: path
      }
    ]
  }

  return result.map(item => ({
    label: item.label,
    path: item.to || '#',
    icon: item.icon
  }))
}

const Breadcrumbs = () => {
  const location = useLocation()
  const { t } = useTranslation()
  const user = useSelector(state => state.Profile.user)
  const breadcrumbs = getBreadcrumbItems(location.pathname, t, user)

  if (breadcrumbs.length === 0) {
    return null
  }

  return (
    <nav className="flex" aria-label="Breadcrumb">
      <ol className="inline-flex items-center space-x-1 md:space-x-3">
        <li className="inline-flex items-center">
          <Link
            to="/"
            className="inline-flex items-center text-sm font-medium text-gray-700 hover:text-blue-600"
          >
            <HomeIcon className="w-4 h-4 mr-2" />
            {t("მთავარი")}
          </Link>
        </li>
        {breadcrumbs.map((item, index) => (
          <li key={index}>
            <div className="flex items-center">
              <ChevronRightIcon className="w-4 h-4 text-gray-400" />
              {item.path !== '#' ? (
                <Link
                  to={item.path}
                  className="ml-1 text-sm font-medium text-gray-700 hover:text-blue-600 md:ml-2"
                >
                  {item.label}
                </Link>
              ) : (
                <span className="ml-1 text-sm font-medium text-gray-500 md:ml-2">
                  {item.label}
                </span>
              )}
            </div>
          </li>
        ))}
      </ol>
    </nav>
  )
}

export default Breadcrumbs
