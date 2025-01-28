import React, { useState, useEffect } from "react"
import { useFormik } from "formik"
import * as Yup from "yup"
import CrmDialog, { DialogButton } from "components/CrmDialogs/Dialog"
import CrmSelect from "components/CrmSelect"
import classNames from "classnames"
import { format } from "date-fns"
import { useGetListNames } from "queries/admin"
import {
  useCreateCalendarEvent,
  useUpdateCalendarEvent,
} from "queries/calendar"

const eventTypes = [
  { value: "single", label: "ერთჯერადი" },
  { value: "recurring", label: "განმეორებადი" },
]

const reminderOptions = [
  { value: "15", label: "15 წუთით ადრე" },
  { value: "30", label: "30 წუთით ადრე" },
  { value: "60", label: "1 საათით ადრე" },
]

const recurrenceFrequencies = [
  { value: "daily", label: "ყოველდღიური" },
  { value: "weekly", label: "ყოველკვირეული" },
  { value: "monthly", label: "ყოველთვიური" },
  { value: "yearly", label: "ყოველწლიური" },
]

const validationSchema = Yup.object().shape({
  title: Yup.string().required("სათაური სავალდებულოა"),
  description: Yup.string(),
  start_time: Yup.date().required("დაწყების დრო სავალდებულოა"),
  end_time: Yup.date()
    .required("დასრულების დრო სავალდებულოა")
    .min(
      Yup.ref("start_time"),
      "დასრულების დრო უნდა იყოს დაწყების დროის შემდეგ"
    ),
  event_type: Yup.string().required("ღონისძიების ტიპი სავალდებულოა"),
  reminder_before: Yup.string().nullable(),
  is_task_event: Yup.boolean(),
  location: Yup.string(),
  guests: Yup.array().of(Yup.number()),
  attachments: Yup.array().of(
    Yup.mixed().test("fileSize", "ფაილი ძალიან დიდია", value => {
      if (!value) return true
      return value.size <= 5000000 // 5MB
    })
  ),
  recurrence_rule: Yup.object().when("event_type", {
    is: "recurring",
    then: Yup.object().shape({
      frequency: Yup.string().required("გამეორების სიხშირე სავალდებულოა"),
      interval: Yup.number().min(1, "ინტერვალი უნდა იყოს მინიმუმ 1"),
      until: Yup.date().nullable(),
    }),
  }),
  tasks: Yup.array().of(
    Yup.object().shape({
      title: Yup.string().required("დავალების სათაური სავალდებულოა"),
      description: Yup.string(),
    })
  ),
})

const EventDialog = ({ isOpen, onClose, selectedSlot, event }) => {
  const [tasks, setTasks] = useState([])
  const [attachments, setAttachments] = useState([])
  const createEvent = useCreateCalendarEvent()
  const updateEvent = useUpdateCalendarEvent()
  const { data: users = [] } = useGetListNames()

  const formik = useFormik({
    initialValues: {
      title: "",
      description: "",
      start_time: selectedSlot?.start || new Date(),
      end_time: selectedSlot?.end || new Date(),
      event_type: "single",
      reminder_before: null,
      is_task_event: false,
      location: "",
      guests: [],
      attachments: [],
      recurrence_rule: {
        frequency: "daily",
        interval: 1,
        until: null,
      },
      tasks: [],
    },
    validationSchema,
    onSubmit: async values => {
      try {
        const formData = new FormData()
        Object.keys(values).forEach(key => {
          if (key === "attachments") {
            values.attachments.forEach(file => {
              formData.append("attachments[]", file)
            })
          } else if (key === "tasks") {
            formData.append(
              "tasks",
              JSON.stringify(
                tasks.map(task => ({
                  title: task.title,
                  description: task.description || "",
                }))
              )
            )
          } else if (key === "guests") {
            formData.append("guests", JSON.stringify(values.guests))
          } else {
            formData.append(key, JSON.stringify(values[key]))
          }
        })

        if (event) {
          await updateEvent.mutateAsync({
            id: event.id,
            data: formData,
          })
        } else {
          await createEvent.mutateAsync(formData)
        }
        onClose()
      } catch (error) {
        console.error("Error saving event:", error)
      }
    },
  })

  useEffect(() => {
    if (event) {
      formik.setValues({
        title: event.title,
        description: event.description || "",
        start_time: new Date(event.start_time),
        end_time: new Date(event.end_time),
        event_type: event.event_type,
        reminder_before: event.reminder_before?.toString(),
        is_task_event: event.is_task_event,
        location: event.location || "",
        guests: event.guests?.map(guest => guest.id) || [],
        attachments: [],
        recurrence_rule: event.recurrence_rule || {
          frequency: "daily",
          interval: 1,
          until: null,
        },
      })
      setTasks(event.tasks || [])
    }
  }, [event])

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

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files)
    setAttachments([...attachments, ...files])
    formik.setFieldValue("attachments", [...formik.values.attachments, ...files])
  }

  const handleRemoveFile = (index) => {
    const newAttachments = attachments.filter((_, i) => i !== index)
    setAttachments(newAttachments)
    formik.setFieldValue("attachments", newAttachments)
  }

  return (
    <CrmDialog
      isOpen={isOpen}
      onOpenChange={onClose}
      title={event ? "ღონისძიების რედაქტირება" : "ახალი ღონისძიება"}
      maxWidth="600px"
      footer={
        <>
          <DialogButton actionType="cancel" onClick={onClose} />
          <DialogButton
            actionType={event ? "edit" : "add"}
            onClick={formik.handleSubmit}
            disabled={!formik.isValid || formik.isSubmitting}
          />
        </>
      }
    >
      <form className="space-y-4" onSubmit={formik.handleSubmit}>
        {/* Title */}
        <div>
          <label className="text-sm font-medium text-gray-700 dark:!text-gray-300">
            სათაური
          </label>
          <input
            type="text"
            name="title"
            value={formik.values.title}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            className={classNames(
              "mt-1 block w-full rounded-md border px-3 py-2 text-sm",
              "focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500",
              "dark:!border-gray-600 dark:!bg-gray-700 dark:!text-white",
              {
                "border-red-500": formik.touched.title && formik.errors.title,
              }
            )}
          />
          {formik.touched.title && formik.errors.title && (
            <div className="mt-1 text-sm text-red-500">
              {formik.errors.title}
            </div>
          )}
        </div>

        {/* Description */}
        <div>
          <label className="text-sm font-medium text-gray-700 dark:!text-gray-300">
            აღწერა
          </label>
          <textarea
            name="description"
            value={formik.values.description}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            rows={3}
            className={classNames(
              "mt-1 block w-full rounded-md border px-3 py-2 text-sm",
              "focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500",
              "dark:!border-gray-600 dark:!bg-gray-700 dark:!text-white"
            )}
          />
        </div>

        {/* Date and Time */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="text-sm font-medium text-gray-700 dark:!text-gray-300">
              დაწყების დრო
            </label>
            <input
              type="datetime-local"
              name="start_time"
              value={format(formik.values.start_time, "yyyy-MM-dd'T'HH:mm")}
              onChange={e => {
                formik.setFieldValue("start_time", new Date(e.target.value))
              }}
              className={classNames(
                "mt-1 block w-full rounded-md border px-3 py-2 text-sm",
                "focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500",
                "dark:!border-gray-600 dark:!bg-gray-700 dark:!text-white"
              )}
            />
          </div>
          <div>
            <label className="text-sm font-medium text-gray-700 dark:!text-gray-300">
              დასრულების დრო
            </label>
            <input
              type="datetime-local"
              name="end_time"
              value={format(formik.values.end_time, "yyyy-MM-dd'T'HH:mm")}
              onChange={e => {
                formik.setFieldValue("end_time", new Date(e.target.value))
              }}
              className={classNames(
                "mt-1 block w-full rounded-md border px-3 py-2 text-sm",
                "focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500",
                "dark:!border-gray-600 dark:!bg-gray-700 dark:!text-white"
              )}
            />
          </div>
        </div>

        {/* Event Type */}
        <div>
          <label className="text-sm font-medium text-gray-700 dark:!text-gray-300">
            ღონისძიების ტიპი
          </label>
          <CrmSelect
            options={eventTypes}
            value={formik.values.event_type}
            onChange={value => formik.setFieldValue("event_type", value)}
            error={formik.touched.event_type && formik.errors.event_type}
          />
        </div>

        {/* Recurrence Rule */}
        {formik.values.event_type === "recurring" && (
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium text-gray-700 dark:!text-gray-300">
                გამეორების სიხშირე
              </label>
              <CrmSelect
                options={recurrenceFrequencies}
                value={formik.values.recurrence_rule.frequency}
                onChange={value =>
                  formik.setFieldValue("recurrence_rule.frequency", value)
                }
              />
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700 dark:!text-gray-300">
                ინტერვალი
              </label>
              <input
                type="number"
                min="1"
                name="recurrence_rule.interval"
                value={formik.values.recurrence_rule.interval}
                onChange={formik.handleChange}
                className={classNames(
                  "mt-1 block w-full rounded-md border px-3 py-2 text-sm",
                  "focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500",
                  "dark:!border-gray-600 dark:!bg-gray-700 dark:!text-white"
                )}
              />
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700 dark:!text-gray-300">
                გამეორების დასრულების თარიღი
              </label>
              <input
                type="date"
                name="recurrence_rule.until"
                value={
                  formik.values.recurrence_rule.until
                    ? format(
                        new Date(formik.values.recurrence_rule.until),
                        "yyyy-MM-dd"
                      )
                    : ""
                }
                onChange={e =>
                  formik.setFieldValue(
                    "recurrence_rule.until",
                    e.target.value ? new Date(e.target.value) : null
                  )
                }
                className={classNames(
                  "mt-1 block w-full rounded-md border px-3 py-2 text-sm",
                  "focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500",
                  "dark:!border-gray-600 dark:!bg-gray-700 dark:!text-white"
                )}
              />
            </div>
          </div>
        )}

        {/* Reminder */}
        <div>
          <label className="text-sm font-medium text-gray-700 dark:!text-gray-300">
            შეხსენება
          </label>
          <CrmSelect
            options={reminderOptions}
            value={formik.values.reminder_before}
            onChange={value => formik.setFieldValue("reminder_before", value)}
          />
        </div>

        {/* Location */}
        <div>
          <label className="text-sm font-medium text-gray-700 dark:!text-gray-300">
            მდებარეობა
          </label>
          <input
            type="text"
            name="location"
            value={formik.values.location}
            onChange={formik.handleChange}
            className={classNames(
              "mt-1 block w-full rounded-md border px-3 py-2 text-sm",
              "focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500",
              "dark:!border-gray-600 dark:!bg-gray-700 dark:!text-white"
            )}
          />
        </div>

        {/* Guests */}
        <div>
          <label className="text-sm font-medium text-gray-700 dark:!text-gray-300">
            მონაწილეები
          </label>
          <CrmSelect
            options={users.map(user => ({
              value: user.id,
              label: user.name
            }))}
            value={formik.values.guests}
            onChange={value => formik.setFieldValue("guests", value)}
            isMulti
            className="dark:!bg-gray-700"
          />
        </div>

        {/* Attachments */}
        <div>
          <label className="text-sm font-medium text-gray-700 dark:!text-gray-300">
            დანართები
          </label>
          <div className="mt-1 flex items-center space-x-2">
            <input
              type="file"
              multiple
              onChange={handleFileChange}
              className="hidden"
              id="file-upload"
            />
            <label
              htmlFor="file-upload"
              className={classNames(
                "cursor-pointer rounded-md border px-4 py-2 text-sm",
                "hover:bg-gray-50 dark:!border-gray-600 dark:!text-gray-300",
                "dark:hover:!bg-gray-600"
              )}
            >
              აირჩიეთ ფაილები
            </label>
          </div>
          {attachments.length > 0 && (
            <div className="mt-2 space-y-2">
              {attachments.map((file, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between rounded-md border p-2 dark:!border-gray-600"
                >
                  <span className="text-sm dark:!text-gray-300">{file.name}</span>
                  <DialogButton
                    actionType="delete"
                    size="sm"
                    onClick={() => handleRemoveFile(index)}
                  />
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Tasks */}
        <div>
          <div className="flex items-center justify-between">
            <label className="text-sm font-medium text-gray-700 dark:!text-gray-300">
              დავალებები
            </label>
            <DialogButton actionType="add" size="sm" onClick={handleAddTask} />
          </div>
          <div className="mt-2 space-y-3">
            {tasks.map((task, index) => (
              <div key={index} className="flex gap-2">
                <div className="flex-1">
                  <input
                    type="text"
                    value={task.title}
                    onChange={e =>
                      handleTaskChange(index, "title", e.target.value)
                    }
                    placeholder="დავალების სათაური"
                    className={classNames(
                      "block w-full rounded-md border px-3 py-2 text-sm",
                      "focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500",
                      "dark:!border-gray-600 dark:!bg-gray-700 dark:!text-white"
                    )}
                  />
                </div>
                <DialogButton
                  actionType="delete"
                  size="sm"
                  onClick={() => handleRemoveTask(index)}
                />
              </div>
            ))}
          </div>
        </div>
      </form>
    </CrmDialog>
  )
}

export default EventDialog
