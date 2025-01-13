import { useQuery, useMutation, useQueryClient, useInfiniteQuery } from "@tanstack/react-query"
import * as taskService from "../services/tasks"
import * as taskCommentService from "../services/taskComment"
import { queryKeys } from "./keys"

// Tasks
export const useTasks = (filters = {}) => {
  return useQuery({
    queryKey: queryKeys.tasks.list(filters),
    queryFn: () => taskService.getTasks(filters),
    staleTime: 5 * 60 * 1000,
  })
}

export const useTask = (id) => {
  return useQuery({
    queryKey: queryKeys.tasks.detail(id),
    queryFn: () => taskService.getTask(id),
    enabled: Boolean(id),
  })
}

export const useCreateTask = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (data) => taskService.createTask(data),
    onSuccess: () => {
      queryClient.invalidateQueries(queryKeys.tasks.lists())
    },
  })
}

export const useUpdateTask = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, data }) => taskService.updateTask(id, data),
    onMutate: async ({ id, data }) => {
      await queryClient.cancelQueries(queryKeys.tasks.detail(id))

      const previousTask = queryClient.getQueryData(queryKeys.tasks.detail(id))

      queryClient.setQueryData(
        queryKeys.tasks.detail(id),
        old => ({ ...old, ...data })
      )

      return { previousTask }
    },
    onError: (err, { id }, context) => {
      queryClient.setQueryData(
        queryKeys.tasks.detail(id),
        context?.previousTask
      )
    },
    onSettled: (_, __, { id }) => {
      queryClient.invalidateQueries(queryKeys.tasks.detail(id))
      queryClient.invalidateQueries(queryKeys.tasks.lists())
    },
  })
}

export const useDeleteTask = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (id) => taskService.deleteTask(id),
    onSuccess: () => {
      queryClient.invalidateQueries(queryKeys.tasks.lists())
    },
  })
}

// Task Comments
export const useTaskComments = (taskId, filters = {}) => {
  return useQuery({
    queryKey: queryKeys.tasks.comments.byTask(taskId),
    queryFn: () => taskCommentService.getTaskComments(taskId, filters),
    enabled: Boolean(taskId),
  })
}

export const useInfiniteTaskComments = (taskId, filters = {}) => {
  return useInfiniteQuery({
    queryKey: queryKeys.tasks.comments.byTask(taskId),
    queryFn: ({ pageParam = 1 }) => 
      taskCommentService.getTaskComments(taskId, { ...filters, page: pageParam }),
    getNextPageParam: (lastPage) => lastPage.nextPage,
    enabled: Boolean(taskId),
  })
}

export const useCreateTaskComment = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ taskId, data }) => taskCommentService.createTaskComment(taskId, data),
    onSuccess: (_, { taskId }) => {
      queryClient.invalidateQueries(queryKeys.tasks.comments.byTask(taskId))
    },
  })
}

export const useUpdateTaskComment = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ taskId, commentId, data }) => 
      taskCommentService.updateTaskComment(taskId, commentId, data),
    onSuccess: (_, { taskId }) => {
      queryClient.invalidateQueries(queryKeys.tasks.comments.byTask(taskId))
    },
  })
}

export const useDeleteTaskComment = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ taskId, commentId }) => 
      taskCommentService.deleteTaskComment(taskId, commentId),
    onSuccess: (_, { taskId }) => {
      queryClient.invalidateQueries(queryKeys.tasks.comments.byTask(taskId))
    },
  })
}
