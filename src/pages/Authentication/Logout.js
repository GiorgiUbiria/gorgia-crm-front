import React, { useEffect } from "react";
import PropTypes from "prop-types";
import withRouter from "components/Common/withRouter";
import { logoutUser } from "services/auth";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const Logout = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const handleLogout = async () => {
      try {
        const res = await logoutUser();
        if(res.status == 20)
        toast.success(res.data.message);
        sessionStorage.removeItem('token')
        sessionStorage.removeItem('authUser')
        navigate('/auth/login');
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