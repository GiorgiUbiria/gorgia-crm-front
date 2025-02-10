import React, { useState } from "react"
import { useForm } from "@tanstack/react-form"
import { useCreateCalendarEvent } from "queries/calendar"
import { X } from "lucide-react"
import { DialogButton } from "components/CrmDialogs/Dialog"
import { useGetListNames as useGetUsers } from "queries/admin"

function FieldInfo({ field }) {
  if (!field.state.meta.isTouched) return null

  return (
    <div className="mt-1">
      {field.state.meta.errors.length > 0 && (
        <em className="text-sm text-red-500">
          {field.state.meta.errors.join(", ")}
        </em>
      )}
    </div>
  )
}

export const AddCalendarEventForm = ({
  onSuccess,
  defaultStartTime,
  defaultEndTime,
}) => {
  const { data: users } = useGetUsers()
  const createCalendarEventMutation = useCreateCalendarEvent()
  const [files, setFiles] = useState([])
  const [tasks, setTasks] = useState([])
  const [guests, setGuests] = useState([])
  const [submitError, setSubmitError] = useState(null)

  const formatDateTimeForInput = date => {
    if (!date) return ""
    const d = new Date(date)
    const tzOffset = d.getTimezoneOffset() * 60000
    const localDate = new Date(d.getTime() - tzOffset)
    return localDate.toISOString().slice(0, 16)
  }

  const parseDateTimeFromInput = value => {
    if (!value) return null
    const d = new Date(value)
    const tzOffset = d.getTimezoneOffset() * 60000
    return new Date(d.getTime() + tzOffset)
  }

  const form = useForm({
    defaultValues: {
      title: "",
      description: "",
      start_time: defaultStartTime
        ? formatDateTimeForInput(defaultStartTime)
        : formatDateTimeForInput(new Date()),
      end_time: defaultEndTime ? formatDateTimeForInput(defaultEndTime) : "",
      reminder_before: "",
      location: "",
    },
    validators: {
      title: value =>
        !value
          ? "სათაური სავალდებულოა"
          : value.length > 255
          ? "სათაური არ უნდა აღემატებოდეს 255 სიმბოლოს"
          : undefined,
      start_time: value => (!value ? "დაწყების დრო სავალდებულოა" : undefined),
      end_time: (value, { start_time }) => {
        if (!value) return undefined
        const startDate = new Date(start_time)
        const endDate = new Date(value)
        if (endDate <= startDate) {
          return "დასრულების დრო უნდა იყოს დაწყების დროის შემდეგ"
        }
        if (startDate.toDateString() !== endDate.toDateString()) {
          return "ივენთი უნდა დასრულდეს იმავე დღეს"
        }
        return undefined
      },
      reminder_before: value =>
        value && !["15", "30", "60"].includes(value)
          ? "შეხსენება უნდა იყოს 15, 30, ან 60 წუთით ადრე"
          : undefined,
    },
    onSubmit: async ({ value }) => {
      try {
        setSubmitError(null)

        const formData = new FormData()

        formData.append("title", value.title.trim())
        formData.append("start_time", new Date(value.start_time).toISOString())
        if (value.end_time) {
          formData.append("end_time", new Date(value.end_time).toISOString())
        }

        formData.append("is_task_event", tasks.length > 0 ? "1" : "0")

        if (value.description?.trim()) {
          formData.append("description", value.description.trim())
        }
        if (value.reminder_before) {
          formData.append("reminder_before", value.reminder_before)
        }
        if (value.location?.trim()) {
          formData.append("location", value.location.trim())
        }

        tasks.forEach((task, index) => {
          formData.append(`tasks[${index}][title]`, task.title.trim())
          formData.append(
            `tasks[${index}][description]`,
            task.description?.trim() || ""
          )
        })

        if (guests?.length > 0) {
          guests.forEach(guestId => {
            formData.append("guests[]", guestId)
          })
        }

        if (files?.length > 0) {
          files.forEach(file => {
            if (file.size > 10 * 1024 * 1024) {
              throw new Error("Files must not be larger than 10MB.")
            }
            formData.append("attachments[]", file)
          })
        }

        await createCalendarEventMutation.mutateAsync(formData)
        onSuccess?.()
      } catch (error) {
        console.error("Error creating event:", error)
        setSubmitError(
          error.response?.data?.message ||
            error.message ||
            "Failed to create event"
        )
      }
    },
  })

  const handleAddTask = () => {
    setTasks([...tasks, { title: "", description: "" }])
  }

  const handleRemoveTask = index => {
    setTasks(tasks.filter((_, i) => i !== index))
  }

  const handleTaskChange = (index, field, value) => {
    const newTasks = [...tasks]
    newTasks[index] = { ...newTasks[index], [field]: value }
    setTasks(newTasks)
  }

  const handleGuestChange = (userId, checked) => {
    if (checked) {
      setGuests([...guests, userId])
    } else {
      setGuests(guests.filter(id => id !== userId))
    }
  }

  return (
    <form
      id="addCalendarEventForm"
      onSubmit={e => {
        e.preventDefault()
        e.stopPropagation()
        form.handleSubmit()
      }}
      className="space-y-6"
    >
      <div className="space-y-4">
        <h3 className="text-lg font-medium dark:!text-gray-200">
          ძირითადი ინფორმაცია
        </h3>

        <form.Field name="title">
          {field => (
            <div>
              <label className="block text-sm font-medium mb-1 dark:!text-gray-200">
                დასახელება
              </label>
              <input
                type="text"
                required
                className="w-full rounded-md border px-3 py-2 text-sm dark:!bg-gray-700 dark:!border-gray-600 dark:!text-gray-200"
                value={field.state.value}
                onChange={e => field.handleChange(e.target.value)}
                onBlur={field.handleBlur}
              />
              <FieldInfo field={field} />
            </div>
          )}
        </form.Field>

        <form.Field name="description">
          {field => (
            <div>
              <label className="block text-sm font-medium mb-1 dark:!text-gray-200">
                აღწერა
              </label>
              <textarea
                className="w-full rounded-md border px-3 py-2 text-sm dark:!bg-gray-700 dark:!border-gray-600 dark:!text-gray-200"
                rows={3}
                value={field.state.value}
                onChange={e => field.handleChange(e.target.value)}
                onBlur={field.handleBlur}
              />
              <FieldInfo field={field} />
            </div>
          )}
        </form.Field>

        <form.Field name="location">
          {field => (
            <div>
              <label className="block text-sm font-medium mb-1 dark:!text-gray-200">
                ადგილმდებარეობა
              </label>
              <input
                type="text"
                className="w-full rounded-md border px-3 py-2 text-sm dark:!bg-gray-700 dark:!border-gray-600 dark:!text-gray-200"
                value={field.state.value}
                onChange={e => field.handleChange(e.target.value)}
                onBlur={field.handleBlur}
              />
              <FieldInfo field={field} />
            </div>
          )}
        </form.Field>

        <form.Field name="start_time">
          {field => (
            <div>
              <label className="block text-sm font-medium mb-1 dark:!text-gray-200">
                დაწყების დრო
              </label>
              <input
                type="datetime-local"
                required
                step="900"
                className="w-full rounded-md border px-3 py-2 text-sm dark:!bg-gray-700 dark:!border-gray-600 dark:!text-gray-200"
                value={field.state.value}
                onChange={e => {
                  const newDate = parseDateTimeFromInput(e.target.value)
                  field.handleChange(formatDateTimeForInput(newDate))
                }}
                onBlur={field.handleBlur}
              />
              <FieldInfo field={field} />
            </div>
          )}
        </form.Field>

        <form.Field name="end_time">
          {field => (
            <div>
              <label className="block text-sm font-medium mb-1 dark:!text-gray-200">
                დასრულების დრო
                <span className="text-gray-500 text-xs ml-1">
                  (არასავალდებულო)
                </span>
              </label>
              <input
                type="datetime-local"
                step="900"
                className="w-full rounded-md border px-3 py-2 text-sm dark:!bg-gray-700 dark:!border-gray-600 dark:!text-gray-200"
                value={field.state.value}
                onChange={e => {
                  const newDate = parseDateTimeFromInput(e.target.value)
                  field.handleChange(formatDateTimeForInput(newDate))
                }}
                onBlur={field.handleBlur}
              />
              <FieldInfo field={field} />
            </div>
          )}
        </form.Field>

        <form.Field name="reminder_before">
          {field => (
            <div>
              <label className="block text-sm font-medium mb-1 dark:!text-gray-200">
                შეხსენება
              </label>
              <select
                className="w-full rounded-md border px-3 py-2 text-sm dark:!bg-gray-700 dark:!border-gray-600 dark:!text-gray-200"
                value={field.state.value || ""}
                onChange={e => {
                  field.handleChange(e.target.value || null)
                }}
                onBlur={field.handleBlur}
              >
                <option value="">არ არის შერჩეული</option>
                <option value="15">15 წუთით ადრე</option>
                <option value="30">30 წუთით ადრე</option>
                <option value="60">1 საათით ადრე</option>
              </select>
              <FieldInfo field={field} />
            </div>
          )}
        </form.Field>
      </div>

      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-medium dark:!text-gray-200">
            დავალებები
          </h3>
          <DialogButton
            actionType="add"
            size="sm"
            onClick={handleAddTask}
            type="button"
          >
            დავალების დამატება
          </DialogButton>
        </div>
        <div className="space-y-3">
          {tasks.map((task, index) => (
            <div key={index} className="flex gap-2">
              <div className="flex-1 space-y-2">
                <input
                  type="text"
                  placeholder="დავალების სათაური"
                  className="w-full rounded-md border px-3 py-2 text-sm dark:!bg-gray-700 dark:!border-gray-600 dark:!text-gray-200"
                  value={task.title}
                  onChange={e => {
                    handleTaskChange(index, "title", e.target.value)
                  }}
                  required
                />
                <input
                  type="text"
                  placeholder="დავალების აღწერა"
                  className="w-full rounded-md border px-3 py-2 text-sm dark:!bg-gray-700 dark:!border-gray-600 dark:!text-gray-200"
                  value={task.description}
                  onChange={e => {
                    handleTaskChange(index, "description", e.target.value)
                  }}
                />
              </div>
              <button
                type="button"
                onClick={() => handleRemoveTask(index)}
                className="p-2 text-gray-500 hover:text-red-500"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          ))}
        </div>
      </div>

      {users?.length > 0 && (
        <div className="space-y-4">
          <h3 className="text-lg font-medium dark:!text-gray-200">სტუმრები</h3>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3 max-h-48 overflow-y-auto p-2 rounded-lg border dark:!border-gray-600">
            {users.map(user => (
              <label
                key={user.id}
                className={`flex items-center gap-2 p-2 rounded-lg transition-colors cursor-pointer ${
                  guests.includes(user.id)
                    ? "bg-blue-50 dark:!bg-blue-900/20 border-blue-200 dark:!border-blue-800"
                    : "bg-gray-50 dark:!bg-gray-700 hover:bg-gray-100 dark:hover:!bg-gray-600"
                } border dark:!border-gray-600`}
              >
                <input
                  type="checkbox"
                  checked={guests.includes(user.id)}
                  onChange={e => {
                    handleGuestChange(user.id, e.target.checked)
                  }}
                  className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <span className="text-sm dark:!text-gray-200 truncate">
                  {user.name}
                </span>
              </label>
            ))}
          </div>
        </div>
      )}

      <div className="space-y-4">
        <h3 className="text-lg font-medium dark:!text-gray-200">
          მიმაგრებული ფაილები
        </h3>

        <div className="relative">
          <div className="flex items-center justify-center w-full">
            <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-lg cursor-pointer bg-gray-50 dark:!bg-gray-700 hover:bg-gray-100 dark:hover:!bg-gray-600 dark:!border-gray-600">
              <div className="flex flex-col items-center justify-center pt-5 pb-6">
                <svg
                  className="w-8 h-8 mb-4 text-gray-500 dark:!text-gray-400"
                  aria-hidden="true"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 20 16"
                >
                  <path
                    stroke="currentColor"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M13 13h3a3 3 0 0 0 0-6h-.025A5.56 5.56 0 0 0 16 6.5 5.5 5.5 0 0 0 5.207 5.021C5.137 5.017 5.071 5 5 5a4 4 0 0 0 0 8h2.167M10 15V6m0 0L8 8m2-2 2 2"
                  />
                </svg>
                <p className="mb-2 text-sm text-gray-500 dark:!text-gray-400">
                  <span className="font-semibold">
                    დააჭირეთ ფაილის ასატვირთად
                  </span>{" "}
                  ან ჩააგდეთ
                </p>
                <p className="text-xs text-gray-500 dark:!text-gray-400">
                  მაქსიმალური ზომა: 10MB
                </p>
              </div>
              <input
                type="file"
                multiple
                className="hidden"
                onChange={e => {
                  setFiles([...e.target.files])
                }}
                accept="*/*"
              />
            </label>
          </div>
          {files.length > 0 && (
            <div className="mt-4 space-y-2">
              {Array.from(files).map((file, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-2 bg-gray-50 dark:!bg-gray-700 rounded-lg"
                >
                  <span className="text-sm dark:!text-gray-200 truncate">
                    {file.name}
                  </span>
                  <button
                    type="button"
                    onClick={() => {
                      const newFiles = Array.from(files)
                      newFiles.splice(index, 1)
                      setFiles(newFiles)
                    }}
                    className="p-1 text-gray-500 hover:text-red-500"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {submitError && (
        <div className="p-3 rounded-md bg-red-50 dark:!bg-red-900/20 text-red-600 dark:!text-red-400 text-sm">
          {submitError}
        </div>
      )}

      <form.Subscribe selector={state => [state.canSubmit, state.isSubmitting]}>
        {([canSubmit, isSubmitting]) => (
          <div className="hidden">
            <button
              type="submit"
              disabled={
                !canSubmit ||
                isSubmitting ||
                createCalendarEventMutation.isLoading
              }
            />
          </div>
        )}
      </form.Subscribe>
    </form>
  )
}
