import PropTypes from "prop-types";
import React from "react";
import { connect } from "react-redux";
import withRouter from "components/Common/withRouter";

import { withTranslation } from "react-i18next";
import SidebarContent from "./SidebarContent";

import { Link } from "react-router-dom";

import logoLightPng from "../../assets/images/logo-light.png";
import logoDark from "../../assets/images/logo-dark.png";

const Sidebar = props => {
  return (
    <React.Fragment>
      <div className="vertical-menu">
        <div className="navbar-brand-box">
          <Link to="/" className="logo logo-dark">
            <span className="logo-sm">
              <img src={logoDark} alt="" height="22" />
            </span>
          </Link>
          <Link to="/" className="logo logo-light">
            <span className="logo-lg">
              <img src={logoLightPng} alt="" height="50px" />
            </span>
          </Link>
        </div>
        <div data-simplebar>
          <SidebarContent />
        </div>
        <div className="sidebar-background"></div>
      </div>
    </React.Fragment>
  );
};

Sidebar.propTypes = {
  type: PropTypes.string,
};

const mapStatetoProps = state => {
  return {
    layout: state.Layout,
  };
};
export default connect(
  mapStatetoProps,
  {}
)(withRouter(withTranslation()(Sidebar)));
