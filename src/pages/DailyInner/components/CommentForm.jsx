import React from "react"

const CommentForm = ({
  onSubmit,
  value,
  onChange,
  onCancel,
  isLoading,
  placeholder = "დაწერე კომენტარი...",
  submitText = "კომენტარის დამატება",
  className = "mb-8",
}) => (
  <form onSubmit={onSubmit} className={className}>
    <textarea
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-[#105D8D] focus:ring-1 focus:ring-[#105D8D] focus:outline-none transition-colors resize-none"
      rows={4}
      disabled={isLoading}
    />
    <div className="mt-3 flex justify-end gap-2">
      {onCancel && (
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2 text-sm text-gray-600 hover:text-gray-800"
        >
          გაუქმება
        </button>
      )}
      <button
        type="submit"
        disabled={isLoading}
        className="px-4 py-2 bg-[#105D8D] hover:bg-[#0D4D75] text-white rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {isLoading ? "იგზავნება..." : submitText}
      </button>
    </div>
  </form>
)

CommentForm.defaultProps = {
  placeholder: "დაწერე კომენტარი...",
  submitText: "კომენტარის დამატება",
  className: "mb-8",
  isLoading: false,
  onCancel: null,
}

export default React.memo(CommentForm)
