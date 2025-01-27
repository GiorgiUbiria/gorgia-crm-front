import { BsGear, BsPerson } from "react-icons/bs"
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
  LuPlus,
  LuNotebook,
  LuMessageSquare,
} from "react-icons/lu"

const getMenuItems = (t, can) => {
  const menuItems = [
    {
      to: "/dashboard",
      icon: LuHouse,
      label: t("მთავარი გვერდი"),
    },
    {
      key: "admin",
      icon: BsGear,
      label: t("სამართავი პანელი"),
      submenu: [
        {
          to: "/admin/dashboard",
          icon: LuLayoutDashboard,
          label: t("მთავარი"),
          show: () => can("role:admin|role:department_head|department:8"),
        },
        {
          to: "/admin/approvals",
          icon: LuShieldCheck,
          label: t("ვიზირება"),
          show: () => can("role:admin"),
        },
        {
          to: "/admin/archive",
          icon: LuArchive,
          label: t("არქივი"),
          show: () => can("role:admin"),
        },
      ],
    },
    {
      to: "/profile",
      icon: BsPerson,
      label: t("პროფილი"),
    },
    {
      to: "/tools/daily-results",
      icon: LuClipboardList,
      label: t("დეპარტამენტის დღის შედეგები"),
      show: () => can("role:admin|role:department_head"),
    },
    {
      to: "/tools/inner-daily-results",
      icon: LuClipboardList,
      label: t("დღის შედეგები"),
    },
    {
      key: "applications",
      icon: LuFileText,
      label: t("განცხადებები"),
      submenu: [
        {
          key: "internalPurchases",
          label: t("შიდა შესყიდვები"),
          icon: LuShoppingCart,
          to: "/applications/purchases",
          submenu: [
            {
              to: "/applications/purchases/new",
              label: t("დამატება"),
              icon: LuPlus,
            },
            {
              to: "/applications/purchases/approve",
              label: t("ვიზირება"),
              icon: LuShieldCheck,
              show: () =>
                can(
                  "role:admin|role:department_head|user:155|user:156|user:157"
                ),
            },
            {
              to: "/applications/purchases/archive",
              label: t("არქივი"),
              icon: LuArchive,
              show: () =>
                can(
                  "role:admin|role:department_head|role:department_head_assistant|department:7|user:373"
                ),
            },
            {
              to: "/applications/purchases/my-requests",
              label: t("გაგზავნილი"),
              icon: LuFileText,
            },
          ],
        },
        {
          key: "business-trip",
          label: t("მივლინება"),
          icon: LuPlane,
          to: "/applications/business-trip",
          submenu: [
            {
              to: "/applications/business-trip/new",
              label: t("დამატება"),
              icon: LuPlus,
            },
            {
              to: "/applications/business-trip/approve",
              label: t("ვიზირება"),
              icon: LuShieldCheck,
              show: () => can("role:admin|role:department_head"),
            },
            {
              to: "/applications/business-trip/archive",
              label: t("არქივი"),
              icon: LuArchive,
              show: () =>
                can(
                  "role:admin|role:department_head|role:department_head_assistant"
                ),
            },
            {
              to: "/applications/business-trip/my-requests",
              label: t("გაგზავნილი"),
              icon: LuFileText,
            },
          ],
        },
        {
          key: "vacation",
          label: t("შვებულება"),
          icon: LuCalendarDays,
          to: "/applications/vacation",
          submenu: [
            {
              to: "/applications/vacation/new",
              label: t("დამატება"),
              icon: LuPlus,
            },
            {
              to: "/applications/vacation/approve",
              label: t("ვიზირება"),
              icon: LuShieldCheck,
              show: () => can("role:admin|role:department_head"),
            },
            {
              to: "/applications/vacation/archive",
              label: t("არქივი"),
              icon: LuArchive,
              show: () =>
                can(
                  "role:admin|role:department_head|role:department_head_assistant|department:8"
                ),
            },
            {
              to: "/applications/vacation/my-requests",
              label: t("გაგზავნილი"),
              icon: LuFileText,
            },
          ],
        },
      ],
    },
    {
      key: "hrDocs",
      icon: LuFolder,
      label: t("HR დოკუმენტები"),
      submenu: [
        {
          to: "/hr/documents/new",
          icon: LuPlus,
          label: t("ახალი მოთხოვნა"),
        },
        {
          to: "/hr/documents/approve",
          icon: LuShieldCheck,
          label: t("ვიზირება"),
          show: () =>
            can(
              "role:admin|role:department_head,department:8|role:department_head_assistant,department:8"
            ),
        },
        {
          to: "/hr/documents/archive",
          icon: LuArchive,
          label: t("არქივი"),
          show: () => can("role:admin|department:8"),
        },
        {
          to: "/hr/documents/my-requests",
          label: t("ჩემი მოთხოვნები"),
          icon: LuFileText,
        },
      ],
    },
    {
      key: "agreements",
      icon: LuFileCode,
      label: t("ხელშეკრულებები"),
      submenu: [
        {
          key: "request",
          label: t("მოთხოვნა"),
          icon: LuPlus,
          to: "/legal/contracts/new",
        },
        {
          key: "purchase",
          label: t("ნასყიდობის ხელშეკრულება"),
          icon: LuFileCode,
          submenu: [
            {
              to: "/legal/contracts/purchase/approve",
              label: t("ვიზირება"),
              icon: LuShieldCheck,
              show: () => can("role:admin|role:department_head"),
            },
            {
              to: "/legal/contracts/purchase/archive",
              label: t("არქივი"),
              icon: LuArchive,
              show: () =>
                can(
                  "role:admin|role:department_head|role:department_head_assistant"
                ),
            },
            {
              to: "/legal/contracts/purchase/my-requests",
              label: t("გაგზავნილი"),
              icon: LuFileText,
            },
          ],
        },
        {
          key: "delivery",
          label: t("მიღება-ჩაბარების აქტი"),
          icon: LuFileCode,
          submenu: [
            {
              to: "/legal/contracts/delivery/approve",
              label: t("ვიზირება"),
              icon: LuShieldCheck,
              show: () => can("role:admin|role:department_head"),
            },
            {
              to: "/legal/contracts/delivery/archive",
              label: t("არქივი"),
              icon: LuArchive,
              show: () =>
                can(
                  "role:admin|role:department_head|role:department_head_assistant"
                ),
            },
            {
              to: "/legal/contracts/delivery/my-requests",
              label: t("გაგზავნილი"),
              icon: LuFileText,
            },
          ],
        },
        {
          key: "marketing",
          label: t("მარკეტინგული მომსახურების ხელშეკრულება"),
          icon: LuFileCode,
          submenu: [
            {
              to: "/legal/contracts/marketing/approve",
              label: t("ვიზირება"),
              icon: LuShieldCheck,
              show: () => can("role:admin|role:department_head"),
            },
            {
              to: "/legal/contracts/marketing/archive",
              label: t("არქივი"),
              icon: LuArchive,
              show: () =>
                can(
                  "role:admin|role:department_head|role:department_head_assistant"
                ),
            },
            {
              to: "/legal/contracts/marketing/my-requests",
              label: t("გაგზავნილი"),
              icon: LuFileText,
            },
          ],
        },
        {
          key: "service",
          label: t("მომსახურების ხელშეკრულება"),
          icon: LuFileCode,
          submenu: [
            {
              to: "/legal/contracts/service/approve",
              label: t("ვიზირება"),
              icon: LuShieldCheck,
              show: () => can("role:admin|role:department_head"),
            },
            {
              to: "/legal/contracts/service/archive",
              label: t("არქივი"),
              icon: LuArchive,
              show: () =>
                can(
                  "role:admin|role:department_head|role:department_head_assistant"
                ),
            },
            {
              to: "/legal/contracts/service/my-requests",
              label: t("გაგზავნილი"),
              icon: LuFileText,
            },
          ],
        },
        {
          key: "local",
          label: t("ადგილობრივი შესყიდვის ხელშეკრულება"),
          icon: LuFileCode,
          submenu: [
            {
              to: "/legal/contracts/local/approve",
              label: t("ვიზირება"),
              icon: LuShieldCheck,
              show: () => can("role:admin|role:department_head"),
            },
            {
              to: "/legal/contracts/local/archive",
              label: t("არქივი"),
              icon: LuArchive,
              show: () =>
                can(
                  "role:admin|role:department_head|role:department_head_assistant"
                ),
            },
            {
              to: "/legal/contracts/local/my-requests",
              label: t("გაგზავნილი"),
              icon: LuFileText,
            },
          ],
        },
      ],
    },
    {
      to: "/support/it-tasks",
      icon: LuHeadset,
      label: t("IT მხარდაჭერა"),
    },
    {
      to: "/support/farm-tasks",
      icon: LuPencilRuler,
      label: t("სამეურნეო Tasks"),
    },
    {
      to: "/support/legal-tasks",
      icon: LuFileCode,
      label: t("იურიდიული Tasks"),
    },
    {
      to: "/tools/notes",
      icon: LuNotebook,
      label: t("ჩანაწერები"),
    },
    {
      to: "/communication/chat",
      icon: LuMessageSquare,
      label: t("ჩატი"),
    },
  ]

  const filterMenuItems = items => {
    return items
      .map(item => {
        // If item has a show function, check if it should be shown
        if (item.show && !item.show()) {
          return null
        }

        // If item has submenu, filter it recursively
        if (item.submenu) {
          const filteredSubmenu = filterMenuItems(item.submenu)
          if (filteredSubmenu.length > 0) {
            return { ...item, submenu: filteredSubmenu }
          }
          return null
        }

        return item
      })
      .filter(Boolean) // Remove null items
  }

  return filterMenuItems(menuItems)
}

export const getMenuConfig = (t, auth) => {
  if (!auth?.can) return []
  return getMenuItems(t, auth.can)
}
