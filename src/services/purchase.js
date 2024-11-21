import defaultInstance from '../plugins/axios'

export const getPurchaseList = async () => {
    return defaultInstance.get('/api/internal-purchase/list')
}

export const createPurchase = async (data) => {
    return defaultInstance.post('/api/internal-purchase/create', data)
}
  
export const getPurchase = async (data) => {
    return defaultInstance.get('/api/internal-purchase/create', data)
}

export const getCurrentUserPurchases = async () => {
    return defaultInstance.get('/api/internal-purchases/current-user');
}

export const updatePurchaseStatus = async (id, status, comment = null) => {
    return defaultInstance.post(`/api/internal-purchase/${id}/status/`, {
        status,
        comment
    });
}