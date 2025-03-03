import React from "react"
import { useForm } from "@tanstack/react-form"
import { useAssignHead } from "queries/admin"
import CrmSelect from "components/CrmSelect"

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

  const selectOptions = users.map(user => ({
    value: user.id,
    label: `${user.name} ${user.sur_name} (${user.email}) - ${user.position || 'პოზიცია არ არის მითითებული'}`,
  }))

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
              <CrmSelect
                label="დეპარტამენტის ხელმძღვანელი"
                options={selectOptions}
                value={field.state.value || ""}
                onChange={field.handleChange}
                error={field.state.meta.errors[0]}
                placeholder="აირჩიეთ ხელმძღვანელი"
                searchable
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
