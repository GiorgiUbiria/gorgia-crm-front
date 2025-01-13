import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import * as invoiceService from "../services/invoiceService"
import { queryKeys } from "./keys"

export const useInvoices = (filters = {}) => {
  return useQuery({
    queryKey: queryKeys.invoices.list(filters),
    queryFn: () => invoiceService.getInvoices(filters),
    staleTime: 5 * 60 * 1000,
  })
}

export const useInvoice = (id) => {
  return useQuery({
    queryKey: queryKeys.invoices.detail(id),
    queryFn: () => invoiceService.getInvoice(id),
    enabled: Boolean(id),
  })
}

export const useCreateInvoice = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (data) => invoiceService.createInvoice(data),
    onSuccess: () => {
      queryClient.invalidateQueries(queryKeys.invoices.lists())
    },
  })
}

export const useUpdateInvoice = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, data }) => invoiceService.updateInvoice(id, data),
    onMutate: async ({ id, data }) => {
      await queryClient.cancelQueries(queryKeys.invoices.detail(id))

      const previousInvoice = queryClient.getQueryData(queryKeys.invoices.detail(id))

      queryClient.setQueryData(
        queryKeys.invoices.detail(id),
        old => ({ ...old, ...data })
      )

      return { previousInvoice }
    },
    onError: (err, { id }, context) => {
      queryClient.setQueryData(
        queryKeys.invoices.detail(id),
        context?.previousInvoice
      )
    },
    onSettled: (_, __, { id }) => {
      queryClient.invalidateQueries(queryKeys.invoices.detail(id))
      queryClient.invalidateQueries(queryKeys.invoices.lists())
    },
  })
}

export const useDeleteInvoice = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (id) => invoiceService.deleteInvoice(id),
    onSuccess: () => {
      queryClient.invalidateQueries(queryKeys.invoices.lists())
    },
  })
}

export const useApproveInvoice = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, data }) => invoiceService.approveInvoice(id, data),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries(queryKeys.invoices.detail(id))
      queryClient.invalidateQueries(queryKeys.invoices.lists())
    },
  })
}

export const useRejectInvoice = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, data }) => invoiceService.rejectInvoice(id, data),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries(queryKeys.invoices.detail(id))
      queryClient.invalidateQueries(queryKeys.invoices.lists())
    },
  })
}

export const useGenerateInvoicePdf = () => {
  return useMutation({
    mutationFn: (id) => invoiceService.generateInvoicePdf(id),
  })
} 