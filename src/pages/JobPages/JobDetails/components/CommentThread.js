import React, { useState } from "react"
import { toast } from "react-toastify"
import {
  useCreateTaskComment,
  useDeleteTaskComment,
} from "../../../../queries/taskComments"

const formatTimeAgo = date => {
  const now = new Date()
  const past = new Date(date)
  const diffInSeconds = Math.floor((now - past) / 1000)

  if (diffInSeconds < 60) {
    return "ახლახანს"
  }

  const diffInMinutes = Math.floor(diffInSeconds / 60)
  if (diffInMinutes < 60) {
    return `${diffInMinutes} წუთის წინ`
  }

  const diffInHours = Math.floor(diffInMinutes / 60)
  if (diffInHours < 24) {
    return `${diffInHours} საათის წინ`
  }

  const diffInDays = Math.floor(diffInHours / 24)
  if (diffInDays < 7) {
    return `${diffInDays} დღის წინ`
  }

  const diffInWeeks = Math.floor(diffInDays / 7)
  if (diffInWeeks < 4) {
    return `${diffInWeeks} კვირის წინ`
  }

  const diffInMonths = Math.floor(diffInDays / 30)
  if (diffInMonths < 12) {
    return `${diffInMonths} თვის წინ`
  }

  const diffInYears = Math.floor(diffInDays / 365)
  return `${diffInYears} წლის წინ`
}

const CommentThread = ({ comment, currentUser, taskId, depth = 0 }) => {
  const [isReplying, setIsReplying] = useState(false)
  const [replyContent, setReplyContent] = useState("")

  const createCommentMutation = useCreateTaskComment()
  const deleteCommentMutation = useDeleteTaskComment()

  const handleSubmitReply = async e => {
    e.preventDefault()
    if (!replyContent.trim()) return

    try {
      await createCommentMutation.mutateAsync({
        taskId,
        data: {
          task_id: taskId,
          comment_text: replyContent,
          parent_id: comment.id,
        },
      })
      setReplyContent("")
      setIsReplying(false)
    } catch (error) {
      toast.error(
        error.response?.data?.message ||
          "პასუხის დამატების დროს დაფიქსირდა შეცდომა"
      )
    }
  }

  const handleDelete = async () => {
    if (window.confirm("ნამდვილად გსურთ კომენტარის წაშლა?")) {
      try {
        await deleteCommentMutation.mutateAsync(comment.id)
      } catch (error) {
        toast.error(
          error.response?.data?.message ||
            "კომენტარის წაშლის დროს დაფიქსირდა შეცდომა"
        )
      }
    }
  }

  const userName = comment.user?.name || "Unknown"
  const userSurName = comment.user?.sur_name || ""
  const userAvatar =
    comment.user?.avatar_url || "https://via.placeholder.com/40"

  return (
    <div className={`${depth > 0 ? "ml-8 border-l border-gray-200 pl-4" : ""}`}>
      <div className="bg-white p-4 mb-4 rounded-lg shadow-sm">
        <div className="flex items-start gap-4">
          <img
            src={userAvatar}
            alt={`${userName} ${userSurName}`}
            className="w-8 h-8 rounded-full"
          />
          <div className="flex-1">
            <div className="flex items-center gap-2">
              <span className="font-medium text-gray-900">
                {userName} {userSurName}
              </span>
              <span className="text-sm text-gray-500">
                {formatTimeAgo(comment.created_at)}
              </span>
            </div>

            <p className="mt-1 text-gray-700 whitespace-pre-wrap">
              {comment.comment_text}
            </p>

            <div className="mt-2 flex items-center gap-4">
              <button
                onClick={() => setIsReplying(!isReplying)}
                className="text-sm text-[#105D8D] hover:text-[#0D4D75] font-medium"
              >
                პასუხის გაცემა
              </button>
              {comment.user_id === currentUser?.id && (
                <button
                  onClick={handleDelete}
                  disabled={deleteCommentMutation.isPending}
                  className="text-sm text-red-500 hover:text-red-700 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {deleteCommentMutation.isPending ? "იშლება..." : "წაშლა"}
                </button>
              )}
            </div>
          </div>
        </div>

        {isReplying && (
          <form onSubmit={handleSubmitReply} className="mt-4 ml-12">
            <textarea
              value={replyContent}
              onChange={e => setReplyContent(e.target.value)}
              placeholder="დაწერე პასუხი..."
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:border-[#105D8D] focus:ring-1 focus:ring-[#105D8D] focus:outline-none resize-none"
              rows={3}
            />
            <div className="mt-2 flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setIsReplying(false)}
                className="px-4 py-2 text-sm text-gray-600 hover:text-gray-800"
              >
                გაუქმება
              </button>
              <button
                type="submit"
                disabled={createCommentMutation.isPending}
                className="px-4 py-2 text-sm text-white bg-[#105D8D] hover:bg-[#0D4D75] rounded disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {createCommentMutation.isPending
                  ? "იგზავნება..."
                  : "პასუხის გაგზავნა"}
              </button>
            </div>
          </form>
        )}
      </div>

      {comment.replies?.length > 0 && (
        <div className="space-y-4">
          {comment.replies.map(reply => (
            <CommentThread
              key={reply.id}
              comment={reply}
              currentUser={currentUser}
              taskId={taskId}
              depth={depth + 1}
            />
          ))}
        </div>
      )}
    </div>
  )
}

export default CommentThread
