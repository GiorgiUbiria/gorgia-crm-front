import defaultInstance from "plugins/axios"

export const getRooms = async () => {
  return defaultInstance.get("/api/rooms")
}

export const getRoom = async roomId => {
  return defaultInstance.get(`/api/rooms/${roomId}`)
}

export const sendMessage = async (roomId, message) => {
  return defaultInstance.post(`/api/rooms/${roomId}/message`, { message })
}
