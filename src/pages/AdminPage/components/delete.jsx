import React from "react"
import { useForm } from "@tanstack/react-form"
import { useDeleteDepartment } from "queries/admin"

export const DeleteDepartmentForm = ({ onSuccess, department_id }) => {
  const deleteDepartmentMutation = useDeleteDepartment()

  const form = useForm({
    defaultValues: {},
    onSubmit: async () => {
      await deleteDepartmentMutation.mutateAsync({ department_id })
      onSuccess?.(onSuccess)
    },
  })

  return (
    <form
      id="deleteDepartmentForm"
      onSubmit={e => {
        e.preventDefault()
        e.stopPropagation()
        form.handleSubmit()
      }}
      className="space-y-4"
    >
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
