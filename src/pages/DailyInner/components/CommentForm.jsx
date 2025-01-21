import React from "react"
import RichTextEditor from "./RichTextEditor"
import { toast } from "react-toastify"

const CommentForm = ({
  onSubmit,
  value,
  onChange,
  onCancel,
  isLoading,
  placeholder = "დაწერე კომენტარი...",
  submitText = "კომენტარის დამატება",
  className = "mb-8",
}) => {
  const handleSubmit = async e => {
    e.preventDefault()
    if (!value.trim()) return

    try {
      console.log("Submitting comment:", { value })
      let commentData
      try {
        // Try to parse the value as JSON first
        commentData = JSON.parse(value)
        console.log("Parsed value as JSON:", commentData)
      } catch (e) {
        // If parsing fails, treat as plain text
        console.log("Using plain text format")
        commentData = {
          text: value,
          format: {
            bold: false,
            italic: false,
            color: "black",
            fontSize: "normal",
          },
        }
      }

      console.log("Comment data to submit:", commentData)
      await onSubmit(e)
    } catch (error) {
      console.error("❌ Comment submission failed:", error)
      toast.error("კომენტარის დამატების დროს დაფიქსირდა შეცდომა")
    }
  }

  return (
    <form onSubmit={handleSubmit} className={className}>
      <RichTextEditor
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        disabled={isLoading}
      />
      <div className="mt-3 flex justify-end gap-2">
        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2 text-sm text-gray-600 hover:text-gray-800 dark:!text-gray-400 dark:!hover:text-gray-200"
          >
            გაუქმება
          </button>
        )}
        <button
          type="submit"
          disabled={isLoading}
          className="px-4 py-2 bg-[#105D8D] hover:bg-[#0D4D75] text-white rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed dark:!bg-[#1A7AB8] dark:!hover:bg-[#1569A0]"
        >
          {isLoading ? "იგზავნება..." : submitText}
        </button>
      </div>
    </form>
  )
}

CommentForm.defaultProps = {
  placeholder: "დაწერე კომენტარი...",
  submitText: "კომენტარის დამატება",
  className: "mb-8",
  isLoading: false,
  onCancel: null,
}

export default React.memo(CommentForm)
