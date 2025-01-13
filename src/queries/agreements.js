import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import * as agreementService from "../services/agreement"
import * as serviceAgreementService from "../services/serviceAgreement"
import * as localAgreementService from "../services/localAgreement"
import * as marketingAgreementService from "../services/marketingAgreement"
import * as deliveryAgreementService from "../services/deliveryAgreement"
import { queryKeys } from "./keys"

// Generic Agreements
export const useAgreements = (filters = {}) => {
  return useQuery({
    queryKey: queryKeys.agreements.list(filters),
    queryFn: () => agreementService.getAgreements(filters),
    staleTime: 5 * 60 * 1000,
  })
}

export const useAgreement = (id) => {
  return useQuery({
    queryKey: queryKeys.agreements.detail(id),
    queryFn: () => agreementService.getAgreement(id),
    enabled: Boolean(id),
  })
}

// Service Agreements
export const useServiceAgreements = (filters = {}) => {
  return useQuery({
    queryKey: queryKeys.agreements.service.list(filters),
    queryFn: () => serviceAgreementService.getServiceAgreements(filters),
    staleTime: 5 * 60 * 1000,
  })
}

export const useServiceAgreement = (id) => {
  return useQuery({
    queryKey: queryKeys.agreements.service.detail(id),
    queryFn: () => serviceAgreementService.getServiceAgreement(id),
    enabled: Boolean(id),
  })
}

export const useCreateServiceAgreement = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (data) => serviceAgreementService.createServiceAgreement(data),
    onSuccess: () => {
      queryClient.invalidateQueries(queryKeys.agreements.service.lists())
      queryClient.invalidateQueries(queryKeys.agreements.lists())
    },
  })
}

export const useUpdateServiceAgreement = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, data }) => serviceAgreementService.updateServiceAgreement(id, data),
    onMutate: async ({ id, data }) => {
      await queryClient.cancelQueries(queryKeys.agreements.service.detail(id))

      const previousAgreement = queryClient.getQueryData(
        queryKeys.agreements.service.detail(id)
      )

      queryClient.setQueryData(
        queryKeys.agreements.service.detail(id),
        old => ({ ...old, ...data })
      )

      return { previousAgreement }
    },
    onError: (err, { id }, context) => {
      queryClient.setQueryData(
        queryKeys.agreements.service.detail(id),
        context?.previousAgreement
      )
    },
    onSettled: (_, __, { id }) => {
      queryClient.invalidateQueries(queryKeys.agreements.service.detail(id))
      queryClient.invalidateQueries(queryKeys.agreements.service.lists())
      queryClient.invalidateQueries(queryKeys.agreements.lists())
    },
  })
}

export const useDeleteServiceAgreement = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (id) => serviceAgreementService.deleteServiceAgreement(id),
    onSuccess: () => {
      queryClient.invalidateQueries(queryKeys.agreements.service.lists())
      queryClient.invalidateQueries(queryKeys.agreements.lists())
    },
  })
}

// Local Agreements
export const useLocalAgreements = (filters = {}) => {
  return useQuery({
    queryKey: queryKeys.agreements.local.list(filters),
    queryFn: () => localAgreementService.getLocalAgreements(filters),
    staleTime: 5 * 60 * 1000,
  })
}

export const useLocalAgreement = (id) => {
  return useQuery({
    queryKey: queryKeys.agreements.local.detail(id),
    queryFn: () => localAgreementService.getLocalAgreement(id),
    enabled: Boolean(id),
  })
}

export const useCreateLocalAgreement = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (data) => localAgreementService.createLocalAgreement(data),
    onSuccess: () => {
      queryClient.invalidateQueries(queryKeys.agreements.local.lists())
      queryClient.invalidateQueries(queryKeys.agreements.lists())
    },
  })
}

export const useUpdateLocalAgreement = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, data }) => localAgreementService.updateLocalAgreement(id, data),
    onMutate: async ({ id, data }) => {
      await queryClient.cancelQueries(queryKeys.agreements.local.detail(id))

      const previousAgreement = queryClient.getQueryData(
        queryKeys.agreements.local.detail(id)
      )

      queryClient.setQueryData(
        queryKeys.agreements.local.detail(id),
        old => ({ ...old, ...data })
      )

      return { previousAgreement }
    },
    onError: (err, { id }, context) => {
      queryClient.setQueryData(
        queryKeys.agreements.local.detail(id),
        context?.previousAgreement
      )
    },
    onSettled: (_, __, { id }) => {
      queryClient.invalidateQueries(queryKeys.agreements.local.detail(id))
      queryClient.invalidateQueries(queryKeys.agreements.local.lists())
      queryClient.invalidateQueries(queryKeys.agreements.lists())
    },
  })
}

export const useDeleteLocalAgreement = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (id) => localAgreementService.deleteLocalAgreement(id),
    onSuccess: () => {
      queryClient.invalidateQueries(queryKeys.agreements.local.lists())
      queryClient.invalidateQueries(queryKeys.agreements.lists())
    },
  })
}

// Marketing Agreements
export const useMarketingAgreements = (filters = {}) => {
  return useQuery({
    queryKey: queryKeys.agreements.marketing.list(filters),
    queryFn: () => marketingAgreementService.getMarketingAgreements(filters),
    staleTime: 5 * 60 * 1000,
  })
}

export const useMarketingAgreement = (id) => {
  return useQuery({
    queryKey: queryKeys.agreements.marketing.detail(id),
    queryFn: () => marketingAgreementService.getMarketingAgreement(id),
    enabled: Boolean(id),
  })
}

export const useCreateMarketingAgreement = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (data) => marketingAgreementService.createMarketingAgreement(data),
    onSuccess: () => {
      queryClient.invalidateQueries(queryKeys.agreements.marketing.lists())
      queryClient.invalidateQueries(queryKeys.agreements.lists())
    },
  })
}

export const useUpdateMarketingAgreement = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, data }) => marketingAgreementService.updateMarketingAgreement(id, data),
    onMutate: async ({ id, data }) => {
      await queryClient.cancelQueries(queryKeys.agreements.marketing.detail(id))

      const previousAgreement = queryClient.getQueryData(
        queryKeys.agreements.marketing.detail(id)
      )

      queryClient.setQueryData(
        queryKeys.agreements.marketing.detail(id),
        old => ({ ...old, ...data })
      )

      return { previousAgreement }
    },
    onError: (err, { id }, context) => {
      queryClient.setQueryData(
        queryKeys.agreements.marketing.detail(id),
        context?.previousAgreement
      )
    },
    onSettled: (_, __, { id }) => {
      queryClient.invalidateQueries(queryKeys.agreements.marketing.detail(id))
      queryClient.invalidateQueries(queryKeys.agreements.marketing.lists())
      queryClient.invalidateQueries(queryKeys.agreements.lists())
    },
  })
}

export const useDeleteMarketingAgreement = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (id) => marketingAgreementService.deleteMarketingAgreement(id),
    onSuccess: () => {
      queryClient.invalidateQueries(queryKeys.agreements.marketing.lists())
      queryClient.invalidateQueries(queryKeys.agreements.lists())
    },
  })
}

// Delivery Agreements
export const useDeliveryAgreements = (filters = {}) => {
  return useQuery({
    queryKey: queryKeys.agreements.delivery.list(filters),
    queryFn: () => deliveryAgreementService.getDeliveryAgreements(filters),
    staleTime: 5 * 60 * 1000,
  })
}

export const useDeliveryAgreement = (id) => {
  return useQuery({
    queryKey: queryKeys.agreements.delivery.detail(id),
    queryFn: () => deliveryAgreementService.getDeliveryAgreement(id),
    enabled: Boolean(id),
  })
}

export const useCreateDeliveryAgreement = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (data) => deliveryAgreementService.createDeliveryAgreement(data),
    onSuccess: () => {
      queryClient.invalidateQueries(queryKeys.agreements.delivery.lists())
      queryClient.invalidateQueries(queryKeys.agreements.lists())
    },
  })
}

export const useUpdateDeliveryAgreement = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, data }) => deliveryAgreementService.updateDeliveryAgreement(id, data),
    onMutate: async ({ id, data }) => {
      await queryClient.cancelQueries(queryKeys.agreements.delivery.detail(id))

      const previousAgreement = queryClient.getQueryData(
        queryKeys.agreements.delivery.detail(id)
      )

      queryClient.setQueryData(
        queryKeys.agreements.delivery.detail(id),
        old => ({ ...old, ...data })
      )

      return { previousAgreement }
    },
    onError: (err, { id }, context) => {
      queryClient.setQueryData(
        queryKeys.agreements.delivery.detail(id),
        context?.previousAgreement
      )
    },
    onSettled: (_, __, { id }) => {
      queryClient.invalidateQueries(queryKeys.agreements.delivery.detail(id))
      queryClient.invalidateQueries(queryKeys.agreements.delivery.lists())
      queryClient.invalidateQueries(queryKeys.agreements.lists())
    },
  })
}

export const useDeleteDeliveryAgreement = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (id) => deliveryAgreementService.deleteDeliveryAgreement(id),
    onSuccess: () => {
      queryClient.invalidateQueries(queryKeys.agreements.delivery.lists())
      queryClient.invalidateQueries(queryKeys.agreements.lists())
    },
  })
} 