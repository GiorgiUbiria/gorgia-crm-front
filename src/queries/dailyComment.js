import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import {
  getDailyComments,
  createDailyComment,
  updateDailyComment,
  deleteDailyComment,
} from "../services/dailyComment"
import { dailyKeys } from "./daily"

export const dailyCommentKeys = {
  all: ["daily-comments"],
  byDaily: (dailyId) => [...dailyCommentKeys.all, "daily", dailyId],
}

// Query for fetching comments
export const useGetDailyComments = (dailyId, options = {}) => {
  return useQuery({
    queryKey: dailyCommentKeys.byDaily(dailyId),
    queryFn: () => getDailyComments(dailyId),
    enabled: !!dailyId,
    ...options,
  })
}

// Mutation for creating a comment
export const useCreateDailyComment = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ dailyId, data }) => createDailyComment(dailyId, data),
    onSuccess: (_, { dailyId }) => {
      // Invalidate both the daily detail and comments queries
      queryClient.invalidateQueries({
        queryKey: dailyKeys.departmentHeadDaily(dailyId),
      })
      queryClient.invalidateQueries({
        queryKey: dailyCommentKeys.byDaily(dailyId),
      })
    },
  })
}

// Mutation for updating a comment
export const useUpdateDailyComment = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ dailyId, commentId, data }) => 
      updateDailyComment(dailyId, commentId, data),
    onSuccess: (_, { dailyId }) => {
      queryClient.invalidateQueries({
        queryKey: dailyKeys.departmentHeadDaily(dailyId),
      })
      queryClient.invalidateQueries({
        queryKey: dailyCommentKeys.byDaily(dailyId),
      })
    },
  })
}

// Mutation for deleting a comment
export const useDeleteDailyComment = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ dailyId, commentId }) => 
      deleteDailyComment(dailyId, commentId),
    onSuccess: (_, { dailyId }) => {
      queryClient.invalidateQueries({
        queryKey: dailyKeys.departmentHeadDaily(dailyId),
      })
      queryClient.invalidateQueries({
        queryKey: dailyCommentKeys.byDaily(dailyId),
      })
    },
  })
}

