export const vacationsKeys = {
  all: () => ["vacations"],
  lists: () => [...vacationsKeys.all(), "list"],
  list: filters => [...vacationsKeys.lists(), { filters }],
  detail: id => [...vacationsKeys.all(), "detail", id],
} 