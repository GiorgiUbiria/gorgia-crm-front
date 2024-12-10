import defaultInstance from '../plugins/axios';

export const getDailyList = async (page = 1, limit = 10) => {
    return defaultInstance.get(`/api/dailies?page=${page}&limit=${limit}`);
};

export const getDaily = async (id) => {
    return defaultInstance.get(`/api/dailies/${id}`);
};

export const createDaily = async (data) => {
    const formData = new FormData();
    Object.keys(data).forEach(key => {
        if (data[key] !== null && data[key] !== undefined) {
            formData.append(key, data[key]);
        }
    });
    return defaultInstance.post("/api/dailies", formData, {
        headers: {
            "Content-Type": "multipart/form-data",
        },
    });
};

export const updateDaily = async (id, data) => {
    const formData = new FormData();
    Object.keys(data).forEach(key => {
        if (data[key] !== null && data[key] !== undefined) {
            formData.append(key, data[key]);
        }
    });
    return defaultInstance.post(`/api/dailies/${id}`, formData, {
        headers: {
            "Content-Type": "multipart/form-data",
        },
    });
};

export const deleteDaily = async (id) => {
    return defaultInstance.delete(`/api/dailies/${id}`);
};

export const addDailyComment = async (data) => {
    return defaultInstance.post("/api/daily-comments", data);
};

export const updateDailyComment = async (id, data) => {
    return defaultInstance.put(`/api/daily-comments/${id}`, data);
};

export const deleteDailyComment = async (id) => {
    return defaultInstance.delete(`/api/daily-comments/${id}`);
};


