import React, { useState, useEffect } from "react"
import { useForm } from "@tanstack/react-form"
import { useGetCalendarEvent, useUpdateCalendarEvent } from "queries/calendar"

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

export const EditCalendarEventForm = ({ eventId, onSuccess }) => {
  const { data: eventData } = useGetCalendarEvent(eventId)
  const updateCalendarEventMutation = useUpdateCalendarEvent()
  const [files, setFiles] = useState([])

  const form = useForm({
    defaultValues: {
      title: '',
      description: '',
      start_time: '',
      end_time: '',
      event_type: 'single',
      reminder_before: null,
      location: '',
      recurrence_rule: null,
    },
    onSubmit: async ({ value }) => {
      const formData = {
        ...value,
        attachments: files,
        recurrence_rule: value.event_type === 'recurring' ? {
          frequency: value.recurrence_rule?.frequency,
          interval: value.recurrence_rule?.interval,
          until: value.recurrence_rule?.until
        } : null
      }
      
      await updateCalendarEventMutation.mutateAsync({ id: eventId, data: formData })
      onSuccess?.()
    },
  })

  useEffect(() => {
    if (eventData) {
      form.setFieldValue('title', eventData.title)
      form.setFieldValue('description', eventData.description)
      form.setFieldValue('start_time', eventData.start_time.slice(0, 16))
      form.setFieldValue('end_time', eventData.end_time.slice(0, 16))
      form.setFieldValue('event_type', eventData.event_type)
      form.setFieldValue('reminder_before', eventData.reminder_before)
      form.setFieldValue('location', eventData.location)
      
      if (eventData.recurrence_rule) {
        form.setFieldValue('recurrence_rule.frequency', eventData.recurrence_rule.frequency)
        form.setFieldValue('recurrence_rule.interval', eventData.recurrence_rule.interval)
        form.setFieldValue('recurrence_rule.until', eventData.recurrence_rule.until)
      }
    }
  }, [eventData, form])

  return (
    <form id="editCalendarEventForm" onSubmit={form.handleSubmit} className="space-y-4">
      {/* Title */}
      <form.Field name="title">
        {field => (
          <div>
            <label className="block text-sm font-medium mb-1">დასახელება</label>
            <input
              type="text"
              required
              className="w-full rounded-md border px-3 py-2 text-sm"
              value={field.state.value}
              onChange={(e) => field.handleChange(e.target.value)}
              onBlur={field.handleBlur}
            />
            <FieldInfo field={field} />
          </div>
        )}
      </form.Field>

      {/* Date/Time */}
      <div className="grid grid-cols-2 gap-4">
        <form.Field name="start_time">
          {field => (
            <div>
              <label className="block text-sm font-medium mb-1">დაწყების დრო</label>
              <input
                type="datetime-local"
                required
                className="w-full rounded-md border px-3 py-2 text-sm"
                value={field.state.value}
                onChange={(e) => field.handleChange(e.target.value)}
                onBlur={field.handleBlur}
              />
            </div>
          )}
        </form.Field>

        <form.Field name="end_time">
          {field => (
            <div>
              <label className="block text-sm font-medium mb-1">დასრულების დრო</label>
              <input
                type="datetime-local"
                required
                className="w-full rounded-md border px-3 py-2 text-sm"
                value={field.state.value}
                onChange={(e) => field.handleChange(e.target.value)}
                onBlur={field.handleBlur}
              />
            </div>
          )}
        </form.Field>
      </div>

      {/* Event Type */}
      <form.Field name="event_type">
        {field => (
          <div>
            <label className="block text-sm font-medium mb-1">მოვლენის ტიპი</label>
            <select
              className="w-full rounded-md border px-3 py-2 text-sm"
              value={field.state.value}
              onChange={(e) => field.handleChange(e.target.value)}
              onBlur={field.handleBlur}
              required
            >
              <option value="single">ერთჯერადი</option>
              <option value="recurring">განმეორებადი</option>
            </select>
          </div>
        )}
      </form.Field>

      {/* Recurrence Rules */}
      {form.state.values.event_type === 'recurring' && (
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <form.Field name="recurrence_rule.frequency">
              {field => (
                <div>
                  <label className="block text-sm font-medium mb-1">სიხშირე</label>
                  <select
                    className="w-full rounded-md border px-3 py-2 text-sm"
                    value={field.state.value}
                    onChange={(e) => field.handleChange(e.target.value)}
                    onBlur={field.handleBlur}
                    required
                  >
                    <option value="daily">დღიური</option>
                    <option value="weekly">ყოველკვირეული</option>
                    <option value="monthly">ყოველთვიური</option>
                    <option value="yearly">ყოველწლიური</option>
                  </select>
                </div>
              )}
            </form.Field>

            <form.Field name="recurrence_rule.interval">
              {field => (
                <div>
                  <label className="block text-sm font-medium mb-1">ინტერვალი</label>
                  <input
                    type="number"
                    min="1"
                    className="w-full rounded-md border px-3 py-2 text-sm"
                    value={field.state.value}
                    onChange={(e) => field.handleChange(e.target.value)}
                    onBlur={field.handleBlur}
                    required
                  />
                </div>
              )}
            </form.Field>
          </div>

          <form.Field name="recurrence_rule.until">
            {field => (
              <div>
                <label className="block text-sm font-medium mb-1">დასრულების თარიღი</label>
                <input
                  type="date"
                  className="w-full rounded-md border px-3 py-2 text-sm"
                  value={field.state.value}
                  onChange={(e) => field.handleChange(e.target.value)}
                  onBlur={field.handleBlur}
                />
              </div>
            )}
          </form.Field>
        </div>
      )}

      {/* File Upload */}
      <div>
        <label className="block text-sm font-medium mb-1">ფაილების მიმაგრება</label>
        <input
          type="file"
          multiple
          onChange={e => setFiles([...e.target.files])}
          className="w-full text-sm"
        />
      </div>

      <form.Subscribe selector={state => [state.canSubmit, state.isSubmitting]}>
        {([canSubmit, isSubmitting]) => (
          <div className="hidden">
            <button type="submit" disabled={!canSubmit || isSubmitting} />
          </div>
        )}
      </form.Subscribe>
    </form>
  )
}
