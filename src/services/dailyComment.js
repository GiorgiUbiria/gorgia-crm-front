import defaultInstance from "../plugins/axios"

export const getDailyComments = async (dailyId) => {
  return defaultInstance.get(`/api/dailies/${dailyId}/comments`)
}

export const createDailyComment = async (dailyId, commentData) => {
  return defaultInstance.post(`/api/dailies/${dailyId}/comments`, {
    ...commentData,
    daily_id: dailyId
  })
}

export const updateDailyComment = async (dailyId, commentId, commentData) => {
  return defaultInstance.put(`/api/dailies/${dailyId}/comments/${commentId}`, {
    ...commentData,
    daily_id: dailyId
  })
}

export const deleteDailyComment = async (dailyId, commentId) => {
  return defaultInstance.delete(`/api/dailies/${dailyId}/comments/${commentId}`)
}
