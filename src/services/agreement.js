import defaultInstance from "plugins/axios"

export const createAgreement = async data => {
  return defaultInstance.post("/api/agreements", data)
}

export const updateAgreementStatus = async (agreementId, status) => {
  return defaultInstance.post(`/api/agreements/${agreementId}/status`, {
    status,
  })
}

export const getDepartmentAgreements = async () => {
  return defaultInstance.get("/api/agreements/departments")
}

export const getUserAgreemnets = async () => {
  return defaultInstance.get("/api/agreements/user")
}
