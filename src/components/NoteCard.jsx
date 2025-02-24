import React, { memo } from "react"

const NoteCard = ({ note, onDelete, onEdit }) => {
  // Truncate note content for preview
  const createPreview = htmlContent => {
    const tempDiv = document.createElement("div")
    tempDiv.innerHTML = htmlContent
    const textContent = tempDiv.textContent || tempDiv.innerText
    return textContent.length > 150
      ? textContent.substring(0, 150) + "..."
      : textContent
  }

  return (
    <div
      onClick={() => onEdit(note.id)}
      className="group relative transform transition-all duration-300 hover:-translate-y-1 hover:rotate-1"
    >
      <div
        className="relative bg-yellow-50 dark:bg-yellow-100/90 rounded-lg p-6 shadow-md hover:shadow-xl transition-shadow duration-300 
                    before:absolute before:inset-0 before:z-0 before:bg-[linear-gradient(45deg,transparent_25%,rgba(0,0,0,.02)_25%,rgba(0,0,0,.02)_50%,transparent_50%,transparent_75%,rgba(0,0,0,.02)_75%)] 
                    before:bg-[length:4px_4px] before:opacity-100 before:dark:opacity-50
                    after:absolute after:inset-0 after:z-0 after:bg-gradient-to-br after:from-transparent after:to-black/5"
      >
        <div className="relative z-10">
          <div className="flex justify-between items-center mb-3">
            <span className="text-sm text-gray-600 dark:text-gray-700 font-handwriting">
              {new Date(note.created_at).toLocaleDateString("en-US", {
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </span>
            <button
              onClick={e => {
                e.stopPropagation()
                onDelete(note)
              }}
              className="opacity-0 group-hover:opacity-100 transition-opacity duration-200 
                       px-3 py-1 text-sm text-red-600 hover:text-red-700 
                       dark:text-red-700 dark:hover:text-red-800"
            >
              წაშლა
            </button>
          </div>

          <h2 className="text-xl font-bold mb-3 text-gray-800 dark:text-gray-900 font-handwriting">
            {note.title}
          </h2>

          <div className="text-gray-700 dark:text-gray-800 line-clamp-4 font-handwriting leading-relaxed">
            {createPreview(note.note)}
          </div>

          <div className="absolute top-0 right-0 w-12 h-12 bg-gradient-to-br from-black/5 to-transparent transform rotate-[-5deg]"></div>
        </div>
      </div>

      <div className="absolute inset-0 -z-10 bg-black/20 blur-md rounded-lg transform translate-y-1 scale-95 opacity-0 group-hover:opacity-30 transition-opacity duration-300"></div>
    </div>
  )
}

export default memo(NoteCard)
