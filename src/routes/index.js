import React from "react"
import { Navigate } from "react-router-dom"

import AdminPage from "pages/AdminPage"
import ArchivePage from "../pages/ArchivePage"
import BusinessPage from "pages/Applications/BusinessTrip/BusinessPage"
import Calendar from "../pages/Calendar/index"
import Chat from "../pages/Chat/Chat"
import Dailies from "pages/Dailies"
import Dashboard from "../pages/Dashboard/index"
import FarmWork from "pages/FarmWork"
import ForgetPwd from "../pages/Authentication/ForgetPassword"
import HeadPage from "pages/HeadPage"
import HrPage from "pages/HrDocuments/HrPage"
import HrPageApprove from "pages/HrDocuments/HrPageApprove"
import HrPageSent from "pages/HrDocuments/HrPageSent"
import InvoicePage from "pages/InvoicePage/InvoicePage"
import JobDetails from "pages/JobPages/JobDetails"
import LawyerPage from "pages/LawyerPage"
import LawyerPageApprove from "pages/LawyerPageApprove"
import LawyerPageArchive from "pages/LawyerPageArchive/LawyerPageArchive"
import LeadsPage from "pages/LeadsPage/LeadsPage"
import Login from "../pages/Authentication/Login"
import Logout from "../pages/Authentication/Logout"
import MakeComment from "pages/Comment/MakeComment"
import NotesEditor from "pages/NotesEditor"
import NotesPage from "pages/NotesPage"
import ProcurementPage from "pages/Applications/InternalProcurement/ProcurementPage"
import ProfilePage from "pages/ProfilePage"
import PurchasePageApprove from "pages/Applications/InternalProcurement/PurchasePageApprove/PurchasePageApprove"
import Register from "../pages/Authentication/Register"
import TaskList from "../pages/JobPages/JobList"
import TripPageApprove from "pages/Applications/BusinessTrip/TripPageApprove/TripPageApprove"
import UserAgreements from "pages/UserAgreements"
import UserProcurement from "pages/Applications/InternalProcurement/UserProcurements"
import UserTrip from "pages/Applications/BusinessTrip/UserTrips"
import UserVocation from "pages/Applications/Vacation/UserVocations"
import VacationPage from "pages/Applications/Vacation/VacationPage"
import VacationPageApprove from "pages/Applications/Vacation/VacationPageApprove/VacationPageApprove"
import VipLeadDetailPage from "pages/VipLeadsPage/VipLeadDetailPage"
import VipLeadsPage from "pages/VipLeadsPage/VipLeadsPage"
import VisitorsTraffic from "pages/VisitorsTraffic/VisitorsTraffic"

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
  { 
    path: "/admin/dashboard", 
    component: <AdminPage />,
    permission: "admin.access"
  },
  { 
    path: "/admin/approvals", 
    component: <HeadPage />,
    permission: "admin.approvals"
  },
  { path: "/admin/visitors", component: <VisitorsTraffic /> },
  { path: "/admin/payment-monitoring", component: <InvoicePage /> },
  { path: "/admin/archive", component: <ArchivePage /> },

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
  { 
    path: "/hr/documents/new", 
    component: <HrPage /> 
  },
  { 
    path: "/hr/documents/approve", 
    component: <HrPageApprove />,
    permission: "hr-documents.manage",
    departmentId: 8
  },
  // { 
  //   path: "/hr/documents/archive", 
  //   component: <HrPageArchive />,
  //   permission: "hr-documents.view",
  //   departmentId: 8
  // },
  { 
    path: "/hr/documents/my-requests", 
    component: <HrPageSent /> 
  },

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
]

const publicRoutes = [
  { path: "/auth/login", component: <Login /> },
  { path: "/auth/logout", component: <Logout /> },
  { path: "/auth/forgot-password", component: <ForgetPwd /> },
  { path: "/auth/register", component: <Register /> },
]

export { authProtectedRoutes, publicRoutes }
