import {
  BsHouseDoor,
  BsGear,
  BsPerson,
  BsFileText,
  BsFolder,
  BsFileEarmark,
  BsJournal,
  BsHeadset,
  BsCreditCard2Front,
  BsCalendar,
  BsChatDots,
  BsTelephone,
  BsTools,
  BsArchive,
  BsPeople,
  BsCashStack,
  BsCalendar2DateFill,
  BsJournalBookmarkFill,
  BsFileCodeFill,
  BsFileCode,
} from "react-icons/bs"

export const getMenuConfig = (t, isAdmin, isDepartmentHead) =>
  [
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
        { to: "/hr/documents", label: t("ცნობები") },
        isAdmin && { to: "/hr/documents/approve", label: t("ვიზირება") },
        { to: "/hr/documents/sent", label: t("გაგზავნილი") },
      ],
    },
    {
      key: "contracts",
      icon: BsFileText,
      label: t("ხელშეკრულებები"),
      submenu: [
        { to: "/legal/contracts/new", label: t("მოთხოვნა") },
        isAdmin && { to: "/legal/contracts/approve", label: t("ვიზირება") },
        isAdmin && { to: "/legal/contracts/archive", label: t("არქივი") },
        { to: "/legal/contracts/my-requests", label: t("გაგზავნილი") },
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
    {
      to: "/admin/payment-monitoring",
      icon: BsCashStack,
      label: t("გადახდების მონიტორინგი"),
    },
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
  ].filter(Boolean)
