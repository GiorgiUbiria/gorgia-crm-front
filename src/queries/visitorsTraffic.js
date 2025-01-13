import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import * as visitorsTrafficService from "../services/visitorsTrafficService"
import { queryKeys } from "./keys"

export const useVisitorsTraffic = (filters = {}) => {
  return useQuery({
    queryKey: queryKeys.visitorsTraffic.list(filters),
    queryFn: () => visitorsTrafficService.getVisitorsTraffic(filters),
    staleTime: 5 * 60 * 1000,
  })
}

export const useCreateVisitorsTraffic = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (data) => visitorsTrafficService.createVisitorsTraffic(data),
    onSuccess: () => {
      queryClient.invalidateQueries(queryKeys.visitorsTraffic.lists())
    },
  })
}

export const useUpdateVisitorsTraffic = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, data }) => visitorsTrafficService.updateVisitorsTraffic(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries(queryKeys.visitorsTraffic.lists())
    },
  })
}

export const useDeleteVisitorsTraffic = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (id) => visitorsTrafficService.deleteVisitorsTraffic(id),
    onSuccess: () => {
      queryClient.invalidateQueries(queryKeys.visitorsTraffic.lists())
    },
  })
} 