import defaultInstance from '../../plugins/axios'

export const getBusinessTrips = async () => {
  return defaultInstance.get('/api/business-trip/list')
}
  
export const getApprovalBusinessTrips = async (data) => {
  return defaultInstance.get('/api/approval/list', data)
}

export const approveBusinessTrip = async (id, data) => {
  return defaultInstance.post("/api/approval/" + id + "/update", data)
}

export const createBusinessTrip = async (data) => {
    return defaultInstance.post("/api/business-trip/create", data);
}

export const deleteBusinessTrip = async (id) => {
    return defaultInstance.delete("/api/business-trip/" + id + "/delete")
}

export const getCurrentUserTrips = async () => {
  return defaultInstance.get('/api/business-trip/currentUser')
}
