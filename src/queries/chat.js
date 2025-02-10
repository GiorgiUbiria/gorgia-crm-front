import { useQuery, useMutation, useQueryClient, useInfiniteQuery } from "@tanstack/react-query"
import * as chatService from "../services/chat"
import { queryKeys } from "./keys"

export const useChatMessages = (filters = {}) => {
  return useQuery({
    queryKey: queryKeys.chat.messages(filters),
    queryFn: () => chatService.getMessages(filters),
    staleTime: 0,
  })
}

export const useInfiniteChatMessages = (filters = {}) => {
  return useInfiniteQuery({
    queryKey: queryKeys.chat.messages(filters),
    queryFn: ({ pageParam = 1 }) => 
      chatService.getMessages({ ...filters, page: pageParam }),
    getNextPageParam: (lastPage) => lastPage.nextPage,
  })
}

export const useSendMessage = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (data) => chatService.sendMessage(data),
    onSuccess: () => {
      queryClient.invalidateQueries(queryKeys.chat.messages())
    },
  })
}

export const useDeleteMessage = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (messageId) => chatService.deleteMessage(messageId),
    onSuccess: () => {
      queryClient.invalidateQueries(queryKeys.chat.messages())
    },
  })
}

export const useUpdateMessage = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ messageId, data }) => chatService.updateMessage(messageId, data),
    onMutate: async ({ messageId, data }) => {
      await queryClient.cancelQueries(queryKeys.chat.messages())

      const previousMessages = queryClient.getQueryData(queryKeys.chat.messages())

      queryClient.setQueryData(
        queryKeys.chat.messages(),
        old => ({
          ...old,
          messages: old.messages.map(message =>
            message.id === messageId ? { ...message, ...data } : message
          )
        })
      )

      return { previousMessages }
    },
    onError: (err, _, context) => {
      queryClient.setQueryData(
        queryKeys.chat.messages(),
        context?.previousMessages
      )
    },
    onSettled: () => {
      queryClient.invalidateQueries(queryKeys.chat.messages())
    },
  })
} 