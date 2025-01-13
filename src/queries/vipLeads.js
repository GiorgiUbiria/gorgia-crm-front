import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import * as vipLeadsService from "../services/vipLeadsService"
import * as vipLeadRequestsService from "../services/vipLeadRequestsService"
import * as leadRequestCommentsService from "../services/leadRequestCommentsService"
import { queryKeys } from "./keys"

// VIP Leads
export const useVipLeads = (filters = {}) => {
  return useQuery({
    queryKey: queryKeys.vipLeads.list(filters),
    queryFn: () => vipLeadsService.getVipLeads(filters),
    staleTime: 5 * 60 * 1000,
  })
}

export const useVipLead = (id) => {
  return useQuery({
    queryKey: queryKeys.vipLeads.detail(id),
    queryFn: () => vipLeadsService.getVipLead(id),
    enabled: Boolean(id),
  })
}

export const useCreateVipLead = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (data) => vipLeadsService.createVipLead(data),
    onSuccess: () => {
      queryClient.invalidateQueries(queryKeys.vipLeads.lists())
    },
  })
}

export const useUpdateVipLead = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, data }) => vipLeadsService.updateVipLead(id, data),
    onMutate: async ({ id, data }) => {
      await queryClient.cancelQueries(queryKeys.vipLeads.detail(id))

      const previousLead = queryClient.getQueryData(queryKeys.vipLeads.detail(id))

      queryClient.setQueryData(
        queryKeys.vipLeads.detail(id),
        old => ({ ...old, ...data })
      )

      return { previousLead }
    },
    onError: (err, { id }, context) => {
      queryClient.setQueryData(
        queryKeys.vipLeads.detail(id),
        context?.previousLead
      )
    },
    onSettled: (_, __, { id }) => {
      queryClient.invalidateQueries(queryKeys.vipLeads.detail(id))
      queryClient.invalidateQueries(queryKeys.vipLeads.lists())
    },
  })
}

export const useDeleteVipLead = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (id) => vipLeadsService.deleteVipLead(id),
    onSuccess: () => {
      queryClient.invalidateQueries(queryKeys.vipLeads.lists())
    },
  })
}

// VIP Lead Requests
export const useVipLeadRequests = (filters = {}) => {
  return useQuery({
    queryKey: queryKeys.vipLeads.requests.list(filters),
    queryFn: () => vipLeadRequestsService.getVipLeadRequests(filters),
    staleTime: 5 * 60 * 1000,
  })
}

export const useVipLeadRequest = (id) => {
  return useQuery({
    queryKey: queryKeys.vipLeads.requests.detail(id),
    queryFn: () => vipLeadRequestsService.getVipLeadRequest(id),
    enabled: Boolean(id),
  })
}

export const useCreateVipLeadRequest = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (data) => vipLeadRequestsService.createVipLeadRequest(data),
    onSuccess: () => {
      queryClient.invalidateQueries(queryKeys.vipLeads.requests.lists())
    },
  })
}

export const useUpdateVipLeadRequest = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, data }) => vipLeadRequestsService.updateVipLeadRequest(id, data),
    onMutate: async ({ id, data }) => {
      await queryClient.cancelQueries(queryKeys.vipLeads.requests.detail(id))

      const previousRequest = queryClient.getQueryData(
        queryKeys.vipLeads.requests.detail(id)
      )

      queryClient.setQueryData(
        queryKeys.vipLeads.requests.detail(id),
        old => ({ ...old, ...data })
      )

      return { previousRequest }
    },
    onError: (err, { id }, context) => {
      queryClient.setQueryData(
        queryKeys.vipLeads.requests.detail(id),
        context?.previousRequest
      )
    },
    onSettled: (_, __, { id }) => {
      queryClient.invalidateQueries(queryKeys.vipLeads.requests.detail(id))
      queryClient.invalidateQueries(queryKeys.vipLeads.requests.lists())
    },
  })
}

export const useDeleteVipLeadRequest = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (id) => vipLeadRequestsService.deleteVipLeadRequest(id),
    onSuccess: () => {
      queryClient.invalidateQueries(queryKeys.vipLeads.requests.lists())
    },
  })
}

// Lead Request Comments
export const useLeadRequestComments = (requestId) => {
  return useQuery({
    queryKey: queryKeys.vipLeads.requests.comments(requestId),
    queryFn: () => leadRequestCommentsService.getLeadRequestComments(requestId),
    enabled: Boolean(requestId),
  })
}

export const useCreateLeadRequestComment = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ requestId, data }) => 
      leadRequestCommentsService.createLeadRequestComment(requestId, data),
    onSuccess: (_, { requestId }) => {
      queryClient.invalidateQueries(queryKeys.vipLeads.requests.comments(requestId))
    },
  })
}

export const useUpdateLeadRequestComment = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ requestId, commentId, data }) => 
      leadRequestCommentsService.updateLeadRequestComment(requestId, commentId, data),
    onSuccess: (_, { requestId }) => {
      queryClient.invalidateQueries(queryKeys.vipLeads.requests.comments(requestId))
    },
  })
}

export const useDeleteLeadRequestComment = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ requestId, commentId }) => 
      leadRequestCommentsService.deleteLeadRequestComment(requestId, commentId),
    onSuccess: (_, { requestId }) => {
      queryClient.invalidateQueries(queryKeys.vipLeads.requests.comments(requestId))
    },
  })
} 