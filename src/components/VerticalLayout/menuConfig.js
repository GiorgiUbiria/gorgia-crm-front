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
import { checkAccess } from "utils/accessGate"

export const getMenuConfig = (t, user) => {
  const menuItems = [
    {
      to: "/dashboard",
      icon: BsHouseDoor,
      label: t("მთავარი გვერდი"),
      conditions: "",
    },
    {
      key: "admin",
      icon: BsGear,
      label: t("სამართავი პანელი"),
      conditions: "",
      submenu: [
        {
          to: "/admin/dashboard",
          label: t("მთავარი"),
          conditions: "role:admin|role:department_head,department:8",
        },
        {
          to: "/admin/approvals",
          label: t("ვიზირება"),
          conditions: "role:admin",
        },
        {
          to: "/admin/archive",
          icon: BsArchive,
          label: t("არქივი"),
          conditions: "role:admin",
        },
      ],
    },
    {
      to: "/profile",
      icon: BsPerson,
      label: t("პროფილი"),
      conditions: "",
    },
    {
      to: "/tools/daily-results",
      icon: BsJournal,
      label: t("დეპარტამენტის დღის შედეგები"),
      conditions: "role:admin|role:department_head",
    },
    {
      to: "/tools/inner-daily-results",
      icon: BsJournal,
      label: t("დღის შედეგები"),
      conditions: "",
    },
    {
      key: "applications",
      icon: BsFileCode,
      label: t("განცხადებები"),
      conditions: "",
      submenu: [
        {
          key: "internalPurchases",
          label: t("შიდა შესყიდვები"),
          to: "/applications/purchases",
          conditions: "",
          submenu: [
            {
              to: "/applications/purchases/new",
              label: t("დამატება"),
              conditions: "",
            },
            {
              to: "/applications/purchases/approve",
              label: t("ვიზირება"),
              conditions: "role:admin|role:department_head|department:17",
            },
            {
              to: "/applications/purchases/archive",
              label: t("არქივი"),
              conditions: "role:admin|role:department_head|department:17",
            },
            {
              to: "/applications/purchases/my-requests",
              label: t("გაგზავნილი"),
              conditions: "",
            },
          ],
        },
        {
          key: "business-trip",
          label: t("მივლინება"),
          to: "/applications/business-trip",
          conditions: "",
          submenu: [
            {
              to: "/applications/business-trip/new",
              label: t("დამატება"),
              conditions: "",
            },
            {
              to: "/applications/business-trip/approve",
              label: t("ვიზირება"),
              conditions: "role:admin|role:department_head",
            },
            {
              to: "/applications/business-trip/archive",
              label: t("არქივი"),
              conditions: "role:admin|role:department_head",
            },
            {
              to: "/applications/business-trip/my-requests",
              label: t("გაგზავნილი"),
              conditions: "",
            },
          ],
        },
        {
          key: "vacation",
          label: t("შვებულება"),
          to: "/applications/vacation",
          conditions: "",
          submenu: [
            {
              to: "/applications/vacation/new",
              label: t("დამატება"),
              conditions: "",
            },
            {
              to: "/applications/vacation/approve",
              label: t("ვიზირება"),
              conditions: "role:admin|role:department_head|department:8",
            },
            {
              to: "/applications/vacation/archive",
              label: t("არქივი"),
              conditions: "role:admin|role:department_head|department:8",
            },
            {
              to: "/applications/vacation/my-requests",
              label: t("გაგზავნილი"),
              conditions: "",
            },
          ],
        },
      ],
    },
    {
      key: "hrDocs",
      icon: BsFolder,
      label: t("HR დოკუმენტები"),
      conditions: "",
      submenu: [
        {
          to: "/hr/documents/new",
          label: t("ახალი მოთხოვნა"),
          conditions: "",
        },
        {
          to: "/hr/documents/approve",
          label: t("ვიზირება"),
          conditions: "role:admin|role:department_head|department:8",
        },
        {
          to: "/hr/documents/archive",
          label: t("არქივი"),
          conditions: "role:admin|role:department_head|department:8",
        },
        {
          to: "/hr/documents/my-requests",
          label: t("ჩემი მოთხოვნები"),
          conditions: "",
        },
      ],
    },
    {
      key: "agreements",
      icon: BsFileCode,
      label: t("ხელშეკრულებები"),
      conditions: "",
      submenu: [
        {
          key: "request",
          label: t("მოთხოვნა"),
          to: "/legal/contracts/new",
          conditions: "",
        },
        {
          key: "purchase",
          label: t("ნასყიდობის ხელშეკრულება"),
          conditions: "",
          submenu: [
            {
              to: "/legal/contracts/purchase/approve",
              label: t("ვიზირება"),
              conditions: "role:admin|role:department_head",
            },
            {
              to: "/legal/contracts/purchase/archive",
              label: t("არქივი"),
              conditions: "role:admin|role:department_head",
            },
            {
              to: "/legal/contracts/purchase/my-requests",
              label: t("გაგზავნილი"),
              conditions: "",
            },
          ],
        },
        {
          key: "delivery",
          label: t("მიღება-ჩაბარების აქტი"),
          conditions: "",
          submenu: [
            {
              to: "/legal/contracts/delivery/approve",
              label: t("ვიზირება"),
              conditions: "role:admin|role:department_head",
            },
            {
              to: "/legal/contracts/delivery/archive",
              label: t("არქივი"),
              conditions: "role:admin|role:department_head",
            },
            {
              to: "/legal/contracts/delivery/my-requests",
              label: t("გაგზავნილი"),
              conditions: "",
            },
          ],
        },
        {
          key: "marketing",
          label: t("მარკეტინგული მომსახურების ხელშეკრულება"),
          conditions: "",
          submenu: [
            {
              to: "/legal/contracts/marketing/approve",
              label: t("ვიზირება"),
              conditions: "role:admin|role:department_head",
            },
            {
              to: "/legal/contracts/marketing/archive",
              label: t("არქივი"),
              conditions: "role:admin|role:department_head",
            },
            {
              to: "/legal/contracts/marketing/my-requests",
              label: t("გაგზავნილი"),
              conditions: "",
            },
          ],
        },
        {
          key: "service",
          label: t("მომსახურების ხელშეკრულება"),
          conditions: "",
          submenu: [
            {
              to: "/legal/contracts/service/approve",
              label: t("ვიზირება"),
              conditions: "role:admin|role:department_head",
            },
            {
              to: "/legal/contracts/service/archive",
              label: t("არქივი"),
              conditions: "role:admin|role:department_head",
            },
            {
              to: "/legal/contracts/service/my-requests",
              label: t("გაგზავნილი"),
              conditions: "",
            },
          ],
        },
        {
          key: "local",
          label: t("ადგილობრივი შესყიდვის ხელშეკრულება"),
          conditions: "",
          submenu: [
            {
              to: "/legal/contracts/local/approve",
              label: t("ვიზირება"),
              conditions: "role:admin|role:department_head",
            },
            {
              to: "/legal/contracts/local/archive",
              label: t("არქივი"),
              conditions: "role:admin|role:department_head",
            },
            {
              to: "/legal/contracts/local/my-requests",
              label: t("გაგზავნილი"),
              conditions: "",
            },
          ],
        },
      ],
    },
    {
      to: "/support/it-tasks",
      icon: BsHeadset,
      label: t("IT მხარდაჭერა"),
      conditions: "",
    },
    {
      to: "/support/farm-tasks",
      icon: BsTools,
      label: t("სამეურნეო Tasks"),
      conditions: "",
    },
    {
      to: "/tools/calendar",
      icon: BsCalendar2DateFill,
      label: t("კალენდარი"),
      conditions: "",
    },
    {
      to: "/tools/notes",
      icon: BsJournalBookmarkFill,
      label: t("ჩანაწერები"),
      conditions: "",
    },
  ]

  const filterMenuItems = items => {
    return items
      .filter(item => {
        if (!item.conditions) return true
        return checkAccess(user, item.conditions)
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
