import defaultInstance from '../plugins/axios'

export const getPurchaseList = async () => {
    return defaultInstance.get('/api/internal-purchase/list')
}

export const createPurchase = async (data) => {
    console.log('createPurchase called with:', data); // Debug log
    try {
        const response = await defaultInstance.post('/api/internal-purchase/create', data);
        console.log('createPurchase response:', response); // Debug log
        return response.data;
    } catch (error) {
        console.error('createPurchase error:', error); // Debug log
        throw error;
    }
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