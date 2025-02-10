import defaultInstance from "plugins/axios"

const handleError = error => {
  const message =
    error.response?.data?.message || "An error occurred. Please try again."
  console.error("Chat Room Service Error:", error)
  throw new Error(message)
}

const ChatRoomService = {
  getChatRooms: async () => {
    try {
      const response = await defaultInstance.get("/api/chat/rooms")
      return response.data
    } catch (error) {
      handleError(error)
    }
  },

  createChatRoom: async data => {
    try {
      const response = await defaultInstance.post("/api/chat/rooms", data)
      return response.data
    } catch (error) {
      handleError(error)
    }
  },

  getChatRoom: async roomId => {
    try {
      const response = await defaultInstance.get(`/api/chat/rooms/${roomId}`)
      return response.data
    } catch (error) {
      handleError(error)
    }
  },

  updateChatRoom: async (roomId, data) => {
    try {
      const response = await defaultInstance.put(
        `/api/chat/rooms/${roomId}`,
        data
      )
      return response.data
    } catch (error) {
      handleError(error)
    }
  },

  addParticipants: async (roomId, data) => {
    try {
      const response = await defaultInstance.post(
        `/api/chat/rooms/${roomId}/participants`,
        data
      )
      return response.data
    } catch (error) {
      handleError(error)
    }
  },

  removeParticipant: async (roomId, userId) => {
    try {
      const response = await defaultInstance.delete(
        `/api/chat/rooms/${roomId}/participants/${userId}`
      )
      return response.data
    } catch (error) {
      handleError(error)
    }
  },

  getMessages: async (roomId, before = null) => {
    try {
      const params = before ? { before } : {}
      const response = await defaultInstance.get(
        `/api/chat/rooms/${roomId}/messages`,
        { params }
      )
      return response.data
    } catch (error) {
      handleError(error)
    }
  },

  sendMessage: async (roomId, data) => {
    try {
      const formData = new FormData()
      if (data.message) formData.append("message", data.message)
      if (data.file) formData.append("file", data.file)
      formData.append("type", data.type || "text")

      const response = await defaultInstance.post(
        `/api/chat/rooms/${roomId}/messages`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
          onUploadProgress: data.onProgress
            ? progressEvent => {
                const progress = Math.round(
                  (progressEvent.loaded * 100) / progressEvent.total
                )
                data.onProgress(progress)
              }
            : undefined,
        }
      )
      return response.data
    } catch (error) {
      handleError(error)
    }
  },

  markMessagesAsRead: async (roomId, messageIds) => {
    try {
      const response = await defaultInstance.post(
        `/api/chat/rooms/${roomId}/messages/read`,
        {
          message_ids: messageIds,
        }
      )
      return response.data
    } catch (error) {
      handleError(error)
    }
  },

  deleteMessage: async (roomId, messageId) => {
    try {
      const response = await defaultInstance.delete(
        `/api/chat/rooms/${roomId}/messages/${messageId}`
      )
      return response.data
    } catch (error) {
      handleError(error)
    }
  },
}

export default ChatRoomService
