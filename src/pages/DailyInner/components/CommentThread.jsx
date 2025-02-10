import React, { useState } from "react"
import {
  useCreateDailyComment,
  useDeleteDailyComment,
} from "../../../queries/dailyComment"
import { formatDistanceToNow } from "../../../utils/dateUtils"
import CommentForm from "./CommentForm"
import { toast } from "store/zustand/toastStore"

const CommentThread = ({ comment, currentUser, dailyId, depth = 0 }) => {
  const [isReplying, setIsReplying] = useState(false)
  const [replyContent, setReplyContent] = useState("")

  const createCommentMutation = useCreateDailyComment()
  const deleteCommentMutation = useDeleteDailyComment()

  if (!comment) {
    console.warn("⚠️ Received null/undefined comment")
    return null
  }

  const handleSubmitReply = async e => {
    e.preventDefault()
    if (!replyContent.trim()) return

    try {
      console.log("Submitting reply:", { replyContent })
      let commentData
      try {
        commentData = JSON.parse(replyContent)
        console.log("Parsed reply as JSON:", commentData)
      } catch (e) {
        console.log("Using plain text format")
        commentData = {
          text: replyContent,
          format: {
            bold: false,
            italic: false,
            color: "black",
            fontSize: "normal",
          },
        }
      }

      console.log("Reply data to submit:", commentData)
      await createCommentMutation.mutateAsync({
        dailyId,
        data: {
          comment: JSON.stringify(commentData),
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

  const renderComment = () => {
    console.log("Rendering comment:", { comment })
    if (!comment?.comment) {
      console.log("No comment content to render")
      return ""
    }

    try {
      let segments = []
      try {
        console.log("Parsing comment content:", {
          content: comment.comment,
          type: typeof comment.comment,
        })
        let parsed =
          typeof comment.comment === "string"
            ? JSON.parse(comment.comment)
            : comment.comment
        console.log("First parse result:", parsed)

        if (parsed.text && typeof parsed.text === "string") {
          try {
            console.log("Attempting to parse inner text:", parsed.text)
            const innerParsed = JSON.parse(parsed.text)
            console.log("Inner parse result:", innerParsed)

            if (Array.isArray(innerParsed)) {
              console.log("Using inner array format")
              segments = innerParsed
            }

            else if (innerParsed.text && innerParsed.format) {
              console.log("Using inner object format")

              segments = [
                {
                  text: innerParsed.text,
                  format: innerParsed.format,
                },
              ]
            }
            else {
              console.log("Using inner plain text format")
              segments = [
                {
                  text: String(innerParsed),
                  format: parsed.format || {
                    bold: false,
                    italic: false,
                    color: "black",
                    fontSize: "normal",
                  },
                },
              ]
            }
          } catch (e) {
            console.warn("Failed to parse inner text:", e)
            segments = [
              {
                text: parsed.text,
                format: parsed.format || {
                  bold: false,
                  italic: false,
                  color: "black",
                  fontSize: "normal",
                },
              },
            ]
          }
        }
        else if (Array.isArray(parsed)) {
          console.log("Using array format")
          segments = parsed
        }
        else if (parsed.text) {
          console.log("Using object format")
          segments = [
            {
              text: parsed.text,
              format: parsed.format || {
                bold: false,
                italic: false,
                color: "black",
                fontSize: "normal",
              },
            },
          ]
        }
        else {
          console.log("Using plain text format")
          segments = [
            {
              text: String(parsed),
              format: {
                bold: false,
                italic: false,
                color: "black",
                fontSize: "normal",
              },
            },
          ]
        }
        console.log("Final segments:", segments)
      } catch (e) {
        console.warn("Failed to parse comment segments:", e, {
          content: comment.comment,
        })
        segments = [
          {
            text: String(comment.comment),
            format: {
              bold: false,
              italic: false,
              color: "black",
              fontSize: "normal",
            },
          },
        ]
      }

      return (
        <div>
          {segments.map((segment, index) => {
            const style = {
              fontWeight: segment.format.bold ? "bold" : "normal",
              fontStyle: segment.format.italic ? "italic" : "normal",
              color: segment.format.color || "black",
              fontSize: segment.format.fontSize === "large" ? "1.2em" : "1em",
            }
            console.log(`Rendering segment ${index}:`, { segment, style })
            return (
              <span key={index} style={style}>
                {segment.text}
              </span>
            )
          })}
        </div>
      )
    } catch (e) {
      console.warn("Failed to render comment:", e)
      return String(comment.comment)
    }
  }

  return (
    <div
      className={`${
        depth > 0
          ? "ml-8 border-l-2 border-gray-100 dark:!border-gray-700 pl-4"
          : ""
      }`}
    >
      <div className="bg-gray-50 dark:!bg-gray-700/80 p-5 rounded-xl shadow-sm hover:shadow-md transition-shadow">
        <div className="flex items-start gap-4">
          <div className="shrink-0 w-10 h-10 rounded-full bg-gradient-to-br from-[#105D8D] to-[#1A7AB8] dark:!from-[#1A7AB8] dark:!to-[#2389CC] text-white flex items-center justify-center text-sm font-semibold shadow-inner">
            {name?.[0]?.toUpperCase() || "?"}
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-3 flex-wrap">
              <span className="font-semibold text-gray-900 dark:!text-gray-50">
                {name} {sur_name}
              </span>
              <span className="text-sm text-gray-500 dark:!text-gray-400">
                {formatDistanceToNow(created_at)}
              </span>
            </div>
            <div className="mt-3 text-gray-700 dark:!text-gray-200 break-words">
              {renderComment()}
            </div>
            <div className="mt-4 flex items-center gap-4">
              <button
                onClick={() => setIsReplying(!isReplying)}
                className="text-sm font-medium text-[#105D8D] hover:text-[#0D4D75] dark:!text-[#4BA3E3] dark:!hover:text-[#71B8ED] transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#105D8D] dark:!focus:ring-offset-gray-800 rounded-md"
              >
                პასუხის გაცემა
              </button>
              {userId === currentUser?.id && (
                <button
                  onClick={handleDelete}
                  disabled={deleteCommentMutation.isPending}
                  className="text-sm font-medium text-red-500 hover:text-red-600 dark:!text-red-400 dark:!hover:text-red-300 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 dark:!focus:ring-offset-gray-800 rounded-md disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {deleteCommentMutation.isPending ? "იშლება..." : "წაშლა"}
                </button>
              )}
            </div>
          </div>
        </div>

        {isReplying && (
          <div className="mt-4 ml-14">
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
