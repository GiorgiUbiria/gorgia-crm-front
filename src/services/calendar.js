import defaultInstance from "../plugins/axios"

// Calendar Events
export const getCalendarEvents = async (params = {}) => {
  try {
    const response = await defaultInstance.get("/api/calendar-events", { params })
    return response.data.data || []
  } catch (error) {
    console.error("Error fetching calendar events:", error)
    throw error
  }
}

export const createCalendarEvent = async data => {
  try {
    const formData = new FormData()
    
    // Handle basic fields
    const basicFields = [
      'title',
      'description',
      'start_time',
      'end_time',
      'event_type',
      'reminder_before',
      'is_task_event',
      'location'
    ]
    
    basicFields.forEach(field => {
      if (data[field] !== undefined) {
        formData.append(field, data[field])
      }
    })

    // Handle recurrence rule
    if (data.recurrence_rule) {
      formData.append('recurrence_rule', JSON.stringify(data.recurrence_rule))
    }

    // Handle guests
    if (data.guests?.length) {
      formData.append('guests', JSON.stringify(data.guests))
    }

    // Handle tasks
    if (data.tasks?.length) {
      formData.append('tasks', JSON.stringify(data.tasks))
    }

    // Handle attachments
    if (data.attachments?.length) {
      data.attachments.forEach(file => {
        formData.append('attachments[]', file)
      })
    }

    const response = await defaultInstance.post("/api/calendar-events", formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    })
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
    const formData = new FormData()
    
    // Handle basic fields
    const basicFields = [
      'title',
      'description',
      'start_time',
      'end_time',
      'event_type',
      'reminder_before',
      'location'
    ]
    
    basicFields.forEach(field => {
      if (data[field] !== undefined) {
        formData.append(field, data[field])
      }
    })

    // Handle recurrence rule
    if (data.recurrence_rule) {
      formData.append('recurrence_rule', JSON.stringify(data.recurrence_rule))
    }

    const response = await defaultInstance.post(`/api/calendar-events/${id}`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    })
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
      { guests: data }
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

// Attachments
export const downloadEventAttachment = async (eventId, attachmentId) => {
  try {
    const response = await defaultInstance.get(
      `/api/calendar-events/${eventId}/attachments/${attachmentId}/download`,
      { responseType: 'blob' }
    )
    return response.data
  } catch (error) {
    console.error("Error downloading attachment:", error)
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
