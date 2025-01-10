import React from "react"
import { MessageSquare } from "lucide-react"

const CommentHeader = ({ count }) => (
  <div className="flex items-center gap-2 mb-6 border-b pb-4">
    <MessageSquare size={20} className="text-[#105D8D]" />
    <h2 className="text-lg font-medium text-gray-900">
      კომენტარები ({count || 0})
    </h2>
  </div>
)

export default React.memo(CommentHeader) 