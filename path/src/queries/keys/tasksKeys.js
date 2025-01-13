export const tasksKeys = {
  all: () => ["tasks"],
  lists: (filters) => [...tasksKeys.all(), "list", { filters }],
  detail: (id) => [...tasksKeys.all(), "detail", id],
  comments: {
    all: () => [...tasksKeys.all(), "comments"],
    byTask: (taskId) => [...tasksKeys.comments.all(), taskId],
  },
} 