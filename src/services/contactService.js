import defaultInstance from '../plugins/axios';

// Correcting the URL to use /v1 prefix
export const getContactList = async (page = 1, limit = 10, sortBy = 'created_at', order = 'desc') => {
    try {
        const response = await defaultInstance.get('/api/v1/contacts', {
            params: {
                page: page,
                limit: limit,
                sortBy: sortBy,
                order: order
            }
        });
        return response.data;
    } catch (error) {
        console.error('Error fetching contact list:', error);
        throw error;
    }
};

// Other functions should also use `/api/v1` as the base
export const createContact = async (data) => {
    try {
        const response = await defaultInstance.post('/api/v1/contacts', data);
        return response.data;
    } catch (error) {
        console.error('Error creating contact:', error);
        throw error;
    }
};

export const updateContact = async (id, data) => {
    try {
        const response = await defaultInstance.put(`/api/v1/contacts/${id}`, data);
        return response.data;
    } catch (error) {
        console.error('Error updating contact:', error);
        throw error;
    }
};

export const deleteContact = async (id) => {
    try {
        const response = await defaultInstance.delete(`/api/v1/contacts/${id}`);
        return response.data;
    } catch (error) {
        console.error('Error deleting contact:', error);
        throw error;
    }
};
