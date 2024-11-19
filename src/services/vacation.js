import defaultInstance from '../plugins/axios'

export const getVacationList = async () => {
    return defaultInstance.get('/api/vocation/list')
}

export const createPurchase = async (data) => {
    return defaultInstance.post('/api/vocation/create', data)
}
  
export const getPurchase = async (data) => {
    return defaultInstance.get('/api/vocation/create', data)
}

export const getCurrentUserVocations = async () => {
    return defaultInstance.get('/api/vocation/currentUser')
}

export const updateVacationStatus = async (vacationId, status) => {
    return defaultInstance.put(`/api/vocations/${vacationId}/status`, { status });
}