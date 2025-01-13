export const leadsKeys = {
  all: () => ["leads"],
  lists: () => [...leadsKeys.all(), "list"],
  list: filters => [...leadsKeys.lists(), { filters }],
  detail: id => [...leadsKeys.all(), "detail", id],
  comments: {
    all: () => [...leadsKeys.all(), "comments"],
    byLead: leadId => [...leadsKeys.comments.all(), leadId],
  },
} 