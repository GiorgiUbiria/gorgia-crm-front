import React from "react"
import { useForm } from "@tanstack/react-form"
import { useAssignTask } from "queries/oneCTasks"
import useAuth from "hooks/useAuth"

export const AssignTaskForm = ({ onSuccess, task_id }) => {
  const { user } = useAuth()
  const assignTaskMutation = useAssignTask()

  const form = useForm({
    defaultValues: {},
    onSubmit: async () => {
      try {
        await assignTaskMutation.mutateAsync({
          taskId: task_id,
          userIds: [user.id],
        })
        onSuccess?.()
      } catch (error) {
        console.error("Error assigning task:", error)
      }
    },
  })

  return (
    <form
      id="assignOneCTaskForm"
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
