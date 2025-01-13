export const dailiesKeys = {
  all: () => ["dailies"],
  lists: () => [...dailiesKeys.all(), "list"],
  list: filters => [...dailiesKeys.lists(), { filters }],
  detail: id => [...dailiesKeys.all(), "detail", id],
  departmentHead: {
    all: () => [...dailiesKeys.all(), "departmentHead"],
    lists: () => [...dailiesKeys.departmentHead.all(), "list"],
    list: filters => [...dailiesKeys.departmentHead.lists(), { filters }],
    detail: id => [...dailiesKeys.departmentHead.all(), "detail", id],
    my: filters => [...dailiesKeys.departmentHead.lists(), "my", { filters }],
  },
  regular: {
    all: () => [...dailiesKeys.all(), "regular"],
    lists: () => [...dailiesKeys.regular.all(), "list"],
    list: filters => [...dailiesKeys.regular.lists(), { filters }],
    detail: id => [...dailiesKeys.regular.all(), "detail", id],
    my: filters => [...dailiesKeys.regular.lists(), "my", { filters }],
  },
} 