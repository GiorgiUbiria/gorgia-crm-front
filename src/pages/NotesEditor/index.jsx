import React, { useEffect, useState, useCallback, useMemo } from "react"
import { useParams, useNavigate } from "react-router-dom"
import { CircularProgress } from "@mui/material"
import ArrowBackIcon from "@mui/icons-material/ArrowBack"

import SaveIcon from "@mui/icons-material/Save"
import ReactQuill from "react-quill"
import "react-quill/dist/quill.snow.css"
import { useForm, Controller } from "react-hook-form"
import { createNote, updateNote, getNote } from "../../services/note"

const NotesEditor = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const [loadingState, setLoadingState] = useState({
    isFetching: false,
    isSaving: false,
  })
  const [error, setError] = useState("")

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors, isDirty },
  } = useForm({
    defaultValues: {
      title: "",
      content: "",
    },
  })

  const isNew = useMemo(() => id === "new", [id])

  const fetchNote = useCallback(
    async noteId => {
      if (isNew) return
      setLoadingState(prev => ({ ...prev, isFetching: true }))
      try {
        const response = await getNote(noteId)
        const { title, content } = response.data
        reset({
          title: title || "",
          content: content || "",
        })
      } catch (err) {
        setError("დაფიქსირდა შეცდომა")
      } finally {
        setLoadingState(prev => ({ ...prev, isFetching: false }))
      }
    },
    [reset, isNew]
  )

  useEffect(() => {
    fetchNote(id)
  }, [id, fetchNote])

  const onSubmit = async data => {
    setLoadingState(prev => ({ ...prev, isSaving: true }))
    setError("")
    try {
      const payload = {
        title: data.title.trim(),
        content: data.content.trim(),
      }

      if (isNew) {
        await createNote(payload)
      } else {
        await updateNote(id, payload)
      }
      navigate("/tools/notes")
    } catch (err) {
      const serverErrors = err.response?.data
      if (serverErrors) {
        const errorMessages = Object.values(serverErrors)
          .flat()
          .filter(Boolean)
          .join(", ")
        setError(errorMessages || "დაფიქსირდა შეცდომა")
      } else {
        setError("დაფიქსირდა შეცდომა")
      }
    } finally {
      setLoadingState(prev => ({ ...prev, isSaving: false }))
    }
  }

  return (
    <div className="min-h-screen p-4 dark:!bg-gray-900">
      <div className="max-w-4xl mx-auto bg-white dark:!bg-gray-800 rounded-lg shadow-lg p-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-center mb-6 gap-4">
          {/* Back Button */}
          <button
            onClick={() => navigate("/tools/notes")}
            className="text-blue-600 dark:!text-blue-400 hover:text-blue-700 dark:!hover:text-blue-300 p-2 rounded-full hover:bg-gray-100 dark:!hover:bg-gray-700 transition-colors"
          >
            <ArrowBackIcon className="w-6 h-6" />
          </button>

          {/* Save Button */}
          <button
            onClick={handleSubmit(onSubmit)}
            disabled={loadingState.isSaving || !isDirty}
            className="flex items-center gap-2 bg-blue-600 dark:!bg-blue-500 hover:bg-blue-700 dark:!hover:bg-blue-600 text-white px-6 py-2 rounded-full font-medium disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {loadingState.isSaving ? (
              <div className="w-6 h-6 animate-spin">
                <CircularProgress className="w-full h-full" color="inherit" />
              </div>
            ) : (
              <SaveIcon className="w-5 h-5" />
            )}
            {loadingState.isSaving ? "Saving..." : "Save"}
          </button>
        </div>

        {/* Title Input */}
        <Controller
          name="title"
          control={control}
          rules={{
            required: "Title is required",
            maxLength: {
              value: 255,
              message: "Title must not exceed 255 characters",
            },
          }}
          render={({ field }) => (
            <div className="mb-6">
              <input
                {...field}
                type="text"
                placeholder="Note Title..."
                className="w-full text-2xl font-bold text-blue-600 dark:!text-blue-400 bg-transparent border-none focus:ring-0 placeholder-gray-400 dark:!placeholder-gray-500"
              />
              {errors.title && (
                <p className="text-sm text-red-500 mt-1">
                  {errors.title.message}
                </p>
              )}
            </div>
          )}
        />

        {/* Content Editor */}
        <Controller
          name="content"
          control={control}
          rules={{ required: "Content is required" }}
          render={({ field }) =>
            loadingState.isFetching ? (
              <div className="flex justify-center py-8">
                <CircularProgress className="w-8 h-8" />
              </div>
            ) : (
              <div className="mb-8">
                <ReactQuill
                  {...field}
                  onChange={value => field.onChange(value)}
                  placeholder="Type your note here..."
                  theme="snow"
                  className="h-96 bg-gray-50 dark:!bg-gray-700 rounded-lg"
                  modules={{
                    toolbar: [
                      [{ header: [1, 2, false] }],
                      ["bold", "italic", "underline", "strike"],
                      [{ list: "ordered" }, { list: "bullet" }],
                      ["link", "image"],
                      ["clean"],
                    ],
                  }}
                />
                {errors.content && (
                  <p className="text-sm text-red-500 mt-2">
                    {errors.content.message}
                  </p>
                )}
              </div>
            )
          }
        />

        {/* Error Message */}
        {error && (
          <div className="mt-5 p-3 bg-red-50 dark:!bg-red-900/20 rounded-lg">
            <p className="text-red-600 dark:!text-red-400">{error}</p>
          </div>
        )}
      </div>
    </div>
  )
}

export default NotesEditor
