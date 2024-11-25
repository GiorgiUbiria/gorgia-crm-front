import defaultInstance from "plugins/axios"

export const getMessages = async receiver_id => {
  return defaultInstance.get("/api/messages", {
    params: {
      receiver_id: receiver_id,
    },
  })
}

export const sendMessage = async data => {
  return defaultInstance.post("/api/messages", data)
}
