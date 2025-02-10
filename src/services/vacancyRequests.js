import defaultInstance from "../plugins/axios"

export const getVacancyRequests = async params => {
  const { data } = await defaultInstance.get("/api/vacancy-requests", {
    params,
  })
  return data
}

export const getVacancyRequest = async id => {
  const { data } = await defaultInstance.get(`/api/vacancy-requests/${id}`)
  return data
}

export const createVacancyRequest = async formData => {
  const { data } = await defaultInstance.post("/api/vacancy-requests", formData)
  return data
}

export const updateVacancyRequest = async (id, formData) => {
  const { data } = await defaultInstance.put(
    `/api/vacancy-requests/${id}`,
    formData
  )
  return data
}

export const deleteVacancyRequest = async id => {
  const { data } = await defaultInstance.delete(`/api/vacancy-requests/${id}`)
  return data
}

export const approveVacancyRequest = async id => {
  const { data } = await defaultInstance.post(
    `/api/vacancy-requests/${id}/approve`
  )
  return data
}

export const rejectVacancyRequest = async (id, rejectionReason) => {
  const { data } = await defaultInstance.post(
    `/api/vacancy-requests/${id}/reject`,
    {
      rejection_reason: rejectionReason,
    }
  )
  return data
}
