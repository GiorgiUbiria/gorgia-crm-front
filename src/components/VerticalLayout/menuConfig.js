import {
  BsHouseDoor,
  BsGear,
  BsPerson,
  BsFolder,
  BsJournal,
  BsHeadset,
  BsTools,
  BsArchive,
  BsCalendar2DateFill,
  BsJournalBookmarkFill,
  BsFileCode,
} from "react-icons/bs"
import { AccessRoles, checkAccess } from "utils/accessControl"

export const getMenuConfig = (t, user) => {
  const menuItems = [
    {
      to: "/dashboard",
      icon: BsHouseDoor,
      label: t("მთავარი გვერდი"),
      requiredRoles: [],
      requiredDepartmentIds: [],
    },
    {
      key: "admin",
      icon: BsGear,
      label: t("სამართავი პანელი"),
      requiredRoles: [
        AccessRoles.ADMIN,
        AccessRoles.DEPARTMENT_HEAD,
        AccessRoles.HR_MEMBER,
      ],
      submenu: [
        {
          to: "/admin/dashboard",
          label: t("მთავარი"),
          requiredRoles: [
            AccessRoles.ADMIN,
            AccessRoles.DEPARTMENT_HEAD,
            AccessRoles.HR_MEMBER,
          ],
          requiredDepartmentIds: [],
        },
        {
          to: "/admin/approvals",
          label: t("ვიზირება"),
          requiredRoles: [AccessRoles.ADMIN],
          requiredDepartmentIds: [],
        },
        {
          to: "/admin/archive",
          icon: BsArchive,
          label: t("არქივი"),
          requiredRoles: [AccessRoles.ADMIN],
          requiredDepartmentIds: [],
        },
      ],
    },
    {
      to: "/profile",
      icon: BsPerson,
      label: t("პროფილი"),
      requiredRoles: [],
      requiredDepartmentIds: [],
    },
    {
      to: "/tools/daily-results",
      icon: BsJournal,
      label: t("დღის შედეგები"),
      requiredRoles: [AccessRoles.ADMIN],
      requiredDepartmentIds: [],
    },
    {
      to: "/tools/inner-daily-results",
      icon: BsJournal,
      label: t("დეპარტამენტის დღის შედეგები"),
      requiredRoles: [],
      requiredDepartmentIds: [],
    },
    {
      key: "applications",
      icon: BsFileCode,
      label: t("განცხადებები"),
      requiredRoles: [],
      requiredDepartmentIds: [],
      submenu: [
        {
          key: "internalPurchases",
          label: t("შიდა შესყიდვები"),
          to: "/applications/purchases",
          requiredRoles: [],
          requiredDepartmentIds: [],
          submenu: [
            {
              to: "/applications/purchases/new",
              label: t("დამატება"),
              requiredRoles: [],
              requiredDepartmentIds: [],
            },
            {
              to: "/applications/purchases/approve",
              label: t("ვიზირება"),
              requiredRoles: [],
              requiredDepartmentIds: [],
            },
            {
              to: "/applications/purchases/archive",
              label: t("არქივი"),
              requiredRoles: [],
              requiredDepartmentIds: [],
            },
            {
              to: "/applications/purchases/my-requests",
              label: t("გაგზავნილი"),
              requiredRoles: [],
              requiredDepartmentIds: [],
            },
          ],
        },
        {
          key: "business-trip",
          label: t("მივლინება"),
          to: "/applications/business-trip",
          requiredRoles: [],
          requiredDepartmentIds: [],
          submenu: [
            {
              to: "/applications/business-trip/new",
              label: t("დამატება"),
              requiredRoles: [],
              requiredDepartmentIds: [],
            },
            {
              to: "/applications/business-trip/approve",
              label: t("ვიზირება"),
              requiredRoles: [],
              requiredDepartmentIds: [],
            },
            {
              to: "/applications/business-trip/archive",
              label: t("არქივი"),
              requiredRoles: [],
              requiredDepartmentIds: [],
            },
            {
              to: "/applications/business-trip/my-requests",
              label: t("გაგზავნილი"),
              requiredRoles: [],
              requiredDepartmentIds: [],
            },
          ],
        },
        {
          key: "vacation",
          label: t("შვებულება"),
          to: "/applications/vacation",
          requiredRoles: [],
          requiredDepartmentIds: [],
          submenu: [
            {
              to: "/applications/vacation/new",
              label: t("დამატება"),
              requiredRoles: [],
              requiredDepartmentIds: [],
            },
            {
              to: "/applications/vacation/approve",
              label: t("ვიზირება"),
              requiredRoles: [],
              requiredDepartmentIds: [],
            },
            {
              to: "/applications/vacation/archive",
              label: t("არქივი"),
              requiredRoles: [],
              requiredDepartmentIds: [],
            },
            {
              to: "/applications/vacation/my-requests",
              label: t("გაგზავნილი"),
              requiredRoles: [],
              requiredDepartmentIds: [],
            },
          ],
        },
      ],
    },
    {
      key: "hrDocs",
      icon: BsFolder,
      label: t("HR დოკუმენტები"),
      requiredRoles: [],
      requiredDepartmentIds: [],
      submenu: [
        {
          to: "/hr/documents/new",
          label: t("ახალი მოთხოვნა"),
          requiredRoles: [],
          requiredDepartmentIds: [],
        },
        {
          to: "/hr/documents/approve",
          label: t("ვიზირება"),
          requiredRoles: [],
          requiredDepartmentIds: [8],
        },
        {
          to: "/hr/documents/archive",
          label: t("არქივი"),
          requiredRoles: [],
          requiredDepartmentIds: [8],
        },
        {
          to: "/hr/documents/my-requests",
          label: t("ჩემი მოთხოვნები"),
          requiredRoles: [],
          requiredDepartmentIds: [],
        },
      ],
    },
    {
      key: "agreements",
      icon: BsFileCode,
      label: t("ხელშეკრულებები"),
      requiredRoles: [],
      requiredDepartmentIds: [],
      submenu: [
        {
          key: "request",
          label: t("მოთხოვნა"),
          to: "/legal/contracts/new",
          requiredRoles: [],
          requiredDepartmentIds: [],
        },
        {
          key: "purchase",
          label: t("ნასყიდობის ხელშეკრულება"),
          requiredRoles: [],
          requiredDepartmentIds: [],
          submenu: [
            {
              to: "/legal/contracts/purchase/approve",
              label: t("ვიზირება"),
              requiredRoles: [],
              requiredDepartmentIds: [],
            },
            {
              to: "/legal/contracts/purchase/archive",
              label: t("არქივი"),
              requiredRoles: [],
              requiredDepartmentIds: [],
            },
            {
              to: "/legal/contracts/purchase/my-requests",
              label: t("გაგზავნილი"),
              requiredRoles: [],
              requiredDepartmentIds: [],
            },
          ],
        },
        {
          key: "delivery",
          label: t("მიღება-ჩაბარების აქტი"),
          requiredRoles: [],
          requiredDepartmentIds: [],
          submenu: [
            {
              to: "/legal/contracts/delivery/approve",
              label: t("ვიზირება"),
              requiredRoles: [],
              requiredDepartmentIds: [],
            },
            {
              to: "/legal/contracts/delivery/archive",
              label: t("არქივი"),
              requiredRoles: [],
              requiredDepartmentIds: [],
            },
            {
              to: "/legal/contracts/delivery/my-requests",
              label: t("გაგზავნილი"),
              requiredRoles: [],
              requiredDepartmentIds: [],
            },
          ],
        },
        {
          key: "marketing",
          label: t("მარკეტინგული მომსახურების ხელშეკრულება"),
          requiredRoles: [],
          requiredDepartmentIds: [],
          submenu: [
            {
              to: "/legal/contracts/marketing/approve",
              label: t("ვიზირება"),
              requiredRoles: [],
              requiredDepartmentIds: [],
            },
            {
              to: "/legal/contracts/marketing/archive",
              label: t("არქივი"),
              requiredRoles: [],
              requiredDepartmentIds: [],
            },
            {
              to: "/legal/contracts/marketing/my-requests",
              label: t("გაგზავნილი"),
              requiredRoles: [],
              requiredDepartmentIds: [],
            },
          ],
        },
        {
          key: "service",
          label: t("მომსახურების ხელშეკრულება"),
          requiredRoles: [],
          requiredDepartmentIds: [],
          submenu: [
            {
              to: "/legal/contracts/service/approve",
              label: t("ვიზირება"),
              requiredRoles: [],
              requiredDepartmentIds: [],
            },
            {
              to: "/legal/contracts/service/archive",
              label: t("არქივი"),
              requiredRoles: [],
              requiredDepartmentIds: [],
            },
            {
              to: "/legal/contracts/service/my-requests",
              label: t("გაგზავნილი"),
              requiredRoles: [],
              requiredDepartmentIds: [],
            },
          ],
        },
        {
          key: "local",
          label: t("ადგილობრივი შესყიდვის ხელშეკრულება"),
          requiredRoles: [],
          requiredDepartmentIds: [],
          submenu: [
            {
              to: "/legal/contracts/local/approve",
              label: t("ვიზირება"),
              requiredRoles: [],
              requiredDepartmentIds: [],
            },
            {
              to: "/legal/contracts/local/archive",
              label: t("არქივი"),
              requiredRoles: [],
              requiredDepartmentIds: [],
            },
            {
              to: "/legal/contracts/local/my-requests",
              label: t("გაგზავნილი"),
              requiredRoles: [],
              requiredDepartmentIds: [],
            },
          ],
        },
      ],
    },
    {
      to: "/support/it-tasks",
      icon: BsHeadset,
      label: t("IT მხარდაჭერა"),
      requiredRoles: [],
      requiredDepartmentIds: [],
    },
    {
      to: "/support/farm-tasks",
      icon: BsTools,
      label: t("სამეურნეო Tasks"),
      requiredRoles: [],
      requiredDepartmentIds: [],
    },
    {
      to: "/tools/calendar",
      icon: BsCalendar2DateFill,
      label: t("კალენდარი"),
      requiredRoles: [],
      requiredDepartmentIds: [],
    },
    {
      to: "/tools/notes",
      icon: BsJournalBookmarkFill,
      label: t("ჩანაწერები"),
      requiredRoles: [],
      requiredDepartmentIds: [],
    },
  ]

  const filterMenuItems = items => {
    return items
      .filter(item => {
        // If no roles or departments are specified, item is accessible to everyone
        if (
          item.requiredRoles.length === 0 &&
          item.requiredDepartmentIds.length === 0
        )
          return true
        return checkAccess(user, item.requiredRoles, item.requiredDepartmentIds)
      })
      .map(item => {
        if (item.submenu) {
          const filteredSubmenu = filterMenuItems(item.submenu)
          if (filteredSubmenu.length > 0) {
            return { ...item, submenu: filteredSubmenu }
          }
          return null
        }
        return item
      })
      .filter(item => item !== null)
  }

  return filterMenuItems(menuItems)
}
