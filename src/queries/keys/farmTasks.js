export const farmTasksKeys = {
  all: () => ["farmTasks"],
  lists: () => [...farmTasksKeys.all(), "list"],
  list: filters => [...farmTasksKeys.lists(), { filters }],
  detail: id => [...farmTasksKeys.all(), "detail", id],
  comments: {
    all: () => [...farmTasksKeys.all(), "comments"],
    byTask: taskId => [...farmTasksKeys.comments.all(), taskId],
  },
} 