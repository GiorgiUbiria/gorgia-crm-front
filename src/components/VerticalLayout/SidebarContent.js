import React, { useEffect, useRef, useCallback } from "react";
import { useLocation } from "react-router-dom";
import PropTypes from "prop-types";


// //Import Scrollbar
import SimpleBar from "simplebar-react";

// MetisMenu
import MetisMenu from "metismenujs";
import withRouter from "components/Common/withRouter";
import { Link } from "react-router-dom";

//i18n
import { withTranslation } from "react-i18next";

const SidebarContent = props => {
  const ref = useRef();
  const activateParentDropdown = useCallback((item) => {
    item.classList.add("active");
    const parent = item.parentElement;
    const parent2El = parent.childNodes[1];

    if (parent2El && parent2El.id !== "side-menu") {
      parent2El.classList.add("mm-show");
    }

    if (parent) {
      parent.classList.add("mm-active");
      const parent2 = parent.parentElement;

      if (parent2) {
        parent2.classList.add("mm-show"); // ul tag

        const parent3 = parent2.parentElement; // li tag

        if (parent3) {
          parent3.classList.add("mm-active"); // li
          parent3.childNodes[0].classList.add("mm-active"); //a
          const parent4 = parent3.parentElement; // ul
          if (parent4) {
            parent4.classList.add("mm-show"); // ul
            const parent5 = parent4.parentElement;
            if (parent5) {
              parent5.classList.add("mm-show"); // li
              parent5.childNodes[0].classList.add("mm-active"); // a tag
            }
          }
        }
      }
      scrollElement(item);
      return false;
    }
    scrollElement(item);
    return false;
  }, []);

  const removeActivation = (items) => {
    for (var i = 0; i < items.length; ++i) {
      var item = items[i];
      const parent = items[i].parentElement;

      if (item && item.classList.contains("active")) {
        item.classList.remove("active");
      }
      if (parent) {
        const parent2El =
          parent.childNodes && parent.childNodes.lenght && parent.childNodes[1]
            ? parent.childNodes[1]
            : null;
        if (parent2El && parent2El.id !== "side-menu") {
          parent2El.classList.remove("mm-show");
        }

        parent.classList.remove("mm-active");
        const parent2 = parent.parentElement;

        if (parent2) {
          parent2.classList.remove("mm-show");

          const parent3 = parent2.parentElement;
          if (parent3) {
            parent3.classList.remove("mm-active"); // li
            parent3.childNodes[0].classList.remove("mm-active");

            const parent4 = parent3.parentElement; // ul
            if (parent4) {
              parent4.classList.remove("mm-show"); // ul
              const parent5 = parent4.parentElement;
              if (parent5) {
                parent5.classList.remove("mm-show"); // li
                parent5.childNodes[0].classList.remove("mm-active"); // a tag
              }
            }
          }
        }
      }
    }
  };

  const path = useLocation();
  const activeMenu = useCallback(() => {
    const pathName = path.pathname;
    let matchingMenuItem = null;
    const ul = document.getElementById("side-menu");
    const items = ul.getElementsByTagName("a");
    removeActivation(items);

    for (let i = 0; i < items.length; ++i) {
      if (pathName === items[i].pathname) {
        matchingMenuItem = items[i];
        break;
      }
    }
    if (matchingMenuItem) {
      activateParentDropdown(matchingMenuItem);
    }
  }, [path.pathname, activateParentDropdown]);

  useEffect(() => {
    ref.current.recalculate();
  }, []);

  useEffect(() => {
    new MetisMenu("#side-menu");
    activeMenu();
  }, []);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    activeMenu();
  }, [activeMenu]);

  function scrollElement(item) {
    if (item) {
      const currentPosition = item.offsetTop;
      if (currentPosition > window.innerHeight) {
        ref.current.getScrollElement().scrollTop = currentPosition - 300;
      }
    }
  }

  return (
    <React.Fragment>
      <SimpleBar className="h-100" ref={ref}>
        <div id="sidebar-menu">
          <ul className="metismenu list-unstyled" id="side-menu">
            <li>
              <Link to="/#">
                <i className="bx bx-home-circle"></i>
                <span>{props.t("მთავარი გვერდი")}</span>
              </Link>
            </li>
            <li>
              <Link to="/tables-datatable">
                <i className="bx bxs-report"></i>
                <span className="badge rounded-pill bg-danger float-end">
                  10
                </span>
                <span>{props.t("დღის საკითხები")}</span>
              </Link>
            </li>
            <li>
              <Link to="/admin">
                <i className="bx bxs-report"></i>
                <span>{props.t("სამართავი პანელი")}</span>
              </Link>
            </li>
            <li>
              <Link to="/head">
                <i className="bx bxs-report"></i>
                <span>{props.t("ვიზირება")}</span>
              </Link>
            </li>
            <li>
              <Link to="/archive">
                <i className="bx bxs-report"></i>
                <span>{props.t("არქივი")}</span>
              </Link>
            </li>
            <li>
              <Link to="/#" className="has-arrow ">
                <i className="bx bx-task"></i>
                <span>{props.t("ხელშეკრულებები")}</span>
              </Link>
              <ul className="sub-menu">
                <li>
                  <Link to="/lawyer">
                    <span>{props.t("მოთხოვნა")}</span>
                  </Link>
                </li>
                <li>
                  <Link to="/lawyer-approve">
                    <span>{props.t("ვიზირება")}</span>
                  </Link>
                </li>
                <li>
                  <Link to="/lawyer-history">
                    <span>{props.t("არქივი")}</span>
                  </Link>
                </li>
                <li>
                  <Link to="/user-agreements">
                    <span>{props.t("გაგზავნილი")}</span>
                  </Link>
                </li>
              </ul>
            </li>

            {/* <li>
              <Link to="/#" className="has-arrow">
                <i className="bx bx-horizontal-center"></i>
                <span>{props.t("განცხადებები")}</span>
              </Link>
              <ul className="sub-menu">
                <li>
                  <Link to="/procurement">
                    <span>{props.t("შესყიდვები")}</span>
                  </Link>
                </li>
                <li>
                  <Link to="/vacation">
                    <span>{props.t("შვებულება")}</span>
                  </Link>
                </li>
                <li>
                  <Link to="/business">
                    <span>{props.t("მივლინება")}</span>
                  </Link>
                </li>
                <li>
                  <Link to="/procurement">
                    <span>{props.t("განცხადების დამატება")}</span>
                  </Link>
                </li>
              </ul>
            </li> */}


            <li>
              <Link to="/#" className="has-arrow">
                <i className="bx bx-horizontal-center"></i>
                <span>{props.t("განცხადებები")}</span>
              </Link>
              <ul className="sub-menu">
                <li>
                  <Link to="/#" className="has-arrow">
                    <span>{props.t("შიდა შესყიდვები")}</span>
                  </Link>
                  <ul className="sub-menu">
                    <li>
                      <Link to="/procurement">
                        <span>{props.t("დამატება")}</span>
                      </Link>
                    </li>
                    <li>
                      <Link to="/procurement/manage">
                        <span>{props.t("ვიზირება")}</span>
                      </Link>
                    </li>
                    {/* <li>
                      <Link to="/procurement/manage">
                        <span>{props.t("გაგზავნილი")}</span>
                      </Link>
                    </li> */}
                  </ul>
                </li>
                <li>
                  <Link to="/#" className="has-arrow">
                    <span>{props.t("შვებულება")}</span>
                  </Link>
                  <ul className="sub-menu">
                    <li>
                      <Link to="/vacation">
                        <span>{props.t("დამატება")}</span>
                      </Link>
                    </li>
                    <li>
                      <Link to="/vacation/manage">
                        <span>{props.t("ვიზირება")}</span>
                      </Link>
                    </li>
                    <li>
                      <Link to="/user-vocations">
                        <span>{props.t("გაგზავნილი")}</span>
                      </Link>
                    </li>
                  </ul>
                </li>
                <li>
                  <Link to="/#" className="has-arrow">
                    <span>{props.t("მივლინება")}</span>
                  </Link>
                  <ul className="sub-menu">
                    <li>
                      <Link to="/business">
                        <span>{props.t("დამატება")}</span>
                      </Link>
                    </li>
                    <li>
                      <Link to="/business/manage">
                        <span>{props.t("ვიზირება")}</span>
                      </Link>
                    </li>
                    <li>
                      <Link to="/user-business">
                        <span>{props.t("გაგზავნილი")}</span>
                      </Link>
                    </li>
                  </ul>
                </li>
              </ul>
            </li>




            <li>
              <Link to="/#" className="has-arrow ">
                <i className="bx bxs-file-doc"></i>
                <span>{props.t("HR დოკუმენტები")}</span>
              </Link>
              <ul className="sub-menu">
                <li>
                  <Link to="/hr">
                    <span>{props.t("ცნობები")}</span>
                  </Link>
                </li>
                <li>
                  <Link to="/hr-approve">
                    <span>{props.t("ვიზირება")}</span>
                  </Link>
                </li>
              </ul>
            </li>
            <li>
              <Link to="/profile">
                <i className="bx bxs-report"></i>
                <span>{props.t("პროფილი")}</span>
              </Link>
            </li>
            <li>
              <Link to="/notes">
                <i className="bx bxs-report"></i>
                <span>{props.t("Notes")}</span>
              </Link>
            </li>
            <li>
              <Link to="/it-tasks">
                <i className="bx bxs-report"></i>
                <span>{props.t("IT მხარდაჭერა")}</span>
              </Link>
            </li>
            <li>
              <Link to="/contacts-list">
                <i className="bx bxs-user-detail"></i>
                <span>{props.t("ლოიალობის ბარათი")}</span>
              </Link>
            </li>
            <li>
              <Link to="/visitors">
                <i className="bx bx-building"></i>
                <span>{props.t("ვიზიტორები")}</span>
              </Link>
            </li>
            {/*<li>
              <Link to="/payment-monitoring">
                <i className="bx bx-credit-card-alt"></i>
                <span>{props.t("გადახდების მონიტორინგი")}</span>
              </Link>
            </li>*/}
          
            <li>
              <Link to="/#" className="has-arrow ">
                <i className="bx bx-phone-call"></i>
                <span>{props.t("ლიდები")}</span>
              </Link>
              <ul className="sub-menu">
              <li>
              <Link to="/vip-leads">
                <span>{props.t("VIP")}</span>
              </Link>
            </li>
                <li>
              <Link to="/corporate-leads">
                <span>{props.t("კორპორატიული")}</span>
              </Link>
            </li>
              </ul>
            </li>
            <li className="menu-title">{props.t("Apps")}</li>

            {/* <li>
              <Link to="/calendar" >
                <i className="bx bx-calendar"></i>
                <span>{props.t("Calendar")}</span>
              </Link>
            </li> */}

            {/* <li>
              <Link to="/chat" >
                <i className="bx bx-chat"></i>
                <span>{props.t("Chat")}</span>
              </Link>
            </li> */}
            {/* <li>
              <Link to="/apps-filemanager" >
                <i className="bx bx-file"></i>
                <span>{props.t("File Manager")}</span>
              </Link>
            </li> */}

            {/* <li>
              <Link to="/contacts-list" className="has-arrow ">
                <i className="bx bxs-user-detail"></i>
                <span>{props.t("Contacts")}</span>
              </Link>
              <ul className="sub-menu">
                <li>
                  <Link to="/contacts-grid">{props.t("User Grid")}</Link>
                </li>
                <li>
                  <Link to="/contacts-list">{props.t("User List")}</Link>
                </li>
                <li>
                  <Link to="/contacts-profile">{props.t("Profile")}</Link>
                </li>
              </ul>
            </li> */}

            {/* <li>
              <Link to="/#" className="has-arrow">                
                <i className="bx bx-briefcase-alt"></i>
                <span key="t-jobs">{props.t("Jobs")}</span>
              </Link>
              <ul className="sub-menu">
                <li><Link to="/job-list">{props.t("Job List")}</Link></li>
                <li><Link to="/job-grid">{props.t("Job Grid")}</Link></li>
                <li><Link to="/job-apply">{props.t("Apply Job")}</Link></li>
                <li><Link to="/job-details">{props.t("Job Details")}</Link></li>
                <li><Link to="/job-categories">{props.t("Jobs Categories")}</Link></li>
                <li>
                  <Link to="/#" className="has-arrow">{props.t("Candidate")}</Link>
                  <ul className="sub-menu" aria-expanded="true">
                    <li><Link to="/candidate-list">{props.t("List")}</Link></li>
                    <li><Link to="/candidate-overview">{props.t("Overview")}</Link></li>
                  </ul>
                </li>
              </ul>
            </li> */}

            {/* <li className="menu-title">Pages</li> */}
            {/* <li>
              <Link to="/#" className="has-arrow">
                <i className="bx bx-user-circle"></i>
                <span>{props.t("Authentication")}</span>
              </Link>
              <ul className="sub-menu">
                <li>
                  <Link to="/pages-login">{props.t("Login")}</Link>
                </li>
                <li>
                  <Link to="/pages-login-2">{props.t("Login 2")}</Link>
                </li>
                <li>
                  <Link to="/pages-register">{props.t("Register")}</Link>
                </li>
                <li>
                  <Link to="/pages-register-2">{props.t("Register 2")}</Link>
                </li>
                <li>
                  <Link to="/page-recoverpw">
                    {props.t("Recover Password")}
                  </Link>
                </li>
                <li>
                  <Link to="/page-recoverpw-2">
                    {props.t("Recover Password 2")}
                  </Link>
                </li>
                <li>
                  <Link to="/auth-lock-screen">{props.t("Lock Screen")}</Link>
                </li>
                <li>
                  <Link to="/auth-lock-screen-2">
                    {props.t("Lock Screen 2")}
                  </Link>
                </li>
                <li>
                  <Link to="/page-confirm-mail">{props.t("Confirm Mail")}</Link>
                </li>
                <li>
                  <Link to="/page-confirm-mail-2">
                    {props.t("Confirm Mail 2")}
                  </Link>
                </li>
                <li>
                  <Link to="/auth-email-verification">
                    {props.t("Email Verification")}
                  </Link>
                </li>
                <li>
                  <Link to="/auth-email-verification-2">
                    {props.t("Email Verification 2")}
                  </Link>
                </li>
                <li>
                  <Link to="/auth-two-step-verification">
                    {props.t("Two Step Verification")}
                  </Link>
                </li>
                <li>
                  <Link to="/auth-two-step-verification-2">
                    {props.t("Two Step Verification 2")}
                  </Link>
                </li>
              </ul>
            </li> */}
            {/* <li>
              <Link to="/#" className="has-arrow ">
                <i className="bx bx-file"></i>
                <span>{props.t("Utility")}</span>
              </Link>
              <ul className="sub-menu">
                <li>
                  <Link to="/pages-starter">{props.t("Starter Page")}</Link>
                </li>
                <li>
                  <Link to="/pages-maintenance">{props.t("Maintenance")}</Link>
                </li>
                <li>
                  <Link to="/pages-comingsoon">{props.t("Coming Soon")}</Link>
                </li>
                <li>
                  <Link to="/pages-timeline">{props.t("Timeline")}</Link>
                </li>
                <li>
                  <Link to="/pages-faqs">{props.t("FAQs")}</Link>
                </li>
                <li>
                  <Link to="/pages-pricing">{props.t("Pricing")}</Link>
                </li>
                <li>
                  <Link to="/pages-404">{props.t("Error 404")}</Link>
                </li>
                <li>
                  <Link to="/pages-500">{props.t("Error 500")}</Link>
                </li>
              </ul>
            </li> */}

            {/* <li className="menu-title">{props.t("Components")}</li> */}

            <li>
              {/* <Link to="/#" className="has-arrow">
                <i className="bx bx-tone" />
                <span>{props.t("UI Elements")}</span>
              </Link> */}
              <ul className="sub-menu">
                {/* <li>
                  <Link to="/ui-alerts">{props.t("Alerts")}</Link>
                </li>
                <li>
                  <Link to="/ui-buttons">{props.t("Buttons")}</Link>
                </li>
                <li>
                  <Link to="/ui-cards">{props.t("Cards")}</Link>
                </li>
                <li>
                  <Link to="/ui-carousel">{props.t("Carousel")}</Link>
                </li>
                <li>
                  <Link to="/ui-dropdowns">{props.t("Dropdowns")}</Link>
                </li>
                <li>
                  <Link to="/ui-grid">{props.t("Grid")}</Link>
                </li>
                <li>
                  <Link to="/ui-images">{props.t("Images")}</Link>
                </li>
                <li>
                  <Link to="/ui-lightbox">{props.t("Lightbox")}</Link>
                </li>
                <li>
                  <Link to="/ui-modals">{props.t("Modals")}</Link>
                </li>
                <li>
                  <Link to="/ui-offcanvas">{props.t("OffCanvas")}</Link>
                </li>
                <li>
                  <Link to="/ui-rangeslider">
                    {props.t("Range Slider")}
                  </Link>
                </li>
                <li>
                  <Link to="/ui-session-timeout">
                    {props.t("Session Timeout")}
                  </Link>
                </li>
                <li>
                  <Link to="/ui-progressbars">
                    {props.t("Progress Bars")}
                  </Link>
                </li>
                <li>
                  <Link to="/ui-placeholders">{props.t("Placeholders")}</Link>
                </li>
                <li>
                  <Link to="/ui-tabs-accordions">
                    {props.t("Tabs & Accordions")}
                  </Link>
                </li>
                <li>
                  <Link to="/ui-typography">
                    {props.t("Typography")}
                  </Link>
                </li>
                <li>
                  <Link to="/ui-toasts">{props.t("Toasts")}</Link>
                </li>
                <li>
                  <Link to="/ui-video">{props.t("Video")}</Link>
                </li>
                <li>
                  <Link to="/ui-general">{props.t("General")}</Link>
                </li>
                <li>
                  <Link to="/ui-colors">{props.t("Colors")}</Link>
                </li>
                <li>
                  <Link to="/ui-rating">{props.t("Rating")}</Link>
                </li> */}
                <li>
                  <Link to="/ui-notifications">{props.t("Notifications")}</Link>
                </li>
                {/* <li>
                  <Link to="/ui-breadcrumb">
                    {props.t("Breadcrumb")}
                  </Link>
                </li> */}
                <li>
                  <Link to="/ui-utilities">{props.t("Utilities")}</Link>
                </li>
              </ul>
            </li>

            <li>
              {/* <Link to="/#" >
                <i className="bx bxs-eraser"></i>
                <span className="badge rounded-pill bg-danger float-end">
                  10
                </span>
                <span>{props.t("Forms")}</span>
              </Link> */}
              <ul className="sub-menu">
                <li>
                  <Link to="/form-elements">{props.t("Form Elements")}</Link>
                </li>
                <li>
                  <Link to="/form-layouts">{props.t("Form Layouts")}</Link>
                </li>
                <li>
                  <Link to="/form-validation">
                    {props.t("Form Validation")}
                  </Link>
                </li>
                <li>
                  <Link to="/form-advanced">{props.t("Form Advanced")}</Link>
                </li>
                <li>
                  <Link to="/form-editors">{props.t("Form Editors")}</Link>
                </li>
                <li>
                  <Link to="/form-uploads">{props.t("Form File Upload")} </Link>
                </li>
                <li>
                  <Link to="/form-repeater">{props.t("Form Repeater")}</Link>
                </li>
                <li>
                  <Link to="/form-wizard">{props.t("Form Wizard")}</Link>
                </li>
                <li>
                  <Link to="/form-mask">{props.t("Form Mask")}</Link>
                </li>
                {/* <li>
                  <Link to="/dual-listbox">{props.t("Transfer List")}</Link>
                </li> */}
              </ul>
            </li>

            {/* <li>
              <Link to="/#" className="has-arrow "> */}
            {/* <i className="bx bx-list-ul"></i> */}
            {/* <span>{props.t("Tables")}</span> */}
            {/* </Link> */}
            {/* <ul className="sub-menu"> */}
            {/* <li>
                  <Link to="/tables-basic">{props.t("Basic Tables")}</Link>
                </li> */}

            {/* <li>
                  <Link to="/tables-responsive">
                    {props.t("Responsive Table")}
                  </Link>
                </li>
                <li>
                  <Link to="/tables-dragndrop">{props.t("Drag & Drop Table")}</Link>
                </li> */}
            {/* </ul>
            </li> */}

            {/* <li>
              <Link to="/#" className="has-arrow ">
                <i className="bx bxs-bar-chart-alt-2"></i>
                <span>{props.t("Charts")}</span>
              </Link>

              <ul className="sub-menu">
                <li>
                  <Link to="/apex-charts">{props.t("Apex charts")}</Link>
                </li>
                <li>
                  <Link to="/chartjs-charts">{props.t("Chartjs Chart")}</Link>
                </li>
                <li>
                  <Link to="/e-charts">{props.t("E Chart")}</Link>
                </li>
                <li>
                  <Link to="/sparkline-charts">
                    {props.t("Sparkline Chart")}
                  </Link>
                </li>
                <li>
                  <Link to="/charts-knob">{props.t("Knob Chart")}</Link>
                </li>
                <li>
                  <Link to="/re-charts">{props.t("Re Chart")}</Link>
                </li>
              </ul>
            </li>

            <li>
              <Link to="/#" className="has-arrow ">
                <i className="bx bx-aperture"></i>
                <span>{props.t("Icons")}</span>
              </Link>
              <ul className="sub-menu">
                <li>
                  <Link to="/icons-boxicons">{props.t("Boxicons")}</Link>
                </li>
                <li>
                  <Link to="/icons-materialdesign">
                    {props.t("Material Design")}
                  </Link>
                </li>
                <li>
                  <Link to="/icons-dripicons">{props.t("Dripicons")}</Link>
                </li>
                <li>
                  <Link to="/icons-fontawesome">{props.t("Font awesome")}</Link>
                </li>
              </ul>
            </li> */}

            {/* <li>
              <Link to="/#" className="has-arrow ">
                <i className="bx bx-map"></i>
                <span>{props.t("Maps")}</span>
              </Link>
              <ul className="sub-menu">
                <li>
                  <Link to="/maps-google">{props.t("Google Maps")}</Link>
                </li>
                
              </ul>
            </li> */}

            {/* <li>
              <Link to="/#" className="has-arrow ">
                <i className="bx bx-share-alt"></i>
                <span>{props.t("Multi Level")}</span>
              </Link>
              <ul className="sub-menu">
                <li>
                  <Link to="/#">{props.t("Level 1.1")}</Link>
                </li>
                <li>
                  <Link to="/#" className="has-arrow">
                    {props.t("Level 1.2")}
                  </Link>
                  <ul className="sub-menu">
                    <li>
                      <Link to="/#">{props.t("Level 2.1")}</Link>
                    </li>
                    <li>
                      <Link to="/#">{props.t("Level 2.2")}</Link>
                    </li>
                  </ul>
                </li>
              </ul>
            </li> */}
          </ul>
        </div>
      </SimpleBar>
    </React.Fragment>
  )
};

SidebarContent.propTypes = {
  location: PropTypes.object,
  t: PropTypes.any,
};

export default withRouter(withTranslation()(SidebarContent));
