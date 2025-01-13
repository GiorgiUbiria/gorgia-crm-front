export const chatKeys = {
  all: () => ["chat"],
  messages: filters => [...chatKeys.all(), "messages", { filters }],
} 