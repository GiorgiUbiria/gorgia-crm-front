import React, { useEffect, useRef, useState } from "react";
import PropTypes from "prop-types";
import { Link, useFetcher, useFetchers } from "react-router-dom";
import { map } from "lodash";
import {
  Button,
  Card,
  Col,
  Container,
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownToggle,
  Form,
  FormGroup,
  Input,
  InputGroup,
  Nav,
  NavItem,
  NavLink,
  Row,
  TabContent,
  TabPane,
  UncontrolledAlert,
  UncontrolledDropdown,
  UncontrolledTooltip,
} from "reactstrap";
import classnames from "classnames";

// emoji
import EmojiPicker from 'emoji-picker-react';

//Import Breadcrumb
import Breadcrumbs from "components/Common/Breadcrumb";
import avatar1 from "../../assets/images/users/avatar-1.jpg";

// simple bar
import SimpleBar from "simplebar-react";
import 'simplebar-react/dist/simplebar.min.css';

import {
  deleteMessage as onDeleteMessage,
  addMessage as onAddMessage,
  getChats as onGetChats,
  getContacts as onGetContacts,
  getGroups as onGetGroups,
  getMessages as onGetMessages,
 
} from "store/actions";

//redux
import { useSelector, useDispatch } from "react-redux";
import { createSelector } from "reselect";
import Spinners from "components/Common/Spinner";

import { handleSearchData } from "components/Common/searchFile";
import { sendMessage, getMessages } from "services/chat";
import Echo from "laravel-echo";
import useFetchUsers from "hooks/useFetchUsers";

const Chat = () => {

  //meta title
  document.title = "Chat | Gorgia LLC";

  const dispatch = useDispatch();

  const ChatProperties = createSelector(
    (state) => state.chat,
    (Chat) => ({
      chats: Chat.chats,
      groups: Chat.groups,
      contacts: Chat.contacts,
      messages: Chat.messages,
      loading: Chat.loading
    })
  );



  const { chats, groups, contacts, messages, loading } = useSelector(ChatProperties);
  const user = useSelector((state) => state.user.user);

  console.log(user);
  
  const [receiverId, setReceiverId] = useState(null);
  const [userId, setUserId] = useState(user?.id); 
  const {users} = useFetchUsers()

  const [messagesData, setMessagesData] = useState();
  const [isLoading, setLoading] = useState(loading)
  // const Chat_Box_Username2 = "Henry Wells"
  const [currentRoomId, setCurrentRoomId] = useState(1);
  const currentUser = {
    name: "Henry Wells",
    isActive: true,
  };
  const [menu1, setMenu1] = useState(false);
  const [search_Menu, setsearch_Menu] = useState(false);
  const [settings_Menu, setsettings_Menu] = useState(false);
  const [other_Menu, setother_Menu] = useState(false);
  const [emoji, setEmoji] = useState(false);
  const [activeTab, setactiveTab] = useState("1");
  const [Chat_Box_Username, setChat_Box_Username] = useState("Steven Franklin");
  const [Chat_Box_User_Status, setChat_Box_User_Status] = useState("online");
  const [curMessage, setCurMessage] = useState("");
  const [selectedImage, setSelectedImage] = useState(null);
  const [isdisable, setDisable] = useState(false);

  useEffect(() => {
    dispatch(onGetChats());
    dispatch(onGetGroups());
    dispatch(onGetContacts());
    dispatch(onGetMessages(currentRoomId));
  }, [onGetChats, onGetGroups, onGetContacts, onGetMessages, currentRoomId]);

  // useEffect(() => {
  //   const a = (messages || []).find(i => i.id);
  //   const a1 = a?.usermessages[a?.usermessages.length - 2]
  //   const a2 = a?.usermessages[a?.usermessages.length - 1]
  //   if (a2?.isSameTime) {
  //     setMessagesData((messages || []).map((item) => {
  //       const updateMessage = item.usermessages.filter((data) => a2.time === a1.time ?
  //         { ...data, id: a1.id, to_id: data.to_id, msg: data.msg, isSameTime: a1.time === a2.time, images: data.images, time: a1.time = 0 }
  //         : { ...item });
  //       return { ...item, usermessages: updateMessage }
  //     }))
  //   } else {
  //     setMessagesData(messages)
  //   }
  // }, [messages])

  //Toggle Chat Box Menus
  const toggleSearch = () => {
    setsearch_Menu(!search_Menu);
  };

  const toggleSettings = () => {
    setsettings_Menu(!settings_Menu);
  };

  const toggleOther = () => {
    setother_Menu(!other_Menu);
  };

  const toggleTab = tab => {
    if (activeTab !== tab) {
      setactiveTab(tab);
    }
  };

  //Use For Chat Box
  const userChatOpen = (chat) => {
    setChat_Box_Username(chat.name); 
    setChat_Box_User_Status(chat.status); // Set the selected user's status
    setCurrentRoomId(chat.roomId); // Set the current room ID
    dispatch(onGetMessages(chat.roomId)); // Fetch messages for the selected room
  };

  // search
  const handelSearch = () => {
    const searchInput = document.getElementById("searchMessage");
    const searchFilter = searchInput.value.toUpperCase();
    const searchUL = document.getElementById("users-conversation")
    const searchLI = searchUL.getElementsByTagName("li");

    Array.prototype.forEach.call(searchLI, (search) => {
      const a = search.getElementsByTagName("p")[0] || '';
      const txtValue = a.textContent || a.innerText || '';

      if (txtValue.toUpperCase().indexOf(searchFilter) > -1) {
        search.style.display = "";
      } else {
        search.style.display = "none";
      }
    });
  };

  const currentTime = new Date();
  const hours = currentTime.getHours();
  const minutes = currentTime.getMinutes();
  const time = `${hours}: ${minutes}`






  // useEffect(() => {
  //   console.log('Fetching messages...');
  //   fetchMessages(receiverId); // Correctly fetch messages based on receiverId
  
  //   console.log('Initializing Echo...');
  //   const echo = new Echo({
  //     broadcaster: 'pusher',
  //     key: process.env.REACT_APP_PUSHER_APP_KEY, 
  //     cluster: process.env.REACT_APP_PUSHER_APP_CLUSTER,
  //     encrypted: true,
  //     forceTLS: true,
  //     authEndpoint: 'https://back.gorgia.ge/broadcasting/auth',
  //   });
  
  //   // console.log(`Subscribing to private chat.${receiverId}...`);
  //   const channel = echo.private(`chat.${receiverId}`);
  
  //   channel.listen('MessageSent', (e) => {
  //     // console.log('New message received:', e.message);
  //     setMessagesData((prevMessages) => [...prevMessages, e.message]);
  //   }).error((error) => {
  //     console.error('Error with Echo subscription:', error);
  //   });
  
  //   return () => {
  //     // console.log(`Leaving channel chat.${receiverId}...`);
  //     echo.leaveChannel(`chat.${receiverId}`);
  //   };
  // }, [receiverId]);

  useEffect(() => {
    if (window.Echo) {
      // Subscribing to the user's private channel
      const channel = window.Echo.private(`chat.${receiverId}`);      
      // Listening for the 'MessageSent' event on this channel
      channel.listen('MessageSent', (event) => {
        setMessagesData((prevMessages) => [
          ...prevMessages,
          event.message // Assuming event.message is the new message data
        ]);
      });
  
      // Cleanup function to leave the channel when component unmounts or receiverId changes
      return () => {
        window.Echo.leave(`chat.${receiverId}`);
      };
    }
  }, [receiverId]);
  


  const addMessage = async () => {
    if (curMessage.trim() !== "") {
      const newMessage = {
        receiver_id: receiverId, // Ensure it matches the receiverId being subscribed to
        message: curMessage,
      };

      try {
        const response = await sendMessage(newMessage);
        const sentMessage = response.data;
        console.log('Message sent:', sentMessage); 

        setMessagesData((prevMessages) => [
          ...prevMessages,
          {
            ...sentMessage,
            isSameTime: true,
            time: new Date().toLocaleTimeString(),
          },
        ]);

        setCurMessage("");
      } catch (error) {
        console.error("Error sending message:", error);
      }
    }
  };

  const fetchMessages = async (receiver_id) => {
    try {
      const response = await getMessages(receiver_id);
      // console.log(response);
      
      setMessagesData(response.data);
    } catch (error) {
      console.error("Error fetching messages:", error);
    }
  };


  const handleUserSelect = (userId) => {
    setReceiverId(userId); // Set the selected user's ID as the receiverId
    fetchMessages(userId);  // Fetch messages for the selected user
  };





const onKeyPress = (e) => {
  if (e.key === "Enter") {
    addMessage();
  }
};

  const searchUsers = () => {
    var input, filter, ul, li, a, i, txtValue;
    input = document.getElementById("search-user");
    filter = input.value.toUpperCase();
    ul = document.getElementById("recent-list");
    li = ul.getElementsByTagName("li");
    for (i = 0; i < li.length; i++) {
      a = li[i].getElementsByTagName("a")[0];
      txtValue = a.textContent || a.innerText;
      if (txtValue.toUpperCase().indexOf(filter) > -1) {
        li[i].style.display = "";
      } else {
        li[i].style.display = "none";
      }
    }
  };

  const [deleteMsg, setDeleteMsg] = useState("");
  const toggle_deleMsg = (id) => {
    setDeleteMsg(!deleteMsg);
    dispatch(onDeleteMessage(id))
  };

  const [copyMsgAlert, setCopyMsgAlert] = useState(false);
  const copyMsg = (ele) => {
    var copyText = ele.closest(".conversation-list").querySelector("p").innerHTML;
    navigator.clipboard.writeText(copyText);
    setCopyMsgAlert(true)
    if (copyText) {
      setTimeout(() => {
        setCopyMsgAlert(false)
      }, 1000)

    }
  };

  // scroll simple bar
  const scrollRef = useRef(null);
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.getScrollElement().scrollTop = scrollRef.current.getScrollElement().scrollHeight;
    }
  }, [messagesData])

  // emoji
  const [emojiArray, setEmojiArray] = useState("");
  const onEmojiClick = (event, emojiObject) => {
    setEmojiArray([...emojiArray, emojiObject.emoji]);
    setCurMessage(curMessage + event.emoji);
    setDisable(true)
  };

  //  img upload
  const handleImageChange = (event) => {
    event.preventDefault();
    let reader = new FileReader();
    let file = event.target.files[0];
    reader.onloadend = () => {
      setSelectedImage(reader.result);
      setDisable(true)
    };
    reader.readAsDataURL(file);
  };

  console.log(userId);
  console.log(receiverId)
  

  return (
    <React.Fragment>
      <div className="page-content">
        <Container fluid>
          {/* Render Breadcrumb */}
          <Breadcrumbs title="Gorgia LLC" breadcrumbItem="Chat" />

          <Row>
            <Col lg="12">
              <div className="d-lg-flex">
                <div className="chat-leftsidebar me-lg-4">
                  <div >
                    <div className="py-4 border-bottom">
                      <div className="d-flex">
                        {/* <div className="align-self-center me-3">
                          <img src={avatar1} className="avatar-xs rounded-circle" alt="" />
                        </div>
                        <div className="flex-grow-1">
                          <h5 className="font-size-15 mt-0 mb-1">
                            {currentUser.name}
                          </h5>
                          <p className="text-muted mb-0">
                            <i className="mdi mdi-circle text-success align-middle me-2" />
                            Active
                          </p>
                        </div> */}
                        <div className="user-list w-100">
                          <h5 className="font-size-14 mb-3">Users</h5>
                          <SimpleBar style={{ maxHeight: "410px" }}>
                            <ul className="list-unstyled chat-list">
                              {users && users?.map((user) => (
                                <li 
                                  key={user.id} 
                                  className={receiverId === user.id ? "active" : ""}
                                  onClick={() => handleUserSelect(user.id)}  // Handle user click
                                >
                                  <Link to="#">
                                    <div className="d-flex align-items-center">
                                      <div className="avatar-xs me-3">
                                        <span className="avatar-title rounded-circle bg-primary-subtle text-primary">
                                          {/* {user.name[0]} */}
                                        </span>
                                      </div>
                                      <div className="flex-grow-1">
                                        <h5 className="font-size-14 mb-0">{user.name}</h5>
                                      </div>
                                    </div>
                                  </Link>
                                </li>
                              ))}
                            </ul>
                          </SimpleBar>
                        </div>

                        <div>
                          <Dropdown
                            isOpen={menu1}
                            toggle={() => setMenu1(!menu1)}
                            className="chat-noti-dropdown active"
                          >
                            <DropdownToggle
                              tag="a"
                              className="btn dropdown-toggle"
                            >
                              <i className="bx bx-bell bx-tada"></i>
                            </DropdownToggle>
                            <DropdownMenu className="dropdown-menu-end">
                              <DropdownItem href="#">Action</DropdownItem>
                              <DropdownItem href="#">Another action</DropdownItem>
                              <DropdownItem href="#">Something else</DropdownItem>
                            </DropdownMenu>
                          </Dropdown>
                        </div>
                      </div>
                    </div>

                    <div className="search-box chat-search-box py-4">
                      <div className="position-relative">
                        <Input
                          onKeyUp={searchUsers}
                          id="search-user"
                          type="text"
                          className="form-control"
                          placeholder="Search..."
                        />
                        <i className="bx bx-search-alt search-icon" />
                      </div>
                    </div>

                    <div className="chat-leftsidebar-nav position-relative">
                      <Nav pills justified>
                        <NavItem>
                          <NavLink
                            className={classnames({
                              active: activeTab === "1",
                            })}
                            onClick={() => {
                              toggleTab("1");
                            }}
                          >
                            <i className="bx bx-chat font-size-20 d-sm-none" />
                            <span className="d-none d-sm-block">Chat</span>
                          </NavLink>
                        </NavItem>
                        <NavItem>
                          <NavLink
                            className={classnames({
                              active: activeTab === "2",
                            })}
                            onClick={() => {
                              toggleTab("2");
                            }}
                          >
                            <i className="bx bx-group font-size-20 d-sm-none" />
                            <span className="d-none d-sm-block">Groups</span>
                          </NavLink>
                        </NavItem>
                        <NavItem>
                          <NavLink
                            className={classnames({
                              active: activeTab === "3",
                            })}
                            onClick={() => {
                              toggleTab("3");
                            }}
                          >
                            <i className="bx bx-book-content font-size-20 d-sm-none" />
                            <span className="d-none d-sm-block">Contacts</span>
                          </NavLink>
                        </NavItem>
                      </Nav>
                      <TabContent activeTab={activeTab} className="py-4">
                        <TabPane tabId="1">
                          <div>
                            <h5 className="font-size-14 mb-3">Recent</h5>
                            <ul className="list-unstyled chat-list" id="recent-list">
                              {
                                isLoading ? <Spinners setLoading={setLoading} /> :
                                  <SimpleBar style={{ maxHeight: "410px" }}>
                                    {map(chats, chat => (
                                      <li
                                        key={chat.id + chat.status}
                                        className={
                                          currentRoomId === chat.roomId
                                            ? "active"
                                            : ""
                                        }
                                      >
                                        <Link
                                          to="#"
                                          onClick={() => {
                                            userChatOpen(chat);
                                          }}
                                        >
                                          <div className="d-flex">
                                            <div className="align-self-center me-3">
                                              <i
                                                className={
                                                  chat.status === "online"
                                                    ? "mdi mdi-circle text-success font-size-10"
                                                    : chat.status === "intermediate"
                                                      ? "mdi mdi-circle text-warning font-size-10"
                                                      : "mdi mdi-circle font-size-10"
                                                }
                                              />
                                            </div>
                                            {chat.isImg ?
                                              <div className="avatar-xs align-self-center me-3">
                                                <span className="avatar-title rounded-circle bg-primary-subtle text-primary">
                                                  {chat.profile}
                                                </span>
                                              </div>
                                              :
                                              <div className="align-self-center me-3">
                                                <img
                                                  src={chat.image}
                                                  className="rounded-circle avatar-xs"
                                                  alt=""
                                                />
                                              </div>
                                            }

                                            <div className="flex-grow-1 overflow-hidden">
                                              <h5 className="text-truncate font-size-14 mb-1">
                                                {chat.name}
                                              </h5>
                                              <p className="text-truncate mb-0">
                                                {chat.description}
                                              </p>
                                            </div>
                                            <div className="font-size-11">
                                              {chat.time}
                                            </div>
                                          </div>
                                        </Link>
                                      </li>
                                    ))}
                                  </SimpleBar>
                              }
                            </ul>
                          </div>
                        </TabPane>

                        {/* <TabPane tabId="2">
                          <h5 className="font-size-14 mb-3">Group</h5>
                          <ul className="list-unstyled chat-list">
                            <SimpleBar style={{ height: "410px" }}>
                              {groups &&
                                groups.map(group => (
                                  <li key={"test" + group.image} className={currentRoomId === group.roomId ? "active" : ""}>
                                    <Link
                                      to="#"
                                      onClick={() => {
                                        userChatOpen(
                                          group
                                        );
                                      }}
                                    >
                                      <div className="d-flex align-items-center">
                                        <div className="avatar-xs me-3">
                                          <span className="avatar-title rounded-circle bg-primary-subtle text-primary">
                                            {group.image}
                                          </span>
                                        </div>

                                        <div className="flex-grow-1">
                                          <h5 className="font-size-14 mb-0">
                                            {group.name}
                                          </h5>
                                        </div>
                                      </div>
                                    </Link>
                                  </li>
                                ))}
                            </SimpleBar>
                          </ul>
                        </TabPane> */}

                        <TabPane tabId="3">
                          <h5 className="font-size-14 mb-3">Contact</h5>

                          <div>
                            {/* <SimpleBar style={{ height: "410px" }}>
                              {contacts &&
                                contacts.map(contact => (
                                  <div
                                    key={"test_" + contact.category}
                                    className={
                                      contact.category === "A" ? "" : "mt-4"
                                    }
                                  >
                                    <div className="avatar-xs mb-3">
                                      <span className="avatar-title rounded-circle bg-primary-subtle text-primary">
                                        {contact.category}
                                      </span>
                                    </div>

                                    <ul className="list-unstyled chat-list">
                                      {contact.child.map(array => (
                                        <li key={"test" + array.id} className={currentRoomId === array.roomId ? "active" : ""}>
                                          <Link
                                            to="#"
                                            onClick={() => {
                                              userChatOpen(
                                                array
                                              );
                                            }}
                                          >
                                            <h5 className="font-size-14 mb-0">
                                              {array.name}
                                            </h5>
                                          </Link>
                                        </li>
                                      ))}
                                    </ul>
                                  </div>
                                ))}
                            </SimpleBar> */}
                          </div>
                        </TabPane>
                      </TabContent>
                    </div>
                  </div>
                </div>
                <div className="w-100 user-chat">
                  <Card>
                    <div className="p-4 border-bottom ">
                      <Row>
                        <Col md="4" xs="9">
                          <h5 className="font-size-15 mb-1">
                            {Chat_Box_Username}
                          </h5>

                          <p className="text-muted mb-0">
                            <i
                              className={
                                Chat_Box_User_Status === "online"
                                  ? "mdi mdi-circle text-success align-middle me-2"
                                  : Chat_Box_User_Status === "intermediate"
                                    ? "mdi mdi-circle text-warning align-middle me-1"
                                    : "mdi mdi-circle align-middle me-1"
                              }
                            />
                            {Chat_Box_User_Status === "online" ? "Active now" : "Offline"}
                          </p>
                        </Col>
                        <Col md="8" xs="3">
                          <ul className="list-inline user-chat-nav text-end mb-0">
                            <li className="list-inline-item d-none d-sm-inline-block">
                              <Dropdown
                                className="me-1"
                                isOpen={search_Menu}
                                toggle={toggleSearch}
                              >
                                <DropdownToggle className="btn nav-btn" tag="a">
                                  <i className="bx bx-search-alt-2" />
                                </DropdownToggle>
                                <DropdownMenu
                                  className="dropdown-menu-md"
                                >
                                  <Form className="p-3">
                                    <FormGroup className="m-0">
                                      <InputGroup>
                                        <Input
                                          type="text"
                                          className="form-control"
                                          id="searchMessage"
                                          placeholder="Search ..."
                                          aria-label="Recipient's username"
                                          onChange={handelSearch}
                                        />
                                        {/* <InputGroupAddon addonType="append"> */}
                                        <Button color="primary" type="submit">
                                          <i className="mdi mdi-magnify" />
                                        </Button>
                                        {/* </InputGroupAddon> */}
                                      </InputGroup>
                                    </FormGroup>
                                  </Form>
                                </DropdownMenu>
                              </Dropdown>
                            </li>
                            <li className="list-inline-item d-none d-sm-inline-block">
                              <Dropdown
                                isOpen={settings_Menu}
                                toggle={toggleSettings}
                                className="me-1"
                              >
                                <DropdownToggle className="btn nav-btn" tag="a">
                                  <i className="bx bx-cog" />
                                </DropdownToggle>
                                <DropdownMenu>
                                  <DropdownItem href="#">
                                    View Profile
                                  </DropdownItem>
                                  <DropdownItem href="#">
                                    Clear chat
                                  </DropdownItem>
                                  <DropdownItem href="#">Muted</DropdownItem>
                                  <DropdownItem href="#">Delete</DropdownItem>
                                </DropdownMenu>
                              </Dropdown>
                            </li>
                            <li className="list-inline-item">
                              <Dropdown
                                isOpen={other_Menu}
                                toggle={toggleOther}
                              >
                                <DropdownToggle className="btn nav-btn" tag="a">
                                  <i className="bx bx-dots-horizontal-rounded" />
                                </DropdownToggle>
                                <DropdownMenu className="dropdown-menu-end">
                                  <DropdownItem href="#">Action</DropdownItem>
                                  <DropdownItem href="#">
                                    Another Action
                                  </DropdownItem>
                                  <DropdownItem href="#">
                                    Something else
                                  </DropdownItem>
                                </DropdownMenu>
                              </Dropdown>
                            </li>
                          </ul>
                        </Col>
                      </Row>
                    </div>

                    <div>

                      <div className="chat-conversation p-3">

                      <SimpleBar ref={scrollRef} style={{ height: "486px" }}>
                    {isLoading ? (
                      <Spinners setLoading={setLoading} />
                    ) : (
                      <ul className="list-unstyled mb-0" id="users-conversation">
                        {messagesData &&
                          messagesData.map((message, index) => (
                            <li
                              key={index}
                              className={message.sender_id === userId ? "right" : ""}
                            >
                              <div className="conversation-list">
                                <UncontrolledDropdown>
                                  <DropdownToggle href="#!" tag="a" className="dropdown-toggle">
                                    <i className="bx bx-dots-vertical-rounded" />
                                  </DropdownToggle>
                                  <DropdownMenu>
                                    <DropdownItem onClick={() => copyMsg(message)} href="#">
                                      Copy
                                    </DropdownItem>
                                    <DropdownItem href="#">Save</DropdownItem>
                                    <DropdownItem href="#">Forward</DropdownItem>
                                    <DropdownItem
                                      onClick={() => toggle_deleMsg(message.id)}
                                      href="#"
                                    >
                                      Delete
                                    </DropdownItem>
                                  </DropdownMenu>
                                </UncontrolledDropdown>
                                <div className="ctext-wrap">
                                  <div className="conversation-name">
                                    {message.sender_id === userId ? "You" : "noone"}
                                  </div>
                                  <p>{message.message}</p>
                                  <p className="chat-time mb-0">
                                    <i className="bx bx-time-five align-middle me-1"></i>
                                    {new Date(message.created_at).toLocaleTimeString()}
                                  </p>
                                </div>
                              </div>
                            </li>
                          ))}
                      </ul>
                    )}
                  </SimpleBar>

                      </div>
                      {
                        selectedImage &&
                        <div className="replymessage-block mb-0 d-flex align-items-start">
                          <div className="flex-grow-1">
                            <img src={selectedImage} alt="select img" style={{ width: "150px", height: "auto" }} />
                          </div>
                          <div className="flex-shrink-0">
                            <button type="button" id="close_toggle" className="btn btn-sm btn-link mt-n2 me-n3 fs-18" onClick={() => setSelectedImage(null)}>
                              <i className="bx bx-x align-middle"></i>
                            </button>
                          </div>
                        </div>
                      }

                      {copyMsgAlert && <UncontrolledAlert color='warning' role="alert">  Message copied</UncontrolledAlert>}
                      {emoji && <EmojiPicker onEmojiClick={onEmojiClick} width={250} height={382} />}

                      <div className="p-3 chat-input-section">
                        <Row>
                          <Col>
                            <div className="position-relative">
                              <input
                                type="text"
                                value={curMessage}
                                onKeyPress={onKeyPress}
                                onChange={e => { setCurMessage(e.target.value); setDisable(true) }}
                                className="form-control chat-input"
                                placeholder="Enter Message..."
                              />
                              <div className="chat-input-links">
                                <ul className="list-inline mb-0">
                                  <li className="list-inline-item" onClick={() => setEmoji(!emoji)}>
                                    <Link to="#">
                                      <i className="mdi mdi-emoticon-happy-outline me-1" id="Emojitooltip" />
                                      <UncontrolledTooltip
                                        placement="top"
                                        target="Emojitooltip"
                                      >
                                        Emojis
                                      </UncontrolledTooltip>
                                    </Link>
                                  </li>
                                  <li className="list-inline-item">
                                    <label htmlFor="imageInput" style={{ color: "#556ee6", fontSize: 16 }}>
                                      <i className="mdi mdi-file-image-outline me-1" id="Imagetooltip" />
                                      <UncontrolledTooltip placement="top" target="Imagetooltip">
                                        Images
                                      </UncontrolledTooltip>
                                    </label>
                                    <input type="file" id="imageInput" className="d-none" onChange={handleImageChange} />
                                  </li>
                                  <li className="list-inline-item">
                                    <Link to="#">
                                      <i className="mdi mdi-file-document-outline" id="Filetooltip" />
                                      <UncontrolledTooltip placement="top" target="Filetooltip">
                                        Add Files
                                      </UncontrolledTooltip>
                                    </Link>
                                  </li>
                                </ul>
                              </div>
                            </div>
                          </Col>
                          <Col className="col-auto">
                            <Button
                              type="button"
                              color="primary"
                              disabled={!isdisable}
                              onClick={() => addMessage()}
                              className="btn btn-primary btn-rounded chat-send w-md "
                            >
                              <span className="d-none d-sm-inline-block me-2">
                                Send
                              </span>{" "}
                              <i className="mdi mdi-send" />
                            </Button>
                          </Col>
                        </Row>
                      </div>
                    </div>
                  </Card>
                </div>
              </div>
            </Col>
          </Row >
        </Container >
      </div >
    </React.Fragment >
  );
};

Chat.propTypes = {
  chats: PropTypes.array,
  groups: PropTypes.array,
  contacts: PropTypes.array,
  messages: PropTypes.array,
  onGetChats: PropTypes.func,
  onGetGroups: PropTypes.func,
  onGetContacts: PropTypes.func,
  onGetMessages: PropTypes.func,
  onAddMessage: PropTypes.func,
};

export default Chat;
