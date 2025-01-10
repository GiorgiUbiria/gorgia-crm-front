import defaultInstance from "../plugins/axios"

const formatDateToMySQLDateTime = date => {
  if (!(date instanceof Date) || isNaN(date)) return null
  return date.toISOString().slice(0, 19).replace("T", " ")
}

/**
 * Calendar View Endpoints
 */
export const getCalendarView = async () => {
  try {
    const response = await defaultInstance.get("/api/meetings/calendar")
    return response.data
  } catch (error) {
    console.error("Error fetching calendar view:", error)
    throw error
  }
}

export const getByDateRange = async (startDate, endDate) => {
  try {
    const response = await defaultInstance.get("/api/meetings/calendar/range", {
      params: {
        start_date: formatDateToMySQLDateTime(startDate),
        end_date: formatDateToMySQLDateTime(endDate),
      },
    })
    return response.data
  } catch (error) {
    console.error("Error fetching meetings by date range:", error)
    throw error
  }
}

/**
 * User-specific Meeting Views
 */
export const getMyMeetings = async () => {
  try {
    const response = await defaultInstance.get("/api/meetings/my")
    return response.data
  } catch (error) {
    console.error("Error fetching my meetings:", error)
    throw error
  }
}

export const getCreatedMeetings = async () => {
  try {
    const response = await defaultInstance.get("/api/meetings/created")
    return response.data
  } catch (error) {
    console.error("Error fetching created meetings:", error)
    throw error
  }
}

export const getAttendingMeetings = async () => {
  try {
    const response = await defaultInstance.get("/api/meetings/attending")
    return response.data
  } catch (error) {
    console.error("Error fetching attending meetings:", error)
    throw error
  }
}

/**
 * Basic CRUD Operations
 */
export const getMeetings = async () => {
  try {
    const response = await defaultInstance.get("/api/meetings")
    return response.data
  } catch (error) {
    console.error("Error fetching meetings:", error)
    throw error
  }
}

export const createMeeting = async data => {
  try {
    const formattedData = {
      title: data.title,
      information: data.information,
      start_time: formatDateToMySQLDateTime(data.start),
      end_time: formatDateToMySQLDateTime(data.end),
      type: data.type === "recurring" ? "recurrent" : "single",
      recurrence_type: data.type === "recurring" ? data.recurrence_type : null,
      recurrence_end_date: data.recurrence_end_date
        ? formatDateToMySQLDateTime(new Date(data.recurrence_end_date + "T23:59:59"))
        : null,
      attendees: data.attendees.map(attendee => attendee.value),
    }

    console.log("Sending data to server:", formattedData);
    const response = await defaultInstance.post("/api/meetings", formattedData)
    return response.data
  } catch (error) {
    if (error.response?.data?.errors) {
      console.error("Validation errors:", error.response.data.errors)
    }
    console.error("Error creating meeting:", error)
    throw error
  }
}

export const getMeeting = async id => {
  try {
    const response = await defaultInstance.get(`/api/meetings/${id}`)
    return response.data
  } catch (error) {
    console.error("Error fetching meeting:", error)
    throw error
  }
}

export const updateMeeting = async (id, data) => {
  try {
    const formattedData = {
      title: data.title,
      information: data.reason,
      start_time: formatDateToMySQLDateTime(data.start),
      end_time: formatDateToMySQLDateTime(data.end),
      attendees: data.invitees.map(invitee => invitee.value),
    }

    const response = await defaultInstance.put(
      `/api/meetings/${id}`,
      formattedData
    )
    return response.data
  } catch (error) {
    if (error.response?.data?.errors) {
      console.error("Validation errors:", error.response.data.errors)
    }
    console.error("Error updating meeting:", error)
    throw error
  }
}

export const deleteMeeting = async id => {
  try {
    const response = await defaultInstance.delete(`/api/meetings/${id}`)
    return response.data
  } catch (error) {
    console.error("Error deleting meeting:", error)
    throw error
  }
}

/**
 * Recurring Meeting Operations
 */
export const updateRecurringMeeting = async (id, data) => {
  try {
    const formattedData = {
      title: data.title,
      information: data.information,
      type: "recurrent",
      recurrence_type: data.recurrence_type,
      recurrence_end_date: data.recurrence_end_date
        ? formatDateToMySQLDateTime(new Date(data.recurrence_end_date + "T23:59:59"))
        : null,
      attendees: data.attendees.map(attendee => attendee.value),
    }

    const response = await defaultInstance.put(
      `/api/meetings/${id}/recurring`,
      formattedData
    )
    return response.data
  } catch (error) {
    console.error("Error updating recurring meeting:", error)
    throw error
  }
}

export const deleteRecurringMeeting = async id => {
  try {
    const response = await defaultInstance.delete(
      `/api/meetings/${id}/recurring`
    )
    return response.data
  } catch (error) {
    console.error("Error deleting recurring meeting:", error)
    throw error
  }
}

/**
 * Status Management
 */
export const updateMeetingStatus = async (meetingId, status) => {
  try {
    const response = await defaultInstance.post(
      `/api/meetings/${meetingId}/status`,
      {
        status,
      }
    )
    return response.data
  } catch (error) {
    console.error("Error updating meeting status:", error)
    throw error
  }
}

export const updateAttendeeStatus = async (meetingId, status) => {
  try {
    const response = await defaultInstance.post(
      `/api/meetings/${meetingId}/attendee-status`,
      {
        status,
      }
    )
    return response.data
  } catch (error) {
    console.error("Error updating attendee status:", error)
    throw error
  }
}

/**
 * Comment Management
 */
export const getComments = async meetingId => {
  try {
    const response = await defaultInstance.get(
      `/api/meetings/${meetingId}/comments`
    )
    return response.data
  } catch (error) {
    console.error("Error fetching comments:", error)
    throw error
  }
}

export const addComment = async (meetingId, content) => {
  try {
    const response = await defaultInstance.post(
      `/api/meetings/${meetingId}/comments`,
      {
        content,
      }
    )
    return response.data
  } catch (error) {
    console.error("Error adding comment:", error)
    throw error
  }
}

export const updateComment = async (meetingId, commentId, content) => {
  try {
    const response = await defaultInstance.put(
      `/api/meetings/${meetingId}/comments/${commentId}`,
      {
        content,
      }
    )
    return response.data
  } catch (error) {
    console.error("Error updating comment:", error)
    throw error
  }
}

export const deleteComment = async (meetingId, commentId) => {
  try {
    const response = await defaultInstance.delete(
      `/api/meetings/${meetingId}/comments/${commentId}`
    )
    return response.data
  } catch (error) {
    console.error("Error deleting comment:", error)
    throw error
  }
}

/**
 * Attendee Management
 */
export const getAttendees = async meetingId => {
  try {
    const response = await defaultInstance.get(
      `/api/meetings/${meetingId}/attendees`
    )
    return response.data
  } catch (error) {
    console.error("Error fetching attendees:", error)
    throw error
  }
}

export const addAttendees = async (meetingId, attendeeIds) => {
  try {
    const response = await defaultInstance.post(
      `/api/meetings/${meetingId}/attendees`,
      {
        attendees: attendeeIds,
      }
    )
    return response.data
  } catch (error) {
    console.error("Error adding attendees:", error)
    throw error
  }
}

export const removeAttendee = async (meetingId, userId) => {
  try {
    const response = await defaultInstance.delete(
      `/api/meetings/${meetingId}/attendees/${userId}`
    )
    return response.data
  } catch (error) {
    console.error("Error removing attendee:", error)
    throw error
  }
}
