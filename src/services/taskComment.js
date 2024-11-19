import defaultInstance from '../plugins/axios';

// Get list of comments for a specific task
export const getTaskComments = async (taskId, page = 1, limit = 10, sortBy = 'created_at', order = 'desc') => {
    try {
        const response = await defaultInstance.get(`/api/tasks/${taskId}/comments`, {
            params: {
                page,
                limit,
                sortBy,
                order
            }
        });
        return response.data;  // Ensure you're returning the actual data
    } catch (error) {
        console.error('Error fetching task comments:', error?.response?.data || error.message);
        throw error;
    }
};

// Get a specific comment
export const getTaskComment = async (commentId) => {
    try {
        const response = await defaultInstance.get(`/api/comments/${commentId}`);
        return response.data;  // Ensure you're returning the actual data
    } catch (error) {
        console.error('Error fetching task comment:', error?.response?.data || error.message);
        throw error;
    }
};

// Create a new comment for a specific task
export const createTaskComment = async (taskId, data) => {
    try {
        const response = await defaultInstance.post(`/api/tasks/${taskId}/comments`, data);
        return response.data;  // Ensure you're returning the actual data
    } catch (error) {
        console.error('Error creating task comment:', error?.response?.data || error.message);
        throw error;
    }
};

// Update an existing comment
export const updateTaskComment = async (commentId, data) => {
    try {
        const response = await defaultInstance.put(`/api/comments/${commentId}`, data);
        return response.data;  // Ensure you're returning the actual data
    } catch (error) {
        console.error('Error updating task comment:', error?.response?.data || error.message);
        throw error;
    }
};

// Delete a comment
export const deleteTaskComment = async (commentId) => {
    try {
        const response = await defaultInstance.delete(`/api/comments/${commentId}`);
        return response.data;  // Ensure you're returning the actual data
    } catch (error) {
        console.error('Error deleting task comment:', error?.response?.data || error.message);
        throw error;
    }
};
