import React, { useEffect } from "react";
import PropTypes from "prop-types";
import withRouter from "components/Common/withRouter";
import { logoutUser } from "services/auth";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import useAuth from "hooks/useAuth";

const Logout = () => {
  const navigate = useNavigate();
  const { clearUser } = useAuth();

  useEffect(() => {
    const handleLogout = async () => {
      try {
        const res = await logoutUser();
        
        // First clear the auth store
        clearUser();
        
        // Then clear session storage
        sessionStorage.removeItem("token");
        sessionStorage.removeItem("authUser");
        
        if (res?.status === 200) {
          toast.success(res.data.message);
        }
        
        // Finally navigate to login
        navigate("/auth/login", { replace: true });
      } catch (err) {
        console.error(err);
        // Even if the API call fails, we should still clear local state and redirect
        navigate("/auth/login", { replace: true });
      }
    };

    handleLogout();
  }, [navigate, clearUser]);

  return <></>;
};

Logout.propTypes = {
  history: PropTypes.object,
};

export default withRouter(Logout);