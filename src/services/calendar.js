import defaultInstance from "../plugins/axios"

// Calendar Events
export const getCalendarEvents = async () => {
  try {
    const response = await defaultInstance.get("/api/calendar-events")
    return response.data.data || []
  } catch (error) {
    console.error("Error fetching calendar events:", error)
    throw error
  }
}

export const createCalendarEvent = async data => {
  try {
    const response = await defaultInstance.post("/api/calendar-events", data)
    return response.data.data
  } catch (error) {
    console.error("Error creating calendar event:", error)
    throw error
  }
}

export const getCalendarEvent = async id => {
  try {
    const response = await defaultInstance.get(`/api/calendar-events/${id}`)
    return response.data.data
  } catch (error) {
    console.error("Error fetching calendar event:", error)
    throw error
  }
}

export const updateCalendarEvent = async (id, data) => {
  try {
    const response = await defaultInstance.put(
      `/api/calendar-events/${id}`,
      data
    )
    return response.data.data
  } catch (error) {
    console.error("Error updating calendar event:", error)
    throw error
  }
}

export const deleteCalendarEvent = async id => {
  try {
    const response = await defaultInstance.delete(`/api/calendar-events/${id}`)
    return response.data.data
  } catch (error) {
    console.error("Error deleting calendar event:", error)
    throw error
  }
}

// Guest Management
export const updateGuestStatus = async (eventId, data) => {
  try {
    const response = await defaultInstance.post(
      `/api/calendar-events/${eventId}/guest-status`,
      data
    )
    return response.data.data
  } catch (error) {
    console.error("Error updating guest status:", error)
    throw error
  }
}

export const addEventGuests = async (eventId, data) => {
  try {
    const response = await defaultInstance.post(
      `/api/calendar-events/${eventId}/guests`,
      data
    )
    return response.data.data
  } catch (error) {
    console.error("Error adding guests:", error)
    throw error
  }
}

export const removeEventGuest = async (eventId, guestId) => {
  try {
    const response = await defaultInstance.delete(
      `/api/calendar-events/${eventId}/guests/${guestId}`
    )
    return response.data.data
  } catch (error) {
    console.error("Error removing guest:", error)
    throw error
  }
}

// Task Management
export const completeEventTask = async (eventId, taskId) => {
  try {
    const response = await defaultInstance.post(
      `/api/calendar-events/${eventId}/tasks/${taskId}/complete`
    )
    return response.data.data
  } catch (error) {
    console.error("Error completing task:", error)
    throw error
  }
}

export const completeAllEventTasks = async eventId => {
  try {
    const response = await defaultInstance.post(
      `/api/calendar-events/${eventId}/tasks/complete-all`
    )
    return response.data.data
  } catch (error) {
    console.error("Error completing all tasks:", error)
    throw error
  }
}

// Comments
export const getEventComments = async eventId => {
  try {
    const response = await defaultInstance.get(
      `/api/calendar-events/${eventId}/comments`
    )
    return response.data.data || []
  } catch (error) {
    console.error("Error fetching event comments:", error)
    throw error
  }
}

export const createEventComment = async (eventId, data) => {
  try {
    const response = await defaultInstance.post(
      `/api/calendar-events/${eventId}/comments`,
      data
    )
    return response.data.data
  } catch (error) {
    console.error("Error creating event comment:", error)
    throw error
  }
}

export const updateEventComment = async (eventId, commentId, data) => {
  try {
    const response = await defaultInstance.put(
      `/api/calendar-events/${eventId}/comments/${commentId}`,
      data
    )
    return response.data.data
  } catch (error) {
    console.error("Error updating event comment:", error)
    throw error
  }
}

export const deleteEventComment = async (eventId, commentId) => {
  try {
    const response = await defaultInstance.delete(
      `/api/calendar-events/${eventId}/comments/${commentId}`
    )
    return response.data.data
  } catch (error) {
    console.error("Error deleting event comment:", error)
    throw error
  }
}
