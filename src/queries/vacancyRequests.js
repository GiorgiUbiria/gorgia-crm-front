import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  approveVacancyRequest,
  createVacancyRequest,
  deleteVacancyRequest,
  getVacancyRequest,
  getVacancyRequests,
  rejectVacancyRequest,
  updateVacancyRequest,
} from "../services/vacancyRequests";
import { VACANCY_REQUESTS } from "./keys";

export const useVacancyRequests = (params) => {
  return useQuery({
    queryKey: [VACANCY_REQUESTS, params],
    queryFn: () => getVacancyRequests(params),
  });
};

export const useVacancyRequest = (id) => {
  return useQuery({
    queryKey: [VACANCY_REQUESTS, id],
    queryFn: () => getVacancyRequest(id),
    enabled: !!id,
  });
};

export const useCreateVacancyRequest = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createVacancyRequest,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [VACANCY_REQUESTS] });
    },
  });
};

export const useUpdateVacancyRequest = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, ...data }) => updateVacancyRequest(id, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: [VACANCY_REQUESTS] });
      queryClient.invalidateQueries({ queryKey: [VACANCY_REQUESTS, variables.id] });
    },
  });
};

export const useDeleteVacancyRequest = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteVacancyRequest,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [VACANCY_REQUESTS] });
    },
  });
};

export const useApproveVacancyRequest = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: approveVacancyRequest,
    onSuccess: (_, id) => {
      queryClient.invalidateQueries({ queryKey: [VACANCY_REQUESTS] });
      queryClient.invalidateQueries({ queryKey: [VACANCY_REQUESTS, id] });
    },
  });
};

export const useRejectVacancyRequest = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, rejectionReason }) => rejectVacancyRequest(id, rejectionReason),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: [VACANCY_REQUESTS] });
      queryClient.invalidateQueries({ queryKey: [VACANCY_REQUESTS, id] });
    },
  });
}; 