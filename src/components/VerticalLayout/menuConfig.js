import {
  BsHouseDoor,
  BsGear,
  BsPerson,
  BsFileText,
  BsFolder,
  BsJournal,
  BsHeadset,
  // BsCreditCard2Front,
  // BsChatDots,
  // BsTelephone,
  BsTools,
  BsArchive,
  // BsPeople,
  BsCalendar2DateFill,
  BsJournalBookmarkFill,
  BsFileCode,
} from "react-icons/bs"

const createSubmenu = (
  basePath,
  labelKey,
  isAdmin,
  isDepartmentHead,
  requiresNew = false
) =>
  [
    requiresNew && { to: `${basePath}/new`, label: labelKey("დამატება") },
    isAdmin && { to: `${basePath}/approve`, label: labelKey("ვიზირება") },
    isAdmin
      ? { to: `${basePath}/archive`, label: labelKey("არქივი") }
      : isDepartmentHead
      ? { to: `${basePath}/archive`, label: labelKey("ვიზირება") }
      : null,
    { to: `${basePath}/my-requests`, label: labelKey("გაგზავნილი") },
  ].filter(Boolean)

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
    {
      key: "admin",
      icon: BsGear,
      label: t("სამართავი პანელი"),
      permission: "users.view",
      submenu: [
        { to: "/admin/dashboard", label: t("მთავარი") },
        { to: "/admin/approvals", label: t("ვიზირება") },
        { to: "/admin/archive", icon: BsArchive, label: t("არქივი") },
      ].filter(item => !item.visible || item.visible !== false),
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
      permission: "daily-results.view-own",
    },
    {
      to: "/tools/inner-daily-results",
      icon: BsJournal,
      label: t("დეპარტამენტის დღის შედეგები"),
    },
    {
      key: "applications",
      icon: BsFileCode,
      label: t("განცხადებები"),
      submenu: [
        {
          key: "internalPurchases",
          label: t("შიდა შესყიდვები"),
          submenu: createSubmenu(
            "/applications/purchases",
            t,
            isAdmin,
            isDepartmentHead,
            true
          ),
        },
        {
          key: "vacation",
          label: t("შვებულება"),
          submenu: createSubmenu(
            "/applications/vacation",
            t,
            isAdmin,
            isDepartmentHead,
            true
          ),
        },
        {
          key: "business",
          label: t("მივლინება"),
          submenu: createSubmenu(
            "/applications/business-trip",
            t,
            isAdmin,
            isDepartmentHead,
            true
          ),
        },
      ],
    },
    {
      key: "hrDocs",
      icon: BsFolder,
      label: t("HR დოკუმენტები"),
      submenu: [
        { to: "/hr/documents/new", label: t("ახალი მოთხოვნა") },
        {
          to: "/hr/documents/approve",
          departmentId: 8,
          permission: "hr-documents.manage",
          label: t("ვიზირება"),
          visible: userDepartmentId === 8 || isAdmin,
        },
        {
          to: "/hr/documents/archive",
          departmentId: 8,
          permission: "hr-documents.view",
          label: t("არქივი"),
          visible: userDepartmentId === 8 || isAdmin,
        },
        { to: "/hr/documents/my-requests", label: t("ჩემი მოთხოვნები") },
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
          submenu: createSubmenu(
            "/legal/contracts/purchase",
            t,
            isAdmin || isDepartmentHead
          ),
        },
        {
          key: "delivery",
          to: "/legal/contracts/delivery",
          label: t("მიღება-ჩაბარების აქტი"),
          submenu: createSubmenu(
            "/legal/contracts/delivery",
            t,
            isAdmin || isDepartmentHead
          ),
        },
        {
          key: "marketing",
          to: "/legal/contracts/marketing",
          label: t("მარკეტინგული მომსახურების ხელშეკრულება"),
          submenu: createSubmenu(
            "/legal/contracts/marketing",
            t,
            isAdmin || isDepartmentHead
          ),
        },
        {
          key: "service",
          to: "/legal/contracts/service",
          label: t("მომსახურების ხელშეკრულება"),
          submenu: createSubmenu(
            "/legal/contracts/service",
            t,
            isAdmin || isDepartmentHead
          ),
        },
        {
          to: "/legal/contracts/local",
          key: "local",
          label: t("ადგილობრივი შესყიდვის ხელშეკრულება"),
          submenu: createSubmenu(
            "/legal/contracts/local",
            t,
            isAdmin || isDepartmentHead
          ),
        },
      ],
    },
    {
      to: "/support/it-tasks",
      icon: BsHeadset,
      label: t("IT მხარდაჭერა"),
    },
    {
      to: "/support/farm-tasks",
      icon: BsTools,
      label: t("სამეურნეო Tasks"),
    },
    // {
    //   to: "/contacts-list",
    //   icon: BsCreditCard2Front,
    //   label: t("ლოიალობის ბარათი"),
    // },
    // { to: "/admin/visitors", icon: BsPeople, label: t("ვიზიტორები") },
    // {
    //   to: "/admin/payment-monitoring",
    //   icon: BsCashStack,
    //   label: t("გადახდების მონიტორინგი"),
    // },
    // {
    //   key: "leads",
    //   icon: BsTelephone,
    //   label: t("ლიდები"),
    //   submenu: [
    //     { to: "/leads/vip", label: t("VIP") },
    //     { to: "/leads/corporate", label: t("კორპორატიული") },
    //   ],
    // },
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
    // {
    //   to: "/communication/chat",
    //   icon: BsChatDots,
    //   label: t("ჩათი"),
    // },
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
