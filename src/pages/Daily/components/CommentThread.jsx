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
        // Try to parse the value as JSON first
        commentData = JSON.parse(replyContent)
        console.log("Parsed reply as JSON:", commentData)
      } catch (e) {
        // If parsing fails, treat as plain text
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
    } catch (error) {
      console.error("❌ Comment deletion failed:", error)
      toast.error(
        error.response?.data?.message ||
          "კომენტარის წაშლის დროს დაფიქსირდა შეცდომა"
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
        // First parse
        let parsed =
          typeof comment.comment === "string"
            ? JSON.parse(comment.comment)
            : comment.comment
        console.log("First parse result:", parsed)

        // Handle double-stringified JSON
        if (parsed.text && typeof parsed.text === "string") {
          try {
            console.log("Attempting to parse inner text:", parsed.text)
            const innerParsed = JSON.parse(parsed.text)
            console.log("Inner parse result:", innerParsed)

            // Handle array format
            if (Array.isArray(innerParsed)) {
              console.log("Using inner array format")
              segments = innerParsed
            }
            // Handle object format
            else if (innerParsed.text && innerParsed.format) {
              console.log("Using inner object format")
              segments = [
                {
                  text: innerParsed.text,
                  format: innerParsed.format,
                },
              ]
            }
            // Handle plain text
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
        // Handle array format
        else if (Array.isArray(parsed)) {
          console.log("Using array format")
          segments = parsed
        }
        // Handle object format
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
        // Handle plain text
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
        // If parsing fails, treat as plain text
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

      console.log("Rendering segments:", segments)
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
            <div className="mt-2 text-gray-700">{renderComment()}</div>
            <div className="mt-2 flex items-center gap-4">
              <button
                onClick={() => {
                  setIsReplying(!isReplying)
                }}
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
            onCancel={() => {
              setIsReplying(false)
              setReplyContent("")
            }}
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
