import React from "react"
import { MessageSquare } from "lucide-react"

const CommentHeader = ({ count }) => (
  <div className="flex items-center gap-2 mb-4 sm:mb-6">
    <MessageSquare size={16} className="sm:w-5 sm:h-5 text-[#105D8D] dark:!text-[#4BA3E3]" />
    <h2 className="text-base sm:text-lg font-medium text-gray-900 dark:!text-gray-100">
      კომენტარები ({count || 0})
    </h2>
  </div>
)

export default React.memo(CommentHeader)
