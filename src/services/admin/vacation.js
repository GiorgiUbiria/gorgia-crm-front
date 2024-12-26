import defaultInstance from "../../plugins/axios"

export const getVacations = async () => {
  return defaultInstance.get("/api/vacation/list")
}

export const getApprovalVacations = async data => {
  return defaultInstance.get(
    "/api/approval/list?page=" + data.page + "&type=" + data.type,
    data
  )
}

export const createVacation = async data => {
  return defaultInstance.post("/api/vacation/create", data)
}

export const approveVacation = async (id, data) => {
  return defaultInstance.post("/api//" + id + "/update", data)
}

export const getVacationBalance = async () => {
  const response = await defaultInstance.get("/api/vacation/balance")
  return {
    status: response.status,
    message: response.data.message,
    data: {
      total_days: response.data.data.total_days,
      remaining_days: response.data.data.remaining_days,
      used_days: response.data.data.used_days,
      used_days_this_year: response.data.data.used_days_this_year,
      vacation_year: response.data.data.vacation_year,
      pending_requests: response.data.data.pending_requests,
      approved_future_requests: response.data.data.approved_future_requests,
      can_request_vacation: response.data.data.can_request_vacation,
    },
  }
}

export const cancelVacation = async (id, data) => {
  return defaultInstance.post(`/api/vacation/${id}/cancel`, data)
}

export const updateVacationStatus = async (id, status) => {
  return defaultInstance.put(`/api/vacation/${id}/status`, {
    approval_status: status,
  })
}

export const getVacationDetails = async id => {
  return defaultInstance.get(`/api/vacation/${id}/show`)
}
