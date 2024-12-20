import React from "react"
import {
  StickyNote,
  Calendar,
  Laptop2,
  Sprout,
  FileText,
  ShoppingCart,
  Umbrella,
  PlaneTakeoff,
} from "lucide-react"
import { useSelector } from "react-redux"

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
]

const colorVariants = {
  blue: "bg-blue-50 text-blue-600 hover:bg-blue-100",
  purple: "bg-purple-50 text-purple-600 hover:bg-purple-100",
  green: "bg-green-50 text-green-600 hover:bg-green-100",
  orange: "bg-orange-50 text-orange-600 hover:bg-orange-100",
  sky: "bg-sky-50 text-sky-600 hover:bg-sky-100",
  red: "bg-red-50 text-red-600 hover:bg-red-100",
  violet: "bg-violet-50 text-violet-600 hover:bg-violet-100",
  slate: "bg-slate-50 text-slate-600 hover:bg-slate-100",
}

function Dashboard() {
  const user = useSelector(state => state.user.user)
  if (!user) return null

  return (
    <div className="min-h-screen bg-gray-50 mt-16 mb-4">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex items-center space-x-2 text-sm text-gray-600 mb-6">
          <span>მთავარი</span>
          <span className="text-gray-400">/</span>
          <span className="font-medium text-gray-900">მთავარი</span>
        </div>

        <div className="mb-6 bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl shadow-lg overflow-hidden">
          <div className="px-6 py-8 sm:px-8">
            <h1 className="text-2xl font-bold text-white mb-2">
              მოგესალმებით, {user.name}!
            </h1>
            <p className="text-blue-100 text-sm">
              ამ გვერდიდან შეგიძლია შეუდგე მუშაობას! წარმატებები!
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {widgets.map(widget => {
            const Icon = widget.icon
            return (
              <div
                key={widget.id}
                className="bg-white rounded-lg shadow-sm border border-gray-100 hover:border-gray-200 hover:shadow transition-all duration-200 overflow-hidden"
              >
                <div className="p-4">
                  <div
                    className={`w-10 h-10 rounded-full ${colorVariants[widget.color]} flex items-center justify-center mb-3`}
                  >
                    <Icon className="w-5 h-5" />
                  </div>
                  <h3 className="text-base font-semibold text-gray-900 mb-1">
                    {widget.title}
                  </h3>
                  <p className="text-gray-600 text-xs mb-3">
                    {widget.description}
                  </p>
                  <button
                    onClick={() => (window.location.href = widget.link)}
                    className={`text-xs font-medium ${colorVariants[widget.color]} px-3 py-1.5 rounded-md w-full text-left hover:shadow-sm transition-all duration-200`}
                  >
                    {widget.buttonText}
                  </button>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}

export default Dashboard
