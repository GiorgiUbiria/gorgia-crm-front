import defaultInstance from "../plugins/axios"

export const getVacationList = async () => {
  return defaultInstance.get("/api/vacation/list")
}

export const createVacation = async data => {
  return defaultInstance.post("/api/vacation/create", data)
}

export const getPurchase = async data => {
  return defaultInstance.get("/api/vacation/create", data)
}

export const getCurrentUserVocations = async () => {
  return defaultInstance.get("/api/vacation/currentUser")
}

export const updateVacationStatus = async (id, status, comment = null) => {
  const data = {
    approval_status: status,
    rejection_reason: comment,
  }

  return defaultInstance.put(`/api/vacation/${id}/status`, data)
}
