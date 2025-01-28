import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import {
  getCalendarEvents,
  getCalendarEvent,
  createCalendarEvent,
  updateCalendarEvent,
  deleteCalendarEvent,
  updateGuestStatus,
  addEventGuests,
  removeEventGuest,
  completeEventTask,
  completeAllEventTasks,
  getEventComments,
  createEventComment,
  updateEventComment,
  deleteEventComment,
} from "../services/calendar"

export const calendarKeys = {
  all: ["calendar"],
  events: () => [...calendarKeys.all, "events"],
  event: id => [...calendarKeys.all, "event", id],
  comments: eventId => [...calendarKeys.all, eventId, "comments"],
}

// Calendar Events
export const useGetCalendarEvents = (options = {}) => {
  return useQuery({
    queryKey: calendarKeys.events(),
    queryFn: getCalendarEvents,
    ...options,
  })
}

export const useGetCalendarEvent = (id, options = {}) => {
  return useQuery({
    queryKey: calendarKeys.event(id),
    queryFn: () => getCalendarEvent(id),
    ...options,
  })
}

export const useCreateCalendarEvent = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: createCalendarEvent,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: calendarKeys.events() })
    },
  })
}

export const useUpdateCalendarEvent = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, data }) => updateCalendarEvent(id, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: calendarKeys.events() })
      queryClient.invalidateQueries({ queryKey: calendarKeys.event(variables.id) })
    },
  })
}

export const useDeleteCalendarEvent = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: deleteCalendarEvent,
    onSuccess: (_, id) => {
      queryClient.invalidateQueries({ queryKey: calendarKeys.events() })
      queryClient.invalidateQueries({ queryKey: calendarKeys.event(id) })
    },
  })
}

// Guest Management
export const useUpdateGuestStatus = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ eventId, data }) => updateGuestStatus(eventId, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: calendarKeys.event(variables.eventId) })
    },
  })
}

export const useAddEventGuests = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ eventId, data }) => addEventGuests(eventId, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: calendarKeys.event(variables.eventId) })
    },
  })
}

export const useRemoveEventGuest = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ eventId, guestId }) => removeEventGuest(eventId, guestId),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: calendarKeys.event(variables.eventId) })
    },
  })
}

// Task Management
export const useCompleteEventTask = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ eventId, taskId }) => completeEventTask(eventId, taskId),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: calendarKeys.event(variables.eventId) })
    },
  })
}

export const useCompleteAllEventTasks = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: eventId => completeAllEventTasks(eventId),
    onSuccess: (_, eventId) => {
      queryClient.invalidateQueries({ queryKey: calendarKeys.event(eventId) })
    },
  })
}

// Comments
export const useGetEventComments = (eventId, options = {}) => {
  return useQuery({
    queryKey: calendarKeys.comments(eventId),
    queryFn: () => getEventComments(eventId),
    ...options,
  })
}

export const useCreateEventComment = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ eventId, data }) => createEventComment(eventId, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: calendarKeys.comments(variables.eventId) })
    },
  })
}

export const useUpdateEventComment = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ eventId, commentId, data }) =>
      updateEventComment(eventId, commentId, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: calendarKeys.comments(variables.eventId) })
    },
  })
}

export const useDeleteEventComment = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ eventId, commentId }) => deleteEventComment(eventId, commentId),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: calendarKeys.comments(variables.eventId) })
    },
  })
}

// Composite Hooks
export const useCalendarQueries = (options = {}) => {
  const { data: events = [], isLoading: isEventsLoading } = useGetCalendarEvents({
    ...options,
    select: data => data || []
  })

  return {
    events,
    isEventsLoading,
  }
}
