import React from "react"
import { Navigate } from "react-router-dom"
import ProtectedRoute from "../components/ProtectedRoute"

import AdminPage from "pages/AdminPage"
import BusinessPage from "pages/Applications/BusinessTrip/BusinessPage"
import TripPageApprove from "pages/Applications/BusinessTrip/TripPageApprove/TripPageApprove"
import UserTrip from "pages/Applications/BusinessTrip/UserTrips"
import ProcurementPage from "pages/Applications/InternalProcurement/ProcurementPage"
import PurchasePageApprove from "pages/Applications/InternalProcurement/PurchasePageApprove/PurchasePageApprove"
import ProcurementPageArchive from "pages/Applications/InternalProcurement/ProcurementPageArchive"
import UserProcurement from "pages/Applications/InternalProcurement/UserProcurements"
import UserVocation from "pages/Applications/Vacation/UserVocations"
import VacationPage from "pages/Applications/Vacation/VacationPage"
import VacationPageApprove from "pages/Applications/Vacation/VacationPageApprove/VacationPageApprove"
import MakeComment from "pages/Comment/MakeComment"
import Dailies from "pages/Dailies/index.jsx"
import Daily from "pages/Daily"
import DailiesInner from "pages/DailiesInner/index.jsx"
import DailyInner from "pages/DailyInner"
import HeadPage from "pages/HeadPage"
import HrPage from "pages/HrDocuments/HrPage"
import HrPageApprove from "pages/HrDocuments/HrPageApprove"
import UserHrDocuments from "pages/HrDocuments/UserHrDocuments"
import UserHrAdditionalDocuments from "pages/HrDocuments/UserHrAdditionalDocuments"
import HrAdditionalPage from "pages/HrDocuments/HrAdditionalPage"
import HrAdditionalArchive from "pages/HrDocuments/HrAdditionalArchive"
import JobDetails from "pages/JobPages/JobDetails"
import FarmTaskDetails from "pages/FarmJobPages/JobDetails"
import FarmTaskList from "pages/FarmJobPages/JobList"
import LegalTaskList from "pages/LegalJobPages/JobList"
import LegalTaskDetails from "pages/LegalJobPages/JobDetails"
import AgreementRequest from "pages/Agreements/AgreementRequest"

import StandardAgreementApprove from "pages/Agreements/Standard/StandardAgreementApprove"
import StandardAgreementArchive from "pages/Agreements/Standard/StandardAgreementArchive"
import StandardAgreementUser from "pages/Agreements/Standard/StandardAgreementUser"

import DeliveryAgreementArchive from "pages/Agreements/Delivery/DeliveryAgreementArchive"
import DeliveryAgreementUser from "pages/Agreements/Delivery/DeliveryAgreementUser"
import DeliveryAgreementApprove from "pages/Agreements/Delivery/DeliveryAgreementApprove"

import MarketingAgreementApprove from "pages/Agreements/Marketing/MarketingAgreementApprove"
import MarketingAgreementArchive from "pages/Agreements/Marketing/MarketingAgreementArchive"
import MarketingAgreementUser from "pages/Agreements/Marketing/MarketingAgreementUser"

import ServiceAgreementApprove from "pages/Agreements/Service/ServiceAgreementApprove"
import ServiceAgreementArchive from "pages/Agreements/Service/ServiceAgreementArchive"
import ServiceAgreementUser from "pages/Agreements/Service/ServiceAgreementUser"

import LocalAgreementApprove from "pages/Agreements/Local/LocalAgreementApprove"
import LocalAgreementArchive from "pages/Agreements/Local/LocalAgreementArchive"
import LocalAgreementUser from "pages/Agreements/Local/LocalAgreementUser"

import PeopleCounting from "pages/PeopleCounting"

import LeadsPage from "pages/LeadsPage/LeadsPage"
import NotesPage from "pages/NotesPage"
import ProfilePage from "pages/ProfilePage"
import VipLeadDetailPage from "pages/VipLeadsPage/VipLeadDetailPage"
import VipLeadsPage from "pages/VipLeadsPage/VipLeadsPage"
import ArchivePage from "../pages/ArchivePage"
import Login from "../pages/Authentication/Login"
import Logout from "../pages/Authentication/Logout"
import Register from "../pages/Authentication/Register"
import Dashboard from "../pages/Dashboard/index"
import TaskList from "../pages/JobPages/JobList"
import VacationPageArchive from "pages/Applications/Vacation/VacationPageArchive"
import TripPageArchive from "pages/Applications/BusinessTrip/TripPageArchive"
import HrPageArchive from "pages/HrDocuments/HrPageArchive"
import CreateNote from "pages/NotesEditor/CreateNote"
import EditNote from "pages/NotesEditor/EditNote"
import Calendar from "pages/Calendar"
import ChatRoom from "pages/ChatRoom"
import TaskCharts from "pages/JobPages/JobCharts"
import VacancyRequests from "pages/Vacancies/VacancyRequests"
import VacancyRequestForm from "pages/Vacancies/VacancyRequestForm"
import VacancyRequestDetails from "pages/Vacancies/VacancyRequestDetails"
import MyVacancyRequests from "pages/Vacancies/MyVacancyRequests"

const withProtectedRoute = (component, permission = "") => (
  <ProtectedRoute permission={permission}>{component}</ProtectedRoute>
)

const dashboardRoutes = {
  path: "/dashboard",
  component: withProtectedRoute(<Dashboard />),
}

const profileRoutes = {
  path: "/profile",
  component: withProtectedRoute(<ProfilePage />),
}

const adminRoutes = {
  path: "/admin",
  children: {
    dashboard: {
      path: "/admin/dashboard",
      component: withProtectedRoute(
        <AdminPage />,
        "role:admin|role:department_head|department:8"
      ),
    },
    approvals: {
      path: "/admin/approvals",
      component: withProtectedRoute(<HeadPage />, "role:admin"),
    },
    archive: {
      path: "/admin/archive",
      component: withProtectedRoute(<ArchivePage />, "role:admin"),
    },
  },
}

const applicationsRoutes = {
  path: "/applications",
  children: {
    purchases: {
      path: "/applications/purchases",
      children: {
        new: {
          path: "/applications/purchases/new",
          component: withProtectedRoute(<ProcurementPage />),
        },
        approve: {
          path: "/applications/purchases/approve",
          component: withProtectedRoute(
            <PurchasePageApprove />,
            "role:admin|role:department_head|user:155|user:156|user:157"
          ),
        },
        archive: {
          path: "/applications/purchases/archive",
          component: withProtectedRoute(
            <ProcurementPageArchive />,
            "role:admin|role:department_head|role:department_head_assistant|department:7|user:373"
          ),
        },
        myRequests: {
          path: "/applications/purchases/my-requests",
          component: withProtectedRoute(<UserProcurement />),
        },
      },
    },
    vacation: {
      path: "/applications/vacation",
      children: {
        new: {
          path: "/applications/vacation/new",
          component: withProtectedRoute(<VacationPage />),
        },
        approve: {
          path: "/applications/vacation/approve",
          component: withProtectedRoute(
            <VacationPageApprove />,
            "role:admin|role:department_head"
          ),
        },
        archive: {
          path: "/applications/vacation/archive",
          component: withProtectedRoute(
            <VacationPageArchive />,
            "role:admin|role:department_head|role:department_head_assistant|department:8"
          ),
        },
        myRequests: {
          path: "/applications/vacation/my-requests",
          component: withProtectedRoute(<UserVocation />),
        },
      },
    },
    businessTrip: {
      path: "/applications/business-trip",
      children: {
        new: {
          path: "/applications/business-trip/new",
          component: withProtectedRoute(<BusinessPage />),
        },
        approve: {
          path: "/applications/business-trip/approve",
          component: withProtectedRoute(
            <TripPageApprove />,
            "role:admin|role:department_head"
          ),
        },
        archive: {
          path: "/applications/business-trip/archive",
          component: withProtectedRoute(
            <TripPageArchive />,
            "role:admin|role:department_head|role:department_head_assistant"
          ),
        },
        myRequests: {
          path: "/applications/business-trip/my-requests",
          component: withProtectedRoute(<UserTrip />),
        },
      },
    },
  },
}

const hrRoutes = {
  path: "/hr",
  children: {
    documents: {
      path: "/hr/documents",
      children: {
        new: {
          path: "/hr/documents/new",
          component: withProtectedRoute(<HrPage />),
        },
        approve: {
          path: "/hr/documents/approve",
          component: withProtectedRoute(
            <HrPageApprove />,
            "role:admin|role:department_head,department:8|role:department_head_assistant,department:8"
          ),
        },
        archive: {
          path: "/hr/documents/archive",
          component: withProtectedRoute(
            <HrPageArchive />,
            "role:admin|department:8"
          ),
        },
        myRequests: {
          path: "/hr/documents/my-requests",
          component: withProtectedRoute(<UserHrDocuments />),
        },
        additionalNew: {
          path: "/hr/documents/additional/new",
          component: withProtectedRoute(<HrAdditionalPage />),
        },
        additionalArchive: {
          path: "/hr/documents/additional/archive",
          component: withProtectedRoute(<HrAdditionalArchive />),
        },
        additionalMyRequests: {
          path: "/hr/documents/additional/my-requests",
          component: withProtectedRoute(<UserHrAdditionalDocuments />),
        },
      },
    },
  },
}

const legalRoutes = {
  path: "/legal",
  children: {
    contracts: {
      path: "/legal/contracts",
      children: {
        new: {
          path: "/legal/contracts/new",
          component: withProtectedRoute(<AgreementRequest />),
        },
        purchase: {
          path: "/legal/contracts/purchase",
          children: {
            approve: {
              path: "/legal/contracts/purchase/approve",
              component: withProtectedRoute(
                <StandardAgreementApprove />,
                "role:admin|role:department_head"
              ),
            },
            archive: {
              path: "/legal/contracts/purchase/archive",
              component: withProtectedRoute(
                <StandardAgreementArchive />,
                "role:admin|role:department_head|role:department_head_assistant"
              ),
            },
            myRequests: {
              path: "/legal/contracts/purchase/my-requests",
              component: withProtectedRoute(<StandardAgreementUser />),
            },
          },
        },
        delivery: {
          path: "/legal/contracts/delivery",
          children: {
            approve: {
              path: "/legal/contracts/delivery/approve",
              component: withProtectedRoute(
                <DeliveryAgreementApprove />,
                "role:admin|role:department_head"
              ),
            },
            archive: {
              path: "/legal/contracts/delivery/archive",
              component: withProtectedRoute(
                <DeliveryAgreementArchive />,
                "role:admin|role:department_head|role:department_head_assistant"
              ),
            },
            myRequests: {
              path: "/legal/contracts/delivery/my-requests",
              component: withProtectedRoute(<DeliveryAgreementUser />),
            },
          },
        },
        marketing: {
          path: "/legal/contracts/marketing",
          children: {
            approve: {
              path: "/legal/contracts/marketing/approve",
              component: withProtectedRoute(
                <MarketingAgreementApprove />,
                "role:admin|role:department_head"
              ),
            },
            archive: {
              path: "/legal/contracts/marketing/archive",
              component: withProtectedRoute(
                <MarketingAgreementArchive />,
                "role:admin|role:department_head|role:department_head_assistant"
              ),
            },
            myRequests: {
              path: "/legal/contracts/marketing/my-requests",
              component: withProtectedRoute(<MarketingAgreementUser />),
            },
          },
        },
        service: {
          path: "/legal/contracts/service",
          children: {
            approve: {
              path: "/legal/contracts/service/approve",
              component: withProtectedRoute(
                <ServiceAgreementApprove />,
                "role:admin|role:department_head"
              ),
            },
            archive: {
              path: "/legal/contracts/service/archive",
              component: withProtectedRoute(
                <ServiceAgreementArchive />,
                "role:admin|role:department_head|role:department_head_assistant"
              ),
            },
            myRequests: {
              path: "/legal/contracts/service/my-requests",
              component: withProtectedRoute(<ServiceAgreementUser />),
            },
          },
        },
        local: {
          path: "/legal/contracts/local",
          children: {
            approve: {
              path: "/legal/contracts/local/approve",
              component: withProtectedRoute(
                <LocalAgreementApprove />,
                "role:admin|role:department_head"
              ),
            },
            archive: {
              path: "/legal/contracts/local/archive",
              component: withProtectedRoute(
                <LocalAgreementArchive />,
                "role:admin|role:department_head|role:department_head_assistant"
              ),
            },
            myRequests: {
              path: "/legal/contracts/local/my-requests",
              component: withProtectedRoute(<LocalAgreementUser />),
            },
          },
        },
      },
    },
  },
}

const supportRoutes = {
  path: "/support",
  children: {
    itTasks: {
      path: "/support/it-tasks",
      component: withProtectedRoute(<TaskList />),
    },
    itTaskDetails: {
      path: "/support/it-tasks/:id",
      component: withProtectedRoute(<JobDetails />),
    },
    itTaskCharts: {
      path: "/support/it-tasks/charts",
      component: withProtectedRoute(
        <TaskCharts />,
        "role:admin|role:department_head,department:5"
      ),
    },
    farmTasks: {
      path: "/support/farm-tasks",
      component: withProtectedRoute(<FarmTaskList />),
    },
    farmTaskDetails: {
      path: "/support/farm-tasks/:id",
      component: withProtectedRoute(<FarmTaskDetails />),
    },
    legalTasks: {
      path: "/support/legal-tasks",
      component: withProtectedRoute(<LegalTaskList />),
    },
    legalTaskDetails: {
      path: "/support/legal-tasks/:id",
      component: withProtectedRoute(<LegalTaskDetails />),
    },
  },
}

const communicationRoutes = {
  path: "/communication",
  children: {
    chat: {
      path: "/communication/chat",
      component: withProtectedRoute(<ChatRoom />),
    },
    comments: {
      path: "/communication/comments/:id",
      component: withProtectedRoute(<MakeComment />),
    },
  },
}

const leadsRoutes = {
  path: "/leads",
  children: {
    vip: {
      path: "/leads/vip",
      component: withProtectedRoute(<VipLeadsPage />),
    },
    vipDetails: {
      path: "/leads/vip/:id",
      component: withProtectedRoute(<VipLeadDetailPage />),
    },
    corporate: {
      path: "/leads/corporate",
      component: withProtectedRoute(<LeadsPage />),
    },
  },
}

const toolsRoutes = {
  path: "/tools",
  children: {
    calendar: {
      path: "/tools/calendar",
      component: withProtectedRoute(<Calendar />),
    },
    notes: {
      path: "/tools/notes",
      component: withProtectedRoute(<NotesPage />),
    },
    createNote: {
      path: "/tools/notes/create",
      component: withProtectedRoute(<CreateNote />),
    },
    editNote: {
      path: "/tools/notes/edit/:id",
      component: withProtectedRoute(<EditNote />),
    },
    dailyResults: {
      path: "/tools/daily-results",
      component: withProtectedRoute(
        <Dailies />,
        "role:admin|role:department_head"
      ),
    },
    dailyResultDetails: {
      path: "/tools/daily-results/:id",
      component: withProtectedRoute(
        <Daily />,
        "role:admin|role:department_head"
      ),
    },
    innerDailyResults: {
      path: "/tools/inner-daily-results",
      component: withProtectedRoute(<DailiesInner />),
    },
    innerDailyResultDetails: {
      path: "/tools/inner-daily-results/:id",
      component: withProtectedRoute(<DailyInner />),
    },
    peopleCounting: {
      path: "/tools/people-counting",
      component: withProtectedRoute(
        <PeopleCounting />,
        "role:admin|department:36|department:21|department:30"
      ),
    },
  },
}

const flattenRoutes = routeObj => {
  const routes = []

  const addRoute = route => {
    const { children, ...routeData } = route
    if (routeData.path && routeData.component) {
      routes.push(routeData)
    }
    if (children) {
      Object.values(children).forEach(child => {
        if (typeof child === "object") {
          addRoute(child)
        }
      })
    }
  }

  addRoute(routeObj)
  return routes
}

const authProtectedRoutes = [
  {
    path: "/",
    exact: true,
    component: <Navigate to="/dashboard" />,
  },
  ...flattenRoutes(dashboardRoutes),
  ...flattenRoutes(profileRoutes),
  ...flattenRoutes(adminRoutes),
  ...flattenRoutes(applicationsRoutes),
  ...flattenRoutes(hrRoutes),
  ...flattenRoutes(legalRoutes),
  ...flattenRoutes(supportRoutes),
  ...flattenRoutes(communicationRoutes),
  ...flattenRoutes(leadsRoutes),
  ...flattenRoutes(toolsRoutes),
  { path: "/vacancy-requests", component: withProtectedRoute(<VacancyRequests />, "role:admin|role:hr") },
  { path: "/vacancy-requests/create", component: withProtectedRoute(<VacancyRequestForm />, "role:admin|role:hr") },
  { path: "/vacancy-requests/my-requests", component: withProtectedRoute(<MyVacancyRequests />, "role:admin|role:hr") },
  { path: "/vacancy-requests/:id", component: withProtectedRoute(<VacancyRequestDetails />, "role:admin|role:hr") },
  { path: "/vacancy-requests/:id/edit", component: withProtectedRoute(<VacancyRequestForm />, "role:admin|role:hr") },
]

const publicRoutes = [
  { path: "/auth/login", component: <Login /> },
  { path: "/auth/logout", component: <Logout /> },
  { path: "/auth/register", component: <Register /> },
]

export { authProtectedRoutes, publicRoutes }
