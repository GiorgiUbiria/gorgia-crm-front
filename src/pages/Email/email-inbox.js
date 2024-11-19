import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import withRouter from "components/Common/withRouter";
import {
  Button,
  Card,
  Col,
  Container,
  Input,
  Label,
  Row,
  Nav,
  Modal,
  ModalBody,
  ModalFooter,
  ModalHeader,
  NavItem,
  NavLink,
} from "reactstrap";

//Import Breadcrumb
import Breadcrumbs from "../../components/Common/Breadcrumb";

import classnames from "classnames";

import { map } from "lodash";

// Import Editor
import { Editor } from "react-draft-wysiwyg";
import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css";

import {
  getMailsLists as onGetMailsLists,
  getSelectedMails as onGetSelectedMails,
  updateMail as onUpdateMail,
  staredMail as onStaredMail
} from "store/mails/actions";

//Import Email Topbar
import EmailToolbar from "./email-toolbar";

//redux
import { useSelector, useDispatch } from "react-redux";
import { createSelector } from "reselect";
import { labelsData, mailChatData } from "common/data";
import { handleSearchData } from "components/Common/searchFile";
import Spinners from "components/Common/Spinner";

const EmailInbox = props => {

  //meta title
  document.title = "Inbox | Gorgia LLC";

  const dispatch = useDispatch();

  const EmailProperties = createSelector(
    (state) => state.mails,
    (Mails) => ({
      mailslists: Mails.mailslists,
      selectedmails: Mails.selectedmails,
      loading: Mails.loading
    })
  );

  const {
    mailslists,
    selectedmails,
    loading
  } = useSelector(EmailProperties);
  const [isLoading, setLoading] = useState(loading)
  const [checkbox, setCheckbox] = useState(false);

  const [mailsList, setMailsList] = useState();
  const [activeTab, setActiveTab] = useState("1");
  const [modal, setmodal] = useState(false);
  const [badgeLength, setBadgeLength] = useState();

  useEffect(() => {
    dispatch(onGetMailsLists(1));
  }, [dispatch]);

  useEffect(() => {
    setMailsList(mailslists)
    const read = mailslists.filter((item) => !item.read).length;
    setBadgeLength(read);
  }, [mailslists])

  const handleSelect = (selectedItems) => {
    dispatch(onGetSelectedMails(selectedItems));
  };

  // search 
  const handelSearch = (searchQuery) => {
    const filteredEmails = mailslists.filter((email) =>
      email.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      email.description.toLowerCase().includes(searchQuery.toLowerCase())
    );
    setMailsList(filteredEmails);
  }

  const [displayCategory, setDisplayCategory] = useState("inbox")
  const filterMails = ({ category }) => {
    if (displayCategory === "inbox" && category === "trash") {
      return false;
    }
    return (
      (displayCategory === "inbox" || displayCategory === category)
    );
  }
  const checkFirstCheckbox = () => {
    const checkboxElement = document.querySelectorAll('.message-list input[type="checkbox"]');
    let isChecked = false;

    checkboxElement.forEach((checkboxElement) => {
      if (checkboxElement.checked) {
        isChecked = true;
        return;
      }
    });

    setCheckbox(isChecked);
  };

  // Starred Mail
  const starredBtn = (item) => {
    dispatch(onStaredMail(item.id));
  };

  return (
    <React.Fragment>
      <div className="page-content">
        <Container fluid>
          {/* Render Breadcrumbs */}
          <Breadcrumbs title="Email" breadcrumbItem="Inbox" />

          <Row>
            <Col xs="12">
              {/* Render Email SideBar */}
              <Card className="email-leftbar">
                <Button type="button" color="danger" className="btn waves-effect waves-light" block onClick={() => { setModal(!modal); }}>
                  Compose
                </Button>
                <div className="mail-list mt-4">
                  <Nav tabs className="nav-tabs-custom" vertical role="tablist">
                    <NavItem>
                      <a href="#!" className={classnames({ active: activeTab === "1", })}
                        onClick={() => {
                          setActiveTab("1"); setDisplayCategory("inbox")
                        }}>
                        <i className="mdi mdi-email-outline me-2"></i> Inbox
                        <span className="ml-1 float-end">{badgeLength === 0 ? "" : (badgeLength)}</span>
                      </a>
                    </NavItem>

                    <NavItem>
                      <a href="#!" className={classnames({ active: activeTab === "2", })}
                        onClick={() => {
                          setActiveTab("2"); setDisplayCategory("starred"); setBadgeLength(0)
                        }}>
                        <i className="mdi mdi-star-outline me-2"></i>Starred
                      </a>
                    </NavItem>

                    <NavItem>
                      <a href="#!" className={classnames({ active: activeTab === "3", })}
                        onClick={() => {
                          setActiveTab("3"); setDisplayCategory("important"); setBadgeLength(0)
                        }}>
                        <i className="mdi mdi-diamond-stone me-2"></i>Important
                      </a>
                    </NavItem>

                    <NavItem>
                      <a href="#!" className={classnames({ active: activeTab === "4", })}
                        onClick={() => {
                          setActiveTab("4"); setDisplayCategory("draft"); setBadgeLength(0)
                        }}>
                        <i className="mdi mdi-file-outline me-2"></i>Draft
                      </a>
                    </NavItem>

                    <NavItem>
                      <a href="#!" className={classnames({ active: activeTab === "5", })}
                        onClick={() => {
                          setActiveTab("5"); setDisplayCategory("sent"); setBadgeLength(0)
                        }}>
                        <i className="mdi mdi-email-check-outline me-2"></i>Sent
                        Mail
                      </a>
                    </NavItem>

                    <NavItem>
                      <a href="#!" className={classnames({ active: activeTab === "6", })}
                        onClick={() => {
                          setActiveTab("6"); setDisplayCategory("trash"); setBadgeLength(0)
                        }}>
                        <i className="mdi mdi-trash-can-outline me-2"></i>Trash
                      </a>
                    </NavItem>
                  </Nav>
                </div>

                <h6 className="mt-4">Labels</h6>

                <div className="mail-list mt-1">
                  {
                    (labelsData || []).map((item, index) => (
                      <Link to="#" key={index}><span className={item.icon}></span>{item.text}</Link>
                    ))
                  }
                </div>

                <h6 className="mt-4">Chat</h6>

                <div className="mt-2">
                  {
                    (mailChatData || []).map((item, index) => (
                      <Link to="#" className="d-flex" key={index}>
                        <div className="flex-shrink-0">
                          <img
                            className="d-flex me-3 rounded-circle"
                            src={item.imageSrc}
                            alt="Gorgia LLC"
                            height="36"
                          />
                        </div>
                        <div className="flex-grow-1 chat-user-box">
                          <p className="user-title m-0">{item.userTitle}</p>
                          <p className="text-muted">{item.textMessage}</p>
                        </div>
                      </Link>
                    ))
                  }
                </div>
              </Card>

              <Modal
                isOpen={modal}
                autoFocus={true}
                centered={true}
                toggle={() => {
                  setmodal(!modal);
                }}
              >
                <div className="modal-content">
                  <ModalHeader
                    toggle={() => {
                      setmodal(!modal);
                    }}
                  >
                    New Message
                  </ModalHeader>
                  <ModalBody>
                    <form>
                      <div className="mb-3">
                        <Input
                          type="email"
                          className="form-control"
                          placeholder="To"
                        />
                      </div>

                      <div className="mb-3">
                        <Input
                          type="text"
                          className="form-control"
                          placeholder="Subject"
                        />
                      </div>
                      <Editor
                        toolbarClassName="toolbarClassName"
                        wrapperClassName="wrapperClassName"
                        editorClassName="editorClassName"
                      />
                    </form>
                  </ModalBody>
                  <ModalFooter>
                    <Button
                      type="button"
                      color="secondary"
                      onClick={() => {
                        setmodal(!modal);
                      }}
                    >
                      Close
                    </Button>
                    <Button type="button" color="primary" onClick={() => setmodal(!modal)}>
                      Send <i className="fab fa-telegram-plane ms-1"></i>
                    </Button>
                  </ModalFooter>
                </div>
              </Modal>
              <div className="email-rightbar mb-3">
                {
                  isLoading ? <Spinners setLoading={setLoading} />
                    :
                    <Card>
                      {mailslists.length > 0 ?
                        <>
                          {/* Render Email Top Tool Bar */}
                          <EmailToolbar checkbox={checkbox} setCheckbox={setCheckbox} handelSearch={handelSearch} selectedmails={selectedmails} activeTab={activeTab} category={displayCategory} />
                          <ul className="message-list">
                            {(mailsList || [])?.filter(({ category }) => filterMails({ category }))?.map((mail, key) => (
                              <li key={key} className={mail.read ? "" : "unread"} >
                                <div className="col-mail col-mail-1">
                                  <div className="checkbox-wrapper-mail">
                                    <Input type="checkbox" value={mail.id} id={mail.id} name="emailcheckbox"
                                      onChange={(e) => e.target.value}
                                      onClick={(e) => { handleSelect(e.target.value); checkFirstCheckbox(); }}
                                    />
                                    <Label htmlFor={mail.id} className="toggle" />
                                  </div>
                                  <Link to={"/email-read/" + mail.id} className="title">
                                    {mail.name}
                                  </Link>
                                  <span className={mail.category === "starred" ? "star-toggle fas fa-star text-warning" : "star-toggle far fa-star"} style={{ cursor: "pointer" }}
                                    onClick={() => starredBtn(mail)}
                                  />
                                </div>
                                <div className="col-mail col-mail-2">
                                  <div
                                    dangerouslySetInnerHTML={{
                                      __html: mail.description,
                                    }}
                                  ></div>
                                  <div className="date">{mail.date}</div>
                                </div>
                              </li>
                            ))}
                          </ul>
                        </>
                        : <div className="align-items-center text-center p-4"> <i className="mdi mdi-email-outline me-2 display-5"></i> <h4> No Recored Found </h4>
                        </div>}
                    </Card>
                }
                {mailslists.length > 0 &&
                  <Row>
                    <Col xs="7">Showing 1 - 20 of 1,524</Col>
                    <Col xs="5">
                      <div className="btn-group float-end">
                        <Button
                          type="button"
                          color="success"
                          size="sm"

                        >
                          <i className="fa fa-chevron-left" />
                        </Button>
                        <Button
                          type="button"
                          color="success"
                          size="sm"

                        >
                          <i className="fa fa-chevron-right" />
                        </Button>
                      </div>
                    </Col>
                  </Row>
                }
              </div>
            </Col>
          </Row>
        </Container>
      </div>
    </React.Fragment >
  );
};

export default withRouter(EmailInbox);
