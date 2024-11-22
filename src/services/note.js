import defaultInstance from "../plugins/axios";

export const getNoteList = async () => {
    return defaultInstance.get('/api/notes/list');
};

export const createNote = async (data) => {
    return defaultInstance.post('/api/notes/create', {
        title: data.title,
        content: data.content
    });
};

export const getNote = async (id) => {
    return defaultInstance.get(`/api/notes/${id}/show`);
};

export const updateNote = async (id, data) => {
    return defaultInstance.post(`/api/notes/${id}/update`, {
        title: data.title,
        content: data.content
    });
};

export const deleteNote = async (id) => {
    return defaultInstance.post(`/api/notes/${id}/delete`);
};