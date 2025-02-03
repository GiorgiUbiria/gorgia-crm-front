import { dailiesKeys } from "./dailies"
import { tasksKeys } from "./tasks"
import { farmTasksKeys } from "./farmTasks"
import { meetingsKeys } from "./meetings"
import { vacationsKeys } from "./vacations"
import { leadsKeys } from "./leads"
import { authKeys } from "./auth"
import { chatKeys } from "./chat"

const hrAdditionalDocumentsKeys = {
  all: ["hr-additional-documents"],
  lists: () => [...hrAdditionalDocumentsKeys.all],
  list: () => [...hrAdditionalDocumentsKeys.lists()],
  current: () => [...hrAdditionalDocumentsKeys.all, "current"],
}

export const queryKeys = {
  dailies: dailiesKeys,
  tasks: tasksKeys,
  farmTasks: farmTasksKeys,
  meetings: meetingsKeys,
  vacations: vacationsKeys,
  leads: leadsKeys,
  auth: authKeys,
  chat: chatKeys,
  hrAdditionalDocuments: hrAdditionalDocumentsKeys,
}
