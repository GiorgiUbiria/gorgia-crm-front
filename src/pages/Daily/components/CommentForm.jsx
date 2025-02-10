import React from "react"
import RichTextEditor from "./RichTextEditor"

const CommentForm = ({
  value,
  onChange,
  onSubmit,
  onCancel,
  isLoading,
  placeholder = "დაწერე კომენტარი...",
  submitText = "კომენტარის დამატება",
}) => {
  return (
    <form onSubmit={onSubmit} className="space-y-3 sm:space-y-4">
      <RichTextEditor
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        disabled={isLoading}
      />
      <div className="flex items-center justify-end gap-2 sm:gap-3">
        <button
          type="button"
          onClick={onCancel}
          className="px-3 sm:px-4 py-2 text-sm font-medium text-gray-700 dark:!text-gray-200 hover:text-gray-900 dark:!hover:text-white transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#105D8D] dark:!focus:ring-offset-gray-800 rounded-lg"
        >
          გაუქმება
        </button>
        <button
          type="submit"
          disabled={isLoading}
          className="px-3 sm:px-4 py-2 text-sm font-medium text-white bg-[#105D8D] hover:bg-[#0D4D75] dark:!bg-[#1A7AB8] dark:!hover:bg-[#1569A0] rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#105D8D] dark:!focus:ring-offset-gray-800 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isLoading ? "იგზავნება..." : submitText}
        </button>
      </div>
    </form>
  )
}

export default CommentForm
