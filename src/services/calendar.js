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
    // If data is already FormData, use it directly
    if (data instanceof FormData) {
      const response = await defaultInstance.post("/api/calendar-events", data, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      })
      return response.data.data
    }

    // Otherwise, create a new FormData instance
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
      if (data[field] !== undefined && data[field] !== null) {
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
    console.group("Calendar Event Update Debug")
    console.log("Update Event - Request Data:", data)

    const formData = new FormData()

    // Handle basic fields
    if (data.title) formData.append('title', data.title)
    if (data.description) formData.append('description', data.description)
    if (data.start_time) formData.append('start_time', data.start_time)
    if (data.end_time) formData.append('end_time', data.end_time)
    if (data.reminder_before) formData.append('reminder_before', data.reminder_before)
    if (data.location) formData.append('location', data.location)
    formData.append('is_task_event', data.is_task_event)

    // Handle tasks array
    if (Array.isArray(data.tasks)) {
      data.tasks.forEach((task, index) => {
        if (task.title) {
          formData.append(`tasks[${index}][title]`, task.title)
        }
        if (task.description) {
          formData.append(`tasks[${index}][description]`, task.description)
        }
      })
    }

    // Handle guests array
    if (Array.isArray(data.guests)) {
      data.guests.forEach(guestId => {
        formData.append('guests[]', guestId)
      })
    }

    // Handle attachments
    if (Array.isArray(data.attachments)) {
      data.attachments.forEach(file => {
        if (file instanceof File) {
          if (file.size > 10 * 1024 * 1024) {
            throw new Error("Files must not be larger than 10MB.")
          }
          formData.append('attachments[]', file)
        }
      })
    }

    // Log the final FormData contents
    console.log("Final FormData Contents:")
    for (let [key, value] of formData.entries()) {
      console.log(`${key}:`, value)
    }

    const response = await defaultInstance.post(`/api/calendar-events/${id}`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    })
    console.log("Update Response:", response.data)
    console.groupEnd()
    return response.data.data
  } catch (error) {
    console.error("Error updating calendar event:", error)
    if (error.response?.data) {
      console.error("Server Error Response:", error.response.data)
    }
    console.groupEnd()
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
export const updateGuestStatus = async (eventId, status) => {
  try {
    const response = await defaultInstance.post(
      `/api/calendar-events/${eventId}/guest-status`,
      { status }
    )
    return response.data
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

export const uncompleteEventTask = async (eventId, taskId) => {
  try {
    const response = await defaultInstance.put(
      `/api/calendar-events/${eventId}/tasks/${taskId}/uncomplete`
    )
    return response.data.data
  } catch (error) {
    console.error("Error uncompleting task:", error)
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

export const removeEventAttachment = async (eventId, attachmentId) => {
  try {
    const response = await defaultInstance.delete(
      `/api/calendar-events/${eventId}/attachments/${attachmentId}`
    )
    return response.data.data
  } catch (error) {
    console.error("Error removing attachment:", error)
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

export const getInvitedEvents = async (params = {}) => {
  try {
    const response = await defaultInstance.get("/api/calendar-events/invited", { params })
    return response.data.data || []
  } catch (error) {
    console.error("Error fetching invited events:", error)
    throw error
  }
}
