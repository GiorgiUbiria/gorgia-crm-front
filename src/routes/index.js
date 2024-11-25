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

const authProtectedRoutes = [
  {
    path: "/",
    exact: true,
    component: <Navigate to="/dashboard" />,
  },
  { path: "/admin", component: <AdminPage /> },
  { path: "/archive", component: <ArchivePage /> },
  { path: "/business", component: <BusinessPage /> },
  { path: "/business/manage", component: <TripPageApprove /> },
  { path: "/calendar", component: <Calendar /> },
  { path: "/chat", component: <Chat /> },
  { path: "/corporate-leads", component: <LeadsPage /> },
  { path: "/dashboard", component: <Dashboard /> },
  { path: "/head", component: <HeadPage /> },
  { path: "/hr", component: <HrPage /> },
  { path: "/hr-approve", component: <HrPageApprove /> },
  { path: "/it-tasks", component: <TaskList /> },
  { path: "/it-tasks/:id", component: <JobDetails /> },
  { path: "/lawyer", component: <LawyerPage /> },
  { path: "/lawyer-approve", component: <LawyerPageApprove /> },
  { path: "/lawyer-history", component: <LawyerPageArchive /> },
  { path: "/notes", component: <NotesPage /> },
  { path: "/notes-editor/:id?", component: <NotesEditor /> },
  { path: "/payment-monitoring", component: <InvoicePage /> },
  { path: "/procurement", component: <ProcurementPage /> },
  { path: "/procurement/manage", component: <PurchasePageApprove /> },
  { path: "/profile", component: <ProfilePage /> },
  { path: "/user-agreements", component: <UserAgreements /> },
  { path: "/user-business", component: <UserTrip /> },
  { path: "/user-procurements", component: <UserProcurement /> },
  { path: "/user-vocations", component: <UserVocation /> },
  { path: "/vacation", component: <VacationPage /> },
  { path: "/vacation/manage", component: <VacationPageApprove /> },
  { path: "/visitors", component: <VisitorsTraffic /> },
  { path: "/vip-leads", component: <VipLeadsPage /> },
  { path: "/vip-leads/:id", component: <VipLeadDetailPage /> },
]

const publicRoutes = [
  { path: "/login", component: <Login /> },
  { path: "/logout", component: <Logout /> },
  { path: "/forgot-password", component: <ForgetPwd /> },
  { path: "/register", component: <Register /> },
]

export { authProtectedRoutes, publicRoutes }
