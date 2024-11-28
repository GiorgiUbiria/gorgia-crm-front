import defaultInstance from "../plugins/axios";

export const getNoteList = async () => {
    return defaultInstance.get('/api/notes');
};

export const createNote = async (data) => {
    return defaultInstance.post('/api/notes', {
        title: data.title,
        content: data.content
    });
};

export const getNote = async (id) => {
    return defaultInstance.get(`/api/notes/${id}`);
};

export const updateNote = async (id, data) => {
    return defaultInstance.put(`/api/notes/${id}`, {
        title: data.title,
        content: data.content
    });
};

export const deleteNote = async (id) => {
    return defaultInstance.delete(`/api/notes/${id}`);
};