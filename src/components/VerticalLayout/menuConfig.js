import {
  BsHouseDoor,
  BsGear,
  BsPerson,
  BsFileText,
  BsFolder,
  BsFileEarmark,
  BsShieldCheck,
  BsHeadset,
  BsCreditCard2Front,
  BsPeople,
  BsCalendar,
  BsJournal,
  BsChatDots,
  BsTelephone,
  BsCash,
} from "react-icons/bs"

export const getMenuConfig = (t, isAdmin) =>
  [
    {
      to: "/",
      icon: BsHouseDoor,
      label: t("მთავარი გვერდი"),
    },
    isAdmin && {
      to: "/admin",
      icon: BsGear,
      label: t("სამართავი პანელი"),
    },
    {
      to: "/profile",
      icon: BsPerson,
      label: t("პროფილი"),
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
            { to: "/procurement", label: t("დამატება") },
            isAdmin && { to: "/procurement/manage", label: t("ვიზირება") },
            { to: "/user-procurements", label: t("გაგზავნილი") },
          ],
        },
        {
          key: "vacation",
          label: t("შვებულება"),
          submenu: [
            { to: "/vacation", label: t("დამატება") },
            isAdmin && { to: "/vacation/manage", label: t("ვიზირება") },
            { to: "/user-vocations", label: t("გაგზავნილი") },
          ],
        },
        {
          key: "business",
          label: t("მივლინება"),
          submenu: [
            { to: "/business", label: t("დამატება") },
            isAdmin && { to: "/business/manage", label: t("ვიზირება") },
            { to: "/user-business", label: t("გაგზავნილი") },
          ],
        },
      ],
    },
    {
      key: "hrDocs",
      icon: BsFolder,
      label: t("HR დოკუმენტები"),
      submenu: [
        { to: "/hr", label: t("ცნობები") },
        isAdmin && { to: "/hr-approve", label: t("ვიზირება") },
        { to: "/hr", label: t("გაგზავნილი") },
      ],
    },
    {
      key: "contracts",
      icon: BsFileEarmark,
      label: t("ხელშეკრულებები"),
      submenu: [
        { to: "/lawyer", label: t("მოთხოვნა") },
        isAdmin && { to: "/lawyer-approve", label: t("ვიზირება") },
        isAdmin && { to: "/lawyer-history", label: t("არქივი") },
        { to: "/user-agreements", label: t("გაგზავნილი") },
      ],
    },
    isAdmin && {
      to: "/head",
      icon: BsShieldCheck,
      label: t("ვიზირება"),
    },
    {
      to: "/it-tasks",
      icon: BsHeadset,
      label: t("IT მხარდაჭერა"),
    },
    {
      to: "/contacts-list",
      icon: BsCreditCard2Front,
      label: t("ლოიალობის ბარათი"),
    },
    isAdmin && {
      to: "/visitors",
      icon: BsPeople,
      label: t("ვიზიტორები"),
    },
    isAdmin && {
      to: "/payment-monitoring",
      icon: BsCash,
      label: t("გადახდების მონიტორინგი"),
    },
    {
      key: "leads",
      icon: BsTelephone,
      label: t("ლიდები"),
      submenu: [
        { to: "/vip-leads", label: t("VIP") },
        { to: "/corporate-leads", label: t("კორპორატიული") },
      ],
    },
    {
      to: "/calendar",
      icon: BsCalendar,
      label: t("კალენდარი"),
    },
    {
      to: "/notes",
      icon: BsJournal,
      label: t("შეტყობინებები"),
    },
    {
      to: "/chat",
      icon: BsChatDots,
      label: t("ჩათი"),
    },
  ].filter(Boolean)
