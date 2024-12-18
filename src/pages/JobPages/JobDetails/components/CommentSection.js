import React, { useState, useEffect } from "react"
import { MessageSquare } from "lucide-react"
import {
  createTaskComment,
  getTaskComments,
  updateTaskComment,
  deleteTaskComment,
} from "../../../../services/taskComment"
import CommentThread from "./CommentThread"

const CommentSection = ({ task }) => {
  const [newComment, setNewComment] = useState("")
  const [comments, setComments] = useState([])
  const currentUser = JSON.parse(sessionStorage.getItem("authUser"))

  useEffect(() => {
    const fetchComments = async () => {
      try {
        const response = await getTaskComments(task.id)
        console.log("Intiial response", response)
        setComments(response.data)
      } catch (error) {
        console.error("Error fetching comments:", error)
      }
    }

    fetchComments()
  }, [task.id])

  const handleSubmitComment = async e => {
    e.preventDefault()
    if (!newComment.trim()) return

    try {
      const newCommentData = {
        task_id: task.id,
        comment_text: newComment,
      }

      const response = await createTaskComment(task.id, newCommentData)
      const createdComment = {
        ...response.data,
        user: currentUser,
        replies: [],
        is_reply: false,
        parent_id: null,
      }

      setComments(prevComments => [...prevComments, createdComment])
      setNewComment("")
    } catch (error) {
      console.error("Error creating comment:", error)
      alert("კომენტარის დამატება ვერ მოხერხდა. სცადეთ თავიდან.")
    }
  }

  const handleAddReply = async (parentId, content) => {
    try {
      const replyData = {
        task_id: task.id,
        comment_text: content,
        parent_id: parentId,
      }

      const response = await createTaskComment(task.id, replyData)
      const createdReply = {
        ...response.data,
        user: currentUser,
        replies: [],
        is_reply: true,
      }

      setComments(prevComments => {
        const updateComments = comments => {
          return comments.map(comment => {
            if (comment.id === parentId) {
              return {
                ...comment,
                replies: [...(comment.replies || []), createdReply],
              }
            }
            if (comment.replies?.length > 0) {
              return {
                ...comment,
                replies: updateComments(comment.replies),
              }
            }
            return comment
          })
        }
        return updateComments(prevComments)
      })
    } catch (error) {
      console.error("Error creating reply:", error)
      alert("პასუხის დამატება ვერ მოხერხდა. სცადეთ თავიდან.")
    }
  }

  const handleEditComment = async (commentId, newContent) => {
    try {
      const response = await updateTaskComment(commentId, {
        comment_text: newContent,
      })

      const updatedComment = {
        ...response.data,
        user: currentUser,
      }

      setComments(prevComments => {
        const updateComments = comments => {
          return comments.map(comment => {
            if (comment.id === commentId) {
              return {
                ...comment,
                ...updatedComment,
                replies: comment.replies,
              }
            }
            if (comment.replies?.length > 0) {
              return {
                ...comment,
                replies: updateComments(comment.replies),
              }
            }
            return comment
          })
        }
        return updateComments(prevComments)
      })
    } catch (error) {
      console.error("Error updating comment:", error)
      alert("კომენტარის განახლება ვერ მოხერხდა. სცადეთ თავიდან.")
    }
  }

  const handleDeleteComment = async commentId => {
    try {
      await deleteTaskComment(commentId)

      setComments(prevComments => {
        const filterComments = comments => {
          return comments
            .filter(comment => comment.id !== commentId)
            .map(comment => {
              if (comment.replies?.length > 0) {
                return {
                  ...comment,
                  replies: filterComments(comment.replies),
                }
              }
              return comment
            })
        }

        return filterComments(prevComments)
      })
    } catch (error) {
      console.error("Error deleting comment:", error)
      alert("კომენტარის წაშლა ვერ მოხერხდა. სცადეთ თავიდან.")
    }
  }

  return (
    <div className="bg-white shadow rounded-lg">
      <div className="p-6">
        <div className="flex items-center gap-2 mb-6">
          <MessageSquare size={20} className="text-[#105D8D]" />
          <h2 className="text-lg font-medium text-gray-900">კომენტარები</h2>
        </div>

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
              className="px-4 py-2 bg-[#105D8D] hover:bg-[#0D4D75] text-white rounded-lg transition-colors"
            >
              კომენტარის დატატება
            </button>
          </div>
        </form>

        <div className="space-y-6">
          {comments.length > 0 ? (
            comments.map(comment => (
              <CommentThread
                key={comment.id}
                comment={comment}
                currentUser={currentUser}
                onAddReply={handleAddReply}
                onEditComment={handleEditComment}
                onDeleteComment={handleDeleteComment}
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
