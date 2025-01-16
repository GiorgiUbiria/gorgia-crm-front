import React from "react"
import { useForm } from "@tanstack/react-form"
import { useUpdateDepartment } from "queries/admin"

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

export const EditDepartmentForm = ({ onSuccess, department }) => {
  const updateDepartmentMutation = useUpdateDepartment()

  const form = useForm({
    defaultValues: {
      name: department?.name,
      description: department?.description,
    },
    onSubmit: async ({ value }) => {
      await updateDepartmentMutation.mutateAsync({
        ...value,
        departmentId: department.id,
      })
      onSuccess?.(onSuccess)
    },
  })

  return (
    <form
      id="editDepartmentForm"
      onSubmit={e => {
        e.preventDefault()
        e.stopPropagation()
        form.handleSubmit()
      }}
      className="space-y-4"
    >
      <div>
        <form.Field
          name="name"
          validators={{
            onChange: ({ value }) =>
              !value
                ? "დეპარტამენტის სახელის მითითება სავალდებულოა"
                : value.length < 2
                ? "დეპარტამენტის სახელი უნდა შეიცავდეს მინიმუმ 2 სიმბოლოს"
                : undefined,
          }}
        >
          {field => (
            <div>
              <label
                htmlFor={field.name}
                className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
              >
                დეპარტამენტის სახელი
              </label>
              <input
                type="text"
                id={field.name}
                name={field.name}
                value={field.state.value}
                onBlur={field.handleBlur}
                onChange={e => field.handleChange(e.target.value)}
                className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
              />
              <FieldInfo field={field} />
            </div>
          )}
        </form.Field>
      </div>

      <div>
        <form.Field name="description">
          {field => (
            <div>
              <label
                htmlFor={field.name}
                className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
              >
                აღწერა
              </label>
              <textarea
                id={field.name}
                name={field.name}
                value={field.state.value}
                onBlur={field.handleBlur}
                onChange={e => field.handleChange(e.target.value)}
                rows={4}
                className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
              />
              <FieldInfo field={field} />
            </div>
          )}
        </form.Field>
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
