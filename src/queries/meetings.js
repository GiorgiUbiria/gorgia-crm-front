import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import * as meetingService from "../services/meetingService"
import { queryKeys } from "./keys"

export const useMeetings = (filters = {}) => {
  return useQuery({
    queryKey: queryKeys.meetings.list(filters),
    queryFn: () => meetingService.getMeetings(filters),
    staleTime: 5 * 60 * 1000,
  })
}

export const useMeeting = (id) => {
  return useQuery({
    queryKey: queryKeys.meetings.detail(id),
    queryFn: () => meetingService.getMeeting(id),
    enabled: Boolean(id),
  })
}

export const useCreateMeeting = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (data) => meetingService.createMeeting(data),
    onSuccess: () => {
      queryClient.invalidateQueries(queryKeys.meetings.lists())
    },
  })
}

export const useUpdateMeeting = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, data }) => meetingService.updateMeeting(id, data),
    onMutate: async ({ id, data }) => {
      await queryClient.cancelQueries(queryKeys.meetings.detail(id))

      const previousMeeting = queryClient.getQueryData(queryKeys.meetings.detail(id))

      queryClient.setQueryData(
        queryKeys.meetings.detail(id),
        old => ({ ...old, ...data })
      )

      return { previousMeeting }
    },
    onError: (err, { id }, context) => {
      queryClient.setQueryData(
        queryKeys.meetings.detail(id),
        context?.previousMeeting
      )
    },
    onSettled: (_, __, { id }) => {
      queryClient.invalidateQueries(queryKeys.meetings.detail(id))
      queryClient.invalidateQueries(queryKeys.meetings.lists())
    },
  })
}

export const useDeleteMeeting = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (id) => meetingService.deleteMeeting(id),
    onSuccess: () => {
      queryClient.invalidateQueries(queryKeys.meetings.lists())
    },
  })
} 