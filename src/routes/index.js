import React from "react"
import { Navigate } from "react-router-dom"
import AccessRoute from "./AccessRoute"

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
import JobDetails from "pages/JobPages/JobDetails"
import FarmTaskDetails from "pages/FarmJobPages/JobDetails"
import FarmTaskList from "pages/FarmJobPages/JobList"
// Request Agreement
import AgreementRequest from "pages/Agreements/AgreementRequest"

// Standard Agreements
import StandardAgreementApprove from "pages/Agreements/Standard/StandardAgreementApprove"
import StandardAgreementArchive from "pages/Agreements/Standard/StandardAgreementArchive"
import StandardAgreementUser from "pages/Agreements/Standard/StandardAgreementUser"

// Delivery Agreements
import DeliveryAgreementArchive from "pages/Agreements/Delivery/DeliveryAgreementArchive"
import DeliveryAgreementUser from "pages/Agreements/Delivery/DeliveryAgreementUser"
import DeliveryAgreementApprove from "pages/Agreements/Delivery/DeliveryAgreementApprove"

// Marketing Agreements
import MarketingAgreementApprove from "pages/Agreements/Marketing/MarketingAgreementApprove"
import MarketingAgreementArchive from "pages/Agreements/Marketing/MarketingAgreementArchive"
import MarketingAgreementUser from "pages/Agreements/Marketing/MarketingAgreementUser"

// Service Agreements
import ServiceAgreementApprove from "pages/Agreements/Service/ServiceAgreementApprove"
import ServiceAgreementArchive from "pages/Agreements/Service/ServiceAgreementArchive"
import ServiceAgreementUser from "pages/Agreements/Service/ServiceAgreementUser"

// Local Agreements
import LocalAgreementApprove from "pages/Agreements/Local/LocalAgreementApprove"
import LocalAgreementArchive from "pages/Agreements/Local/LocalAgreementArchive"
import LocalAgreementUser from "pages/Agreements/Local/LocalAgreementUser"

import LeadsPage from "pages/LeadsPage/LeadsPage"
import NotesPage from "pages/NotesPage"
import ProfilePage from "pages/ProfilePage"
import VipLeadDetailPage from "pages/VipLeadsPage/VipLeadDetailPage"
import VipLeadsPage from "pages/VipLeadsPage/VipLeadsPage"
import VisitorsTraffic from "pages/VisitorsTraffic/VisitorsTraffic"
import ArchivePage from "../pages/ArchivePage"
import ForgetPwd from "../pages/Authentication/ForgetPassword"
import Login from "../pages/Authentication/Login"
import Logout from "../pages/Authentication/Logout"
import Register from "../pages/Authentication/Register"
import Calendar from "../pages/Calendar/index"
import Dashboard from "../pages/Dashboard/index"
import TaskList from "../pages/JobPages/JobList"
import VacationPageArchive from "pages/Applications/Vacation/VacationPageArchive"
import TripPageArchive from "pages/Applications/BusinessTrip/TripPageArchive"
import HrPageArchive from "pages/HrDocuments/HrPageArchive"
import CreateNote from "pages/NotesEditor/CreateNote"
import EditNote from "pages/NotesEditor/EditNote"
import ChatBox from "pages/Chat/ChatBox"

const withAccessRoute = (component, conditions = "") => (
  <AccessRoute conditions={conditions}>{component}</AccessRoute>
)

const dashboardRoutes = {
  path: "/dashboard",
  component: <Dashboard />,
}

const profileRoutes = {
  path: "/profile",
  component: <ProfilePage />,
}

const adminRoutes = {
  path: "/admin",
  children: {
    dashboard: {
      path: "/admin/dashboard",
      component: withAccessRoute(
        <AdminPage />,
        "role:admin|role:department_head|role:hr_member"
      ),
    },
    approvals: {
      path: "/admin/approvals",
      component: withAccessRoute(<HeadPage />, "role:admin"),
    },
    archive: {
      path: "/admin/archive",
      component: withAccessRoute(<ArchivePage />, "role:admin"),
    },
    visitors: {
      path: "/admin/visitors",
      component: withAccessRoute(
        <VisitorsTraffic />,
        "role:admin|role:department_head|role:hr_member"
      ),
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
          component: <ProcurementPage />,
        },
        approve: {
          path: "/applications/purchases/approve",
          component: <PurchasePageApprove />,
        },
        archive: {
          path: "/applications/purchases/archive",
          component: <ProcurementPageArchive />,
        },
        myRequests: {
          path: "/applications/purchases/my-requests",
          component: <UserProcurement />,
        },
      },
    },
    vacation: {
      path: "/applications/vacation",
      children: {
        new: {
          path: "/applications/vacation/new",
          component: <VacationPage />,
        },
        approve: {
          path: "/applications/vacation/approve",
          component: <VacationPageApprove />,
        },
        archive: {
          path: "/applications/vacation/archive",
          component: <VacationPageArchive />,
        },
        myRequests: {
          path: "/applications/vacation/my-requests",
          component: <UserVocation />,
        },
      },
    },
    businessTrip: {
      path: "/applications/business-trip",
      children: {
        new: {
          path: "/applications/business-trip/new",
          component: <BusinessPage />,
        },
        approve: {
          path: "/applications/business-trip/approve",
          component: <TripPageApprove />,
        },
        archive: {
          path: "/applications/business-trip/archive",
          component: <TripPageArchive />,
        },
        myRequests: {
          path: "/applications/business-trip/my-requests",
          component: <UserTrip />,
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
          component: <HrPage />,
        },
        approve: {
          path: "/hr/documents/approve",
          component: withAccessRoute(
            <HrPageApprove />,
            "role:admin|role:department_head,department:8|role:department_head_assistant,department:8"
          ),
        },
        archive: {
          path: "/hr/documents/archive",
          component: withAccessRoute(
            <HrPageArchive />,
            "role:admin|department:8"
          ),
        },
        myRequests: {
          path: "/hr/documents/my-requests",
          component: <UserHrDocuments />,
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
          component: <AgreementRequest />,
        },
        purchase: {
          path: "/legal/contracts/purchase",
          children: {
            approve: {
              path: "/legal/contracts/purchase/approve",
              component: <StandardAgreementApprove />,
            },
            archive: {
              path: "/legal/contracts/purchase/archive",
              component: <StandardAgreementArchive />,
            },
            myRequests: {
              path: "/legal/contracts/purchase/my-requests",
              component: <StandardAgreementUser />,
            },
          },
        },
        delivery: {
          path: "/legal/contracts/delivery",
          children: {
            approve: {
              path: "/legal/contracts/delivery/approve",
              component: <DeliveryAgreementApprove />,
            },
            archive: {
              path: "/legal/contracts/delivery/archive",
              component: <DeliveryAgreementArchive />,
            },
            myRequests: {
              path: "/legal/contracts/delivery/my-requests",
              component: <DeliveryAgreementUser />,
            },
          },
        },
        marketing: {
          path: "/legal/contracts/marketing",
          children: {
            approve: {
              path: "/legal/contracts/marketing/approve",
              component: <MarketingAgreementApprove />,
            },
            archive: {
              path: "/legal/contracts/marketing/archive",
              component: <MarketingAgreementArchive />,
            },
            myRequests: {
              path: "/legal/contracts/marketing/my-requests",
              component: <MarketingAgreementUser />,
            },
          },
        },
        service: {
          path: "/legal/contracts/service",
          children: {
            approve: {
              path: "/legal/contracts/service/approve",
              component: <ServiceAgreementApprove />,
            },
            archive: {
              path: "/legal/contracts/service/archive",
              component: <ServiceAgreementArchive />,
            },
            myRequests: {
              path: "/legal/contracts/service/my-requests",
              component: <ServiceAgreementUser />,
            },
          },
        },
        local: {
          path: "/legal/contracts/local",
          children: {
            approve: {
              path: "/legal/contracts/local/approve",
              component: <LocalAgreementApprove />,
            },
            archive: {
              path: "/legal/contracts/local/archive",
              component: <LocalAgreementArchive />,
            },
            myRequests: {
              path: "/legal/contracts/local/my-requests",
              component: <LocalAgreementUser />,
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
      component: <TaskList />,
    },
    itTaskDetails: {
      path: "/support/it-tasks/:id",
      component: <JobDetails />,
    },
    farmTasks: {
      path: "/support/farm-tasks",
      component: <FarmTaskList />,
    },
    farmTaskDetails: {
      path: "/support/farm-tasks/:id",
      component: <FarmTaskDetails />,
    },
  },
}

const communicationRoutes = {
  path: "/communication",
  children: {
    chat: {
      path: "/communication/chat",
      component: <ChatBox />,
    },
    comments: {
      path: "/communication/comments/:id",
      component: <MakeComment />,
    },
  },
}

const leadsRoutes = {
  path: "/leads",
  children: {
    vip: {
      path: "/leads/vip",
      component: <VipLeadsPage />,
    },
    vipDetails: {
      path: "/leads/vip/:id",
      component: <VipLeadDetailPage />,
    },
    corporate: {
      path: "/leads/corporate",
      component: <LeadsPage />,
    },
  },
}

const toolsRoutes = {
  path: "/tools",
  children: {
    calendar: {
      path: "/tools/calendar",
      component: <Calendar />,
    },
    notes: {
      path: "/tools/notes",
      component: <NotesPage />,
    },
    createNote: {
      path: "/tools/notes/create",
      component: <CreateNote />,
    },
    editNote: {
      path: "/tools/notes/edit/:id",
      component: <EditNote />,
    },
    dailyResults: {
      path: "/tools/daily-results",
      component: <Dailies />,
    },
    dailyResultDetails: {
      path: "/tools/daily-results/:id",
      component: <Daily />,
    },
    innerDailyResults: {
      path: "/tools/inner-daily-results",
      component: <DailiesInner />,
    },
    innerDailyResultDetails: {
      path: "/tools/inner-daily-results/:id",
      component: <DailyInner />,
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
]

const publicRoutes = [
  { path: "/auth/login", component: <Login /> },
  { path: "/auth/logout", component: <Logout /> },
  { path: "/auth/forgot-password", component: <ForgetPwd /> },
  { path: "/auth/register", component: <Register /> },
]

export { authProtectedRoutes, publicRoutes }
