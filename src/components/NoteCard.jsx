import React, { memo } from "react"

const NoteCard = ({ note, onDelete, onEdit }) => (
  <div
    className="mb-4 rounded-lg bg-white dark:!bg-gray-800 shadow-md hover:shadow-lg transition-shadow duration-200 cursor-pointer"
    onClick={() => onEdit(note.id)}
  >
    <div className="p-4">
      <div className="flex justify-between items-center">
        <span className="text-sm text-gray-500 dark:!text-gray-400">
          {new Date(note.created_at).toLocaleDateString("en-US", {
            month: "short",
            day: "numeric",
          })}
        </span>
        <button
          className="px-3 py-1 text-sm text-white bg-red-500 hover:bg-red-600 dark:!bg-red-600 dark:!hover:bg-red-700 rounded transition-colors duration-200"
          onClick={e => {
            e.stopPropagation()
            onDelete(note)
          }}
        >
          წაშლა
        </button>
      </div>
      <h2 className="mt-2 text-xl font-bold text-blue-600 dark:!text-blue-400">
        {note.title}
      </h2>
      <div
        className="mt-2 text-gray-600 dark:!text-gray-300 prose dark:!prose-invert max-w-none"
        dangerouslySetInnerHTML={{ __html: note.note }}
      />
    </div>
  </div>
)

export default memo(NoteCard) 