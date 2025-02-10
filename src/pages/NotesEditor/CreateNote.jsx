import React, { useState } from "react"
import { useNavigate } from "react-router-dom"
import { createNote } from "../../services/note"
import NoteForm from "./NoteForm"
import { ArrowLeftIcon } from "@heroicons/react/24/outline"

const CreateNote = () => {
  const navigate = useNavigate()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState("")

  const handleSubmit = async data => {
    setIsSubmitting(true)
    setError("")
    try {
      await createNote({
        title: data.title.trim(),
        content: data.content.trim(),
      })
      navigate("/tools/notes")
    } catch (err) {
      const serverErrors = err.response?.data
      if (serverErrors) {
        const errorMessages = Object.values(serverErrors)
          .flat()
          .filter(Boolean)
          .join(", ")
        setError(errorMessages || "ახალი ჩანაწერის შექმნა ვერ მოხერხდა")
      } else {
        setError("ახალი ჩანაწერის შექმნა ვერ მოხერხდა")
      }
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen p-4 dark:!bg-gray-900">
      <div className="max-w-4xl mx-auto bg-white dark:!bg-gray-800 rounded-lg shadow-lg p-6">
        <div className="flex flex-col sm:flex-row justify-between items-center mb-6 gap-4">
          <button
            onClick={() => navigate("/tools/notes")}
            className="text-blue-600 dark:!text-blue-400 hover:text-blue-700 dark:!hover:text-blue-300 p-2 rounded-full hover:bg-gray-100 dark:!hover:bg-gray-700 transition-colors"
          >
            <ArrowLeftIcon className="w-6 h-6" />
          </button>

          <h2 className="text-xl font-semibold text-gray-800 dark:!text-gray-200">
            ახალი ჩანაწერის შექმნა
          </h2>
        </div>

        <NoteForm
          onSubmit={handleSubmit}
          isSubmitting={isSubmitting}
          error={error}
          initialValues={{ title: "", content: "" }}
        />
      </div>
    </div>
  )
}

export default CreateNote
