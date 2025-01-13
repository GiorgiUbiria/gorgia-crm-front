export const tasksKeys = {
  all: () => ["tasks"],
  lists: () => [...tasksKeys.all(), "list"],
  list: filters => [...tasksKeys.lists(), { filters }],
  detail: id => [...tasksKeys.all(), "detail", id],
  comments: {
    all: () => [...tasksKeys.all(), "comments"],
    byTask: taskId => [...tasksKeys.comments.all(), taskId],
  },
} 