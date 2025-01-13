export const authKeys = {
  all: () => ["auth"],
  user: () => [...authKeys.all(), "user"],
} 