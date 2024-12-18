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
  ListTodo,
  Plus,
} from "lucide-react"

// Mock user data (replace with your actual user state management)
const user = {
  name: "John Doe",
}

const widgets = [
  {
    id: 1,
    title: "ჩანაწერები",
    description: "შეინახე და გააზიარე თქვენი ჩანაწერები აქ.",
    icon: StickyNote,
    buttonText: "იხილე ჩანაწერები",
    link: "/tools/notes",
    color: "blue",
  },
  {
    id: 2,
    title: "კალენდარი",
    description: "გამოიყენე კალენდარი მნიშვნელოვან თარიღების შესანახად.",
    icon: Calendar,
    buttonText: "იხილე კალენდარი",
    link: "/tools/calendar",
    color: "purple",
  },
  {
    id: 3,
    title: "IT თასქები",
    description: "მოითხოვე დახმარება IT დეპარტამენტისგან.",
    icon: Laptop2,
    buttonText: "იხილე IT თასქები",
    link: "/support/it-tasks",
    color: "green",
  },
  {
    id: 4,
    title: "სამეურნეო თასქები",
    description: "მოითხოვე დახმარება სამეურნეო თასქების შესასრულებლად.",
    icon: Sprout,
    buttonText: "იხილე ფერმის თასქები",
    link: "/support/farm-tasks",
    color: "orange",
  },
  {
    id: 5,
    title: "HR ცნობები",
    description: "მოითხოვე ახალი HR ცნობა.",
    icon: FileText,
    buttonText: "მოითხოვე ცნობა",
    link: "/hr/documents/new",
    color: "sky",
  },
  {
    id: 6,
    title: "შიდა შესყიდვები",
    description: "მოითხოვე ახალი შიდა შესყიდვა.",
    icon: ShoppingCart,
    buttonText: "მოითხოვე ახალიში შესყიდვა",
    link: "/applications/purchases/new",
    color: "red",
  },
  {
    id: 7,
    title: "შვებულება",
    description: "მოითხოვე შვებულება.",
    icon: Umbrella,
    buttonText: "მოითხოვე შვებულება",
    link: "/applications/vacation/new",
    color: "violet",
  },
  {
    id: 8,
    title: "მივადღენა",
    description: "მოითხოვე მასწავლებლობა.",
    icon: PlaneTakeoff,
    buttonText: "მოითხოვე მიხლინება",
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
  if (!user) return null

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Breadcrumbs */}
        <div className="flex items-center space-x-2 text-sm text-gray-600 mb-8">
          <span>მთავარი</span>
          <span className="text-gray-400">/</span>
          <span className="font-medium text-gray-900">მთავარი</span>
        </div>

        {/* Welcome Card */}
        <div className="mb-8 bg-gradient-to-r from-blue-500 to-blue-600 rounded-2xl shadow-xl overflow-hidden">
          <div className="px-8 py-10 sm:px-10">
            <h1 className="text-3xl font-bold text-white mb-4">
              მოგესალმებით, {user.name}!
            </h1>
            <p className="text-blue-100 mb-8">
              ამ გვერდზე შეგიძლია ნახო შენი დავალებები, კალენდარი და მოთხოვნები.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <button
                onClick={() => (window.location.href = "/tasks/new")}
                className="inline-flex items-center justify-center px-6 py-3 bg-white text-blue-600 rounded-full font-medium hover:bg-blue-50 transition-colors duration-200"
              >
                <Plus className="w-5 h-5 mr-2" />
                გაუშვება ახალი დავალება
              </button>
              <button
                onClick={() => (window.location.href = "/tasks/today")}
                className="inline-flex items-center justify-center px-6 py-3 border-2 border-white text-white rounded-full font-medium hover:bg-white/10 transition-colors duration-200"
              >
                <ListTodo className="w-5 h-5 mr-2" />
                ნახე ჩემი ამდღევანდელი დავალებები
              </button>
            </div>
          </div>
        </div>

        {/* Widgets Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {widgets.map(widget => {
            const Icon = widget.icon
            return (
              <div
                key={widget.id}
                className="bg-white rounded-xl shadow-sm border border-gray-100 hover:border-gray-200 hover:shadow-md transition-all duration-200 overflow-hidden"
              >
                <div className="p-6">
                  <div
                    className={`w-12 h-12 rounded-full ${
                      colorVariants[widget.color]
                    } flex items-center justify-center mb-4`}
                  >
                    <Icon className="w-6 h-6" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    {widget.title}
                  </h3>
                  <p className="text-gray-600 text-sm mb-4">
                    {widget.description}
                  </p>
                  <button
                    onClick={() => (window.location.href = widget.link)}
                    className={`text-sm font-medium ${
                      colorVariants[widget.color]
                    } px-4 py-2 rounded-lg w-full text-left hover:shadow-sm transition-all duration-200`}
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
