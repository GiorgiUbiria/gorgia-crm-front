import React, { useState } from "react"
import { toast } from "react-toastify"
import {
  useCreateDailyComment,
  useDeleteDailyComment,
} from "../../../queries/dailyComment"
import { formatDistanceToNow } from "../../../utils/dateUtils"
import CommentForm from "./CommentForm"

const CommentThread = ({ comment, currentUser, dailyId, depth = 0 }) => {
  const [isReplying, setIsReplying] = useState(false)
  const [replyContent, setReplyContent] = useState("")

  const createCommentMutation = useCreateDailyComment()
  const deleteCommentMutation = useDeleteDailyComment()

  if (!comment) return null

  const handleSubmitReply = async e => {
    e.preventDefault()
    if (!replyContent.trim()) return

    try {
      await createCommentMutation.mutateAsync({
        dailyId,
        data: {
          comment: replyContent,
          parent_id: comment.id,
        },
      })
      setReplyContent("")
      setIsReplying(false)
      toast.success("პასუხი წარმატებით დაემატა")
    } catch (error) {
      toast.error(
        error.response?.data?.message ||
          "პასუხის დამატების დროს დაფიქსირდა შეცდომა"
      )
    }
  }

  const handleDelete = async () => {
    if (!window.confirm("ნამდვილად გსურთ კომენტარის წაშლა?")) return

    try {
      await deleteCommentMutation.mutateAsync({
        dailyId,
        commentId: comment.id,
      })
      toast.success("კომენტარი წაიშალა")
    } catch (error) {
      toast.error(
        error.response?.data?.message ||
          "კომენტარის წაშლის დროს დაფიქსირდა შეცდომა"
      )
    }
  }

  const { user = {}, created_at, replies = [] } = comment
  const { name = "", sur_name = "", id: userId } = user

  return (
    <div className={`${depth > 0 ? "ml-8 border-l border-gray-200 pl-4" : ""}`}>
      <div className="bg-white p-4 rounded-lg shadow-sm">
        <div className="flex items-start gap-4">
          <div className="w-8 h-8 rounded-full bg-[#105D8D] text-white flex items-center justify-center text-sm font-medium">
            {name?.[0]?.toUpperCase() || "?"}
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-2">
              <span className="font-medium">
                {name} {sur_name}
              </span>
              <span className="text-sm text-gray-500">
                {formatDistanceToNow(created_at)}
              </span>
            </div>
            <p className="mt-2 text-gray-700">{comment.comment}</p>
            <div className="mt-2 flex items-center gap-4">
              <button
                onClick={() => setIsReplying(!isReplying)}
                className="text-sm text-[#105D8D] hover:text-[#0D4D75] font-medium"
              >
                პასუხის გაცემა
              </button>
              {userId === currentUser?.id && (
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
          <CommentForm
            value={replyContent}
            onChange={e => setReplyContent(e.target.value)}
            onSubmit={handleSubmitReply}
            onCancel={() => setIsReplying(false)}
            isLoading={createCommentMutation.isPending}
            placeholder="დაწერე პასუხი..."
            submitText="პასუხის გაგზავნა"
            className="mt-4 ml-12"
          />
        )}
      </div>

      {replies.length > 0 && (
        <div className="space-y-4 mt-4">
          {replies.map(reply => (
            <CommentThread
              key={reply.id}
              comment={reply}
              currentUser={currentUser}
              dailyId={dailyId}
              depth={depth + 1}
            />
          ))}
        </div>
      )}
    </div>
  )
}

export default React.memo(CommentThread)
