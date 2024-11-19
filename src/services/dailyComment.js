import defaultInstance from '../plugins/axios'

export const getDailyCommentList = async () => {
    return defaultInstance.get('/api/daily-comments')
}

export const createDailyComment = async (data) => {
    return defaultInstance.post('/api/daily-comments', data)
}

export const getDailyComment = async (id) => {
    return defaultInstance.get(`/api/daily-comments/${id}`)
}

export const updateDailyComment = async (id, data) => {
    return defaultInstance.put(`/api/daily-comments/${id}`, data)
}

export const deleteDailyComment = async (id) => {
    return defaultInstance.delete(`/api/daily-comments/${id}`)
}