import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import {
  getDailyComments,
  createDailyComment,
  updateDailyComment,
  deleteDailyComment,
} from "../services/dailyComment"

export const dailyCommentKeys = {
  all: ["daily-comments"],
  byDaily: dailyId => [...dailyCommentKeys.all, "daily", dailyId],
}

export const useGetDailyComments = (dailyId, options = {}) => {
  return useQuery({
    queryKey: dailyCommentKeys.byDaily(dailyId),
    queryFn: async () => {
      const response = await getDailyComments(dailyId)
      return response
    },
    enabled: !!dailyId,
    ...options,
  })
}

export const useCreateDailyComment = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({ dailyId, data }) => {
      const response = await createDailyComment(dailyId, data)
      return response
    },
    onMutate: async ({ dailyId, data }) => {
      await queryClient.cancelQueries({
        queryKey: dailyCommentKeys.byDaily(dailyId),
      })

      const previousComments = queryClient.getQueryData(
        dailyCommentKeys.byDaily(dailyId)
      )

      const optimisticComment = {
        id: Date.now(),
        comment: data.comment,
        parent_id: data.parent_id,
        created_at: new Date().toISOString(),
        user: queryClient.getQueryData(["currentUser"]) || {},
        replies: [],
      }

      queryClient.setQueryData(dailyCommentKeys.byDaily(dailyId), old => {
        const comments = old?.data || []
        const newData = { data: [...comments, optimisticComment] }

        return newData
      })

      return { previousComments }
    },
    onError: (err, { dailyId }, context) => {
      console.error("❌ Error creating comment:", err)
      if (context?.previousComments) {
        queryClient.setQueryData(
          dailyCommentKeys.byDaily(dailyId),
          context.previousComments
        )
      }
    },
    onSettled: (data, error, { dailyId }) => {
      queryClient.invalidateQueries({
        queryKey: dailyCommentKeys.byDaily(dailyId),
      })
    },
  })
}

export const useUpdateDailyComment = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ dailyId, commentId, data }) =>
      updateDailyComment(dailyId, commentId, data),
    onSuccess: (_, { dailyId }) => {
      queryClient.invalidateQueries({
        queryKey: dailyCommentKeys.byDaily(dailyId),
      })
    },
  })
}

export const useDeleteDailyComment = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ dailyId, commentId }) =>
      deleteDailyComment(dailyId, commentId),
    onMutate: async ({ dailyId, commentId }) => {
      await queryClient.cancelQueries({
        queryKey: dailyCommentKeys.byDaily(dailyId),
      })

      const previousComments = queryClient.getQueryData(
        dailyCommentKeys.byDaily(dailyId)
      )

      queryClient.setQueryData(dailyCommentKeys.byDaily(dailyId), old => {
        const comments = old?.data || []
        return { data: comments.filter(comment => comment.id !== commentId) }
      })

      return { previousComments }
    },
    onError: (err, { dailyId }, context) => {
      console.error("❌ Error deleting comment:", err)
      if (context?.previousComments) {
        queryClient.setQueryData(
          dailyCommentKeys.byDaily(dailyId),
          context.previousComments
        )
      }
    },
    onSettled: (_, __, { dailyId }) => {
      queryClient.invalidateQueries({
        queryKey: dailyCommentKeys.byDaily(dailyId),
      })
    },
  })
}
