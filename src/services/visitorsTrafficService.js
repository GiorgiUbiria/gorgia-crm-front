import defaultInstance from '../plugins/axios'; // Adjust the path if your axios instance is located elsewhere

// Fetch visitor traffic list
export const getVisitorsTraffic = async (page = 1, limit = 10) => {
  try {
    const response = await defaultInstance.get('/api/v1/visitors-traffic', {
      params: {
        page: page,
        limit: limit
      }
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching visitor traffic:', error);
    throw error;
  }
};

// Create new visitor traffic entry
export const createVisitor = async (data) => {
  try {
    const response = await defaultInstance.post('/api/v1/visitors-traffic', data);
    return response.data;
  } catch (error) {
    console.error('Error creating visitor traffic:', error);
    throw error;
  }
};

// Update visitor traffic entry
export const updateVisitor = async (id, data) => {
  try {
    const response = await defaultInstance.put(`/api/v1/visitors-traffic/${id}`, data);
    return response.data;
  } catch (error) {
    console.error('Error updating visitor traffic:', error);
    throw error;
  }
};

// Delete visitor traffic entry
export const deleteVisitor = async (id) => {
  try {
    const response = await defaultInstance.delete(`/api/v1/visitors-traffic/${id}`);
    return response.data;
  } catch (error) {
    console.error('Error deleting visitor traffic:', error);
    throw error;
  }
};
