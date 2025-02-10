import React, { useState } from "react"
import { MessageSquare } from "lucide-react"
import { Spinner } from "reactstrap"
import {
  useGetTaskComments,
  useCreateTaskComment,
} from "../../../../queries/legalTasks"
import CommentThread from "./CommentThread"
import useAuth from "hooks/useAuth"
import { toast } from "store/zustand/toastStore"

const CommentSection = ({ task, canComment }) => {
  const [newComment, setNewComment] = useState("")
  const { user, isLoading: userLoading } = useAuth()

  const {
    data: comments = [],
    isLoading: commentsLoading,
    error,
  } = useGetTaskComments(task.data.id)

  console.log(comments)
  const createCommentMutation = useCreateTaskComment()

  const handleSubmitComment = async e => {
    e.preventDefault()
    if (!newComment.trim()) return

    try {
      await createCommentMutation.mutateAsync({
        taskId: task.data.id,
        data: {
          task_id: task.data.id,
          comment_text: newComment,
        },
      })
      setNewComment("")
    } catch (error) {
      toast.error(
        error.response?.data?.message ||
          "კომენტარის დამატების დროს დაფიქსირდა შეცდომა",
        "შეცდომა",
        {
          duration: 2000,
          size: "small",
        }
      )
    }
  }
  if (userLoading || commentsLoading) {
    return (
      <div className="bg-white dark:!bg-gray-800 shadow rounded-lg">
        <div className="p-4 sm:p-6 flex justify-center">
          <Spinner color="primary" />
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="bg-white dark:!bg-gray-800 shadow rounded-lg">
        <div className="p-4 sm:p-6">
          <p className="text-center text-red-500 dark:!text-red-400">
            კომენტარების ჩატვირთვის დროს დაფიქსირდა შეცდომა
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-white dark:!bg-gray-800 shadow rounded-lg">
      <div className="p-4 sm:p-6">
        <div className="flex items-center gap-2 mb-4 sm:mb-6">
          <MessageSquare
            size={20}
            className="text-[#105D8D] dark:!text-blue-400"
          />
          <h2 className="text-lg font-medium text-gray-900 dark:!text-gray-100">
            კომენტარები
          </h2>
        </div>

        {canComment && (
          <form onSubmit={handleSubmitComment} className="mb-6 sm:mb-8">
            <textarea
              value={newComment}
              onChange={e => setNewComment(e.target.value)}
              placeholder="დაწერე კომენტარი..."
              className="w-full px-3 sm:px-4 py-2 sm:py-3 rounded-lg border border-gray-300 dark:!border-gray-700 focus:border-[#105D8D] dark:focus:!border-blue-400 focus:ring-1 focus:ring-[#105D8D] dark:focus:!ring-blue-400 focus:outline-none transition-colors resize-none bg-white dark:!bg-gray-800 text-gray-700 dark:!text-gray-300"
              rows={3}
            />
            <div className="mt-2 sm:mt-3 flex justify-end">
              <button
                type="submit"
                disabled={createCommentMutation.isPending}
                className="px-3 sm:px-4 py-1.5 sm:py-2 text-sm bg-[#105D8D] dark:!bg-blue-600 hover:bg-[#0D4D75] dark:hover:!bg-blue-700 text-white rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {createCommentMutation.isPending
                  ? "იგზავნება..."
                  : "კომენტარის დამატება"}
              </button>
            </div>
          </form>
        )}

        <div className="space-y-4 sm:space-y-6">
          {comments?.data.length > 0 ? (
            comments.data.map(comment => (
              <CommentThread
                key={comment.id}
                comment={comment}
                currentUser={user}
                taskId={task.data.id}
                canEdit={false}
              />
            ))
          ) : (
            <p className="text-center text-gray-500 dark:!text-gray-400">
              კომენტარები არ არის
            </p>
          )}
        </div>
      </div>
    </div>
  )
}

export default CommentSection
