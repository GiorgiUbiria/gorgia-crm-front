import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import {
  getTaskComments,
  createTaskComment,
  updateTaskComment,
  deleteTaskComment,
} from "../services/taskComment"

export const commentKeys = {
  all: ["comments"],
  taskComments: taskId => [...commentKeys.all, "task", taskId],
  comment: commentId => [...commentKeys.all, "detail", commentId],
}

export const useGetTaskComments = (taskId, options = {}) => {
  return useQuery({
    queryKey: commentKeys.taskComments(taskId),
    queryFn: () => getTaskComments(taskId),
    ...options,
  })
}

export const useCreateTaskComment = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ taskId, data }) => createTaskComment(taskId, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: commentKeys.taskComments(variables.taskId),
      })
    },
  })
}

export const useUpdateTaskComment = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ commentId, data }) => updateTaskComment(commentId, data),
    onSuccess: (_, variables) => {
      const taskId = queryClient
        .getQueryCache()
        .findAll(commentKeys.all)
        .find(query =>
          query.state.data?.comments?.find(c => c.id === variables.commentId)
        )?.state.data?.task_id

      if (taskId) {
        queryClient.invalidateQueries({
          queryKey: commentKeys.taskComments(taskId),
        })
      }
    },
  })
}

export const useDeleteTaskComment = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: commentId => deleteTaskComment(commentId),
    onSuccess: (_, commentId) => {
      const taskId = queryClient
        .getQueryCache()
        .findAll(commentKeys.all)
        .find(query =>
          query.state.data?.comments?.find(c => c.id === commentId)
        )?.state.data?.task_id

      if (taskId) {
        queryClient.invalidateQueries({
          queryKey: commentKeys.taskComments(taskId),
        })
      }
    },
  })
}
