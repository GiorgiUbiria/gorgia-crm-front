import {
  BsHouseDoor,
  BsGear,
  BsPerson,
  BsFileText,
  BsFolder,
  BsFileEarmark,
  BsJournal,
  BsShieldCheck,
  BsHeadset,
  BsCreditCard2Front,
  BsPeople,
  BsCalendar,
  BsChatDots,
  BsTelephone,
  BsTools,
  BsCash,
  BsArchive,
} from "react-icons/bs"

export const getMenuConfig = (t, isAdmin) =>
  [
    {
      to: "/dashboard",
      icon: BsHouseDoor,
      label: t("მთავარი გვერდი"),
    },
    isAdmin && {
      to: "/admin/dashboard",
      icon: BsGear,
      label: t("სამართავი პანელი"),
      submenu: [
        { to: "/admin/approvals", label: t("ვიზირება") },
        { to: "/admin/visitors", label: t("ვიზიტორები") },
        { to: "/admin/payment-monitoring", label: t("გადახდების მონიტორინგი") },
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
      icon: BsFileText,
      label: t("განცხადებები"),
      submenu: [
        {
          key: "internalPurchases",
          label: t("შიდა შესყიდვები"),
          submenu: [
            { to: "/applications/purchases/new", label: t("დამატება") },
            isAdmin && { to: "/applications/purchases/approve", label: t("ვიზირება") },
            { to: "/applications/purchases/my-requests", label: t("გაგზავნილი") },
          ],
        },
        {
          key: "vacation",
          label: t("შვებულება"),
          submenu: [
            { to: "/applications/vacation/new", label: t("დამატება") },
            isAdmin && { to: "/applications/vacation/approve", label: t("ვიზირება") },
            { to: "/applications/vacation/my-requests", label: t("გაგზავნილი") },
          ],
        },
        {
          key: "business",
          label: t("მივლინება"),
          submenu: [
            { to: "/applications/business-trip/new", label: t("დამატება") },
            isAdmin && { to: "/applications/business-trip/approve", label: t("ვიზირება") },
            { to: "/applications/business-trip/my-requests", label: t("გაგზავნილი") },
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
        { to: "/hr/documents", label: t("გაგზავნილი") },
      ],
    },
    {
      key: "contracts",
      icon: BsFileEarmark,
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
      icon: BsCalendar,
      label: t("კალენდარი"),
    },
    {
      to: "/tools/notes",
      icon: BsJournal,
      label: t("ჩანაწერები"),
    },
    {
      to: "/communication/chat",
      icon: BsChatDots,
      label: t("ჩათი"),
    },
  ].filter(Boolean)
