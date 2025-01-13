import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import * as calendarService from "../services/calendar"
import { queryKeys } from "./keys"

export const useCalendarEvents = (filters = {}) => {
  return useQuery({
    queryKey: queryKeys.calendar.events(filters),
    queryFn: () => calendarService.getEvents(filters),
    staleTime: 5 * 60 * 1000,
  })
}

export const useCreateEvent = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (data) => calendarService.createEvent(data),
    onSuccess: () => {
      queryClient.invalidateQueries(queryKeys.calendar.events())
    },
  })
}

export const useUpdateEvent = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ eventId, data }) => calendarService.updateEvent(eventId, data),
    onMutate: async ({ eventId, data }) => {
      await queryClient.cancelQueries(queryKeys.calendar.events())

      const previousEvents = queryClient.getQueryData(queryKeys.calendar.events())

      queryClient.setQueryData(
        queryKeys.calendar.events(),
        old => ({
          ...old,
          events: old.events.map(event =>
            event.id === eventId ? { ...event, ...data } : event
          )
        })
      )

      return { previousEvents }
    },
    onError: (err, _, context) => {
      queryClient.setQueryData(
        queryKeys.calendar.events(),
        context?.previousEvents
      )
    },
    onSettled: () => {
      queryClient.invalidateQueries(queryKeys.calendar.events())
    },
  })
}

export const useDeleteEvent = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (eventId) => calendarService.deleteEvent(eventId),
    onSuccess: () => {
      queryClient.invalidateQueries(queryKeys.calendar.events())
    },
  })
} 