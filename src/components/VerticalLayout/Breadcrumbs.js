import React from "react"
import { Link, useLocation } from "react-router-dom"
import { ChevronRightIcon, HomeIcon } from "@heroicons/react/24/outline"
import { getMenuConfig } from "./menuConfig"
import useAuth from "hooks/useAuth"

const AGREEMENT_TYPES = {
  purchase: "ნასყიდობის ხელშეკრულება",
  marketing: "მარკეტინგული ხელშეკრულება",
  local: "ადგილობრივი ხელშეკრულება",
  delivery: "მიწოდების ხელშეკრულება",
  service: "მომსახურების ხელშეკრულება",
}

const findBreadcrumbPath = (
  items,
  targetPath,
  currentPath = [],
  result = []
) => {
  for (const item of items) {
    const newPath = [...currentPath, item]

    if (item.to === targetPath) {
      result.push(...newPath)
      return true
    }

    if (item.to && targetPath.startsWith(item.to + "/")) {
      const remainingPath = targetPath.slice(item.to.length)

      if (targetPath === "/admin/dashboard") {
        result.push(...newPath)
        result.push({
          label: "მთავარი",
          to: targetPath,
        })
        return true
      }

      if (targetPath.startsWith("/hr/documents/")) {
        const hrPath = targetPath.replace("/hr/documents/", "")
        if (
          hrPath === "approve" ||
          hrPath === "archive" ||
          hrPath === "my-requests"
        ) {
          result.push(...newPath)
          result.push({
            label:
              hrPath === "approve"
                ? "ვიზირება"
                : hrPath === "archive"
                ? "არქივი"
                : "ჩემი მოთხოვნები",
            to: targetPath,
          })
          return true
        }
      }

      if (targetPath.startsWith("/legal/contracts/")) {
        const parts = targetPath.split("/")
        const agreementType = parts[3]
        const action = parts[4]

        if (
          AGREEMENT_TYPES[agreementType] &&
          (action === "approve" ||
            action === "archive" ||
            action === "my-requests")
        ) {
          result.push(...newPath)
          result.push({
            label: AGREEMENT_TYPES[agreementType],
            to: `/legal/contracts/${agreementType}`,
          })
          result.push({
            label:
              action === "approve"
                ? "ვიზირება"
                : action === "archive"
                ? "არქივი"
                : "გაგზავნილი",
            to: targetPath,
          })
          return true
        }
      }

      if (
        remainingPath === "/approve" ||
        remainingPath === "/archive" ||
        remainingPath === "/my-requests"
      ) {
        result.push(...newPath)
        result.push({
          label:
            remainingPath === "/approve"
              ? "ვიზირება"
              : remainingPath === "/archive"
              ? "არქივი"
              : "გაგზავნილი",
          to: targetPath,
        })
        return true
      }
    }

    if (item.submenu) {
      if (findBreadcrumbPath(item.submenu, targetPath, newPath, result)) {
        return true
      }
    }
  }
  return false
}

const getBreadcrumbItems = (path, user) => {
  const menuItems = getMenuConfig(user)
  const result = []

  if (path === "/tools/daily-results") {
    return [
      {
        label: "დეპარტამენტის დღის შედეგები",
        path: path,
      },
    ]
  }
  if (path === "/tools/inner-daily-results") {
    return [
      {
        label: "დღის შედეგები",
        path: path,
      },
    ]
  }

  if (path === "/admin/dashboard") {
    return [
      {
        label: "სამართავი პანელი",
        path: "/admin/dashboard",
      },
      {
        label: "მთავარი",
        path: "/admin/dashboard",
      },
    ]
  }

  if (path.startsWith("/hr/documents/")) {
    const section = path.split("/").pop()
    return [
      {
        label: "HR დოკუმენტები",
        path: "/hr/documents",
      },
      {
        label:
          section === "approve"
            ? "ვიზირება"
            : section === "archive"
            ? "არქივი"
            : section === "my-requests"
            ? "ჩემი მოთხოვნები"
            : section === "new"
            ? "ახალი მოთხოვნა"
            : section,
        path: path,
      },
    ]
  }

  if (path.startsWith("/legal/contracts/")) {
    const parts = path.split("/")
    const agreementType = parts[3]
    const action = parts[4]

    if (AGREEMENT_TYPES[agreementType]) {
      const breadcrumbs = [
        {
          label: "ხელშეკრულებები",
          path: "/legal/contracts",
        },
        {
          label: AGREEMENT_TYPES[agreementType],
          path: `/legal/contracts/${agreementType}`,
        },
      ]

      if (action) {
        breadcrumbs.push({
          label:
            action === "approve"
              ? "ვიზირება"
              : action === "archive"
              ? "არქივი"
              : action === "my-requests"
              ? "გაგზავნილი"
              : action === "new"
              ? "ახალი მოთხოვნა"
              : action,
          path: path,
        })
      }

      return breadcrumbs
    }
  }

  if (path.startsWith("/applications/")) {
    const parts = path.split("/")
    const applicationType = parts[2]
    const action = parts[3]

    const applicationLabels = {
      purchases: "შიდა შესყიდვები",
      "business-trip": "მივლინება",
      vacation: "შვებულება",
    }

    if (applicationLabels[applicationType]) {
      const breadcrumbs = [
        {
          label: "განცხადებები",
          path: "/applications",
        },
        {
          label: applicationLabels[applicationType],
          path: `/applications/${applicationType}`,
        },
      ]

      if (action) {
        breadcrumbs.push({
          label:
            action === "approve"
              ? "ვიზირება"
              : action === "archive"
              ? "არქივი"
              : action === "my-requests"
              ? "გაგზავნილი"
              : action === "new"
              ? "დამატება"
              : t(action),
          path: path,
        })
      }

      return breadcrumbs
    }
  }

  findBreadcrumbPath(menuItems, path, [], result)

  if (result.length === 0 && path.startsWith("/admin/")) {
    return [
      {
        label: "სამართავი პანელი",
        path: "/admin/dashboard",
      },
      {
        label: path.includes("archive")
          ? "არქივი"
          : path.includes("approvals")
          ? "ვიზირება"
          : "მთავარი",
        path: path,
      },
    ]
  }

  return result.map(item => ({
    label: item.label,
    path: item.to || "#",
    icon: item.icon,
  }))
}

const Breadcrumbs = () => {
  const location = useLocation()
  const { user } = useAuth()
  const breadcrumbs = getBreadcrumbItems(location.pathname, user)

  if (breadcrumbs.length === 0) {
    return null
  }

  return (
    <nav
      className="flex overflow-x-auto scrollbar-none"
      aria-label="Breadcrumb"
    >
      <ol className="inline-flex items-center flex-nowrap min-w-full">
        <li className="inline-flex items-center flex-shrink-0">
          <Link
            to="/"
            className="inline-flex items-center text-xs md:text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors duration-200 whitespace-nowrap"
          >
            <HomeIcon className="w-3.5 h-3.5 md:w-4 md:h-4 mr-1.5 md:mr-2 flex-shrink-0" />
            <span className="hidden xs:inline">მთავარი</span>
          </Link>
        </li>
        {breadcrumbs.map((item, index) => (
          <li key={index} className="flex items-center flex-shrink-0">
            <ChevronRightIcon className="w-3.5 h-3.5 md:w-4 md:h-4 mx-1 md:mx-2 text-gray-400 dark:text-gray-500 flex-shrink-0" />
            {item.path !== "#" ? (
              <Link
                to={item.path}
                className="text-xs md:text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors duration-200 whitespace-nowrap"
              >
                <span className="block max-w-[100px] xs:max-w-[150px] sm:max-w-none truncate">
                  {item.label}
                </span>
              </Link>
            ) : (
              <span className="text-xs md:text-sm font-medium text-gray-500 dark:text-gray-400 whitespace-nowrap">
                <span className="block max-w-[100px] xs:max-w-[150px] sm:max-w-none truncate">
                  {item.label}
                </span>
              </span>
            )}
          </li>
        ))}
      </ol>
    </nav>
  )
}

export default Breadcrumbs
