import React, { useEffect } from "react";
import PropTypes from "prop-types";
import withRouter from "components/Common/withRouter";
import { logoutUser as logUser } from "../../store/actions";
import { logoutUser } from "services/auth";
//redux
import { useDispatch } from "react-redux";
import { clearUser } from "store/user/actions";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const Logout = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  useEffect(() => {
    // dispatch(logoutUser(history));
    const handleLogout = async () => {
      try {
        const res = await logoutUser();
        if(res.status == 20)
        toast.success(res.data.message);
        sessionStorage.removeItem('token')
        sessionStorage.removeItem('authUser')
        navigate('/login');
      } catch(err) {
        console.error(err);
      }
    }

    handleLogout()
  }, []);

  return <></>;
};

Logout.propTypes = {
  history: PropTypes.object,
};

export default withRouter(Logout);