import React, { useState } from "react"
import {
  useGetCalendarEvent,
  useCompleteEventTask,
  useUncompleteEventTask,
  useCreateEventComment,
  useUpdateEventComment,
  useDeleteEventComment,
  useUpdateGuestStatus,
} from "queries/calendar"
import CrmSpinner from "components/CrmSpinner"
import { format } from "date-fns"
import { ka } from "date-fns/locale"
import {
  Clock,
  MapPin,
  Bell,
  CheckSquare,
  Users,
  Paperclip,
  MessageSquare,
  MoreVertical,
  Edit2,
  Trash2,
  Check,
  X,
} from "lucide-react"
import useAuth from "hooks/useAuth"
import { Menu } from "@headlessui/react"

const formatDateTime = date => {
  if (!date) return ""
  return format(new Date(date), "d MMMM yyyy, HH:mm", { locale: ka })
}

const getStatusColor = status => {
  switch (status) {
    case "accepted":
      return "text-green-600 dark:!text-green-400 bg-green-50 dark:!bg-green-900/20"
    case "declined":
      return "text-red-600 dark:!text-red-400 bg-red-50 dark:!bg-red-900/20"
    default:
      return "text-yellow-600 dark:!text-yellow-400 bg-yellow-50 dark:!bg-yellow-900/20"
  }
}

const getStatusText = status => {
  switch (status) {
    case "accepted":
      return "დათანხმდა"
    case "declined":
      return "უარი თქვა"
    default:
      return "მოლოდინში"
  }
}

export const ViewCalendarEventDetails = ({ eventId, onClose }) => {
  const { data: event, isLoading } = useGetCalendarEvent(eventId)
  const updateStatusMutation = useUpdateGuestStatus()
  const { user } = useAuth()
  const completeTaskMutation = useCompleteEventTask()
  const uncompleteTaskMutation = useUncompleteEventTask()
  const addCommentMutation = useCreateEventComment({
    onSuccess: () => {
      setNewComment("")
    },
  })
  const updateCommentMutation = useUpdateEventComment({
    onSuccess: () => {
      setEditingComment(null)
    },
  })
  const deleteCommentMutation = useDeleteEventComment()

  const [newComment, setNewComment] = useState("")
  const [editingComment, setEditingComment] = useState(null)

  const isGuest = event?.guests?.some(g => g.user_id === user?.id)
  const guestStatus = event?.guests?.find(g => g.user_id === user?.id)?.status

  const handleTaskToggle = async (taskId, isCompleted) => {
    try {
      if (isCompleted) {
        await uncompleteTaskMutation.mutateAsync({
          eventId,
          taskId,
        })
      } else {
        await completeTaskMutation.mutateAsync({
          eventId,
          taskId,
        })
      }
    } catch (error) {
      console.error("Error updating task:", error)
    }
  }

  const handleAddComment = async e => {
    e.preventDefault()
    if (!newComment.trim()) return

    try {
      await addCommentMutation.mutateAsync({
        eventId,
        data: { content: newComment.trim() },
      })
    } catch (error) {
      console.error("Error adding comment:", error)
    }
  }

  const handleUpdateComment = async (commentId, content) => {
    try {
      await updateCommentMutation.mutateAsync({
        eventId,
        commentId,
        data: { content },
      })
    } catch (error) {
      console.error("Error updating comment:", error)
    }
  }

  const handleDeleteComment = async commentId => {
    try {
      await deleteCommentMutation.mutateAsync({
        eventId,
        commentId,
      })
    } catch (error) {
      console.error("Error deleting comment:", error)
    }
  }

  const handleStatusUpdate = async (status) => {
    try {
      await updateStatusMutation.mutateAsync({ eventId, status })
      onClose()
    } catch (error) {
      console.error("Error updating invitation status:", error)
    }
  }

  if (isLoading) {
    return <CrmSpinner />
  }

  if (!event) {
    return (
      <div className="text-center py-8 text-gray-500 dark:!text-gray-400">
        ივენთი ვერ მოიძებნა
      </div>
    )
  }

  return (
    <div className="space-y-8">
      {/* Header Section */}
      <div className="flex items-start justify-between">
        <h2 className="text-2xl font-semibold mb-2 dark:!text-gray-200">
          {event.title}
        </h2>
        {isGuest && guestStatus === "pending" && (
          <div className="flex items-center gap-2">
            <button
              onClick={() => handleStatusUpdate("accepted")}
              disabled={updateStatusMutation.isLoading}
              className="p-2 text-green-600 hover:text-green-700 dark:!text-green-400 dark:hover:!text-green-300"
              title="დათანხმება"
            >
              <Check className="w-5 h-5" />
            </button>
            <button
              onClick={() => handleStatusUpdate("declined")}
              disabled={updateStatusMutation.isLoading}
              className="p-2 text-red-600 hover:text-red-700 dark:!text-red-400 dark:hover:!text-red-300"
              title="უარყოფა"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        )}
      </div>

      {/* Time and Location Section */}
      <div className="space-y-4">
        <div className="flex items-start gap-3">
          <Clock className="w-5 h-5 text-blue-500 mt-0.5 flex-shrink-0" />
          <div>
            <div className="font-medium dark:!text-gray-200">
              {formatDateTime(event.start_time)}
            </div>
            {event.end_time && (
              <div className="text-gray-500 dark:!text-gray-400 text-sm">
                დასრულება: {formatDateTime(event.end_time)}
              </div>
            )}
            {event.reminder_before && (
              <div className="flex items-center gap-2 mt-2 text-sm">
                <Bell className="w-4 h-4 text-yellow-500" />
                <span className="text-gray-600 dark:!text-gray-400">
                  შეხსენება {event.reminder_before} წუთით ადრე
                </span>
              </div>
            )}
          </div>
        </div>

        {event.location && (
          <div className="flex items-start gap-3">
            <MapPin className="w-5 h-5 text-red-500 mt-0.5 flex-shrink-0" />
            <span className="dark:!text-gray-200">{event.location}</span>
          </div>
        )}
      </div>

      {/* Tasks Section */}
      {event.is_task_event && event.tasks?.length > 0 && (
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <CheckSquare className="w-5 h-5 text-green-500" />
            <h3 className="text-lg font-medium dark:!text-gray-200">
              დავალებები
            </h3>
          </div>
          <div className="pl-8 space-y-4">
            {event.tasks.map(task => (
              <div
                key={task.id}
                className={`p-4 bg-gray-50 dark:!bg-gray-700/50 rounded-lg transition-colors ${
                  task.is_completed ? "bg-green-50 dark:!bg-green-900/20" : ""
                }`}
              >
                <div className="flex items-start gap-3">
                  <input
                    type="checkbox"
                    checked={task.is_completed}
                    onChange={() =>
                      handleTaskToggle(task.id, task.is_completed)
                    }
                    className="mt-1 rounded border-gray-300 text-green-600 focus:ring-green-500"
                  />
                  <div className="flex-1">
                    <h4
                      className={`font-medium dark:!text-gray-200 ${
                        task.is_completed ? "line-through text-gray-500" : ""
                      }`}
                    >
                      {task.title}
                    </h4>
                    {task.description && (
                      <p
                        className={`text-sm ${
                          task.is_completed
                            ? "text-gray-400"
                            : "text-gray-600 dark:!text-gray-400"
                        }`}
                      >
                        {task.description}
                      </p>
                    )}
                    {task.completed_at && (
                      <p className="text-xs text-gray-400 mt-2">
                        დასრულდა: {formatDateTime(task.completed_at)}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Guests Section */}
      {event.guests?.length > 0 && (
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <Users className="w-5 h-5 text-violet-500" />
            <h3 className="text-lg font-medium dark:!text-gray-200">
              სტუმრები ({event.guests.length})
            </h3>
          </div>
          <div className="pl-8 grid grid-cols-2 md:grid-cols-3 gap-3">
            {event.guests.map(guest => (
              <div
                key={guest.user.id}
                className="p-3 bg-gray-50 dark:!bg-gray-700/50 rounded-lg"
              >
                <div className="text-sm dark:!text-gray-200 mb-2">
                  {guest.user.name}
                </div>
                <span
                  className={`inline-block px-2 py-1 text-xs rounded-full ${getStatusColor(
                    guest.status
                  )}`}
                >
                  {getStatusText(guest.status)}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Attachments Section */}
      {event.attachments?.length > 0 && (
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <Paperclip className="w-5 h-5 text-orange-500" />
            <h3 className="text-lg font-medium dark:!text-gray-200">
              მიმაგრებული ფაილები ({event.attachments.length})
            </h3>
          </div>
          <div className="pl-8 space-y-2">
            {event.attachments.map(attachment => (
              <a
                key={attachment.id}
                href={attachment.download_url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-between p-3 bg-gray-50 dark:!bg-gray-700/50 rounded-lg hover:bg-gray-100 dark:hover:!bg-gray-600 transition-colors group"
              >
                <div className="flex items-center gap-2">
                  <Paperclip className="w-4 h-4 text-gray-400" />
                  <span className="text-sm text-blue-600 dark:!text-blue-400 group-hover:underline">
                    {attachment.file_name}
                  </span>
                </div>
                <span className="text-xs text-gray-500">
                  {Math.round(attachment.file_size / 1024)} KB
                </span>
              </a>
            ))}
          </div>
        </div>
      )}

      {/* Comments Section */}
      <div className="space-y-3">
        <div className="flex items-center gap-2">
          <MessageSquare className="w-5 h-5 text-indigo-500" />
          <h3 className="text-lg font-medium dark:!text-gray-200">
            კომენტარები {event.comments?.length > 0 && `(${event.comments.length})`}
          </h3>
        </div>
        <div className="pl-8 space-y-4">
          {/* Add Comment Form */}
          <form onSubmit={handleAddComment} className="space-y-2">
            <textarea
              value={newComment}
              onChange={e => setNewComment(e.target.value)}
              placeholder="დაწერეთ კომენტარი..."
              className="w-full rounded-lg border px-3 py-2 text-sm dark:!bg-gray-700 dark:!border-gray-600 dark:!text-gray-200 focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              rows={3}
            />
            <button
              type="submit"
              disabled={!newComment.trim() || addCommentMutation.isLoading}
              className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {addCommentMutation.isLoading ? "იგზავნება..." : "კომენტარის დამატება"}
            </button>
          </form>

          {/* Comments List */}
          <div className="space-y-4">
            {event.comments?.map(comment => (
              <div
                key={comment.id}
                className="p-4 bg-gray-50 dark:!bg-gray-700/50 rounded-lg"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="font-medium dark:!text-gray-200">
                        {comment.user.name}
                      </span>
                      <span className="text-xs text-gray-500">
                        {formatDateTime(comment.created_at)}
                      </span>
                      {comment.updated_at !== comment.created_at && (
                        <span className="text-xs text-gray-400 italic">
                          (რედაქტირებულია)
                        </span>
                      )}
                    </div>
                    {editingComment?.id === comment.id ? (
                      <form
                        onSubmit={e => {
                          e.preventDefault()
                          handleUpdateComment(
                            comment.id,
                            editingComment.content
                          )
                        }}
                        className="space-y-2"
                      >
                        <textarea
                          value={editingComment.content}
                          onChange={e =>
                            setEditingComment({
                              ...editingComment,
                              content: e.target.value,
                            })
                          }
                          className="w-full rounded-lg border px-3 py-2 text-sm dark:!bg-gray-700 dark:!border-gray-600 dark:!text-gray-200"
                          rows={2}
                        />
                        <div className="flex items-center gap-2">
                          <button
                            type="submit"
                            disabled={updateCommentMutation.isLoading}
                            className="px-3 py-1 text-xs font-medium text-white bg-blue-600 rounded hover:bg-blue-700"
                          >
                            {updateCommentMutation.isLoading ? "ინახება..." : "შენახვა"}
                          </button>
                          <button
                            type="button"
                            onClick={() => setEditingComment(null)}
                            className="px-3 py-1 text-xs font-medium text-gray-600 bg-gray-100 rounded hover:bg-gray-200 dark:!text-gray-200 dark:!bg-gray-600 dark:hover:!bg-gray-500"
                          >
                            გაუქმება
                          </button>
                        </div>
                      </form>
                    ) : (
                      <p className="text-gray-600 dark:!text-gray-400 whitespace-pre-wrap">
                        {comment.content}
                      </p>
                    )}
                  </div>
                  {comment.user_id === user?.id && (
                    <Menu as="div" className="relative">
                      <Menu.Button className="p-1 text-gray-400 hover:text-gray-600 dark:hover:!text-gray-300">
                        <MoreVertical className="w-4 h-4" />
                      </Menu.Button>
                      <Menu.Items className="absolute right-0 mt-1 w-36 bg-white dark:!bg-gray-800 rounded-lg shadow-lg border dark:!border-gray-700 py-1 z-10">
                        <Menu.Item>
                          {({ active }) => (
                            <button
                              onClick={() =>
                                setEditingComment({
                                  id: comment.id,
                                  content: comment.content,
                                })
                              }
                              className={`${
                                active ? "bg-gray-100 dark:!bg-gray-700" : ""
                              } flex items-center gap-2 w-full px-3 py-2 text-sm text-gray-700 dark:!text-gray-200`}
                            >
                              <Edit2 className="w-4 h-4" />
                              რედაქტირება
                            </button>
                          )}
                        </Menu.Item>
                        <Menu.Item>
                          {({ active }) => (
                            <button
                              onClick={() => handleDeleteComment(comment.id)}
                              disabled={deleteCommentMutation.isLoading}
                              className={`${
                                active ? "bg-gray-100 dark:!bg-gray-700" : ""
                              } flex items-center gap-2 w-full px-3 py-2 text-sm text-red-600`}
                            >
                              <Trash2 className="w-4 h-4" />
                              {deleteCommentMutation.isLoading ? "იშლება..." : "წაშლა"}
                            </button>
                          )}
                        </Menu.Item>
                      </Menu.Items>
                    </Menu>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
