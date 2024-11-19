import defaultInstance from '../plugins/axios';

export const getDailyList = async (page = 1, limit = 10, sortBy = 'created_at', order = 'desc') => {
    try {
        const response = await defaultInstance.get('/api/dailies', {
            params: {
                page: page,
                limit: limit,
                sortBy: sortBy,
                order: order
            }
        });
        return response;
    } catch (error) {
        console.error('Error fetching daily list:', error);
        throw error;
    }
};

export const createDaily = async (data) => {
    const formData = new FormData();

    // Ensure department is a number
    const departmentId = Number(data.department);

    // Format the date if necessary
    const formattedDate = new Date(data.date).toISOString().split('T')[0];

    formData.append('name', data.name);
    formData.append('date', formattedDate); // Ensure this is properly formatted
    formData.append('description', data.description);
    formData.append('department_id', departmentId);  // Ensure this is a number
    
    if (data.attachment) {
        formData.append('attachment', data.attachment, data.attachment.name);
    }
    if (data.link) {
        formData.append('link', data.link);
    }

    try {
        const response = await defaultInstance.post('/api/dailies', formData, {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        });
        console.log('Daily created successfully:', response.data);
        return response.data;
    } catch (error) {
        if (error.response) {
            console.error('Error response data:', error.response.data);
            console.error('Error response status:', error.response.status);
            console.error('Error response headers:', error.response.headers);
        } else if (error.request) {
            console.error('Error request data:', error.request);
        } else {
            console.error('Error message:', error.message);
        }
        throw error;
    }
};

export const getDaily = async (id) => {
    return defaultInstance.get(`/api/dailies/${id}`);
}


export const updateDaily = async (id, data) => {
    const formData = new FormData();
    formData.append('name', data.name);
    formData.append('date', data.date);
    formData.append('description', data.description);
    formData.append('department_id', data.department_id); 
    if (data.attachment) {
        formData.append('attachment', data.attachment, data.attachment.name);
    }
    if (data.link) {
        formData.append('link', data.link);
    }
    return defaultInstance.put(`/api/dailies/${id}`, formData, {
        headers: {
            'Content-Type': 'multipart/form-data'
        }
    });
}

export const deleteDaily = async (id) => {
    return defaultInstance.delete(`/api/dailies/${id}`);
}


