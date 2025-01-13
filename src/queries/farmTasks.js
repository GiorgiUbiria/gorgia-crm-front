import { useQuery, useMutation, useQueryClient, useInfiniteQuery } from "@tanstack/react-query"
import * as farmTaskService from "../services/farmTasks"
import * as farmTaskCommentService from "../services/farmTaskComment"
import { queryKeys } from "./keys"

// Farm Tasks
export const useFarmTasks = (filters = {}) => {
  return useQuery({
    queryKey: queryKeys.farmTasks.list(filters),
    queryFn: () => farmTaskService.getFarmTasks(filters),
    staleTime: 5 * 60 * 1000,
  })
}

export const useFarmTask = (id) => {
  return useQuery({
    queryKey: queryKeys.farmTasks.detail(id),
    queryFn: () => farmTaskService.getFarmTask(id),
    enabled: Boolean(id),
  })
}

export const useCreateFarmTask = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (data) => farmTaskService.createFarmTask(data),
    onSuccess: () => {
      queryClient.invalidateQueries(queryKeys.farmTasks.lists())
    },
  })
}

export const useUpdateFarmTask = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, data }) => farmTaskService.updateFarmTask(id, data),
    onMutate: async ({ id, data }) => {
      await queryClient.cancelQueries(queryKeys.farmTasks.detail(id))

      const previousTask = queryClient.getQueryData(queryKeys.farmTasks.detail(id))

      queryClient.setQueryData(
        queryKeys.farmTasks.detail(id),
        old => ({ ...old, ...data })
      )

      return { previousTask }
    },
    onError: (err, { id }, context) => {
      queryClient.setQueryData(
        queryKeys.farmTasks.detail(id),
        context?.previousTask
      )
    },
    onSettled: (_, __, { id }) => {
      queryClient.invalidateQueries(queryKeys.farmTasks.detail(id))
      queryClient.invalidateQueries(queryKeys.farmTasks.lists())
    },
  })
}

export const useDeleteFarmTask = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (id) => farmTaskService.deleteFarmTask(id),
    onSuccess: () => {
      queryClient.invalidateQueries(queryKeys.farmTasks.lists())
    },
  })
}

// Farm Task Comments
export const useFarmTaskComments = (taskId, filters = {}) => {
  return useQuery({
    queryKey: queryKeys.farmTasks.comments.byTask(taskId),
    queryFn: () => farmTaskCommentService.getFarmTaskComments(taskId, filters),
    enabled: Boolean(taskId),
  })
}

export const useInfiniteFarmTaskComments = (taskId, filters = {}) => {
  return useInfiniteQuery({
    queryKey: queryKeys.farmTasks.comments.byTask(taskId),
    queryFn: ({ pageParam = 1 }) => 
      farmTaskCommentService.getFarmTaskComments(taskId, { ...filters, page: pageParam }),
    getNextPageParam: (lastPage) => lastPage.nextPage,
    enabled: Boolean(taskId),
  })
}

export const useCreateFarmTaskComment = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ taskId, data }) => farmTaskCommentService.createFarmTaskComment(taskId, data),
    onSuccess: (_, { taskId }) => {
      queryClient.invalidateQueries(queryKeys.farmTasks.comments.byTask(taskId))
    },
  })
}

export const useUpdateFarmTaskComment = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ taskId, commentId, data }) => 
      farmTaskCommentService.updateFarmTaskComment(taskId, commentId, data),
    onSuccess: (_, { taskId }) => {
      queryClient.invalidateQueries(queryKeys.farmTasks.comments.byTask(taskId))
    },
  })
}

export const useDeleteFarmTaskComment = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ taskId, commentId }) => 
      farmTaskCommentService.deleteFarmTaskComment(taskId, commentId),
    onSuccess: (_, { taskId }) => {
      queryClient.invalidateQueries(queryKeys.farmTasks.comments.byTask(taskId))
    },
  })
}
