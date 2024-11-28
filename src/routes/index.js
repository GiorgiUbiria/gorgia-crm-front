import React from "react"
import { Navigate } from "react-router-dom"
import Chat from "../pages/Chat/Chat"
import Calendar from "../pages/Calendar/index"
import Login from "../pages/Authentication/Login"
import Logout from "../pages/Authentication/Logout"
import Register from "../pages/Authentication/Register"
import ForgetPwd from "../pages/Authentication/ForgetPassword"
import Dashboard from "../pages/Dashboard/index"
import ProfilePage from "pages/ProfilePage"
import BusinessPage from "pages/BusinessPage"
import VacationPage from "pages/VacationPage"
import ProcurementPage from "pages/ProcurementPage"
import HeadPage from "pages/HeadPage"
import HrPage from "pages/HrPage"
import AdminPage from "pages/AdminPage"
import NotesPage from "pages/NotesPage"
import NotesEditor from "pages/NotesEditor"
import LawyerPage from "pages/LawyerPage"
import LawyerPageApprove from "pages/LawyerPageApprove"
import LawyerPageArchive from "pages/LawyerPageArchive/LawyerPageArchive"
import HrPageApprove from "pages/HrPageApprove"
import TaskList from "../pages/JobPages/JobList"
import VisitorsTraffic from "pages/VisitorsTraffic/VisitorsTraffic"
import ArchivePage from "pages/Archive"
import InvoicePage from "pages/InvoicePage/InvoicePage"
import LeadsPage from "pages/LeadsPage/LeadsPage"
import VipLeadsPage from "pages/VipLeadsPage/VipLeadsPage"
import VacationPageApprove from "pages/VacationPageApprove/VacationPageApprove"
import TripPageApprove from "pages/TripPageApprove/TripPageApprove"
import PurchasePageApprove from "pages/PurchasePageApprove/PurchasePageApprove"
import UserAgreements from "pages/UserAgreements"
import UserProcurement from "pages/UserProcurements"
import UserVocation from "pages/UserVocations"
import UserTrip from "pages/UserTrips"
import VipLeadDetailPage from "pages/VipLeadsPage/VipLeadDetailPage"
import JobDetails from "pages/JobPages/JobDetails"
import FarmWork from "pages/FarmWork"
import Dailies from "pages/Dailies"
import MakeComment from "pages/Comment/MakeComment"

const authProtectedRoutes = [
  // Dashboard & Main Routes
  {
    path: "/",
    exact: true,
    component: <Navigate to="/dashboard" />,
  },
  { path: "/dashboard", component: <Dashboard /> },
  { path: "/profile", component: <ProfilePage /> },

  // Admin Routes
  { path: "/admin/dashboard", component: <AdminPage /> },
  { path: "/admin/approvals", component: <HeadPage /> },
  { path: "/admin/visitors", component: <VisitorsTraffic /> },
  { path: "/admin/payment-monitoring", component: <InvoicePage /> },

  // Applications Routes
  // -- Internal Purchases
  { path: "/applications/purchases/new", component: <ProcurementPage /> },
  {
    path: "/applications/purchases/approve",
    component: <PurchasePageApprove />,
  },
  {
    path: "/applications/purchases/my-requests",
    component: <UserProcurement />,
  },

  // -- Vacation Requests
  { path: "/applications/vacation/new", component: <VacationPage /> },
  {
    path: "/applications/vacation/approve",
    component: <VacationPageApprove />,
  },
  { path: "/applications/vacation/my-requests", component: <UserVocation /> },

  // -- Business Trips
  { path: "/applications/business-trip/new", component: <BusinessPage /> },
  {
    path: "/applications/business-trip/approve",
    component: <TripPageApprove />,
  },
  { path: "/applications/business-trip/my-requests", component: <UserTrip /> },

  // HR Documents
  { path: "/hr/documents", component: <HrPage /> },
  { path: "/hr/documents/approve", component: <HrPageApprove /> },

  // Legal Documents
  { path: "/legal/contracts/new", component: <LawyerPage /> },
  { path: "/legal/contracts/approve", component: <LawyerPageApprove /> },
  { path: "/legal/contracts/archive", component: <LawyerPageArchive /> },
  { path: "/legal/contracts/my-requests", component: <UserAgreements /> },

  // Support & Tasks
  { path: "/support/it-tasks", component: <TaskList /> },
  { path: "/support/it-tasks/:id", component: <JobDetails /> },
  { path: "/support/maintenance", component: <FarmWork /> },

  // Communication
  { path: "/communication/chat", component: <Chat /> },
  { path: "/communication/comments/:id", component: <MakeComment /> },

  // Leads Management
  { path: "/leads/vip", component: <VipLeadsPage /> },
  { path: "/leads/vip/:id", component: <VipLeadDetailPage /> },
  { path: "/leads/corporate", component: <LeadsPage /> },

  // Tools & Utilities
  { path: "/tools/calendar", component: <Calendar /> },
  { path: "/tools/notes", component: <NotesPage /> },
  { path: "/tools/notes/:id", component: <NotesEditor /> },
  { path: "/tools/daily-results", component: <Dailies /> },

  // Archive
  { path: "/archive", component: <ArchivePage /> },
]

const publicRoutes = [
  { path: "/auth/login", component: <Login /> },
  { path: "/auth/logout", component: <Logout /> },
  { path: "/auth/forgot-password", component: <ForgetPwd /> },
  { path: "/auth/register", component: <Register /> },
]

export { authProtectedRoutes, publicRoutes }
