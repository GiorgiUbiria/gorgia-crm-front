import { BsHouseDoor, BsGear, BsPerson } from "react-icons/bs"
import { checkAccess } from "utils/accessGate"
import {
  LuLayoutDashboard,
  LuShieldCheck,
  LuHouse,
  LuArchive,
  LuClipboardList,
  LuFileText,
  LuShoppingCart,
  LuPlane,
  LuCalendarDays,
  LuFolder,
  LuFileCode,
  LuHeadset,
  LuPencilRuler,
  LuCalendar,
  LuPlus,
  LuNotebook,
} from "react-icons/lu"

export const getMenuConfig = (t, user) => {
  const menuItems = [
    {
      key: "dashboard",
      label: t("Dashboard"),
      icon: LuHouse,
      to: "/dashboard",
    },
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
          icon: LuLayoutDashboard,
          label: t("მთავარი"),
          conditions: "role:admin|role:department_head,department:8",
        },
        {
          to: "/admin/approvals",
          icon: LuShieldCheck,
          label: t("ვიზირება"),
          conditions: "role:admin",
        },
        {
          to: "/admin/archive",
          icon: LuArchive,
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
      icon: LuClipboardList,
      label: t("დეპარტამენტის დღის შედეგები"),
      conditions: "role:admin|role:department_head",
    },
    {
      to: "/tools/inner-daily-results",
      icon: LuClipboardList,
      label: t("დღის შედეგები"),
      conditions: "",
    },
    {
      key: "applications",
      icon: LuFileText,
      label: t("განცხადებები"),
      conditions: "",
      submenu: [
        {
          key: "internalPurchases",
          label: t("შიდა შესყიდვები"),
          icon: LuShoppingCart,
          to: "/applications/purchases",
          conditions: "",
          submenu: [
            {
              to: "/applications/purchases/new",
              label: t("დამატება"),
              icon: LuPlus,
              conditions: "",
            },
            {
              to: "/applications/purchases/approve",
              label: t("ვიზირება"),
              icon: LuShieldCheck,
              conditions: "role:admin|role:department_head|department:17",
            },
            {
              to: "/applications/purchases/archive",
              label: t("არქივი"),
              icon: LuArchive,
              conditions: "role:admin|role:department_head|department:17",
            },
            {
              to: "/applications/purchases/my-requests",
              label: t("გაგზავნილი"),
              icon: LuFileText,
              conditions: "",
            },
          ],
        },
        {
          key: "business-trip",
          label: t("მივლინება"),
          icon: LuPlane,
          to: "/applications/business-trip",
          conditions: "",
          submenu: [
            {
              to: "/applications/business-trip/new",
              label: t("დამატება"),
              icon: LuPlus,
              conditions: "",
            },
            {
              to: "/applications/business-trip/approve",
              label: t("ვიზირება"),
              icon: LuShieldCheck,
              conditions: "role:admin|role:department_head",
            },
            {
              to: "/applications/business-trip/archive",
              label: t("არქივი"),
              icon: LuArchive,
              conditions: "role:admin|role:department_head",
            },
            {
              to: "/applications/business-trip/my-requests",
              label: t("გაგზავნილი"),
              icon: LuFileText,
              conditions: "",
            },
          ],
        },
        {
          key: "vacation",
          label: t("შვებულება"),
          icon: LuCalendarDays,
          to: "/applications/vacation",
          conditions: "",
          submenu: [
            {
              to: "/applications/vacation/new",
              label: t("დამატება"),
              icon: LuPlus,
              conditions: "",
            },
            {
              to: "/applications/vacation/approve",
              label: t("ვიზირება"),
              icon: LuShieldCheck,
              conditions: "role:admin|role:department_head|department:8",
            },
            {
              to: "/applications/vacation/archive",
              label: t("არქივი"),
              icon: LuArchive,
              conditions: "role:admin|role:department_head|department:8",
            },
            {
              to: "/applications/vacation/my-requests",
              label: t("გაგზავნილი"),
              icon: LuFileText,
              conditions: "",
            },
          ],
        },
      ],
    },
    {
      key: "hrDocs",
      icon: LuFolder,
      label: t("HR დოკუმენტები"),
      conditions: "",
      submenu: [
        {
          to: "/hr/documents/new",
          icon: LuPlus,
          label: t("ახალი მოთხოვნა"),
          conditions: "",
        },
        {
          to: "/hr/documents/approve",
          icon: LuShieldCheck,
          label: t("ვიზირება"),
          conditions: "role:admin|role:department_head|department:8",
        },
        {
          to: "/hr/documents/archive",
          icon: LuArchive,
          label: t("არქივი"),
          conditions: "role:admin|role:department_head|department:8",
        },
        {
          to: "/hr/documents/my-requests",
          label: t("ჩემი მოთხოვნები"),
          icon: LuFileText,
          conditions: "",
        },
      ],
    },
    {
      key: "agreements",
      icon: LuFileCode,
      label: t("ხელშეკრულებები"),
      conditions: "",
      submenu: [
        {
          key: "request",
          label: t("მოთხოვნა"),
          icon: LuPlus,
          to: "/legal/contracts/new",
          conditions: "",
        },
        {
          key: "purchase",
          label: t("ნასყიდობის ხელშეკრულება"),
          icon: LuFileCode,
          conditions: "",
          submenu: [
            {
              to: "/legal/contracts/purchase/approve",
              label: t("ვიზირება"),
              icon: LuShieldCheck,
              conditions: "role:admin|role:department_head",
            },
            {
              to: "/legal/contracts/purchase/archive",
              label: t("არქივი"),
              icon: LuArchive,
              conditions: "role:admin|role:department_head",
            },
            {
              to: "/legal/contracts/purchase/my-requests",
              label: t("გაგზავნილი"),
              icon: LuFileText,
              conditions: "",
            },
          ],
        },
        {
          key: "delivery",
          label: t("მიღება-ჩაბარების აქტი"),
          icon: LuFileCode,
          conditions: "",
          submenu: [
            {
              to: "/legal/contracts/delivery/approve",
              label: t("ვიზირება"),
              icon: LuShieldCheck,
              conditions: "role:admin|role:department_head",
            },
            {
              to: "/legal/contracts/delivery/archive",
              label: t("არქივი"),
              icon: LuArchive,
              conditions: "role:admin|role:department_head",
            },
            {
              to: "/legal/contracts/delivery/my-requests",
              label: t("გაგზავნილი"),
              icon: LuFileText,
              conditions: "",
            },
          ],
        },
        {
          key: "marketing",
          label: t("მარკეტინგული მომსახურების ხელშეკრულება"),
          conditions: "",
          icon: LuFileCode,
          submenu: [
            {
              to: "/legal/contracts/marketing/approve",
              label: t("ვიზირება"),
              icon: LuShieldCheck,
              conditions: "role:admin|role:department_head",
            },
            {
              to: "/legal/contracts/marketing/archive",
              label: t("არქივი"),
              icon: LuArchive,
              conditions: "role:admin|role:department_head",
            },
            {
              to: "/legal/contracts/marketing/my-requests",
              label: t("გაგზავნილი"),
              icon: LuFileText,
              conditions: "",
            },
          ],
        },
        {
          key: "service",
          label: t("მომსახურების ხელშეკრულება"),
          icon: LuFileCode,
          conditions: "",
          submenu: [
            {
              to: "/legal/contracts/service/approve",
              label: t("ვიზირება"),
              icon: LuShieldCheck,
              conditions: "role:admin|role:department_head",
            },
            {
              to: "/legal/contracts/service/archive",
              label: t("არქივი"),
              icon: LuArchive,
              conditions: "role:admin|role:department_head",
            },
            {
              to: "/legal/contracts/service/my-requests",
              label: t("გაგზავნილი"),
              icon: LuFileText,
              conditions: "",
            },
          ],
        },
        {
          key: "local",
          label: t("ადგილობრივი შესყიდვის ხელშეკრულება"),
          conditions: "",
          icon: LuFileCode,
          submenu: [
            {
              to: "/legal/contracts/local/approve",
              label: t("ვიზირება"),
              icon: LuShieldCheck,
              conditions: "role:admin|role:department_head",
            },
            {
              to: "/legal/contracts/local/archive",
              label: t("არქივი"),
              icon: LuArchive,
              conditions: "role:admin|role:department_head",
            },
            {
              to: "/legal/contracts/local/my-requests",
              label: t("გაგზავნილი"),
              icon: LuFileText,
              conditions: "",
            },
          ],
        },
      ],
    },
    {
      to: "/support/it-tasks",
      icon: LuHeadset,
      label: t("IT მხარდაჭერა"),
      conditions: "",
    },
    {
      to: "/support/farm-tasks",
      icon: LuPencilRuler,
      label: t("სამეურნეო Tasks"),
      conditions: "",
    },
    {
      to: "/tools/calendar",
      icon: LuCalendar,
      label: t("კალენდარი"),
      conditions: "",
    },
    {
      to: "/tools/notes",
      icon: LuNotebook,
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
