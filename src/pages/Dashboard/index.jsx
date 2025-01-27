import React from "react"
import {
  StickyNote,
  Calendar,
  Laptop2,
  Sprout,
  BookOpen,
  FileText,
  ShoppingCart,
  Umbrella,
  PlaneTakeoff,
  ArrowRight,
  CalendarDays,
} from "lucide-react"
import { Link } from "react-router-dom"

const widgets = [
  {
    id: 1,
    title: "ჩანაწერები",
    description: "შექმენი, შეინახე, გააზიარე შენი ჩანაწერები.",
    icon: StickyNote,
    buttonText: "იხილე",
    link: "/tools/notes",
    color: "blue",
  },
  {
    id: 2,
    title: "კალენდარი",
    description: "გამოიყენე კალენდარი თარიღების ჩასანიშნად.",
    icon: Calendar,
    buttonText: "იხილე",
    link: "/tools/calendar",
    color: "purple",
  },
  {
    id: 3,
    title: "IT თასქები",
    description: "მოითხოვე დახმარება IT დეპარტამენტისგან.",
    icon: Laptop2,
    buttonText: "იხილე",
    link: "/support/it-tasks",
    color: "green",
  },
  {
    id: 4,
    title: "სამეურნეო თასქები",
    description: "მოითხოვე დახმარება სამეურნეო თასქების შესასრულებლად.",
    icon: Sprout,
    buttonText: "იხილე",
    link: "/support/farm-tasks",
    color: "orange",
  },
  {
    id: 5,
    title: "HR ცნობები",
    description: "მოითხოვე ახალი HR ცნობა.",
    icon: FileText,
    buttonText: "მოითხოვე",
    link: "/hr/documents/new",
    color: "sky",
  },
  {
    id: 6,
    title: "შიდა შესყიდვები",
    description: "მოითხოვე ახალი შიდა შესყიდვა.",
    icon: ShoppingCart,
    buttonText: "მოითხოვე",
    link: "/applications/purchases/new",
    color: "red",
  },
  {
    id: 7,
    title: "შვებულება",
    description: "მოითხოვე შვებულება.",
    icon: Umbrella,
    buttonText: "მოითხოვე",
    link: "/applications/vacation/new",
    color: "violet",
  },
  {
    id: 8,
    title: "მივლინება",
    description: "მოითხოვე მივლინება.",
    icon: PlaneTakeoff,
    buttonText: "მოითხოვე",
    link: "/applications/business-trip/new",
    color: "slate",
  },
  {
    id: 9,
    title: "elearning.gorgia.ge",
    description: "გადადი სასწავლო პლატფორმაზე",
    icon: BookOpen,
    buttonText: "გადასვლა",
    link: "https://elearning.gorgia.ge/",
    color: "blue",
  },
  {
    id: 10,
    title: "shemosvlebi.gorgia.ge",
    description: "გადადი შემოსვლების კალენდარზე",
    icon: Calendar,
    buttonText: "გადასვლა",
    link: "https://shemosvlebi.gorgia.ge/",
    color: "violet",
  },
  {
    id: 11,
    title: "trainingcalendar.gorgia.ge",
    description: "გადადი სასწავლო კალენდარზე",
    icon: CalendarDays,
    buttonText: "გადასვლა",
    link: "https://trainingcalendar.gorgia.ge/",
    color: "green",
  },
  {
    id: 12,
    title: "...",
    description: "მალე დაემატება",
    icon: PlaneTakeoff,
    buttonText: "მოითხოვე",
    link: "/applications/business-trip/new",
    color: "slate",
    disabled: true,
  },
]

const colorVariants = {
  blue: {
    bg: "bg-blue-50 dark:!bg-blue-500/10",
    text: "text-blue-600 dark:!text-blue-400",
    hover: "hover:bg-blue-100 dark:!hover:bg-blue-500/20",
    border: "border-blue-100 dark:!border-blue-500/20",
    gradient: "from-blue-500 to-blue-600 dark:!from-blue-600 dark:!to-blue-700",
  },
  purple: {
    bg: "bg-purple-50 dark:!bg-purple-500/10",
    text: "text-purple-600 dark:!text-purple-400",
    hover: "hover:bg-purple-100 dark:!hover:bg-purple-500/20",
    border: "border-purple-100 dark:!border-purple-500/20",
    gradient:
      "from-purple-500 to-purple-600 dark:!from-purple-600 dark:!to-purple-700",
  },
  green: {
    bg: "bg-green-50 dark:!bg-green-500/10",
    text: "text-green-600 dark:!text-green-400",
    hover: "hover:bg-green-100 dark:!hover:bg-green-500/20",
    border: "border-green-100 dark:!border-green-500/20",
    gradient:
      "from-green-500 to-green-600 dark:!from-green-600 dark:!to-green-700",
  },
  orange: {
    bg: "bg-orange-50 dark:!bg-orange-500/10",
    text: "text-orange-600 dark:!text-orange-400",
    hover: "hover:bg-orange-100 dark:!hover:bg-orange-500/20",
    border: "border-orange-100 dark:!border-orange-500/20",
    gradient:
      "from-orange-500 to-orange-600 dark:!from-orange-600 dark:!to-orange-700",
  },
  sky: {
    bg: "bg-sky-50 dark:!bg-sky-500/10",
    text: "text-sky-600 dark:!text-sky-400",
    hover: "hover:bg-sky-100 dark:!hover:bg-sky-500/20",
    border: "border-sky-100 dark:!border-sky-500/20",
    gradient: "from-sky-500 to-sky-600 dark:!from-sky-600 dark:!to-sky-700",
  },
  red: {
    bg: "bg-red-50 dark:!bg-red-500/10",
    text: "text-red-600 dark:!text-red-400",
    hover: "hover:bg-red-100 dark:!hover:bg-red-500/20",
    border: "border-red-100 dark:!border-red-500/20",
    gradient: "from-red-500 to-red-600 dark:!from-red-600 dark:!to-red-700",
  },
  violet: {
    bg: "bg-violet-50 dark:!bg-violet-500/10",
    text: "text-violet-600 dark:!text-violet-400",
    hover: "hover:bg-violet-100 dark:!hover:bg-violet-500/20",
    border: "border-violet-100 dark:!border-violet-500/20",
    gradient:
      "from-violet-500 to-violet-600 dark:!from-violet-600 dark:!to-violet-700",
  },
  slate: {
    bg: "bg-slate-50 dark:!bg-slate-500/10",
    text: "text-slate-600 dark:!text-slate-400",
    hover: "hover:bg-slate-100 dark:!hover:bg-slate-500/20",
    border: "border-slate-100 dark:!border-slate-500/20",
    gradient:
      "from-slate-500 to-slate-600 dark:!from-slate-600 dark:!to-slate-700",
  },
}

function WidgetCard({ widget }) {
  const Icon = widget.icon
  const colors = colorVariants[widget.color]
  const isDisabled = widget.disabled
  const isExternal = widget.link.startsWith("http")

  const CardContent = () => (
    <div className="p-6 h-full flex flex-col">
      <div
        className={`w-14 h-14 rounded-2xl ${colors.bg} ${colors.text} flex items-center justify-center mb-4 transition-transform duration-300 group-hover:scale-110`}
      >
        <Icon className="w-7 h-7" />
      </div>
      <h3 className="text-lg font-semibold text-gray-900 dark:!text-gray-100 mb-2">
        {widget.title}
      </h3>
      <p className="text-gray-600 dark:!text-gray-400 text-sm mb-4 flex-grow">
        {widget.description}
      </p>
      <div
        className={`
        inline-flex items-center gap-2 text-sm font-medium px-4 py-2.5 rounded-xl
        transition-all duration-300 group-hover:gap-3
        ${
          isDisabled
            ? "bg-gray-100 dark:!bg-gray-800 text-gray-400 dark:!text-gray-500 cursor-not-allowed"
            : `${colors.bg} ${colors.text} ${colors.hover}`
        }
      `}
      >
        {widget.buttonText}
        <ArrowRight className="w-4 h-4" />
      </div>
    </div>
  )

  const cardClasses = `
    group relative bg-white dark:!bg-gray-800 rounded-2xl
    border border-gray-100 dark:!border-gray-700
    hover:border-gray-200 dark:!hover:border-gray-600
    shadow-sm hover:shadow-md
    transition-all duration-300
    overflow-hidden
    animate-fade-in
    ${isDisabled ? "opacity-60 cursor-not-allowed" : "hover:-translate-y-1"}
  `

  if (isDisabled) {
    return (
      <div className={cardClasses}>
        <CardContent />
      </div>
    )
  }

  if (isExternal) {
    return (
      <a
        href={widget.link}
        target="_blank"
        rel="noopener noreferrer"
        className={cardClasses}
      >
        <CardContent />
      </a>
    )
  }

  return (
    <Link to={widget.link} className={cardClasses}>
      <CardContent />
    </Link>
  )
}

function Dashboard() {
  const user = JSON.parse(sessionStorage.getItem("authUser"))

  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-[calc(100vh-4rem)]">
        <div className="animate-pulse text-gray-600 dark:!text-gray-400">
          Loading user data...
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen dark:!bg-gray-900 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        {/* Welcome Card */}
        <div className="relative bg-gradient-to-br from-blue-500 to-blue-700 dark:!from-blue-600 dark:!to-blue-900 rounded-2xl shadow-xl overflow-hidden mb-8 animate-fade-in">
          {/* Background pattern */}
          <div className="absolute inset-0 bg-grid-white/[0.05] opacity-50" />

          <div className="relative px-6 sm:px-8 py-8 sm:py-10">
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white mb-3 tracking-tight">
              მოგესალმებით, {user.name}!
            </h1>
            <p className="text-blue-100 text-base sm:text-lg max-w-2xl">
              ამ გვერდიდან შეგიძლია შეუდგე მუშაობას! წარმატებები!
            </p>
          </div>
        </div>

        {/* Widgets Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {widgets.map((widget, index) => (
            <WidgetCard
              key={widget.id}
              widget={widget}
              style={{
                animationDelay: `${index * 50}ms`,
              }}
            />
          ))}
        </div>
      </div>
    </div>
  )
}

export default Dashboard
