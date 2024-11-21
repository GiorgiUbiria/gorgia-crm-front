import { combineReducers } from "redux";

// Front
import Layout from "./layout/reducer";

// Authentication
import Login from "./auth/login/reducer";
import Account from "./auth/register/reducer";
import ForgetPassword from "./auth/forgetpwd/reducer";
import Profile from "./auth/profile/reducer";

//Calendar
import calendar from "./calendar/reducer";

//chat
import chat from "./chat/reducer";

//invoices
import invoices from "./invoices/reducer";

//Dashboard 
import Dashboard from "./dashboard/reducer";

import user from '../redux/user/reducer'
import users from "../redux/users/reducer";

const rootReducer = combineReducers({
  Layout,
  Login,
  Account,
  ForgetPassword,
  Profile,
  calendar,
  chat,
  invoices,
  Dashboard,
  user,
  users
});

export default rootReducer;