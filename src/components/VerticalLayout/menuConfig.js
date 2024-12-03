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
} from "react-icons/bs"

export const getMenuConfig = (t, isAdmin, isDepartmentHead, departmentId) =>
  [
    {
      key: "contracts",
      icon: BsFileEarmark,
      label: t("ხელშეკრულებები"),
      submenu: [
        { to: "/legal/contracts/new", label: t("მოთხოვნა") },
        (isAdmin || (isDepartmentHead && departmentId === 10)) && {
          to: "/legal/contracts/approve",
          label: t("ვიზირება"),
        },
        (isAdmin || departmentId === 10) && {
          to: "/legal/contracts/archive",
          label: t("არქივი"),
        },
        { to: "/legal/contracts/my-requests", label: t("გაგზავნილი") },
      ],
    },
  ].filter(Boolean)
