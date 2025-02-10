import React from "react"
import { useForm, Controller } from "react-hook-form"
import ReactQuill from "react-quill"
import "react-quill/dist/quill.snow.css"
import { ArrowDownIcon } from "@heroicons/react/24/outline"

const NoteForm = ({ onSubmit, isSubmitting, error, initialValues }) => {
  const {
    control,
    handleSubmit,
    formState: { errors, isDirty },
  } = useForm({
    defaultValues: initialValues,
  })

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="flex flex-col h-[calc(100vh-200px)]"
    >
      <div className="space-y-6 flex-1">
        <Controller
          name="title"
          control={control}
          rules={{
            required: "სათაური აუცილებელია",
            maxLength: {
              value: 255,
              message: "სათაური არ უნდა აღემატებოდეს 255 სიმბოლოს",
            },
          }}
          render={({ field }) => (
            <div className="space-y-2">
              <input
                {...field}
                type="text"
                placeholder="ჩანაწერის სათაური..."
                className="w-full text-2xl font-bold text-blue-600 dark:!text-blue-300 bg-transparent border-none focus:ring-0 placeholder-gray-400 dark:!placeholder-gray-400"
              />
              {errors.title && (
                <p className="text-sm text-red-500 dark:!text-red-300">
                  {errors.title.message}
                </p>
              )}
            </div>
          )}
        />

        <Controller
          name="content"
          control={control}
          rules={{ required: "Content is required" }}
          render={({ field }) => (
            <div className="space-y-2 h-[calc(100%-150px)]">
              <ReactQuill
                {...field}
                onChange={value => field.onChange(value)}
                placeholder="ჩაწერე აქ..."
                theme="snow"
                className=" bg-gray-50 dark:!bg-gray-700 rounded-lg border text-gray-900 dark:!text-gray-100 border-gray-200 dark:!border-gray-600"
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
                <p className="text-sm text-red-500 dark:!text-red-300">
                  {errors.content.message}
                </p>
              )}
            </div>
          )}
        />

        {error && (
          <div className="p-3 bg-red-50 dark:!bg-red-900/20 rounded-lg">
            <p className="text-red-600 dark:!text-red-400">{error}</p>
          </div>
        )}
      </div>

      <div className="flex justify-end mt-6">
        <button
          type="submit"
          disabled={isSubmitting || !isDirty}
          className="flex items-center gap-2 bg-blue-600 dark:!bg-blue-500 hover:bg-blue-700 dark:!hover:bg-blue-600 text-white px-6 py-2 rounded-full font-medium disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          {isSubmitting ? (
            <div className="w-5 h-5 animate-spin rounded-full border-2 border-white border-t-transparent" />
          ) : (
            <ArrowDownIcon className="w-5 h-5" />
          )}
          {isSubmitting ? "ინახება..." : "შენახვა"}
        </button>
      </div>
    </form>
  )
}

export default NoteForm
