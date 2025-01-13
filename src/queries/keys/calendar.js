export const calendarKeys = {
  all: () => ["calendar"],
  events: filters => [...calendarKeys.all(), "events", { filters }],
} 