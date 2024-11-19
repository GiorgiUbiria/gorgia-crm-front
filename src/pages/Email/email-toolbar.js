import React, { useState, useEffect } from "react";
import {
  Button,
  Dropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem,
  Row,
  Col
} from "reactstrap";

//redux
import { useSelector, useDispatch } from "react-redux";
import { createSelector } from "reselect";

import {
  setFolderOnSelectedMails as onFolderOnSelectedMails,
  selectFolders as onSelectFolders,
  getSelectedMails as onGetSelectedMails,
  deleteMail as onDeleteMail,
  trashMail as onTrashMail,
} from "store/mails/actions";
import DeleteModal from "components/Common/DeleteModal";

const EmailToolbar = (props) => {
  const dispatch = useDispatch();

  const EmailProperties = createSelector(
    (state) => state.mails,
    (Mails) => ({
      selectedmails: Mails.selectedmails,
      folders: Mails.folders
    })
  );

  const {
    selectedmails,
    folders
  } = useSelector(EmailProperties);


  useEffect(() => {
    dispatch(onSelectFolders());
  }, [dispatch]);

  const [folder_Menu, setfolder_Menu] = useState(false);
  const [tag_Menu, settag_Menu] = useState(false);
  const [more_Menu, setmore_Menu] = useState(false);

  const handleunSelectCheckbox = () => {
    var items = document.getElementsByName('emailcheckbox');
    for (var i = 0; i < items.length; i++) {
      if (items[i].type == 'checkbox')
        items[i].checked = false;
    }
    document.getElementById('checkall').checked = false;
  };

  // Checked All Email
  const checkedAll = () => {
    const checkall = document.getElementById("checkall");
    const element = document.querySelectorAll(".message-list li");
    var forId = [];
    if (checkall.checked) {
      element.forEach((node) => {
        forId.push(node.querySelector('.form-check-input').value);
      });
    } else {
      var forId = null
    }
    dispatch(onGetSelectedMails(forId));
  };


  // delete modal 
  const [delet, setDelet] = useState(false)

  const handleDelete = () => setDelet(!delet);

  const handleDeleteData = () => {
    // dispatch(onFolderOnSelectedMails(selectedmails, 4, props.activeTab));
    selectedmails.map((item) => {
      if (props.category === "trash") {
        console.log("trash", props.category);
        dispatch(onDeleteMail(item));
        props.setCheckbox(false)
      } else {
        console.log("delete", props.category);

        dispatch(onTrashMail(item));
        props.setCheckbox(false)
      }
      return item
    })
    handleunSelectCheckbox();
    handleDelete();
  }


  return (
    <React.Fragment>
      <div className="p-3 message-list pb-0">
        <Row className="justify-content-between">
          <Col>
            <div className="d-flex align-items-start gap-2">
              <div className="checkbox-wrapper-mail selectall mt-2">
                <input
                  type="checkbox"
                  className="form-check-input"
                  id="checkall"
                  onChange={(e) => {
                    checkedAll(e.target.value);
                  }}
                  value=""
                />
                <label className="toggle form-label" htmlFor="checkall"></label>
              </div>
              {props.checkbox && (
                <div className="btn-toolbar" role="toolbar">
                  <div className="btn-group me-2 mb-2 mb-sm-0">
                    <Button type="button" color="primary">
                      <i className="fa fa-inbox" />
                    </Button>
                    <Button type="button" color="primary">
                      <i className="fa fa-exclamation-circle" />
                    </Button>
                    <Button
                      type="button"
                      color="primary"
                      onClick={handleDelete}
                    >
                      <i className="far fa-trash-alt" />
                    </Button>
                  </div>
                  <Dropdown
                    isOpen={folder_Menu}
                    toggle={() => {
                      setfolder_Menu(!folder_Menu);
                    }}
                    className="btn-group me-2 mb-2 mb-sm-0"
                  >
                    <DropdownToggle
                      className="btn btn-primary  dropdown-toggle"
                      tag="i"
                    >
                      <i className="fa fa-folder" />{" "}
                      <i className="mdi mdi-chevron-down ms-1" />
                    </DropdownToggle>
                    <DropdownMenu className="dropdown-menu-end">
                      {folders.map((folder) => (
                        <DropdownItem
                          to="#"
                          onClick={(ev) => {
                            dispatch(
                              onFolderOnSelectedMails(
                                selectedMails,
                                ev.target.value,
                                props.activeTab
                              )
                            );
                            handleunSelectCheckbox();
                          }}
                          value={folder.id}
                          key={folder.id}
                        >
                          {folder.title}
                        </DropdownItem>
                      ))}
                    </DropdownMenu>
                  </Dropdown>
                  <Dropdown
                    isOpen={tag_Menu}
                    toggle={() => {
                      settag_Menu(!tag_Menu);
                    }}
                    className="btn-group me-2 mb-2 mb-sm-0"
                  >
                    <DropdownToggle
                      className="btn btn-primary  dropdown-toggle"
                      tag="i"
                    >
                      <i className="fa fa-tag" />{" "}
                      <i className="mdi mdi-chevron-down ms-1" />
                    </DropdownToggle>
                    <DropdownMenu className="dropdown-menu-end">
                      <DropdownItem to="#">Updates</DropdownItem>
                      <DropdownItem to="#">Social</DropdownItem>
                      <DropdownItem to="#">Team Manage</DropdownItem>
                    </DropdownMenu>
                  </Dropdown>
                  <Dropdown
                    isOpen={more_Menu}
                    toggle={() => {
                      setmore_Menu(!more_Menu);
                    }}
                    className="btn-group me-2 mb-2 mb-sm-0"
                  >
                    <DropdownToggle
                      className="btn btn-primary  dropdown-toggle"
                      tag="div"
                    >
                      More <i className="mdi mdi-dots-vertical ms-2" />
                    </DropdownToggle>
                    <DropdownMenu className="dropdown-menu-end">
                      <DropdownItem to="#">Mark as Unread</DropdownItem>
                      <DropdownItem to="#">Mark as Important</DropdownItem>
                      <DropdownItem to="#">Add to Tasks</DropdownItem>
                      <DropdownItem to="#">Add Star</DropdownItem>
                      <DropdownItem to="#">Mute</DropdownItem>
                    </DropdownMenu>
                  </Dropdown>
                </div>
              )}
            </div>
          </Col>
          <Col lg={3}>
            <div className="search-box mb-2 me-2">
              <div className="position-relative">
                <input
                  type="text"
                  className="form-control bg-light border-light rounded"
                  placeholder="Search..." onChange={(e) => props.handelSearch(e.target.value)} />
                <i className="bx bx-search-alt search-icon"></i>
              </div>
            </div>
          </Col>
        </Row>
      </div>
      <DeleteModal show={delet} onDeleteClick={handleDeleteData} onCloseClick={handleDelete} />
    </React.Fragment>
  );
};

export default EmailToolbar;
