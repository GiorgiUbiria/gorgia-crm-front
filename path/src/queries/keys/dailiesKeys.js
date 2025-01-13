export const dailiesKeys = {
  all: () => ["dailies"],
  lists: (filters) => [...dailiesKeys.all(), "list", { filters }],
  detail: (id) => [...dailiesKeys.all(), "detail", id],
  departmentHead: {
    all: () => [...dailiesKeys.all(), "departmentHead"],
    lists: (filters) => [...dailiesKeys.departmentHead.all(), "list", { filters }],
    detail: (id) => [...dailiesKeys.departmentHead.all(), "detail", id],
    my: (filters) => [...dailiesKeys.departmentHead.lists(filters), "my", { filters }],
  },
  regular: {
    all: () => [...dailiesKeys.all(), "regular"],
    lists: (filters) => [...dailiesKeys.regular.all(), "list", { filters }],
    detail: (id) => [...dailiesKeys.regular.all(), "detail", id],
    my: (filters) => [...dailiesKeys.regular.lists(filters), "my", { filters }],
  },
}