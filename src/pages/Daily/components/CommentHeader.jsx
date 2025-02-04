import React from "react"
import { MessageSquare } from "lucide-react"

const CommentHeader = ({ count }) => (
  <div className="flex items-center gap-2 mb-4 sm:mb-6 border-b border-gray-200 dark:!border-gray-700 pb-3 sm:pb-4">
    <MessageSquare size={18} className="text-[#105D8D] dark:!text-[#4BA3E3]" />
    <h2 className="text-base sm:text-lg font-medium text-gray-900 dark:!text-gray-100">
      კომენტარები ({count || 0})
    </h2>
  </div>
)

export default React.memo(CommentHeader)
