import React, { useState, useEffect } from "react"
import { useNavigate, useParams } from "react-router-dom"
import { getNote, updateNote } from "../../services/note"
import NoteForm from "./NoteForm"
import { ArrowLeftIcon } from "@heroicons/react/24/outline"

const EditNote = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const [isLoading, setIsLoading] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState("")
  const [note, setNote] = useState(null)

  useEffect(() => {
    const fetchNote = async () => {
      try {
        const response = await getNote(id)
        setNote(response.data)
      } catch (err) {
        setError("Failed to load note data.")
      } finally {
        setIsLoading(false)
      }
    }

    fetchNote()
  }, [id])

  const handleSubmit = async data => {
    setIsSubmitting(true)
    setError("")
    try {
      await updateNote(id, {
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
        setError(errorMessages || "ჩანაწერის განახლება ვერ მოხერხდა")
      } else {
        setError("ჩანაწერის განახლება ვერ მოხერხდა")
      }
    } finally {
      setIsSubmitting(false)
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center dark:!bg-gray-900">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    )
  }

  if (!note && !isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center dark:!bg-gray-900">
        <p className="text-red-500 dark:!text-red-400">ჩანაწერი ვერ მოიძებნა</p>
      </div>
    )
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
            ჩანაწერის განახლება
          </h2>
        </div>

        <NoteForm
          onSubmit={handleSubmit}
          isSubmitting={isSubmitting}
          error={error}
          initialValues={{
            title: note?.title || "",
            content: note?.content || "",
          }}
        />
      </div>
    </div>
  )
}

export default EditNote
