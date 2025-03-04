import React, { useState } from "react"
import { MessageSquare } from "lucide-react"
import { Spinner } from "reactstrap"
import {
  useGetTaskComments,
  useCreateTaskComment,
} from "../../../../queries/taskComments"
import CommentThread from "./CommentThread"
import useAuth from "hooks/useAuth"
import { toast } from "store/zustand/toastStore"

const CommentSection = ({ taskData, canComment }) => {
  const [newComment, setNewComment] = useState("")
  const { user, isLoading: userLoading } = useAuth()

  const {
    data: comments = [],
    isLoading: commentsLoading,
    error,
  } = useGetTaskComments(taskData.id)

  const createCommentMutation = useCreateTaskComment()

  const handleSubmitComment = async e => {
    e.preventDefault()
    if (!newComment.trim()) return

    try {
      await createCommentMutation.mutateAsync({
        taskId: taskData.id,
        data: {
          task_id: taskData.id,
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
      <div className="bg-white shadow rounded-lg">
        <div className="p-6 flex justify-center">
          <Spinner color="primary" />
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="bg-white shadow rounded-lg">
        <div className="p-6">
          <p className="text-center text-red-500">
            კომენტარების ჩატვირთვის დროს დაფიქსირდა შეცდომა
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-white shadow rounded-lg">
      <div className="p-6">
        <div className="flex items-center gap-2 mb-6">
          <MessageSquare size={20} className="text-[#105D8D]" />
          <h2 className="text-lg font-medium text-gray-900">კომენტარები</h2>
        </div>

        {canComment && (
          <form onSubmit={handleSubmitComment} className="mb-8">
            <textarea
              value={newComment}
              onChange={e => setNewComment(e.target.value)}
              placeholder="დაწერე კომენტარი..."
              className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-[#105D8D] focus:ring-1 focus:ring-[#105D8D] focus:outline-none transition-colors resize-none"
              rows={4}
            />
            <div className="mt-3 flex justify-end">
              <button
                type="submit"
                disabled={createCommentMutation.isPending}
                className="px-4 py-2 bg-[#105D8D] hover:bg-[#0D4D75] text-white rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {createCommentMutation.isPending
                  ? "იგზავნება..."
                  : "კომენტარის დამატება"}
              </button>
            </div>
          </form>
        )}

        <div className="space-y-6">
          {comments?.data?.length > 0 ? (
            comments.data.map(comment => (
              <CommentThread
                key={comment.id}
                comment={comment}
                currentUser={user}
                taskId={taskData.id}
                canEdit={false}
              />
            ))
          ) : (
            <p className="text-center text-gray-500">კომენტარები არ არის</p>
          )}
        </div>
      </div>
    </div>
  )
}

export default CommentSection
