import React from "react";

import { Navigate } from "react-router-dom";

// Pages Component

import Chat from "../pages/Chat/Chat";

// File Manager

import FileManager from "../pages/FileManager/index";



// Profile

import UserProfile from "../pages/Authentication/user-profile";



// Pages Calendar

import Calendar from "../pages/Calendar/index";



// //Tasks

import TasksList from "../pages/Tasks/tasks-list";

import TasksCreate from "../pages/Tasks/tasks-create";

import TasksKanban from "../pages/Tasks/tasks-kanban";



// //Projects

import ProjectsGrid from "../pages/Projects/projects-grid";

import ProjectsList from "../pages/Projects/projects-list";

import ProjectsOverview from "../pages/Projects/ProjectOverview/projects-overview";

import ProjectsCreate from "../pages/Projects/projects-create";



// //Ecommerce Pages

import EcommerceProducts from "../pages/Ecommerce/EcommerceProducts";

import EcommerceProductDetail from "../pages/Ecommerce/EcommerceDetails/index";

import EcommerceOrders from "../pages/Ecommerce/EcommerceOrders/index";

import EcommerceCustomers from "../pages/Ecommerce/EcommerceCustomers/index";

import EcommerceCart from "../pages/Ecommerce/EcommerceCart";

import EcommerceCheckout from "../pages/Ecommerce/EcommerceCheckout";

import EcommerceShops from "../pages/Ecommerce/EcommerceShops/index";

import EcommerceAddProduct from "../pages/Ecommerce/EcommerceAddProduct";



//Email

import EmailInbox from "../pages/Email/email-inbox";

import EmailRead from "../pages/Email/email-read";

import EmailBasicTemplte from "../pages/Email/email-basic-templte";

import EmailAlertTemplte from "../pages/Email/email-template-alert";

import EmailTemplateBilling from "../pages/Email/email-template-billing";



//Invoices

import InvoicesList from "../pages/Invoices/invoices-list";

import InvoiceDetail from "../pages/Invoices/invoices-detail";



// Authentication related pages

import Login from "../pages/Authentication/Login";

import Logout from "../pages/Authentication/Logout";

import Register from "../pages/Authentication/Register";

import ForgetPwd from "../pages/Authentication/ForgetPassword";



//  // Inner Authentication

import Login1 from "../pages/AuthenticationInner/Login";

import Login2 from "../pages/AuthenticationInner/Login2";

import Register1 from "../pages/AuthenticationInner/Register";

import Register2 from "../pages/AuthenticationInner/Register2";

import Recoverpw from "../pages/AuthenticationInner/Recoverpw";

import Recoverpw2 from "../pages/AuthenticationInner/Recoverpw2";

import ForgetPwd1 from "../pages/AuthenticationInner/ForgetPassword";

import ForgetPwd2 from "../pages/AuthenticationInner/ForgetPassword2";

import LockScreen from "../pages/AuthenticationInner/auth-lock-screen";

import LockScreen2 from "../pages/AuthenticationInner/auth-lock-screen-2";

import ConfirmMail from "../pages/AuthenticationInner/page-confirm-mail";

import ConfirmMail2 from "../pages/AuthenticationInner/page-confirm-mail-2";

import EmailVerification from "../pages/AuthenticationInner/auth-email-verification";

import EmailVerification2 from "../pages/AuthenticationInner/auth-email-verification-2";

import TwostepVerification from "../pages/AuthenticationInner/auth-two-step-verification";

import TwostepVerification2 from "../pages/AuthenticationInner/auth-two-step-verification-2";



// Dashboard

import Dashboard from "../pages/Dashboard/index";

import DashboardSaas from "../pages/Dashboard-saas/index";

import DashboardCrypto from "../pages/Dashboard-crypto/index";

import Blog from "../pages/Dashboard-Blog/index";

import DashboardJob from "../pages/DashboardJob/index";



//Crypto

import CryptoWallet from "../pages/Crypto/CryptoWallet/crypto-wallet";

import CryptoBuySell from "../pages/Crypto/crypto-buy-sell";

import CryptoExchange from "../pages/Crypto/crypto-exchange";

import CryptoLending from "../pages/Crypto/crypto-lending";

import CryptoOrders from "../pages/Crypto/CryptoOrders/crypto-orders";

import CryptoKYCApplication from "../pages/Crypto/crypto-kyc-application";

import CryptoIcoLanding from "../pages/Crypto/CryptoIcoLanding/index";



// Charts

import ChartApex from "../pages/Charts/Apexcharts";

import ChartjsChart from "../pages/Charts/ChartjsChart";

import EChart from "../pages/Charts/EChart";

import SparklineChart from "../pages/Charts/SparklineChart";

import ChartsKnob from "../pages/Charts/charts-knob";

import ReCharts from "../pages/Charts/ReCharts";



// Maps

import MapsGoogle from "../pages/Maps/MapsGoogle";



//Icons

import IconBoxicons from "../pages/Icons/IconBoxicons";

import IconDripicons from "../pages/Icons/IconDripicons";

import IconMaterialdesign from "../pages/Icons/IconMaterialdesign";

import IconFontawesome from "../pages/Icons/IconFontawesome";



//Tables

import BasicTables from "../pages/Tables/BasicTables";

import DatatableTables from "../pages/Tables/DatatableTables";



//Blog

import BlogList from "../pages/Blog/BlogList/index";

import BlogGrid from "../pages/Blog/BlogGrid/index";

import BlogDetails from "../pages/Blog/BlogDetails";



//Job

import JobGrid from "../pages/JobPages/JobGrid/index";

import JobDetails from "../pages/JobPages/JobDetails";

import JobCategories from "../pages/JobPages/JobCategories";

import JobList from "../pages/JobPages/JobList";

import ApplyJobs from "../pages/JobPages/ApplyJobs/index";

import CandidateList from "../pages/JobPages/CandidateList";

import CandidateOverview from "../pages/JobPages/CandidateOverview";



// Forms

import FormElements from "../pages/Forms/FormElements";

import FormLayouts from "../pages/Forms/FormLayouts";

import FormAdvanced from "../pages/Forms/FormAdvanced";

import FormEditors from "../pages/Forms/FormEditors";

import FormValidations from "../pages/Forms/FormValidations";

import FormMask from "../pages/Forms/FormMask";

import FormRepeater from "../pages/Forms/FormRepeater";

import FormUpload from "../pages/Forms/FormUpload";

import FormWizard from "../pages/Forms/FormWizard";



//Ui

import UiAlert from "../pages/Ui/UiAlert";

import UiButtons from "../pages/Ui/UiButtons";

import UiCards from "../pages/Ui/UiCards";

import UiCarousel from "../pages/Ui/UiCarousel";

import UiColors from "../pages/Ui/UiColors";

import UiDropdown from "../pages/Ui/UiDropdown";

import UiGeneral from "../pages/Ui/UiGeneral";

import UiGrid from "../pages/Ui/UiGrid";

import UiImages from "../pages/Ui/UiImages";

import UiLightbox from "../pages/Ui/UiLightbox";

import UiModal from "../pages/Ui/UiModal";

import UiProgressbar from "../pages/Ui/UiProgressbar";

import UiTabsAccordions from "../pages/Ui/UiTabsAccordions";

import UiTypography from "../pages/Ui/UiTypography";

import UiVideo from "../pages/Ui/UiVideo";

import UiSessionTimeout from "../pages/Ui/UiSessionTimeout";

import UiRating from "../pages/Ui/UiRating";

import UiRangeSlider from "../pages/Ui/UiRangeSlider";

import UiNotifications from "../pages/Ui/ui-notifications";

import UiOffCanvas from "pages/Ui/UiOffCanvas";

import UiUtilitie from "../pages/Ui/UiUtilitie";

import UiPlaceholders from "../pages/Ui/UiPlaceholders";

import UiToasts from "../pages/Ui/UiToast";



//Pages

import PagesStarter from "../pages/Utility/pages-starter";

import PagesMaintenance from "../pages/Utility/pages-maintenance";

import PagesComingsoon from "../pages/Utility/pages-comingsoon";

import PagesTimeline from "../pages/Utility/pages-timeline";

import PagesFaqs from "../pages/Utility/pages-faqs";

import PagesPricing from "../pages/Utility/pages-pricing";

import Pages404 from "../pages/Utility/pages-404";

import Pages500 from "../pages/Utility/pages-500";



//Contacts

import ContactsGrid from "../pages/Contacts/contacts-grid";

import ContactsList from "../pages/Contacts/ContactList/contacts-list";

import ContactsProfile from "../pages/Contacts/ContactsProfile/contacts-profile";

import MakeComment from "pages/Comment/MakeComment";

import ProfilePage from "pages/ProfilePage";

import BusinessPage from "pages/BusinessPage";

import VacationPage from "pages/VacationPage";

import ProcurementPage from "pages/ProcurementPage";

import HeadPage from "pages/HeadPage";

import HrPage from "pages/HrPage";

import AdminPage from "pages/AdminPage";

import NotesPage from "pages/NotesPage";

import NotesEditor from "pages/NotesEditor";

import LawyerPage from "pages/LawyerPage";

import LawyerPageApprove from "pages/LawyerPageApprove";

import LawyerPageArchive from "pages/LawyerPageArchive/LawyerPageArchive";

import LawyerPageDoc from "pages/LawyerPageDoc";

import HrPageApprove from "pages/HrPageApprove";

import ItHelpPage from "pages/ItHelpPage";

import TaskList from "../pages/JobPages/JobList";

import VisitorsTraffic from "pages/VisitorsTraffic/VisitorsTraffic";

import ArchivePage from "pages/Archive";

import InvoicePage from "pages/InvoicePage/InvoicePage";

import LeadsPage from "pages/LeadsPage/LeadsPage";

import VipLeadsPage from "pages/VipLeadsPage/VipLeadsPage";

import VacationPageApprove from "pages/VacationPageApprove/VacationPageApprove";

import TripPageApprove from "pages/TripPageApprove/TripPageApprove";

import PurchasePageApprove from "pages/PurchasePageApprove/PurchasePageApprove";

import UserAgreements from "pages/UserAgreements";

import UserProcurement from "pages/UserProcurements";

import UserVocation from "pages/UserVocations";

import UserTrip from "pages/UserTrips";

import VipLeadDetailPage from "pages/VipLeadsPage/VipLeadDetailPage";


const authProtectedRoutes = [

  { path: "/dashboard", component: <Dashboard /> },

  { path: "/dashboard-saas", component: <DashboardSaas /> },

  { path: "/dashboard-crypto", component: <DashboardCrypto /> },

  { path: "/blog", component: <Blog /> },

  { path: "/dashboard-job", component: <DashboardJob /> },



  //Crypto

  { path: "/crypto-wallet", component: <CryptoWallet /> },

  { path: "/crypto-buy-sell", component: <CryptoBuySell /> },

  { path: "/crypto-exchange", component: <CryptoExchange /> },

  { path: "/crypto-lending", component: <CryptoLending /> },

  { path: "/crypto-orders", component: <CryptoOrders /> },

  { path: "/crypto-kyc-application", component: <CryptoKYCApplication /> },



  //chat

  { path: "/chat", component: <Chat /> },



  //File Manager

  { path: "/apps-filemanager", component: <FileManager /> },



  // //calendar

  { path: "/calendar", component: <Calendar /> },





  //agreements

  { path: "/user-agreements", component: <UserAgreements/> },



  // //profile

  // { path: "/profile", component: <UserProfile /> },

  { path: "/profile", component: <ProfilePage /> },

  { path: "/business", component: <BusinessPage /> },

  { path: "/business/manage", component: <TripPageApprove/> },

  { path: "/user-business", component: <UserTrip/> },



  { path: "/vacation", component: <VacationPage /> },

  { path: "/vacation/manage", component: <VacationPageApprove /> },

  { path: "/user-vocations", component: <UserVocation /> },

  { path: "/procurement", component: <ProcurementPage /> },

  { path: "/procurement/manage", component: <PurchasePageApprove/> },

  { path: "/user-procurements", component: <UserProcurement/> },



  { path: "/head", component: <HeadPage /> },

  { path: "/archive", component: <ArchivePage /> },

  { path: "/it", component: <ItHelpPage /> },

  { path: "/hr", component: <HrPage /> },

  { path: "/hr-approve", component: <HrPageApprove /> },

  { path: "/lawyer", component: <LawyerPage /> },

  { path: "/lawyer-approve", component: <LawyerPageApprove /> },

  { path: "/lawyer-history", component: <LawyerPageArchive /> },

  { path: "/lawyer-doc", component: <LawyerPageDoc /> },

  { path: "/admin", component: <AdminPage /> },

  { path: "/notes", component: <NotesPage /> },

  { path: "/notes-editor/:id?", component: <NotesEditor /> },



  //Ecommerce

  {

    path: "/ecommerce-product-detail/:id",

    component: <EcommerceProductDetail />,

  },

  { path: "/ecommerce-products", component: <EcommerceProducts /> },

  { path: "/ecommerce-orders", component: <EcommerceOrders /> },

  { path: "/ecommerce-customers", component: <EcommerceCustomers /> },

  { path: "/ecommerce-cart", component: <EcommerceCart /> },

  { path: "/ecommerce-checkout", component: <EcommerceCheckout /> },

  { path: "/ecommerce-shops", component: <EcommerceShops /> },

  { path: "/ecommerce-add-product", component: <EcommerceAddProduct /> },



  //Email

  { path: "/email-inbox", component: <EmailInbox /> },

  { path: "/email-read/:id?", component: <EmailRead /> },

  { path: "/email-template-basic", component: <EmailBasicTemplte /> },

  { path: "/email-template-alert", component: <EmailAlertTemplte /> },

  { path: "/email-template-billing", component: <EmailTemplateBilling /> },



  //Invoices

  { path: "/invoices-list", component: <InvoicesList /> },

  { path: "/invoices-detail/:id", component: <InvoiceDetail /> },

  { path: "/invoices-detail", component: <InvoiceDetail /> },



  // Tasks

  { path: "/tasks-list", component: <TasksList /> },

  { path: "/tasks-create", component: <TasksCreate /> },

  { path: "/tasks-kanban", component: <TasksKanban /> },



  //Projects

  { path: "/projects-grid", component: <ProjectsGrid /> },

  { path: "/projects-list", component: <ProjectsList /> },

  { path: "/projects-overview", component: <ProjectsOverview /> },

  { path: "/projects-overview/:id", component: <ProjectsOverview /> },

  { path: "/projects-create", component: <ProjectsCreate /> },



  //Blog

  { path: "/blog-list", component: <BlogList /> },

  { path: "/blog-grid", component: <BlogGrid /> },

  { path: "/blog-details", component: <BlogDetails /> },



  //job

  { path: "/job-grid", component: <JobGrid /> },

  { path: "/it-tasks/:id", component: <JobDetails /> },

  { path: "/job-categories", component: <JobCategories /> },

  { path: "/it-tasks", component: <TaskList /> },

  { path: "/job-apply", component: <ApplyJobs /> },

  { path: "/candidate-list", component: <CandidateList /> },

  { path: "/candidate-overview", component: <CandidateOverview /> },



  // Contacts

  { path: "/contacts-grid", component: <ContactsGrid /> },

  { path: "/contacts-list", component: <ContactsList /> },

  { path: "/visitors", component: <VisitorsTraffic /> },

  { path: "/vip-leads", component: <VipLeadsPage /> },

  { path: "/vip-leads/:id", component: <VipLeadDetailPage /> },

  { path: "/corporate-leads", component: <LeadsPage /> },

  { path: "/payment-monitoring", component: <InvoicePage /> },

  { path: "/contacts-profile", component: <ContactsProfile /> },



  //Charts

  { path: "/apex-charts", component: <ChartApex /> },

  { path: "/chartjs-charts", component: <ChartjsChart /> },

  { path: "/e-charts", component: <EChart /> },

  { path: "/sparkline-charts", component: <SparklineChart /> },

  { path: "/charts-knob", component: <ChartsKnob /> },

  { path: "/re-charts", component: <ReCharts /> },



  // Icons

  { path: "/icons-boxicons", component: <IconBoxicons /> },

  { path: "/icons-dripicons", component: <IconDripicons /> },

  { path: "/icons-materialdesign", component: <IconMaterialdesign /> },

  { path: "/icons-fontawesome", component: <IconFontawesome /> },



  // Tables

  { path: "/tables-basic", component: <BasicTables /> },

  { path: "/tables-datatable", component: <DatatableTables /> },

  { path: "/comment/:id", component: <MakeComment /> },



  // Maps

  { path: "/maps-google", component: <MapsGoogle /> },



  // Forms

  { path: "/form-elements", component: <FormElements /> },

  { path: "/form-layouts", component: <FormLayouts /> },

  { path: "/form-advanced", component: <FormAdvanced /> },

  { path: "/form-editors", component: <FormEditors /> },

  { path: "/form-mask", component: <FormMask /> },

  { path: "/form-repeater", component: <FormRepeater /> },

  { path: "/form-uploads", component: <FormUpload /> },

  { path: "/form-wizard", component: <FormWizard /> },

  { path: "/form-validation", component: <FormValidations /> },



  // Ui

  { path: "/ui-alerts", component: <UiAlert /> },

  { path: "/ui-buttons", component: <UiButtons /> },

  { path: "/ui-cards", component: <UiCards /> },

  { path: "/ui-carousel", component: <UiCarousel /> },

  { path: "/ui-colors", component: <UiColors /> },

  { path: "/ui-dropdowns", component: <UiDropdown /> },

  { path: "/ui-general", component: <UiGeneral /> },

  { path: "/ui-grid", component: <UiGrid /> },

  { path: "/ui-images", component: <UiImages /> },

  { path: "/ui-lightbox", component: <UiLightbox /> },

  { path: "/ui-modals", component: <UiModal /> },

  { path: "/ui-progressbars", component: <UiProgressbar /> },

  { path: "/ui-tabs-accordions", component: <UiTabsAccordions /> },

  { path: "/ui-typography", component: <UiTypography /> },

  { path: "/ui-video", component: <UiVideo /> },

  { path: "/ui-session-timeout", component: <UiSessionTimeout /> },

  { path: "/ui-rating", component: <UiRating /> },

  { path: "/ui-rangeslider", component: <UiRangeSlider /> },

  { path: "/ui-notifications", component: <UiNotifications /> },

  { path: "/ui-offcanvas", component: <UiOffCanvas /> },

  { path: "/ui-utilities", component: <UiUtilitie /> },

  { path: "/ui-placeholders", component: <UiPlaceholders /> },

  { path: "/ui-toasts", component: <UiToasts /> },



  //Utility

  { path: "/pages-starter", component: <PagesStarter /> },

  { path: "/pages-timeline", component: <PagesTimeline /> },

  { path: "/pages-faqs", component: <PagesFaqs /> },

  { path: "/pages-pricing", component: <PagesPricing /> },



  // this route should be at the end of all other routes

  // eslint-disable-next-line react/display-name

  {

    path: "/",

    exact: true,

    component: <Navigate to="/dashboard" />,

  },

  { path: "/user-procurements", component: <UserProcurement /> },

]



const publicRoutes = [

  { path: "/login", component: <Login /> },

  { path: "/logout", component: <Logout /> },

  { path: "/forgot-password", component: <ForgetPwd /> },

  { path: "/register", component: <Register /> },



  { path: "/pages-maintenance", component: <PagesMaintenance /> },

  { path: "/pages-comingsoon", component: <PagesComingsoon /> },

  { path: "/pages-404", component: <Pages404 /> },

  { path: "/pages-500", component: <Pages500 /> },

  { path: "/crypto-ico-landing", component: <CryptoIcoLanding /> },



  // Authentication Inner

  { path: "/pages-login", component: <Login1 /> },

  { path: "/pages-login-2", component: <Login2 /> },

  { path: "/pages-register", component: <Register1 /> },

  { path: "/pages-register-2", component: <Register2 /> },

  { path: "/page-recoverpw", component: <Recoverpw /> },

  { path: "/page-recoverpw-2", component: <Recoverpw2 /> },

  { path: "/pages-forgot-pwd", component: <ForgetPwd1 /> },

  { path: "/auth-forgot-pwd-2", component: <ForgetPwd2 /> },

  { path: "/auth-lock-screen", component: <LockScreen /> },

  { path: "/auth-lock-screen-2", component: <LockScreen2 /> },

  { path: "/page-confirm-mail", component: <ConfirmMail /> },

  { path: "/page-confirm-mail-2", component: <ConfirmMail2 /> },

  { path: "/auth-email-verification", component: <EmailVerification /> },

  { path: "/auth-email-verification-2", component: <EmailVerification2 /> },

  { path: "/auth-two-step-verification", component: <TwostepVerification /> },

  { path: "/auth-two-step-verification-2", component: <TwostepVerification2 /> },

];



export { authProtectedRoutes, publicRoutes };


