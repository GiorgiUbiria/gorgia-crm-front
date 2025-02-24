import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import {
  getTaskList,
  getMyTasks,
  getTask,
  createTask,
  updateTask,
  deleteTask,
  assignTask,
  startTask,
  finishTask,
  getTasksAssignedToMe,
  getTaskComments,
  createTaskComment,
  updateTaskComment,
  deleteTaskComment,
} from "../services/oneCTask"

export const taskKeys = {
  all: ["1c-tasks"],
  list: () => [...taskKeys.all, "list"],
  myTasks: () => [...taskKeys.all, "my"],
  detail: id => [...taskKeys.all, "detail", id],
  assignedToMe: () => [...taskKeys.all, "assigned-to-me"],
  comments: taskId => [...taskKeys.all, taskId, "comments"],
}

export const useGetTaskList = (options = {}) => {
  return useQuery({
    queryKey: taskKeys.list(),
    queryFn: getTaskList,
    ...options,
  })
}

export const useGetMyTasks = (options = {}) => {
  return useQuery({
    queryKey: taskKeys.myTasks(),
    queryFn: getMyTasks,
    ...options,
  })
}

export const useGetTasksAssignedToMe = (options = {}) => {
  return useQuery({
    queryKey: taskKeys.assignedToMe(),
    queryFn: getTasksAssignedToMe,
    ...options,
  })
}

export const useGetTask = (id, options = {}) => {
  return useQuery({
    queryKey: taskKeys.detail(id),
    queryFn: () => getTask(id),
    ...options,
  })
}

export const useGetTaskComments = (taskId, options = {}) => {
  return useQuery({
    queryKey: taskKeys.comments(taskId),
    queryFn: () => getTaskComments(taskId),
    ...options,
  })
}

export const useAssignTask = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: assignTask,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: taskKeys.all })
    },
  })
}

export const useStartTask = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: startTask,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: taskKeys.all })
    },
  })
}

export const useFinishTask = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: finishTask,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: taskKeys.all })
    },
  })
}

export const useCreateTask = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: createTask,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: taskKeys.all })
    },
  })
}

export const useUpdateTask = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, data }) => updateTask(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: taskKeys.all })
    },
  })
}

export const useDeleteTask = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: deleteTask,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: taskKeys.all })
    },
  })
}

export const useCreateTaskComment = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ taskId, data }) => createTaskComment(taskId, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: taskKeys.comments(variables.taskId),
      })
    },
  })
}

export const useUpdateTaskComment = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ taskId, commentId, data }) =>
      updateTaskComment(taskId, commentId, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: taskKeys.comments(variables.taskId),
      })
    },
  })
}

export const useDeleteTaskComment = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ taskId, commentId }) => deleteTaskComment(taskId, commentId),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: taskKeys.comments(variables.taskId),
      })
    },
  })
}

export const useTaskQueries = (islegalDepartment, hasEditPermission) => {
  const { data: tasksList = [], isLoading: isTasksListLoading } =
    useGetTaskList({
      enabled: islegalDepartment || hasEditPermission,
    })

  const { data: myTasksList = [], isLoading: isMyTasksLoading } = useGetMyTasks(
    {
      enabled: !islegalDepartment && !hasEditPermission,
    }
  )

  const { data: assignedTasksList = [], isLoading: isAssignedTasksLoading } =
    useGetTasksAssignedToMe({
      enabled: islegalDepartment || hasEditPermission,
    })

  return {
    tasksList,
    myTasksList,
    assignedTasksList,
    isTasksListLoading,
    isMyTasksLoading,
    isAssignedTasksLoading,
  }
}
