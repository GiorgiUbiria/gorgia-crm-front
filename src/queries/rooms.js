import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import * as roomsService from "../services/rooms"
import { queryKeys } from "./keys"

export const useRooms = (filters = {}) => {
  return useQuery({
    queryKey: queryKeys.rooms.list(filters),
    queryFn: () => roomsService.getRooms(filters),
    staleTime: 5 * 60 * 1000,
  })
}

export const useCreateRoom = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (data) => roomsService.createRoom(data),
    onSuccess: () => {
      queryClient.invalidateQueries(queryKeys.rooms.lists())
    },
  })
}

export const useUpdateRoom = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, data }) => roomsService.updateRoom(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries(queryKeys.rooms.lists())
    },
  })
}

export const useDeleteRoom = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (id) => roomsService.deleteRoom(id),
    onSuccess: () => {
      queryClient.invalidateQueries(queryKeys.rooms.lists())
    },
  })
} 