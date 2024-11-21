import defaultInstance from '../plugins/axios';

const formatDateToMySQLDateTime = (date) => {
  if (!(date instanceof Date) || isNaN(date)) return null;
  return date.toISOString().slice(0, 19).replace('T', ' ');
};

/**
 * Fetch list of meetings
 * @returns {Promise} - The list of meetings from the server
 */
export const getMeetings = async () => {
  try {
    const response = await defaultInstance.get('/api/meetings');
    return response.data;
  } catch (error) {
    console.error('Error fetching meetings:', error);
    throw error;
  }
};

/**
 * Create a new meeting
 * @param {object} data - Meeting data including title, times, reason, comments, and attendees
 * @returns {Promise} - The newly created meeting
 */
export const createMeeting = async (data) => {
  try {
    // Transform the data to match the expected format
    const formattedData = {
      title: data.title,
      start_time: formatDateToMySQLDateTime(data.start),
      end_time: formatDateToMySQLDateTime(data.end),
      reason: data.reason,
      comments: data.comments,
      attendees: data.invitees.map(invitee => invitee.value)
    };

    const response = await defaultInstance.post('/api/meetings', formattedData);
    return response.data;
  } catch (error) {
    if (error.response?.data?.errors) {
      console.error('Validation errors:', error.response.data.errors);
    }
    console.error('Error creating meeting:', error);
    throw error;
  }
};

/**
 * Get a specific meeting by ID
 * @param {number} id - Meeting ID
 * @returns {Promise} - The meeting details
 */
export const getMeeting = async (id) => {
  try {
    const response = await defaultInstance.get(`/api/meetings/${id}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching meeting:', error);
    throw error;
  }
};

/**
 * Update an existing meeting
 * @param {number} id - Meeting ID
 * @param {object} data - Updated meeting data
 * @returns {Promise} - The updated meeting
 */
export const updateMeeting = async (id, data) => {
  try {
    const formattedData = {
      title: data.title,
      start_time: formatDateToMySQLDateTime(data.start),
      end_time: formatDateToMySQLDateTime(data.end),
      reason: data.reason,
      comments: data.comments,
      attendees: data.invitees.map(invitee => invitee.value)
    };

    const response = await defaultInstance.put(`/api/meetings/${id}`, formattedData);
    return response.data;
  } catch (error) {
    if (error.response?.data?.errors) {
      console.error('Validation errors:', error.response.data.errors);
    }
    console.error('Error updating meeting:', error);
    throw error;
  }
};

/**
 * Delete a meeting
 * @param {number} id - Meeting ID
 * @returns {Promise} - Deletion confirmation
 */
export const deleteMeeting = async (id) => {
  try {
    const response = await defaultInstance.delete(`/api/meetings/${id}`);
    return response.data;
  } catch (error) {
    console.error('Error deleting meeting:', error);
    throw error;
  }
};

/**
 * Update attendee status for a meeting
 * @param {number} meetingId - Meeting ID
 * @param {string} status - New status ('accepted' or 'declined')
 * @returns {Promise} - Updated meeting details
 */
export const updateAttendeeStatus = async (meetingId, status) => {
  try {
    const response = await defaultInstance.post(`/api/meetings/${meetingId}/status`, {
      status
    });
    return response.data;
  } catch (error) {
    console.error('Error updating attendee status:', error);
    throw error;
  }
}; 