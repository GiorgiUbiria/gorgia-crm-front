import React, { useState } from "react"
import { useForm } from "@tanstack/react-form"
import { useCreateCalendarEvent } from "queries/calendar"

function FieldInfo({ field }) {
  if (!field.state.meta.isTouched) return null

  return (
    <div className="mt-1">
      {field.state.meta.errors.length > 0 && (
        <em className="text-sm text-red-500">
          {field.state.meta.errors.join(", ")}
        </em>
      )}
      {field.state.meta.isValidating && (
        <span className="text-sm text-blue-500">მოწმდება...</span>
      )}
    </div>
  )
}

export const AddCalendarEventForm = ({ onSuccess }) => {
  const [eventType] = useState('single')
  const [files] = useState([])
  const createCalendarEventMutation = useCreateCalendarEvent()

  const form = useForm({
    defaultValues: {
      title: '',
      description: '',
      start_time: '',
      end_time: '',
      event_type: 'single',
      reminder_before: null,
      location: '',
      guests: [],
      recurrence_rule: null,
      tasks: [],
      attachments: []
    },
    onSubmit: async ({ value }) => {
      const formData = {
        ...value,
        tasks: [],
        attachments: files,
        recurrence_rule: eventType === 'recurring' ? {
          frequency: value.recurrence_rule?.frequency,
          interval: value.recurrence_rule?.interval,
          until: value.recurrence_rule?.until
        } : null
      }
      
      await createCalendarEventMutation.mutateAsync(formData)
      onSuccess?.()
    },
  })

  return (
    <form id="addCalendarEventForm" onSubmit={form.handleSubmit} className="space-y-4">
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

      {/* Description */}
      <form.Field name="description">
        {field => (
          <div>
            <label className="block text-sm font-medium mb-1">აღწერა</label>
            <textarea
              className="w-full rounded-md border px-3 py-2 text-sm"
              rows={3}
              value={field.state.value}
              onChange={(e) => field.handleChange(e.target.value)}
              onBlur={field.handleBlur}
            />
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
      {eventType === 'recurring' && (
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

      {/* Reminder */}
      <form.Field name="reminder_before">
        {field => (
          <div>
            <label className="block text-sm font-medium mb-1">შეხსენება</label>
            <select
              className="w-full rounded-md border px-3 py-2 text-sm"
              value={field.state.value}
              onChange={(e) => field.handleChange(e.target.value)}
              onBlur={field.handleBlur}
            >
              <option value="">არ არის შერჩეული</option>
              <option value="15">15 წუთით ადრე</option>
              <option value="30">30 წუთით ადრე</option>
              <option value="60">1 საათით ადრე</option>
            </select>
          </div>
        )}
      </form.Field>

      {/* Location */}
      <form.Field name="location">
        {field => (
          <div>
            <label className="block text-sm font-medium mb-1">ადგილმდებარეობა</label>
            <input
              type="text"
              className="w-full rounded-md border px-3 py-2 text-sm"
              value={field.state.value}
              onChange={(e) => field.handleChange(e.target.value)}
              onBlur={field.handleBlur}
            />
          </div>
        )}
      </form.Field>

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

      {/* Submit handling */}
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
