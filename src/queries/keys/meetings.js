export const meetingsKeys = {
  all: () => ["meetings"],
  lists: () => [...meetingsKeys.all(), "list"],
  list: filters => [...meetingsKeys.lists(), { filters }],
  detail: id => [...meetingsKeys.all(), "detail", id],
} 