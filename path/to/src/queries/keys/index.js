// Define each top-level key separately

const dailiesKeys = {
  all: ["dailies"],
  lists: () => [...dailiesKeys.all, "list"],
  list: filters => [...dailiesKeys.lists(), { filters }],
  detail: id => [...dailiesKeys.all, "detail", id],
  departmentHead: {
    all: () => [...dailiesKeys.all, "departmentHead"],
    lists: () => [...dailiesKeys.departmentHead.all(), "list"],
    list: filters => [...dailiesKeys.departmentHead.lists(), { filters }],
    detail: id => [...dailiesKeys.departmentHead.all(), "detail", id],
    my: filters => [...dailiesKeys.departmentHead.lists(), "my", { filters }],
  },
  regular: {
    all: () => [...dailiesKeys.all, "regular"],
    lists: () => [...dailiesKeys.regular.all(), "list"],
    list: filters => [...dailiesKeys.regular.lists(), { filters }],
    detail: id => [...dailiesKeys.regular.all, "detail", id],
    my: filters => [...dailiesKeys.regular.lists(), "my", { filters }],
  },
}

const tasksKeys = {
  all: ["tasks"],
  lists: () => [...tasksKeys.all, "list"],
  list: filters => [...tasksKeys.lists(), { filters }],
  detail: id => [...tasksKeys.all, "detail", id],
  comments: {
    all: () => [...tasksKeys.all, "comments"],
    byTask: taskId => [...tasksKeys.comments.all(), taskId],
  },
}

const farmTasksKeys = {
  all: ["farmTasks"],
  lists: () => [...farmTasksKeys.all, "list"],
  list: filters => [...farmTasksKeys.lists(), { filters }],
  detail: id => [...farmTasksKeys.all, "detail", id],
  comments: {
    all: () => [...farmTasksKeys.all, "comments"],
    byTask: taskId => [...farmTasksKeys.comments.all(), taskId],
  },
}

const meetingsKeys = {
  all: ["meetings"],
  lists: () => [...meetingsKeys.all, "list"],
  list: filters => [...meetingsKeys.lists(), { filters }],
  detail: id => [...meetingsKeys.all, "detail", id],
}

const vacationsKeys = {
  all: ["vacations"],
  lists: () => [...vacationsKeys.all, "list"],
  list: filters => [...vacationsKeys.lists(), { filters }],
  detail: id => [...vacationsKeys.all, "detail", id],
}

const purchasesKeys = {
  all: ["purchases"],
  lists: () => [...purchasesKeys.all, "list"],
  list: filters => [...purchasesKeys.lists(), { filters }],
  detail: id => [...purchasesKeys.all, "detail", id],
}

const vipLeadsKeys = {
  all: ["vipLeads"],
  lists: () => [...vipLeadsKeys.all, "list"],
  list: filters => [...vipLeadsKeys.lists(), { filters }],
  detail: id => [...vipLeadsKeys.all, "detail", id],
  requests: {
    all: [...vipLeadsKeys.all, "requests"],
    lists: () => [...vipLeadsKeys.requests.all, "list"],
    list: filters => [...vipLeadsKeys.requests.lists(), { filters }],
    detail: id => [...vipLeadsKeys.requests.all, "detail", id],
  },
}

const visitorsTrafficKeys = {
  all: ["visitorsTraffic"],
  lists: () => [...visitorsTrafficKeys.all, "list"],
  list: filters => [...visitorsTrafficKeys.lists(), { filters }],
}

const usersKeys = {
  all: ["users"],
  lists: () => [...usersKeys.all, "list"],
  list: filters => [...usersKeys.lists(), { filters }],
  detail: id => [...usersKeys.all, "detail", id],
  roles: {
    all: [...usersKeys.all, "roles"],
    lists: () => [...usersKeys.roles.all, "list"],
    list: filters => [...usersKeys.roles.lists(), { filters }],
  },
}

const roomsKeys = {
  all: ["rooms"],
  lists: () => [...roomsKeys.all, "list"],
  list: filters => [...roomsKeys.lists(), { filters }],
}

const agreementsKeys = {
  all: ["agreements"],
  lists: () => [...agreementsKeys.all, "list"],
  list: filters => [...agreementsKeys.lists(), { filters }],
  detail: id => [...agreementsKeys.all, "detail", id],
  service: {
    all: [...agreementsKeys.all, "service"],
    lists: () => [...agreementsKeys.service.all, "list"],
    list: filters => [...agreementsKeys.service.lists(), { filters }],
    detail: id => [...agreementsKeys.service.all, "detail", id],
  },
  local: {
    all: [...agreementsKeys.all, "local"],
    lists: () => [...agreementsKeys.local.all, "list"],
    list: filters => [...agreementsKeys.local.lists(), { filters }],
    detail: id => [...agreementsKeys.local.all, "detail", id],
  },
  marketing: {
    all: [...agreementsKeys.all, "marketing"],
    lists: () => [...agreementsKeys.marketing.all, "list"],
    list: filters => [...agreementsKeys.marketing.lists(), { filters }],
    detail: id => [...agreementsKeys.marketing.all, "detail", id],
  },
  delivery: {
    all: [...agreementsKeys.all, "delivery"],
    lists: () => [...agreementsKeys.delivery.all, "list"],
    list: filters => [...agreementsKeys.delivery.lists(), { filters }],
    detail: id => [...agreementsKeys.delivery.all, "detail", id],
  },
}

const notesKeys = {
  all: ["notes"],
  lists: () => [...notesKeys.all, "list"],
  list: filters => [...notesKeys.lists(), { filters }],
  detail: id => [...notesKeys.all, "detail", id],
}

const hrDocumentsKeys = {
  all: ["hrDocuments"],
  lists: () => [...hrDocumentsKeys.all, "list"],
  list: filters => [...hrDocumentsKeys.lists(), { filters }],
  detail: id => [...hrDocumentsKeys.all, "detail", id],
}

const invoicesKeys = {
  all: ["invoices"],
  lists: () => [...invoicesKeys.all, "list"],
  list: filters => [...invoicesKeys.lists(), { filters }],
  detail: id => [...invoicesKeys.all, "detail", id],
}

const leadsKeys = {
  all: ["leads"],
  lists: () => [...leadsKeys.all, "list"],
  list: filters => [...leadsKeys.lists(), { filters }],
  detail: id => [...leadsKeys.all, "detail", id],
  comments: {
    all: [...leadsKeys.all, "comments"],
    byLead: leadId => [...leadsKeys.comments.all, leadId],
  },
}

const authKeys = {
  all: ["auth"],
  user: () => [...authKeys.all, "user"],
}

const calendarKeys = {
  all: ["calendar"],
  events: filters => [...calendarKeys.all, "events", { filters }],
}

const chatKeys = {
  all: ["chat"],
  messages: filters => [...chatKeys.all, "messages", { filters }],
}

// Combine all keys into the final queryKeys object
export const queryKeys = {
  dailies: dailiesKeys,
  tasks: tasksKeys,
  farmTasks: farmTasksKeys,
  meetings: meetingsKeys,
  vacations: vacationsKeys,
  purchases: purchasesKeys,
  vipLeads: vipLeadsKeys,
  visitorsTraffic: visitorsTrafficKeys,
  users: usersKeys,
  rooms: roomsKeys,
  agreements: agreementsKeys,
  notes: notesKeys,
  hrDocuments: hrDocumentsKeys,
  invoices: invoicesKeys,
  leads: leadsKeys,
  auth: authKeys,
  calendar: calendarKeys,
  chat: chatKeys,
} 