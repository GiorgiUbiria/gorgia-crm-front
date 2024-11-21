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

export const updateVacationStatus = async (id, status, comment = null) => {
    const data = {
        status,
        comment
    };
    
    return defaultInstance.put(`/api/vocation/${id}/status`, data);
}