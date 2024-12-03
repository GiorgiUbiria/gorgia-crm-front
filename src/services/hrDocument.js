import defaultInstance from "plugins/axios"

export const createHrDocument = async data => {
  return defaultInstance.post("/api/hr-documents", data)
}

export const updateHrDocumentStatus = async (
  hrDocumentId,
  status,
  data = {}
) => {
  return defaultInstance.patch(`/api/hr-documents/${hrDocumentId}/status`, {
    status,
    ...data,
  })
}

export const getHrDocuments = async () => {
  return defaultInstance.get("/api/hr-documents")
}

export const getCurrentUserHrDocuments = async () => {
  return defaultInstance.get("/api/hr-documents/current")
}

export const downloadHrDocument = async hrDocumentId => {
  return defaultInstance.get(`/api/hr-documents/${hrDocumentId}/download`, {
    responseType: 'blob',
  })
}
