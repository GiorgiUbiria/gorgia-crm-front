import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import ChatRoomService from "../services/chatroom"

export const chatKeys = {
  all: ["chat"],
  rooms: () => [...chatKeys.all, "rooms"],

  room: id => [...chatKeys.rooms(), id],
  messages: roomId => [...chatKeys.room(roomId), "messages"],
  messageList: (roomId, filters) => [
    ...chatKeys.messages(roomId),
    { ...filters },
  ],
}

export const useChatRooms = (options = {}) => {
  return useQuery({
    queryKey: chatKeys.rooms(),
    queryFn: () => ChatRoomService.getChatRooms(),
    staleTime: 30 * 1000,
    refetchInterval: 30 * 1000,
    retry: 3,
    retryDelay: attemptIndex => Math.min(1000 * 2 ** attemptIndex, 30000),
    ...options,
  })
}

export const useChatRoom = (roomId, options = {}) => {
  return useQuery({
    queryKey: chatKeys.room(roomId),
    queryFn: () => ChatRoomService.getChatRoom(roomId),
    staleTime: 30 * 1000,
    refetchInterval: 30 * 1000,
    enabled: !!roomId,
    retry: 3,
    retryDelay: attemptIndex => Math.min(1000 * 2 ** attemptIndex, 30000),
    ...options,
  })
}

export const useChatMessages = (roomId, options = {}) => {
  return useQuery({
    queryKey: chatKeys.messages(roomId),
    queryFn: () => ChatRoomService.getMessages(roomId),
    staleTime: 5 * 1000,
    refetchInterval: 5 * 1000,
    enabled: !!roomId,
    retry: 3,
    retryDelay: attemptIndex => Math.min(1000 * 2 ** attemptIndex, 30000),
    ...options,

  })
}

export const useCreateChatRoom = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: data => ChatRoomService.createChatRoom(data),
    onMutate: async newRoom => {
      await queryClient.cancelQueries({ queryKey: chatKeys.rooms() })
      const previousRooms = queryClient.getQueryData(chatKeys.rooms())

      if (previousRooms?.data) {
        queryClient.setQueryData(chatKeys.rooms(), {
          ...previousRooms,

          data: [
            {
              id: Date.now(),
              name: newRoom.name,
              type: newRoom.type,
              unread_count: 0,
              created_at: new Date().toISOString(),
              ...newRoom,
            },
            ...previousRooms.data,
          ],
        })
      }

      return { previousRooms }
    },
    onError: (err, newRoom, context) => {
      if (context?.previousRooms) {
        queryClient.setQueryData(chatKeys.rooms(), context.previousRooms)
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: chatKeys.rooms() })
    },
  })
}

export const useUpdateChatRoom = roomId => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: data => ChatRoomService.updateChatRoom(roomId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: chatKeys.room(roomId) })
      queryClient.invalidateQueries({ queryKey: chatKeys.rooms() })
    },
  })
}

export const useAddParticipants = roomId => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: data => ChatRoomService.addParticipants(roomId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: chatKeys.room(roomId) })
    },
  })
}

export const useRemoveParticipant = roomId => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: userId => ChatRoomService.removeParticipant(roomId, userId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: chatKeys.room(roomId) })
    },
  })
}

export const useSendMessage = roomId => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: data => ChatRoomService.sendMessage(roomId, data),
    onMutate: async newMessage => {
      await queryClient.cancelQueries({
        queryKey: chatKeys.messages(roomId),
      })

      const previousMessages = queryClient.getQueryData(
        chatKeys.messageList(roomId, {})
      )

      if (previousMessages?.data) {
        const optimisticMessage = {
          id: Date.now(),
          chat_room_id: roomId,
          message: newMessage.message,
          type: newMessage.type || "text",
          file_path: null,

          file_name: newMessage.file?.name,
          created_at: new Date().toISOString(),
          user: queryClient.getQueryData(["auth"])?.user,
        }

        queryClient.setQueryData(chatKeys.messageList(roomId, {}), {
          ...previousMessages,
          data: [...previousMessages.data, optimisticMessage],
        })
      }

      return { previousMessages }
    },
    onError: (err, newMessage, context) => {
      if (context?.previousMessages) {
        queryClient.setQueryData(
          chatKeys.messageList(roomId, {}),
          context.previousMessages
        )
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: chatKeys.messages(roomId) })
    },
  })
}

export const useMarkMessagesAsRead = roomId => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: messageIds =>
      ChatRoomService.markMessagesAsRead(roomId, messageIds),
    onMutate: async messageIds => {
      await queryClient.cancelQueries({
        queryKey: chatKeys.messages(roomId),
      })

      const previousMessages = queryClient.getQueryData(
        chatKeys.messageList(roomId, {})
      )

      if (previousMessages?.data) {
        queryClient.setQueryData(chatKeys.messageList(roomId, {}), {
          ...previousMessages,
          data: previousMessages.data.map(msg =>
            messageIds.includes(msg.id)
              ? { ...msg, read_at: new Date().toISOString() }
              : msg
          ),
        })
      }

      return { previousMessages }
    },
    onError: (err, messageIds, context) => {
      if (context?.previousMessages) {
        queryClient.setQueryData(
          chatKeys.messageList(roomId, {}),
          context.previousMessages
        )
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: chatKeys.messages(roomId) })
      queryClient.invalidateQueries({ queryKey: chatKeys.rooms() })
    },
  })
}

export const useDeleteMessage = roomId => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: messageId => ChatRoomService.deleteMessage(roomId, messageId),
    onMutate: async messageId => {
      await queryClient.cancelQueries({
        queryKey: chatKeys.messages(roomId),
      })

      const previousMessages = queryClient.getQueryData(
        chatKeys.messageList(roomId, {})
      )

      if (previousMessages?.data) {
        queryClient.setQueryData(chatKeys.messageList(roomId, {}), {
          ...previousMessages,
          data: previousMessages.data.filter(msg => msg.id !== messageId),
        })
      }

      return { previousMessages }
    },
    onError: (err, messageId, context) => {
      if (context?.previousMessages) {
        queryClient.setQueryData(
          chatKeys.messageList(roomId, {}),
          context.previousMessages
        )
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: chatKeys.messages(roomId) })
    },
  })
}
