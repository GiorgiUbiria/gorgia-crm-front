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
  LuUser,
  LuFilter,
  LuPaintbrush,
  // LuBriefcase,
} from "react-icons/lu"

const getMenuItems = can => {
  const menuItems = [
    {
      to: "/dashboard",
      icon: LuHouse,
      label: "მთავარი გვერდი",
    },
    {
      key: "admin",
      icon: BsGear,
      label: "სამართავი პანელი",
      submenu: [
        {
          to: "/admin/dashboard",
          icon: LuLayoutDashboard,
          label: "მთავარი",
          show: () => can("role:admin|role:department_head|department:8"),
        },
        {
          to: "/admin/approvals",
          icon: LuShieldCheck,
          label: "ვიზირება",
          show: () => can("role:admin"),
        },
        {
          to: "/admin/archive",
          icon: LuArchive,
          label: "არქივი",
          show: () => can("role:admin"),
        },
      ],
    },
    {
      to: "/profile",
      icon: BsPerson,
      label: "პროფილი",
    },
    {
      to: "/tools/daily-results",
      icon: LuClipboardList,
      label: "დეპარტამენტის დღის შედეგები",
      show: () => can("role:admin|role:department_head"),
    },
    {
      to: "/tools/inner-daily-results",
      icon: LuClipboardList,
      label: "დღის შედეგები",
    },
    {
      key: "applications",
      icon: LuFileText,
      label: "განცხადებები",
      submenu: [
        {
          key: "internalPurchases",
          label: "შიდა შესყიდვები",
          icon: LuShoppingCart,
          to: "/applications/purchases",
          submenu: [
            {
              to: "/applications/purchases/new",
              label: "დამატება",
              icon: LuPlus,
            },
            {
              to: "/applications/purchases/approve",
              label: "ვიზირება",
              icon: LuShieldCheck,
              show: () =>
                can(
                  "role:admin|role:department_head|user:155|user:156|user:157"
                ),
            },
            {
              to: "/applications/purchases/archive",
              label: "არქივი",
              icon: LuArchive,
              show: () =>
                can(
                  "role:admin|role:department_head|role:department_head_assistant|department:7|user:373"
                ),
            },
            {
              to: "/applications/purchases/my-requests",
              label: "გაგზავნილი",
              icon: LuFileText,
            },
          ],
        },
        {
          key: "business-trip",
          label: "მივლინება",
          icon: LuPlane,
          disabled: true,
          to: "/applications/business-trip",
          submenu: [
            {
              to: "/applications/business-trip/new",
              label: "დამატება",
              icon: LuPlus,
            },
            {
              to: "/applications/business-trip/approve",
              label: "ვიზირება",
              icon: LuShieldCheck,
              show: () => can("role:admin|role:department_head"),
            },
            {
              to: "/applications/business-trip/archive",
              label: "არქივი",
              icon: LuArchive,
              show: () =>
                can(
                  "role:admin|role:department_head|role:department_head_assistant"
                ),
            },
            {
              to: "/applications/business-trip/my-requests",
              label: "გაგზავნილი",
              icon: LuFileText,
            },
          ],
        },
        {
          key: "vacation",
          label: "შვებულება",
          icon: LuCalendarDays,
          to: "/applications/vacation",
          submenu: [
            {
              to: "/applications/vacation/new",
              label: "დამატება",
              icon: LuPlus,
            },
            {
              to: "/applications/vacation/approve",
              label: "ვიზირება",
              icon: LuShieldCheck,
              show: () => can("role:admin|role:department_head"),
            },
            {
              to: "/applications/vacation/archive",
              label: "არქივი",
              icon: LuArchive,
              show: () =>
                can(
                  "role:admin|role:department_head|role:department_head_assistant|department:8"
                ),
            },
            {
              to: "/applications/vacation/my-requests",
              label: "გაგზავნილი",
              icon: LuFileText,
            },
          ],
        },
      ],
    },
    {
      key: "hrDocs",
      icon: LuFolder,
      label: "HR დოკუმენტები",
      submenu: [
        {
          to: "/hr/documents/new",
          icon: LuPlus,
          label: "ახალი მოთხოვნა",
        },
        {
          to: "/hr/documents/approve",
          icon: LuShieldCheck,
          label: "ვიზირება",
          show: () =>
            can(
              "role:admin|role:department_head,department:8|role:department_head_assistant,department:8"
            ),
        },
        {
          to: "/hr/documents/archive",
          icon: LuArchive,
          label: "არქივი",
          show: () => can("role:admin|department:8"),
        },
        {
          to: "/hr/documents/my-requests",
          label: "ჩემი მოთხოვნები",
          icon: LuFileText,
        },
        {
          key: "additionalHrDocs",
          label: "დამატებითი მოთხოვნები",
          icon: LuFileText,
          submenu: [
            {
              to: "/hr/documents/additional/new",
              label: "ექიმის ცნობის/ბიულეტენის მოთხოვნა",
              icon: LuPlus,
            },
            {
              to: "/hr/documents/additional/my-requests",
              label: "ჩემი ცნობები",
              icon: LuFileText,
            },
            {
              to: "/hr/documents/additional/archive",
              label: "ცნობების არქივი",
              icon: LuArchive,
              show: () => can("department:8"),
            },
          ],
        },
      ],
    },
    {
      key: "agreements",
      icon: LuFileCode,
      label: "ხელშეკრულებები",
      submenu: [
        {
          key: "request",
          label: "მოთხოვნა",
          icon: LuPlus,
          to: "/legal/contracts/new",
        },
        {
          key: "purchase",
          label: "ნასყიდობის ხელშეკრულება",
          icon: LuFileCode,
          submenu: [
            {
              to: "/legal/contracts/purchase/approve",
              label: "ვიზირება",
              icon: LuShieldCheck,
              show: () => can("role:admin|role:department_head"),
            },
            {
              to: "/legal/contracts/purchase/archive",
              label: "არქივი",
              icon: LuArchive,
              show: () =>
                can(
                  "role:admin|role:department_head|role:department_head_assistant"
                ),
            },
            {
              to: "/legal/contracts/purchase/my-requests",
              label: "გაგზავნილი",
              icon: LuFileText,
            },
          ],
        },
        {
          key: "delivery",
          label: "მიღება-ჩაბარების აქტი",
          icon: LuFileCode,
          submenu: [
            {
              to: "/legal/contracts/delivery/approve",
              label: "ვიზირება",
              icon: LuShieldCheck,
              show: () => can("role:admin|role:department_head"),
            },
            {
              to: "/legal/contracts/delivery/archive",
              label: "არქივი",
              icon: LuArchive,
              show: () =>
                can(
                  "role:admin|role:department_head|role:department_head_assistant"
                ),
            },
            {
              to: "/legal/contracts/delivery/my-requests",
              label: "გაგზავნილი",
              icon: LuFileText,
            },
          ],
        },
        {
          key: "marketing",
          label: "მარკეტინგული მომსახურების ხელშეკრულება",
          icon: LuFileCode,
          submenu: [
            {
              to: "/legal/contracts/marketing/approve",
              label: "ვიზირება",
              icon: LuShieldCheck,
              show: () => can("role:admin|role:department_head"),
            },
            {
              to: "/legal/contracts/marketing/archive",
              label: "არქივი",
              icon: LuArchive,
              show: () =>
                can(
                  "role:admin|role:department_head|role:department_head_assistant"
                ),
            },
            {
              to: "/legal/contracts/marketing/my-requests",
              label: "გაგზავნილი",
              icon: LuFileText,
            },
          ],
        },
        {
          key: "service",
          label: "მომსახურების ხელშეკრულება",
          icon: LuFileCode,
          submenu: [
            {
              to: "/legal/contracts/service/approve",
              label: "ვიზირება",
              icon: LuShieldCheck,
              show: () => can("role:admin|role:department_head"),
            },
            {
              to: "/legal/contracts/service/archive",
              label: "არქივი",
              icon: LuArchive,
              show: () =>
                can(
                  "role:admin|role:department_head|role:department_head_assistant"
                ),
            },
            {
              to: "/legal/contracts/service/my-requests",
              label: "გაგზავნილი",
              icon: LuFileText,
            },
          ],
        },
        {
          key: "local",
          label: "ადგილობრივი შესყიდვის ხელშეკრულება",
          icon: LuFileCode,
          submenu: [
            {
              to: "/legal/contracts/local/approve",
              label: "ვიზირება",
              icon: LuShieldCheck,
              show: () => can("role:admin|role:department_head"),
            },
            {
              to: "/legal/contracts/local/archive",
              label: "არქივი",
              icon: LuArchive,
              show: () =>
                can(
                  "role:admin|role:department_head|role:department_head_assistant"
                ),
            },
            {
              to: "/legal/contracts/local/my-requests",
              label: "გაგზავნილი",
              icon: LuFileText,
            },
          ],
        },
      ],
    },
    {
      to: "/tools/design-forms",
      icon: LuPaintbrush,
      label: "დიზაინის მოთხოვნები",
    },
    {
      to: "/support/it-tasks",
      icon: LuHeadset,
      label: "IT მხარდაჭერა",
    },
    {
      to: "/support/farm-tasks",
      icon: LuPencilRuler,
      label: "სამეურნეო Tasks",
    },
    {
      to: "/support/legal-tasks",
      icon: LuFileCode,
      label: "იურიდიული Tasks",
    },
    {
      to: "/tools/notes",
      icon: LuNotebook,
      label: "ჩანაწერები",
    },
    {
      to: "/communication/chat",
      icon: LuMessageSquare,
      label: "ჩატი",
    },
    {
      to: "/tools/employee-contacts",
      icon: LuFilter,
      label: "საკომუნიკაციო ბაზა",
      show: () => can("role:admin|department:8"),
    },
    {
      to: "/tools/people-counting",
      icon: LuUser,
      label: "ვიზიტორების ფორმა",
      show: () =>
        can(
          "role:admin|department:36,role:department_head|department:21|department:30|user:133"
        ),
    },
    {
      to: "/tools/calendar",
      icon: LuCalendarDays,
      label: "კალენდარი",
    },
    // {
    //   key: "vacancy",
    //   label: "ვაკანსიის მოთხოვნა",
    //   icon: LuBriefcase,
    //   disabled: true,
    //   show: () => can("role:admin|department:8"),
    //   submenu: [
    //     {
    //       to: "/vacancy-requests/create",
    //       label: "მოთხოვნა",
    //       icon: LuPlus,
    //       show: () => can("role:admin|role:hr"),
    //     },
    //     {
    //       to: "/vacancy-requests/my-requests",
    //       label: "გაგზავნილი",
    //       icon: LuFileText,
    //       show: () => can("role:admin|role:hr"),
    //     },
    //     {
    //       to: "/vacancy-requests/archive",
    //       label: "არქივი",
    //       icon: LuArchive,
    //       show: () => can("role:admin|role:hr"),
    //     },
    //   ],
    // },
  ]

  const filterMenuItems = items => {
    return items
      .map(item => {
        if (item.show && !item.show()) {
          return null
        }

        if (item.submenu) {
          const filteredSubmenu = filterMenuItems(item.submenu)
          if (filteredSubmenu.length > 0) {
            return { ...item, submenu: filteredSubmenu }
          }
          return null
        }

        return item
      })
      .filter(Boolean)
  }

  return filterMenuItems(menuItems)
}

export const getMenuConfig = auth => {
  if (!auth?.can) return []
  return getMenuItems(auth.can)
}
