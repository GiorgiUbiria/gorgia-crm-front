import defaultInstance from "../plugins/axios";

export const getNoteList = async () => {
    return defaultInstance.get('/api/notes/list');
};

export const createNote = async (data) => {
    return defaultInstance.post('/api/notes/create', data);
};

export const getNote = async (id) => {
    return defaultInstance.get(`/api/notes/${id}/show`);
};

export const updateNote = async (id, data) => {
    return defaultInstance.post(`/api/notes/${id}/update`, data);
};

export const deleteNote = async (id) => {
    return defaultInstance.delete(`/api/notes/${id}/delete`);
};