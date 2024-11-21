import React, { useEffect, useRef, useState } from "react";
import PropTypes from "prop-types";
import {
  Button,
  Card,
  Col,
  Container,
  Input,
  InputGroup,
  Row,
} from "reactstrap";

import EmojiPicker from 'emoji-picker-react';

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
    <div className="chat-container">
      <Container fluid>
        <Row className="chat-wrapper">
          {/* Simplified Sidebar */}
          <Col lg={3} className="chat-sidebar">
            <div className="sidebar-header">
              <h4>Messages</h4>
              <div className="search-box">
                <Input
                  type="text"
                  placeholder="Search users..."
                  onChange={searchUsers}
                />
                <i className="bx bx-search" />
              </div>
            </div>

            <div className="users-list">
              <SimpleBar style={{ maxHeight: "calc(100vh - 180px)" }}>
                <ul className="list-unstyled">
                  {users && users.length > 0 ? (
                    users.map((user) => (
                      <li 
                        key={user.id} 
                        className={`user-item ${receiverId === user.id ? "active" : ""}`}
                        onClick={() => handleUserSelect(user.id)}
                      >
                        <div className="user-avatar">
                          {user.avatar ? (
                            <img src={user.avatar} alt={user.name} />
                          ) : (
                            <span className="avatar-initial">
                              {user.name ? user.name.charAt(0) : '?'}
                            </span>
                          )}
                          <span className={`status-indicator ${user.status || 'offline'}`} />
                        </div>
                        <div className="user-info">
                          <h6>{user.name || 'Unknown User'}</h6>
                          <small className="text-muted">
                            {user.lastMessage || "No messages yet"}
                          </small>
                        </div>
                      </li>
                    ))
                  ) : (
                    <li className="text-center p-3">
                      <small className="text-muted">No users available</small>
                    </li>
                  )}
                </ul>
              </SimpleBar>
            </div>
          </Col>

          {/* Simplified Chat Area */}
          <Col lg={9} className="chat-main">
            {receiverId ? (
              <>
                <div className="chat-header">
                  <div className="chat-user-info">
                    <h5>{Chat_Box_Username}</h5>
                    <small className={`status ${Chat_Box_User_Status}`}>
                      {Chat_Box_User_Status === "online" ? "Active now" : "Offline"}
                    </small>
                  </div>
                  <div className="chat-actions">
                    <Button color="light" className="btn-icon">
                      <i className="bx bx-search" />
                    </Button>
                    <Button color="light" className="btn-icon">
                      <i className="bx bx-phone" />
                    </Button>
                    <Button color="light" className="btn-icon">
                      <i className="bx bx-video" />
                    </Button>
                  </div>
                </div>

                <div className="chat-messages">
                  <SimpleBar 
                    style={{ 
                      height: "100%",
                      maxHeight: "calc(100vh - 270px)"
                    }}
                  >
                    <ul className="messages-list">
                      {messagesData?.map((message, index) => (
                        <li 
                          key={index}
                          className={`message ${message.sender_id === userId ? "sent" : "received"}`}
                        >
                          <div className="message-content">
                            <p>{message.message}</p>
                            <small className="message-time">
                              {new Date(message.created_at).toLocaleTimeString()}
                            </small>
                          </div>
                        </li>
                      ))}
                    </ul>
                  </SimpleBar>
                </div>

                <div className="chat-input">
                  <InputGroup>
                    <Button color="light" className="btn-icon">
                      <i className="bx bx-smile" onClick={() => setEmoji(!emoji)} />
                    </Button>
                    <Input
                      value={curMessage}
                      onChange={e => setCurMessage(e.target.value)}
                      onKeyPress={onKeyPress}
                      placeholder="Type your message..."
                    />
                    <Button 
                      color="primary"
                      disabled={!curMessage.trim()}
                      onClick={addMessage}
                    >
                      <i className="bx bx-send" />
                    </Button>
                  </InputGroup>
                  {emoji && (
                    <div className="emoji-picker-container">
                      <EmojiPicker onEmojiClick={onEmojiClick} />
                    </div>
                  )}
                </div>
              </>
            ) : (
              <div className="no-chat-selected">
                <i className="bx bx-message-square-dots" />
                <h4>Select a conversation to start messaging</h4>
              </div>
            )}
          </Col>
        </Row>
      </Container>
    </div>
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
