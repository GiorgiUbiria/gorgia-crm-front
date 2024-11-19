import defaultInstance from "plugins/axios";

export const createHrDocument = async (data) => {
    console.log("data", data);
    
    return defaultInstance.post('/api/hr-documents', data);
}

export const updateHrDocumentStatus = async (hrDocumentId, status, data = {}) => {
    return defaultInstance.patch(`/api/hr-documents/${hrDocumentId}/status`, { 
        status, 
        ...data  // Merge additional data like salary, salary_text, or comment
    });
};

export const getHrDocuments = async () => {
    return defaultInstance.get('/api/hr-documents');
}

export const getCurrentUserHrDocuments = async () => {
    return defaultInstance.get('/api/hr-documents/current');
}
