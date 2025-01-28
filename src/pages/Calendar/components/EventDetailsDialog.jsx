import React, { useState } from "react"
import { format } from "date-fns"
import classNames from "classnames"
import CrmDialog, { DialogButton } from "components/CrmDialogs/Dialog"
import CrmSpinner from "components/CrmSpinner"
import {
  useDeleteCalendarEvent,
  useGetEventComments,
  useCreateEventComment,
  useDeleteEventComment,
  useCompleteEventTask,
  useCompleteAllEventTasks,
} from "queries/calendar"
import EventDialog from "./EventDialog"

const EventDetailsDialog = ({ isOpen, onClose, event }) => {
  const [isEditing, setIsEditing] = useState(false)
  const [newComment, setNewComment] = useState("")

  const deleteEvent = useDeleteCalendarEvent()
  const { data: comments = [], isLoading: isCommentsLoading } =
    useGetEventComments(event?.id, {
      enabled: !!event,
    })
  const createComment = useCreateEventComment()
  const deleteComment = useDeleteEventComment()
  const completeTask = useCompleteEventTask()
  const completeAllTasks = useCompleteAllEventTasks()

  if (!event) return null

  const handleDelete = async () => {
    try {
      await deleteEvent.mutateAsync(event.id)
      onClose()
    } catch (error) {
      console.error("Error deleting event:", error)
    }
  }

  const handleEdit = () => {
    setIsEditing(true)
  }

  const handleCloseEdit = () => {
    setIsEditing(false)
  }

  const handleAddComment = async () => {
    if (!newComment.trim()) return

    try {
      await createComment.mutateAsync({
        eventId: event.id,
        data: { content: newComment },
      })
      setNewComment("")
    } catch (error) {
      console.error("Error adding comment:", error)
    }
  }

  const handleDeleteComment = async commentId => {
    try {
      await deleteComment.mutateAsync({
        eventId: event.id,
        commentId,
      })
    } catch (error) {
      console.error("Error deleting comment:", error)
    }
  }

  const handleCompleteTask = async taskId => {
    try {
      await completeTask.mutateAsync({
        eventId: event.id,
        taskId,
      })
    } catch (error) {
      console.error("Error completing task:", error)
    }
  }

  const handleCompleteAllTasks = async () => {
    try {
      await completeAllTasks.mutateAsync(event.id)
    } catch (error) {
      console.error("Error completing all tasks:", error)
    }
  }

  if (isEditing) {
    return <EventDialog isOpen={true} onClose={handleCloseEdit} event={event} />
  }

  return (
    <CrmDialog
      isOpen={isOpen}
      onOpenChange={onClose}
      title={event.title}
      maxWidth="600px"
      footer={
        <>
          <DialogButton actionType="delete" onClick={handleDelete} />
          <DialogButton actionType="edit" onClick={handleEdit} />
          <DialogButton actionType="cancel" onClick={onClose} />
        </>
      }
    >
      <div className="space-y-6">
        {/* Event Details */}
        <div className="space-y-4">
          <div>
            <h3 className="text-sm font-medium text-gray-500 dark:!text-gray-400">
              აღწერა
            </h3>
            <p className="mt-1 text-sm text-gray-900 dark:!text-gray-100">
              {event.description || "აღწერა არ არის"}
            </p>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <h3 className="text-sm font-medium text-gray-500 dark:!text-gray-400">
                დაწყების დრო
              </h3>
              <p className="mt-1 text-sm text-gray-900 dark:!text-gray-100">
                {format(new Date(event.start_time), "dd/MM/yyyy HH:mm")}
              </p>
            </div>
            <div>
              <h3 className="text-sm font-medium text-gray-500 dark:!text-gray-400">
                დასრულების დრო
              </h3>
              <p className="mt-1 text-sm text-gray-900 dark:!text-gray-100">
                {format(new Date(event.end_time), "dd/MM/yyyy HH:mm")}
              </p>
            </div>
          </div>

          {event.location && (
            <div>
              <h3 className="text-sm font-medium text-gray-500 dark:!text-gray-400">
                მდებარეობა
              </h3>
              <p className="mt-1 text-sm text-gray-900 dark:!text-gray-100">
                {event.location}
              </p>
            </div>
          )}

          {event.event_type === "recurring" && event.recurrence_rule && (
            <div>
              <h3 className="text-sm font-medium text-gray-500 dark:!text-gray-400">
                გამეორების წესი
              </h3>
              <p className="mt-1 text-sm text-gray-900 dark:!text-gray-100">
                {`${event.recurrence_rule.interval} ${event.recurrence_rule.frequency}`}
                {event.recurrence_rule.until &&
                  ` - ${format(
                    new Date(event.recurrence_rule.until),
                    "dd/MM/yyyy"
                  )}-მდე`}
              </p>
            </div>
          )}
        </div>

        {/* Tasks */}
        {event.tasks && event.tasks.length > 0 && (
          <div>
            <div className="mb-2 flex items-center justify-between">
              <h3 className="text-sm font-medium text-gray-900 dark:!text-gray-100">
                დავალებები
              </h3>
              <DialogButton
                actionType="approve"
                size="sm"
                onClick={handleCompleteAllTasks}
              />
            </div>
            <div className="space-y-2">
              {event.tasks.map(task => (
                <div
                  key={task.id}
                  className="flex items-center justify-between rounded-md border border-gray-200 p-2 dark:!border-gray-700"
                >
                  <div className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      checked={task.completed}
                      onChange={() => handleCompleteTask(task.id)}
                      className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                    <span
                      className={classNames("text-sm", {
                        "line-through": task.completed,
                      })}
                    >
                      {task.title}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Comments */}
        <div>
          <h3 className="mb-2 text-sm font-medium text-gray-900 dark:!text-gray-100">
            კომენტარები
          </h3>
          <div className="space-y-4">
            <div className="flex gap-2">
              <input
                type="text"
                value={newComment}
                onChange={e => setNewComment(e.target.value)}
                placeholder="დაწერეთ კომენტარი..."
                className={classNames(
                  "block w-full rounded-md border px-3 py-2 text-sm",
                  "focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500",
                  "dark:!border-gray-600 dark:!bg-gray-700 dark:!text-white"
                )}
              />
              <DialogButton
                actionType="add"
                size="sm"
                onClick={handleAddComment}
              />
            </div>

            {isCommentsLoading ? (
              <div className="flex justify-center py-4">
                <CrmSpinner size="sm" />
              </div>
            ) : comments.length > 0 ? (
              <div className="space-y-3">
                {comments.map(comment => (
                  <div
                    key={comment.id}
                    className="rounded-md border border-gray-200 p-3 dark:!border-gray-700"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <span className="text-sm font-medium text-gray-900 dark:!text-gray-100">
                          {comment.user.name}
                        </span>
                        <span className="text-xs text-gray-500">
                          {format(
                            new Date(comment.created_at),
                            "dd/MM/yyyy HH:mm"
                          )}
                        </span>
                      </div>
                      <DialogButton
                        actionType="delete"
                        size="sm"
                        onClick={() => handleDeleteComment(comment.id)}
                      />
                    </div>
                    <p className="mt-1 text-sm text-gray-700 dark:!text-gray-300">
                      {comment.content}
                    </p>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-center text-sm text-gray-500">
                კომენტარები არ არის
              </p>
            )}
          </div>
        </div>
      </div>
    </CrmDialog>
  )
}

export default EventDetailsDialog
