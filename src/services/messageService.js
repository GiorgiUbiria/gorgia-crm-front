import defaultInstance from "plugins/axios"

const getMessages = () => {
  return defaultInstance.get(`/api/messages`)
}

const sendMessage = text => {
  return defaultInstance.post(`/api/messages`, { text })
}

export default {
  getMessages,
  sendMessage,
}
