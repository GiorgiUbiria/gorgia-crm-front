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
} from "../services/tasks"

export const taskKeys = {
  all: ["tasks"],
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
      queryClient.invalidateQueries({ queryKey: taskKeys.list() })
      queryClient.invalidateQueries({ queryKey: taskKeys.myTasks() })
      queryClient.invalidateQueries({ queryKey: taskKeys.assignedToMe() })
    },
  })
}

export const useUpdateTask = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: updateTask,
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

export const useTaskQueries = isITDepartment => {
  const { data: tasksList = [], isLoading: isTasksListLoading } =
    useGetTaskList({
      enabled: isITDepartment(),
    })

  const { data: myTasksList = [], isLoading: isMyTasksLoading } =
    useGetMyTasks({
      enabled: !isITDepartment(),
    })

  const { data: assignedTasksList = [], isLoading: isAssignedTasksLoading } =
    useGetTasksAssignedToMe({
      enabled: isITDepartment(),
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
