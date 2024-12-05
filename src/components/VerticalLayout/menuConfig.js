import {
  BsHouseDoor,
  BsGear,
  BsPerson,
  BsFileText,
  BsFolder,
  BsJournal,
  BsHeadset,
  BsCreditCard2Front,
  BsChatDots,
  BsTelephone,
  BsTools,
  BsArchive,
  BsPeople,
  BsCashStack,
  BsCalendar2DateFill,
  BsJournalBookmarkFill,
  BsFileCode,
} from "react-icons/bs"

export const getMenuConfig = (
  t,
  isAdmin,
  isDepartmentHead,
  userDepartmentId,
  hasPermission
) => {
  const menuItems = [
    {
      to: "/dashboard",
      icon: BsHouseDoor,
      label: t("მთავარი გვერდი"),
    },
    (isAdmin || isDepartmentHead) && {
      key: "admin",
      icon: BsGear,
      label: t("სამართავი პანელი"),
      submenu: [
        { to: "/admin/dashboard", label: t("მთავარი") },
        { to: "/admin/approvals", label: t("ვიზირება") },
        { to: "/admin/archive", icon: BsArchive, label: t("არქივი") },
      ],
    },
    {
      to: "/profile",
      icon: BsPerson,
      label: t("პროფილი"),
    },
    {
      to: "/tools/daily-results",
      icon: BsJournal,
      label: t("დღის შედეგები"),
    },
    {
      key: "applications",
      icon: BsFileCode,
      label: t("განცხადებები"),
      submenu: [
        {
          key: "internalPurchases",
          label: t("შიდა შესყიდვები"),
          submenu: [
            { to: "/applications/purchases/new", label: t("დამატება") },
            isAdmin && {
              to: "/applications/purchases/approve",
              label: t("ვიზირება"),
            },
            isAdmin && {
              to: "/applications/purchases/archive",
              label: t("არქივი"),
            },
            {
              to: "/applications/purchases/my-requests",
              label: t("გაგზავნილი"),
            },
          ],
        },
        {
          key: "vacation",
          label: t("შვებულება"),
          submenu: [
            { to: "/applications/vacation/new", label: t("დამატება") },
            isAdmin && {
              to: "/applications/vacation/approve",
              label: t("ვიზირება"),
            },
            isAdmin && {
              to: "/applications/vacation/archive",
              label: t("არქივი"),
            },
            {
              to: "/applications/vacation/my-requests",
              label: t("გაგზავნილი"),
            },
          ],
        },
        {
          key: "business",
          label: t("მივლინება"),
          submenu: [
            { to: "/applications/business-trip/new", label: t("დამატება") },
            isAdmin && {
              to: "/applications/business-trip/approve",
              label: t("ვიზირება"),
            },
            isAdmin && {
              to: "/applications/business-trip/archive",
              label: t("არქივი"),
            },
            {
              to: "/applications/business-trip/my-requests",
              label: t("გაგზავნილი"),
            },
          ],
        },
      ],
    },
    {
      key: "hrDocs",
      icon: BsFolder,
      label: t("HR დოკუმენტები"),
      submenu: [
        {
          to: "/hr/documents/new",
          label: t("ახალი მოთხოვნა"),
        },
        {
          to: "/hr/documents/approve",
          departmentId: 8,
          permission: "hr-documents.manage",
          label: t("ვიზირება"),
          visible: (isDepartmentHead && userDepartmentId === 8) || isAdmin,
        },
        {
          to: "/hr/documents/archive",
          departmentId: 8,
          permission: "hr-documents.view",
          label: t("არქივი"),
          visible: userDepartmentId === 8 || isAdmin,
        },
        {
          to: "/hr/documents/my-requests",
          label: t("ჩემი მოთხოვნები"),
        },
      ],
    },
    {
      key: "contracts",
      icon: BsFileText,
      label: t("ხელშეკრულებები"),
      submenu: [
        { to: "/legal/contracts/new", label: t("მოთხოვნა") },
        {
          key: "purchase",
          to: "/legal/contracts/purchase",
          label: t("ნასყიდობის ხელშეკრულება"),
          submenu: [
            isAdmin && {
              to: "/legal/contracts/purchase/approve",
              label: t("ვიზირება"),
            },
            isAdmin && {
              to: "/legal/contracts/purchase/archive",
              label: t("არქივი"),
            },
            { to: "/legal/contracts/purchase/my-requests", label: t("გაგზავნილი") },
          ],
        },
        {
          key: "delivery",
          to: "/legal/contracts/delivery",
          label: t("მიღება-ჩაბარების ხელშეკრულება"),
          submenu: [
            isAdmin && {
              to: "/legal/contracts/delivery/approve",
              label: t("ვიზირება"),
            },
            isAdmin && {
              to: "/legal/contracts/delivery/archive",
              label: t("არქივი"),
            },
            {
              to: "/legal/contracts/delivery/my-requests",
              label: t("გაგზავნილი"),
            },
          ],
        },
        {
          key: "marketing",
          to: "/legal/contracts/marketing",
          label: t("მარკეტინგის ხელშეკრულება"),
          submenu: [
            isAdmin && {
              to: "/legal/contracts/marketing/approve",
              label: t("ვიზირება"),
            },
            isAdmin && {
              to: "/legal/contracts/marketing/archive",
              label: t("არქივი"),
            },
            { to: "/legal/contracts/marketing/my-requests", label: t("გაგზავნილი") },
          ],
        },
        {
          key: "service",
          to: "/legal/contracts/service",
          label: t("მომსახურების ხელშეკრულება"),
          submenu: [
            isAdmin && {
              to: "/legal/contracts/service/approve",
              label: t("ვიზირება"),
            },
            isAdmin && {
              to: "/legal/contracts/service/archive",
              label: t("არქივი"),
            },
            {
              to: "/legal/contracts/service/my-requests",
              label: t("გაგზავნილი"),
            },
          ],
        },
      ],
    },
    {
      to: "/support/it-tasks",
      icon: BsHeadset,
      label: t("IT მხარდაჭერა"),
    },
    {
      to: "/support/maintenance",
      icon: BsTools,
      label: t("სამეურნეო Tasks"),
    },
    {
      to: "/contacts-list",
      icon: BsCreditCard2Front,
      label: t("ლოიალობის ბარათი"),
    },
    { to: "/admin/visitors", icon: BsPeople, label: t("ვიზიტორები") },
    // {
    //   to: "/admin/payment-monitoring",
    //   icon: BsCashStack,
    //   label: t("გადახდების მონიტორინგი"),
    // },
    {
      key: "leads",
      icon: BsTelephone,
      label: t("ლიდები"),
      submenu: [
        { to: "/leads/vip", label: t("VIP") },
        { to: "/leads/corporate", label: t("კორპორატიული") },
      ],
    },
    {
      to: "/tools/calendar",
      icon: BsCalendar2DateFill,
      label: t("კალენდარი"),
    },
    {
      to: "/tools/notes",
      icon: BsJournalBookmarkFill,
      label: t("ჩანაწერები"),
    },
    {
      to: "/communication/chat",
      icon: BsChatDots,
      label: t("ჩათი"),
    },
  ]
  const filterMenuItems = items => {
    return items
      .filter(item => {
        if (item.visible === false) return false
        if (!item.permission) return true
        return hasPermission(item.permission, item.departmentId)
      })
      .map(item => {
        if (item.submenu) {
          return {
            ...item,
            submenu: filterMenuItems(item.submenu),
          }
        }
        return item
      })
      .filter(item => {
        if (item.submenu) {
          return item.submenu.length > 0
        }
        return true
      })
  }

  return filterMenuItems(menuItems)
}
