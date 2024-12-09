import React from "react"
import { Navigate } from "react-router-dom"

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
import Dailies from "pages/Dailies"
import Daily from "pages/Daily"
import FarmWork from "pages/FarmWork"
import HeadPage from "pages/HeadPage"
import HrPage from "pages/HrDocuments/HrPage"
import HrPageApprove from "pages/HrDocuments/HrPageApprove"
import UserHrDocuments from "pages/HrDocuments/UserHrDocuments"
import InvoicePage from "pages/InvoicePage/InvoicePage"
import JobDetails from "pages/JobPages/JobDetails"
import LawyerPage from "pages/LawyerPage"
import LawyerPageApprove from "pages/LawyerPageApprove"
import LawyerPageArchive from "pages/LawyerPageArchive/LawyerPageArchive"
import LeadsPage from "pages/LeadsPage/LeadsPage"
import NotesEditor from "pages/NotesEditor"
import NotesPage from "pages/NotesPage"
import ProfilePage from "pages/ProfilePage"
import UserAgreements from "pages/UserAgreements"
import VipLeadDetailPage from "pages/VipLeadsPage/VipLeadDetailPage"
import VipLeadsPage from "pages/VipLeadsPage/VipLeadsPage"
import VisitorsTraffic from "pages/VisitorsTraffic/VisitorsTraffic"
import ArchivePage from "../pages/ArchivePage"
import ForgetPwd from "../pages/Authentication/ForgetPassword"
import Login from "../pages/Authentication/Login"
import Logout from "../pages/Authentication/Logout"
import Register from "../pages/Authentication/Register"
import Calendar from "../pages/Calendar/index"
import Chat from "../pages/Chat/Chat"
import Dashboard from "../pages/Dashboard/index"
import TaskList from "../pages/JobPages/JobList"
import FarmTaskDetails from "../pages/FarmDetails"
import VacationPageArchive from "pages/Applications/Vacation/VacationPageArchive"
import TripPageArchive from "pages/Applications/BusinessTrip/TripPageArchive"
import HrPageArchive from "pages/HrDocuments/HrPageArchive"
import DeliveryAgreementArchive from "pages/DeliveryAgreementArchive"
import DeliveryAgreementUser from "pages/DeliveryAgreementUser"
import DeliveryAgreementApprove from "pages/DeliveryAgreementApprove"
import MarketingAgreementApprove from "pages/MarketingAgreementApprove"
import MarketingAgreementArchive from "pages/MarketingAgreementArchive"
import MarketingAgreementUser from "pages/MarketingAgreementUser"
import ServiceAgreementApprove from "pages/ServiceAgreementApprove"
import ServiceAgreementArchive from "pages/ServiceAgreementArchive"
import ServiceAgreementUser from "pages/ServiceAgreementUser"
import LocalAgreementApprove from "pages/LocalAgreementApprove"
import LocalAgreementArchive from "pages/LocalAgreementArchive"
import LocalAgreementUser from "pages/LocalAgreementUser"

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
    permission: "admin.access",
  },
  {
    path: "/admin/approvals",
    component: <HeadPage />,
    permission: "admin.approvals",
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
    path: "/applications/purchases/archive",
    component: <ProcurementPageArchive />,
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
  {
    path: "/applications/vacation/archive",
    component: <VacationPageArchive />,
  },
  { path: "/applications/vacation/my-requests", component: <UserVocation /> },

  // -- Business Trips
  { path: "/applications/business-trip/new", component: <BusinessPage /> },
  {
    path: "/applications/business-trip/approve",
    component: <TripPageApprove />,
  },
  {
    path: "/applications/business-trip/archive",
    component: <TripPageArchive />,
  },
  { path: "/applications/business-trip/my-requests", component: <UserTrip /> },

  // HR Documents
  {
    path: "/hr/documents/new",
    component: <HrPage />,
  },
  {
    path: "/hr/documents/approve",
    component: <HrPageApprove />,
    permission: "hr-documents.manage",
    departmentId: 8,
  },
  {
    path: "/hr/documents/archive",
    component: <HrPageArchive />,
    permission: "hr-documents.view",
    departmentId: 8,
  },
  {
    path: "/hr/documents/my-requests",
    component: <UserHrDocuments />,
  },

  // Legal Documents
  { path: "/legal/contracts/new", component: <LawyerPage /> },

  {
    path: "/legal/contracts/purchase/approve",
    component: <LawyerPageApprove />,
  },
  {
    path: "/legal/contracts/purchase/archive",
    component: <LawyerPageArchive />,
  },
  {
    path: "/legal/contracts/purchase/my-requests",
    component: <UserAgreements />,
  },

  {
    path: "/legal/contracts/delivery/approve",
    component: <DeliveryAgreementApprove />,
  },
  {
    path: "/legal/contracts/delivery/archive",
    component: <DeliveryAgreementArchive />,
  },
  {
    path: "/legal/contracts/delivery/my-requests",
    component: <DeliveryAgreementUser />,
  },

  {
    path: "/legal/contracts/marketing/approve",
    component: <MarketingAgreementApprove />,
  },
  {
    path: "/legal/contracts/marketing/archive",
    component: <MarketingAgreementArchive />,
  },
  {
    path: "/legal/contracts/marketing/my-requests",
    component: <MarketingAgreementUser />,
  },
  {
    path: "/legal/contracts/service/approve",
    component: <ServiceAgreementApprove />,
  },
  {
    path: "/legal/contracts/service/archive",
    component: <ServiceAgreementArchive />,
  },
  {
    path: "/legal/contracts/service/my-requests",
    component: <ServiceAgreementUser />,
  },

  {
    path: "/legal/contracts/local/approve",
    component: <LocalAgreementApprove />,
  },
  {
    path: "/legal/contracts/local/archive",
    component: <LocalAgreementArchive />,
  },
  {
    path: "/legal/contracts/local/my-requests",
    component: <LocalAgreementUser />,
  },

  // Support & Tasks
  { path: "/support/it-tasks", component: <TaskList /> },
  { path: "/support/it-tasks/:id", component: <JobDetails /> },
  { path: "/support/farm-tasks", component: <FarmWork /> },
  { path: "/support/farm-tasks/:id", component: <FarmTaskDetails /> },

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
  { path: "/tools/daily-results/:id", component: <Daily /> },
]

const publicRoutes = [
  { path: "/auth/login", component: <Login /> },
  { path: "/auth/logout", component: <Logout /> },
  { path: "/auth/forgot-password", component: <ForgetPwd /> },
  { path: "/auth/register", component: <Register /> },
]

export { authProtectedRoutes, publicRoutes }
