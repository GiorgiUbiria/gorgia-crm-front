import defaultInstance from "../../plugins/axios"

export const getVacations = async () => {
  return defaultInstance.get("/api/vacation/list")
}

export const getApprovalVacations = async (data) => {
  return defaultInstance.get(
    "/api/approval/list?page=" + data.page + "&type=" + data.type,
    data
  )
}

export const approveVacation = async (id, data) => {
  return defaultInstance.post("/api/approval/" + id + "/update", data)
}
