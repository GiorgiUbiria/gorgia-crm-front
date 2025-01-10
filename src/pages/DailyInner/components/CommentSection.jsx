import React, { useState } from "react"
import { Spinner } from "reactstrap"
import { Plus } from "lucide-react"
import {
  useCreateDailyComment,
  useGetDailyComments,
} from "../../../queries/dailyComment"
import useCurrentUser from "../../../hooks/useCurrentUser"
import CommentThread from "./CommentThread"
import CommentHeader from "./CommentHeader"
import CommentForm from "./CommentForm"
import { toast } from "react-toastify"

const CommentSection = ({ daily, canComment }) => {
  const [newComment, setNewComment] = useState("")
  const [showCommentForm, setShowCommentForm] = useState(false)
  const { currentUser } = useCurrentUser()
  const createCommentMutation = useCreateDailyComment()

  const {
    data: commentsData,
    isLoading: isLoadingComments,
    isError: isErrorComments,
    error: commentsError,
  } = useGetDailyComments(daily?.id)

  const rootComments = React.useMemo(() => {
    const comments = commentsData?.data || daily?.comments || []

    const replyIds = new Set(
      comments.flatMap(comment => comment.replies || []).map(reply => reply.id)
    )

    return comments.filter(comment => !replyIds.has(comment.id))
  }, [commentsData?.data, daily?.comments])

  const handleSubmitComment = async e => {
    e.preventDefault()
    if (!newComment.trim()) return

    try {
      await createCommentMutation.mutateAsync({
        dailyId: daily.id,
        data: {
          comment: newComment,
        },
      })
      setNewComment("")
      setShowCommentForm(false)
      toast.success("კომენტარი წარმატებით დაემატა")
    } catch (error) {
      toast.error(
        error.response?.data?.message ||
          "კომენტარის დამატების დროს დაფიქსირდა შეცდომა"
      )
    }
  }

  if (isLoadingComments || createCommentMutation.isPending) {
    return (
      <div className="bg-white shadow rounded-lg">
        <div className="p-6 flex justify-center">
          <Spinner color="primary" />
        </div>
      </div>
    )
  }

  if (isErrorComments) {
    return (
      <div className="bg-white shadow rounded-lg">
        <div className="p-6 text-center text-red-500">
          {commentsError?.message || "კომენტარების ჩატვირთვა ვერ მოხერხდა"}
        </div>
      </div>
    )
  }

  return (
    <div className="bg-white shadow rounded-lg">
      <div className="p-6">
        <div className="flex items-center justify-between mb-6 border-b pb-4">
          <CommentHeader count={rootComments.length} />
          {canComment && !showCommentForm && (
            <button
              onClick={() => setShowCommentForm(true)}
              className="flex items-center gap-2 px-4 py-2 bg-[#105D8D] hover:bg-[#0D4D75] text-white rounded-lg transition-colors"
            >
              <Plus size={16} />
              <span>დაამატე კომენტარი</span>
            </button>
          )}
        </div>

        {canComment && showCommentForm && (
          <CommentForm
            value={newComment}
            onChange={e => setNewComment(e.target.value)}
            onSubmit={handleSubmitComment}
            onCancel={() => {
              setShowCommentForm(false)
              setNewComment("")
            }}
            isLoading={createCommentMutation.isPending}
          />
        )}

        <div className="space-y-6">
          {rootComments.length > 0 ? (
            rootComments.map(comment => (
              <CommentThread
                key={comment.id}
                comment={comment}
                currentUser={currentUser}
                dailyId={daily.id}
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
