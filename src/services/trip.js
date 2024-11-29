import defaultInstance from "../plugins/axios"

export const getTripList = async () => {
  return defaultInstance.get("/api/business-trip/list")
}

export const getAllTripsList = async () => {
  return defaultInstance.get("/api/business-trip/listAll")
}

export const createTrip = async data => {
  return defaultInstance.post("/api/business-trip/create", data)
}

export const updateTripStatus = async (id, status, comment = null) => {
  const data = {
    status,
    comment,
  }
  return defaultInstance.put(`/api/business-trip/${id}/status`, data)
}
