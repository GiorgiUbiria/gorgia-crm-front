import React from "react"
import { useForm } from "@tanstack/react-form"
import { useAssignHead } from "queries/admin"

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

export const AssignDepartmentHeadForm = ({
  onSuccess,
  users = [],
  department_id,
  currentHeadId,
}) => {
  const assignHeadMutation = useAssignHead()

  const form = useForm({
    defaultValues: {
      userId: currentHeadId || "",
    },
    onSubmit: async ({ value }) => {
      const payload = { ...value, departmentId: department_id }
      await assignHeadMutation.mutateAsync(payload)
      onSuccess?.(onSuccess)
    },
  })

  return (
    <form
      id="assignHeadForm"
      onSubmit={e => {
        e.preventDefault()
        e.stopPropagation()
        form.handleSubmit()
      }}
      className="space-y-4"
    >
      <div>
        <form.Field
          name="userId"
          validators={{
            onChange: ({ value }) =>
              !value ? "მომხმარებლის მითითება აუცილებელია" : undefined,
          }}
        >
          {field => (
            <div>
              <label
                htmlFor={field.user_id}
                className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
              >
                დეპარტამენტის ხელმძღვანელი
              </label>
              <select
                id={field.userId}
                name={field.userId}
                value={field.state.value || ""}
                onChange={e => field.handleChange(e.target.value)}
                className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
              >
                <option value="">აირჩიეთ ხელმძღვანელი</option>
                {Array.isArray(users) && users.map(user => (
                  <option key={user.id} value={user.id}>
                    {user.name + " " + user.sur_name}
                  </option>
                ))}
              </select>
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
