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

import useIsAdmin from 'hooks/useIsAdmin';

const SidebarContent = props => {
  const ref = useRef();
  const isAdmin = useIsAdmin();

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
      <SimpleBar ref={ref}>
        <div id="sidebar-menu">
          <ul className="metismenu list-unstyled" id="side-menu">
            <li>
              <Link to="/">
                <i className="bx bx-home"></i>
                <span>{props.t("მთავარი გვერდი")}</span>
              </Link>
            </li>

            {isAdmin && (
              <li>
                <Link to="/admin">
                  <i className="bx bx-cog"></i>
                  <span>{props.t("სამართავი პანელი")}</span>
                </Link>
              </li>
            )}

            <li>
              <Link to="/profile">
                <i className="bx bx-user"></i>
                <span>{props.t("პროფილი")}</span>
              </Link>
            </li>

            <li>
              <Link to="/#" className="has-arrow">
                <i className="bx bx-file"></i>
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
                    {isAdmin && (
                      <li>
                        <Link to="/procurement/manage">
                          <span>{props.t("ვიზირება")}</span>
                        </Link>
                      </li>
                    )}
                    <li>
                      <Link to="/user-procurements">
                        <span>{props.t("გაგზავნილი")}</span>
                      </Link>
                    </li>
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
                    {isAdmin && (
                      <li>
                        <Link to="/vacation/manage">
                          <span>{props.t("ვიზირება")}</span>
                        </Link>
                      </li>
                    )}
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
                    {isAdmin && (
                      <li>
                        <Link to="/business/manage">
                          <span>{props.t("ვიზირება")}</span>
                        </Link>
                      </li>
                    )}
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
              <Link to="/#" className="has-arrow">
                <i className="bx bx-folder"></i>
                <span>{props.t("HR დოკუმენტები")}</span>
              </Link>
              <ul className="sub-menu">
                <li>
                  <Link to="/hr">
                    <span>{props.t("ცნობები")}</span>
                  </Link>
                </li>
                {isAdmin && (
                  <li>
                    <Link to="/hr-approve">
                      <span>{props.t("ვიზირება")}</span>
                    </Link>
                  </li>
                )}
                <li>
                  <Link to="/hr">
                    <span>{props.t("გაგზავნილი")}</span>
                  </Link>
                </li>
              </ul>
            </li>

            <li>
              <Link to="/#" className="has-arrow">
                <i className="bx bx-file-blank"></i>
                <span>{props.t("ხელშეკრულებები")}</span>
              </Link>
              <ul className="sub-menu">
                <li>
                  <Link to="/lawyer">
                    <span>{props.t("მოთხოვნა")}</span>
                  </Link>
                </li>
                {isAdmin && (
                  <>
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
                  </>
                )}
                <li>
                  <Link to="/user-agreements">
                    <span>{props.t("გაგზავნილი")}</span>
                  </Link>
                </li>
              </ul>
            </li>

            {isAdmin && (
              <li>
                <Link to="/head">
                  <i className="bx bx-check-shield"></i>
                  <span>{props.t("ვიზირება")}</span>
                </Link>
              </li>
            )}

            <li>
              <Link to="/it-tasks">
                <i className="bx bx-support"></i>
                <span>{props.t("IT მხარდაჭერა")}</span>
              </Link>
            </li>

            <li>
              <Link to="/contacts-list">
                <i className="bx bx-card"></i>
                <span>{props.t("ლოიალობის ბარათი")}</span>
              </Link>
            </li>

            {isAdmin && (
              <>
                <li>
                  <Link to="/visitors">
                    <i className="bx bx-group"></i>
                    <span>{props.t("ვიზიტორები")}</span>
                  </Link>
                </li>

                <li>
                  <Link to="/payment-monitoring">
                    <i className="bx bx-money"></i>
                    <span>{props.t("გადახდების მონიტორინგი")}</span>
                  </Link>
                </li>

                <li>
                  <Link to="/#" className="has-arrow">
                    <i className="bx bx-phone"></i>
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
              </>
            )}

            <li>
              <Link to="/calendar">
                <i className="bx bx-calendar"></i>
                <span>{props.t("კალენდარი")}</span>
              </Link>
            </li>

            <li>
              <Link to="/notes">
                <i className="bx bx-note"></i>
                <span>{props.t("შეტყობინებები")}</span>
              </Link>
            </li>

            <li>
              <Link to="/chat">
                <i className="bx bx-chat"></i>
                <span>{props.t("ჩათი")}</span>
              </Link>
            </li>
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
