import React, { useState } from "react"
import {
  useCreateDailyComment,
  useDeleteDailyComment,
} from "../../../queries/dailyComment"
import { formatDistanceToNow } from "../../../utils/dateUtils"
import CommentForm from "./CommentForm"
import { toast } from "store/zustand/toastStore"
import { useEditor, EditorContent } from "@tiptap/react"
import StarterKit from "@tiptap/starter-kit"
import TextStyle from "@tiptap/extension-text-style"
import Color from "@tiptap/extension-color"
import Highlight from "@tiptap/extension-highlight"
import Link from "@tiptap/extension-link"
import Underline from "@tiptap/extension-underline"

const CommentThread = ({ comment, currentUser, dailyId, depth = 0 }) => {
  const [isReplying, setIsReplying] = useState(false)
  const [replyContent, setReplyContent] = useState("")

  const createCommentMutation = useCreateDailyComment()
  const deleteCommentMutation = useDeleteDailyComment()

  const commentEditor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: {
          levels: [1, 2],
        },
      }),
      TextStyle,
      Color,
      Highlight.configure({
        multicolor: true,
      }),
      Link.configure({
        openOnClick: false,
        HTMLAttributes: {
          class: "text-blue-500 hover:text-blue-700 underline",
        },
      }),
      Underline,
    ],
    content: null,
    editable: false,
  })

  // Update editor content when comment changes
  React.useEffect(() => {
    if (commentEditor && comment?.comment) {
      try {
        let content = comment.comment
        if (typeof content === "string") {
          const parsed = JSON.parse(content)
          if (parsed.text) {
            content = JSON.parse(parsed.text)
          } else {
            content = parsed
          }
        }
        commentEditor.commands.setContent(content)
      } catch (e) {
        console.warn("Failed to parse comment content:", e)
        commentEditor.commands.setContent(String(comment.comment))
      }
    }
  }, [comment?.comment, commentEditor])

  if (!comment) {
    console.warn("⚠️ Received null/undefined comment")
    return null
  }

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
    } catch (error) {
      console.error("❌ Reply submission failed:", error)
      toast.error(
        error.response?.data?.message ||
          "პასუხის დამატების დროს დაფიქსირდა შეცდომა",
        "შეცდომა",
        {
          duration: 2000,
          size: "small",
        }
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
    } catch (error) {
      console.error("❌ Comment deletion failed:", error)
      toast.error(
        error.response?.data?.message ||
          "კომენტარის წაშლის დროს დაფიქსირდა შეცდომა",
        "შეცდომა",
        {
          duration: 2000,
          size: "small",
        }
      )
    }
  }

  const { user = {}, created_at, replies = [] } = comment
  const { name = "", sur_name = "", id: userId } = user

  return (
    <div
      className={`${
        depth > 0
          ? "ml-3 sm:ml-8 border-l-2 border-gray-100 dark:!border-gray-700 pl-3 sm:pl-4"
          : ""
      }`}
    >
      <div className="bg-gray-50 dark:!bg-gray-700/80 p-3 sm:p-5 rounded-xl shadow-sm hover:shadow-md transition-shadow">
        <div className="flex items-start gap-3 sm:gap-4">
          <div className="shrink-0 w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-gradient-to-br from-[#105D8D] to-[#1A7AB8] dark:!from-[#1A7AB8] dark:!to-[#2389CC] text-white flex items-center justify-center text-xs sm:text-sm font-semibold shadow-inner">
            {name?.[0]?.toUpperCase() || "?"}
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-3 flex-wrap">
              <span className="font-semibold text-sm sm:text-base text-gray-900 dark:!text-gray-50">
                {name} {sur_name}
              </span>
              <span className="text-xs sm:text-sm text-gray-500 dark:!text-gray-400">
                {formatDistanceToNow(created_at)}
              </span>
            </div>
            <div className="mt-2 sm:mt-3 text-sm sm:text-base text-gray-700 dark:!text-gray-200 break-words prose dark:prose-invert max-w-none">
              {commentEditor && <EditorContent editor={commentEditor} />}
            </div>
            <div className="mt-3 sm:mt-4 flex flex-wrap items-center gap-3 sm:gap-4">
              <button
                onClick={() => setIsReplying(!isReplying)}
                className="text-xs sm:text-sm font-medium text-[#105D8D] hover:text-[#0D4D75] dark:!text-[#4BA3E3] dark:!hover:text-[#71B8ED] transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#105D8D] dark:!focus:ring-offset-gray-800 rounded-md"
              >
                პასუხის გაცემა
              </button>
              {userId === currentUser?.id && (
                <button
                  onClick={handleDelete}
                  disabled={deleteCommentMutation.isPending}
                  className="text-xs sm:text-sm font-medium text-red-500 hover:text-red-600 dark:!text-red-400 dark:!hover:text-red-300 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 dark:!focus:ring-offset-gray-800 rounded-md disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {deleteCommentMutation.isPending ? "იშლება..." : "წაშლა"}
                </button>
              )}
            </div>
          </div>
        </div>

        {isReplying && (
          <div className="mt-3 sm:mt-4 ml-11 sm:ml-14">
            <CommentForm
              value={replyContent}
              onChange={e => setReplyContent(e.target.value)}
              onSubmit={handleSubmitReply}
              onCancel={() => {
                setIsReplying(false)
                setReplyContent("")
              }}
              isLoading={createCommentMutation.isPending}
              placeholder="დაწერე პასუხი..."
              submitText="პასუხის გაგზავნა"
            />
          </div>
        )}
      </div>

      {replies.length > 0 && (
        <div className="space-y-3 sm:space-y-4 mt-3 sm:mt-4">
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
