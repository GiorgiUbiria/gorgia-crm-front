import { useQuery, useMutation, useQueryClient, useInfiniteQuery } from "@tanstack/react-query"
import * as leadsService from "../services/leadsService"
import * as leadRequestCommentsService from "../services/leadRequestCommentsService"
import { queryKeys } from "./keys"

// Leads
export const useLeads = (filters = {}) => {
  return useQuery({
    queryKey: queryKeys.leads.list(filters),
    queryFn: () => leadsService.getLeads(filters),
    staleTime: 5 * 60 * 1000,
  })
}

export const useLead = (id) => {
  return useQuery({
    queryKey: queryKeys.leads.detail(id),
    queryFn: () => leadsService.getLead(id),
    enabled: Boolean(id),
  })
}

export const useCreateLead = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (data) => leadsService.createLead(data),
    onSuccess: () => {
      queryClient.invalidateQueries(queryKeys.leads.lists())
    },
  })
}

export const useUpdateLead = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, data }) => leadsService.updateLead(id, data),
    onMutate: async ({ id, data }) => {
      await queryClient.cancelQueries(queryKeys.leads.detail(id))

      const previousLead = queryClient.getQueryData(queryKeys.leads.detail(id))

      queryClient.setQueryData(
        queryKeys.leads.detail(id),
        old => ({ ...old, ...data })
      )

      return { previousLead }
    },
    onError: (err, { id }, context) => {
      queryClient.setQueryData(
        queryKeys.leads.detail(id),
        context?.previousLead
      )
    },
    onSettled: (_, __, { id }) => {
      queryClient.invalidateQueries(queryKeys.leads.detail(id))
      queryClient.invalidateQueries(queryKeys.leads.lists())
    },
  })
}

export const useDeleteLead = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (id) => leadsService.deleteLead(id),
    onSuccess: () => {
      queryClient.invalidateQueries(queryKeys.leads.lists())
    },
  })
}

// Lead Comments
export const useLeadComments = (leadId, filters = {}) => {
  return useQuery({
    queryKey: queryKeys.leads.comments.byLead(leadId),
    queryFn: () => leadRequestCommentsService.getLeadComments(leadId, filters),
    enabled: Boolean(leadId),
  })
}

export const useInfiniteLeadComments = (leadId, filters = {}) => {
  return useInfiniteQuery({
    queryKey: queryKeys.leads.comments.byLead(leadId),
    queryFn: ({ pageParam = 1 }) => 
      leadRequestCommentsService.getLeadComments(leadId, { ...filters, page: pageParam }),
    getNextPageParam: (lastPage) => lastPage.nextPage,
    enabled: Boolean(leadId),
  })
}

export const useCreateLeadComment = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ leadId, data }) => leadRequestCommentsService.createLeadComment(leadId, data),
    onSuccess: (_, { leadId }) => {
      queryClient.invalidateQueries(queryKeys.leads.comments.byLead(leadId))
    },
  })
}

export const useUpdateLeadComment = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ leadId, commentId, data }) => 
      leadRequestCommentsService.updateLeadComment(leadId, commentId, data),
    onSuccess: (_, { leadId }) => {
      queryClient.invalidateQueries(queryKeys.leads.comments.byLead(leadId))
    },
  })
}

export const useDeleteLeadComment = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ leadId, commentId }) => 
      leadRequestCommentsService.deleteLeadComment(leadId, commentId),
    onSuccess: (_, { leadId }) => {
      queryClient.invalidateQueries(queryKeys.leads.comments.byLead(leadId))
    },
  })
} 