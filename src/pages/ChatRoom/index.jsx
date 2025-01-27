import React, { useEffect, useState, useRef } from "react"
import ChatRoomService from "../../services/chatroom"
import echo from "../../plugins/echo"
import classNames from "classnames"
import { formatDistanceToNow } from "date-fns"
import { ka } from "date-fns/locale"
import useAuth from "hooks/useAuth"
import CrmDialog, { DialogButton } from "../../components/CrmDialogs/Dialog"
import CrmSelect from "../../components/CrmSelect"
import { useGetListNames } from "../../queries/admin"

// Enhanced Message component
const Message = ({ message, currentUser, formatTime }) => {
  const isMyMessage = message.user?.id === currentUser?.id

  return (
    <div
      className={classNames("flex group", {
        "justify-end": isMyMessage,
      })}
    >
      <div
        className={classNames(
          "max-w-[70%] rounded-xl p-3 break-words relative transition-all duration-200",
          {
            "bg-primary text-white": isMyMessage,
            "bg-surface dark:!bg-gray-700": !isMyMessage,
            "hover:shadow-lg": true,
          }
        )}
      >
        <div className="flex items-center gap-2 mb-1">
          <div className="text-sm font-medium dark:!text-gray-100">
            {message.user?.name} {message.user?.sur_name}
          </div>
          {!isMyMessage && (
            <div className="w-2 h-2 rounded-full bg-green-400 dark:!bg-green-500" />
          )}
        </div>
        {message.type === "text" && (
          <p className="dark:!text-gray-200 text-sm leading-relaxed">
            {message.message}
          </p>
        )}
        {message.type === "image" && message.file_path && (
          <img
            src={`${process.env.REACT_APP_API_URL}/storage/${message.file_path}`}
            alt="Uploaded"
            className="max-w-full rounded-lg shadow-sm"
          />
        )}
        {message.type === "file" && message.file_path && (
          <a
            href={`${process.env.ACT_APP_API_URL}/storage/${message.file_path}`}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-400 hover:text-blue-500 dark:!text-blue-300 dark:!hover:text-blue-400 flex items-center gap-1"
          >
            <i className="bx bx-file" />
            {message.file_name}
          </a>
        )}
        <div className="text-xs opacity-70 mt-1 dark:!text-gray-300">
          {formatTime(message.created_at)}
        </div>
        <div className="absolute -bottom-2 right-3 text-xs opacity-50 dark:!text-gray-400 hidden group-hover:block">
          {isMyMessage && (
            <i
              className={classNames("bx", {
                "bx-check": !message.is_read,
                "bx-check-double text-primary": message.is_read,
              })}
            />
          )}
        </div>
      </div>
    </div>
  )
}

// Enhanced MessageInput component
const MessageInput = ({ onSendMessage }) => {
  const [message, setMessage] = useState("")
  const [file, setFile] = useState(null)
  const fileInputRef = useRef(null)
  const textareaRef = useRef(null)

  const handleSubmit = async e => {
    e.preventDefault()
    if (!message.trim() && !file) return

    try {
      await onSendMessage({
        message: message.trim(),
        file,
        type: file
          ? file.type.startsWith("image/")
            ? "image"
            : "file"
          : "text",
      })
      setMessage("")
      setFile(null)
      if (fileInputRef.current) {
        fileInputRef.current.value = ""
      }
      if (textareaRef.current) {
        textareaRef.current.style.height = "auto"
      }
    } catch (error) {
      console.error("Failed to send message:", error)
    }
  }

  const handleInputChange = e => {
    setMessage(e.target.value)
    // Auto-resize textarea
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto"
      textareaRef.current.style.height = `${Math.min(
        textareaRef.current.scrollHeight,
        200
      )}px`
    }
  }

  return (
    <div className="p-4 border-t border-border dark:!border-gray-600 bg-white dark:!bg-gray-800">
      <form onSubmit={handleSubmit} className="flex gap-2 items-end">
        <div className="flex-1 relative">
          <textarea
            ref={textareaRef}
            value={message}
            onChange={handleInputChange}
            placeholder="შეიყვანეთ შეტყობინება..."
            rows={1}
            className="w-full min-h-[48px] rounded-xl border border-border dark:!border-gray-600 p-3 bg-surface dark:!bg-gray-800 text-gray-900 dark:!text-gray-100 resize-none overflow-hidden transition-all duration-200 focus:ring-2 focus:ring-primary focus:border-transparent scrollbar-thin scrollbar-thumb-gray-300 dark:!scrollbar-thumb-gray-600 scrollbar-track-transparent"
          />
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="absolute right-2 bottom-2 p-2 text-gray-500 dark:!text-gray-400 hover:text-primary dark:!hover:text-primary-dark"
          >
            <i className="bx bx-paperclip text-xl" />
          </button>
          <input
            type="file"
            onChange={e => setFile(e.target.files[0])}
            ref={fileInputRef}
            className="hidden"
          />
        </div>
        <button
          type="submit"
          className="h-12 w-12 flex items-center justify-center bg-primary text-white rounded-xl hover:bg-primary-hover dark:!bg-primary-dark dark:!hover:bg-primary-dark/90 transition-all duration-200"
        >
          <i className="bx bx-send text-xl" />
        </button>
      </form>
      {file && (
        <div className="mt-2 text-sm text-gray-500 dark:!text-gray-400 flex items-center justify-between bg-gray-100 dark:!bg-gray-700 rounded-lg p-2">
          <span>{file.name}</span>
          <button
            onClick={() => {
              setFile(null)
              if (fileInputRef.current) {
                fileInputRef.current.value = ""
              }
            }}
            className="text-red-500 hover:text-red-600 dark:!text-red-400 dark:!hover:text-red-500"
          >
            <i className="bx bx-x text-lg" />
          </button>
        </div>
      )}
    </div>
  )
}

// Enhanced ChatRoomList component
const ChatRoomList = ({
  rooms,
  setRooms,
  selectedRoom,
  onSelectRoom,
  onNewChat,
  loading,
  currentUser,
}) => {
  const renderLastMessage = room => {
    if (!room.last_message) {
      return "No messages yet"
    }

    const isMyMessage = room.last_message.user_id === currentUser?.id
    const isRead = room.last_message.read_at !== null

    return (
      <div className="flex items-center gap-1">
        {isMyMessage && (
          <i
            className={classNames("bx text-sm", {
              "bx-check": !isRead,
              "bx-check-double text-primary": isRead,
            })}
          />
        )}
        <span
          className={classNames("truncate", {
            "text-gray-500 dark:!text-gray-400": !isMyMessage,
            "text-primary dark:!text-primary-dark": isMyMessage,
          })}
        >
          {room.last_message.type === "text" && room.last_message.message}
          {room.last_message.type === "image" && "📷 Image"}
          {room.last_message.type === "file" && "📄 File"}
        </span>
      </div>
    )
  }

  // Function to update room's last message
  const updateRoomLastMessage = (roomId, newMessage) => {
    setRooms(prevRooms =>
      prevRooms.map(room =>
        room.id === roomId ? { ...room, last_message: newMessage } : room
      )
    )
  }

  // Function to mark last message as read
  const markLastMessageAsRead = roomId => {
    setRooms(prevRooms =>
      prevRooms.map(room => {
        if (room.id === roomId && room.last_message) {
          return {
            ...room,
            last_message: {
              ...room.last_message,
              read_at: new Date().toISOString(),
            },
            unread_count: 0,
          }
        }
        return room
      })
    )
  }

  // Handle new messages from Echo
  useEffect(() => {
    const handleNewMessage = message => {
      updateRoomLastMessage(message.chat_room_id, message)
    }

    echo
      .private(`user.${currentUser.id}`)
      .listen(".new.chat.message", handleNewMessage)

    return () => {
      echo.private(`user.${currentUser.id}`).stopListening(".new.chat.message")
    }
  }, [currentUser.id])

  // Mark messages as read when room is selected
  useEffect(() => {
    if (selectedRoom) {
      markLastMessageAsRead(selectedRoom.id)
    }
  }, [selectedRoom])

  return (
    <div className="w-1/4 border-r border-border dark:!border-gray-600 overflow-y-auto bg-white dark:!bg-gray-800 scrollbar-thin scrollbar-thumb-gray-300 dark:!scrollbar-thumb-gray-600 scrollbar-track-transparent">
      <div className="p-4">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold dark:!text-gray-100">ჩატები</h2>
          <button
            onClick={onNewChat}
            className="p-2 text-primary hover:text-primary-hover dark:!text-primary-dark dark:!hover:text-primary-dark/90 rounded-lg hover:bg-gray-100 dark:!hover:bg-gray-700 transition-all duration-200"
          >
            <i className="bx bx-plus text-xl" />
          </button>
        </div>
        <div className="space-y-1">
          {loading ? (
            <div className="text-center p-4 dark:!text-gray-300">
              იტვირთება...
            </div>
          ) : (
            rooms?.map(
              room =>
                room && (
                  <div
                    key={room.id}
                    className={classNames(
                      "p-3 rounded-lg cursor-pointer transition-all duration-200 group",
                      {
                        "bg-primary/10 dark:!bg-primary-dark/20":
                          selectedRoom?.id === room.id,
                        "hover:bg-surface dark:!hover:bg-gray-700":
                          selectedRoom?.id !== room.id,
                      }
                    )}
                    onClick={() => onSelectRoom(room)}
                  >
                    <div className="flex items-center justify-between">
                      <h3 className="font-medium dark:!text-gray-100">
                        {room.type === "private"
                          ? `${room.other_participant?.name} ${room.other_participant?.sur_name}`
                          : room.name}
                      </h3>
                      {room.unread_count > 0 && (
                        <div className="relative">
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-primary/20 text-primary dark:!bg-primary-dark/20 dark:!text-primary-dark">
                            {room.unread_count}
                          </span>
                          <div className="absolute -top-8 right-0 bg-gray-800 dark:!bg-gray-900 text-white text-xs px-2 py-1 rounded-lg opacity-0 group-hover:opacity-100 transition-all duration-200">
                            {room.unread_count} წაუკითხავი შეტყობინება
                          </div>
                        </div>
                      )}
                    </div>
                    <div className="text-sm text-gray-500 dark:!text-gray-400 mt-1 truncate">
                      {renderLastMessage(room)}
                    </div>
                  </div>
                )
            )
          )}
        </div>
      </div>
    </div>
  )
}

// Enhanced NewChatModal component
const NewChatModal = ({ onClose, onCreateRoom }) => {
  const [newChatType, setNewChatType] = useState("private")
  const [newChatName, setNewChatName] = useState("")
  const [selectedParticipants, setSelectedParticipants] = useState([])
  const { data: users = [], isLoading } = useGetListNames()
  const chatTypeOptions = [
    { value: "private", label: "პირადი" },
    { value: "group", label: "ჯგუფური" },
  ]

  const userOptions = users.map(user => ({
    value: user.id,
    label: `${user.name} ${user.sur_name}`,
  }))

  const handleSubmit = async e => {
    e.preventDefault()
    if (newChatType === "group" && !newChatName) return
    if (selectedParticipants.length === 0) return

    try {
      const data = {
        type: newChatType,
        participants: selectedParticipants,
      }

      if (newChatType === "group") {
        data.name = newChatName.trim()
      }

      await onCreateRoom(data)
      onClose()
    } catch (error) {
      console.error("Failed to create chat room:", error)
    }
  }

  return (
    <CrmDialog
      isOpen={true}
      onOpenChange={onClose}
      title="ახალი ჩატი"
      footer={
        <>
          <DialogButton actionType="cancel" onClick={onClose} />
          <DialogButton
            actionType="add"
            onClick={handleSubmit}
            disabled={
              selectedParticipants.length === 0 ||
              (newChatType === "group" && !newChatName)
            }
          />
        </>
      }
    >
      <form className="space-y-4">
        <div>
          <CrmSelect
            label="ჩატის ტიპი"
            value={newChatType}
            onChange={value => {
              setNewChatType(value)
              setSelectedParticipants([])
            }}
            options={chatTypeOptions}
            className="dark:!bg-gray-800 dark:!text-gray-100"
          />
        </div>

        {newChatType === "group" && (
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:!text-gray-300 mb-1">
              ჯგუფის სახელი
            </label>
            <input
              type="text"
              value={newChatName}
              onChange={e => setNewChatName(e.target.value)}
              className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-primary dark:!border-gray-600 dark:!bg-gray-800 dark:!text-gray-100"
              placeholder="შეიყვანეთ ჯგუფის სახელი"
            />
          </div>
        )}

        <div>
          <CrmSelect
            label="მონაწილეები"
            value={selectedParticipants[0]}
            onChange={value => {
              if (newChatType === "private") {
                setSelectedParticipants([value])
              } else {
                setSelectedParticipants(prev =>
                  prev.includes(value)
                    ? prev.filter(id => id !== value)
                    : [...prev, value]
                )
              }
            }}
            options={userOptions}
            searchable
            placeholder="აირჩიეთ მონაწილე"
            loading={isLoading}
            className="dark:!bg-gray-800 dark:!text-gray-100"
          />
          {newChatType === "group" && selectedParticipants.length > 0 && (
            <div className="mt-2">
              <label className="block text-sm font-medium text-gray-700 dark:!text-gray-300 mb-2">
                არჩეული მონაწილეები
              </label>
              <div className="flex flex-wrap gap-2">
                {selectedParticipants.map(participantId => {
                  const user = users.find(u => u.id === participantId)
                  return (
                    <div
                      key={participantId}
                      className="inline-flex items-center gap-1 rounded-full bg-primary/10 px-3 py-1 text-sm text-primary dark:!bg-primary-dark/20 dark:!text-primary-dark"
                    >
                      <span>
                        {user?.name} {user?.sur_name}
                      </span>
                      <button
                        type="button"
                        onClick={() =>
                          setSelectedParticipants(prev =>
                            prev.filter(id => id !== participantId)
                          )
                        }
                        className="ml-1 text-primary hover:text-primary-hover dark:!text-primary-dark dark:!hover:text-primary-hover-dark"
                      >
                        <i className="bx bx-x text-lg" />
                      </button>
                    </div>
                  )
                })}
              </div>
            </div>
          )}
        </div>
      </form>
    </CrmDialog>
  )
}

// Main ChatRoom component
const ChatRoom = () => {
  const { user: currentUser } = useAuth()
  const [rooms, setRooms] = useState([])
  const [selectedRoom, setSelectedRoom] = useState(null)
  const [messages, setMessages] = useState([])
  const [loading, setLoading] = useState(true)
  const [showNewChatModal, setShowNewChatModal] = useState(false)
  const [isConnected, setIsConnected] = useState(false)
  const messagesEndRef = useRef(null)

  // Echo connection handling
  useEffect(() => {
    echo.connector.pusher.connection.bind("connected", () => {
      console.log("Connected to Echo/Reverb")
      setIsConnected(true)
    })

    echo.connector.pusher.connection.bind("disconnected", () => {
      console.log("Disconnected from Echo/Reverb")
      setIsConnected(false)
    })

    echo.connector.pusher.connection.bind("error", error => {
      console.error("Echo/Reverb connection error:", error)
    })

    return () => {
      echo.connector.pusher.connection.unbind()
    }
  }, [])

  const loadRooms = async () => {
    try {
      const response = await ChatRoomService.getChatRooms()
      setRooms(response.data)
      setLoading(false)
    } catch (error) {
      console.error("Failed to load chat rooms:", error)
      setLoading(false)
    }
  }

  const loadMessages = async roomId => {
    try {
      const response = await ChatRoomService.getMessages(roomId)
      setMessages(response.data)
    } catch (error) {
      console.error("Failed to load messages:", error)
    }
  }

  useEffect(() => {
    loadRooms()
  }, [])

  useEffect(() => {
    if (selectedRoom) {
      const channel = echo
        .join(`presence.chat.room.${selectedRoom.id}`)
        .listen(".new.chat.message", handleNewMessage)

      return () => {
        channel.stopListening(".new.chat.message")
        echo.leave(`presence.chat.room.${selectedRoom.id}`)
      }
    }
  }, [selectedRoom])

  const markMessagesAsRead = async messageIds => {
    try {
      await ChatRoomService.markMessagesAsRead(selectedRoom.id, messageIds)
      // Update local state to mark messages as read
      setMessages(prev =>
        prev.map(msg =>
          messageIds.includes(msg.id) ? { ...msg, is_read: true } : msg
        )
      )
    } catch (error) {
      console.error("Failed to mark messages as read:", error)
    }
  }

  const handleNewMessage = async event => {
    console.log("Handling new message:", event)

    // Update messages list
    setMessages(prev => {
      // Remove optimistic message if it exists
      const filteredMessages = prev.filter(
        msg => !msg.id.toString().includes("temp-")
      )

      // Check if message already exists to prevent duplicates
      const messageExists = filteredMessages.some(msg => msg.id === event.id)

      if (messageExists) {
        return filteredMessages
      }

      // If it's a new message from another user, mark it as read
      if (event.user?.id !== currentUser?.id) {
        markMessagesAsRead([event.id])
      }

      return [...filteredMessages, event]
    })

    // Update last_message in rooms list
    setRooms(prevRooms =>
      prevRooms.map(room =>
        room.id === event.chat_room_id
          ? {
              ...room,
              last_message: event,
              unread_count:
                event.user?.id !== currentUser?.id
                  ? (room.unread_count || 0) + 1
                  : room.unread_count,
            }
          : room
      )
    )
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  const handleSendMessage = async messageData => {
    try {
      // Optimistically add text messages
      if (messageData.type === "text") {
        const optimisticMessage = {
          id: "temp-" + Date.now(),
          chat_room_id: selectedRoom.id,
          user: currentUser,
          message: messageData.message,
          type: messageData.type,
          created_at: new Date().toISOString(),
        }
        setMessages(prev => [...prev, optimisticMessage])
      }

      const response = await ChatRoomService.sendMessage(
        selectedRoom.id,
        messageData
      )

      // For file uploads, add the message after successful upload
      if (messageData.type === "file" || messageData.type === "image") {
        setMessages(prev => {
          // Remove any temporary messages
          const filteredMessages = prev.filter(
            msg => !msg.id.toString().includes("temp-")
          )
          return [...filteredMessages, response.data]
        })
      }
    } catch (error) {
      console.error("Failed to send message:", error)
      // Remove optimistic message if it failed
      setMessages(prev =>
        prev.filter(msg => !msg.id.toString().includes("temp-"))
      )
    }
  }

  const formatTime = date => {
    return formatDistanceToNow(new Date(date), {
      addSuffix: true,
      locale: ka,
    })
  }

  const handleCreateRoom = async data => {
    try {
      await ChatRoomService.createChatRoom(data)
      loadRooms()
      setShowNewChatModal(false)
    } catch (error) {
      console.error("Failed to create chat room:", error)
    }
  }

  // Add useEffect to mark messages as read when the chat is opened
  useEffect(() => {
    if (selectedRoom) {
      // Get unread messages
      const unreadMessages = messages.filter(
        msg => !msg.is_read && msg.user?.id !== currentUser?.id
      )

      if (unreadMessages.length > 0) {
        const unreadMessageIds = unreadMessages.map(msg => msg.id)
        markMessagesAsRead(unreadMessageIds)
      }
    }
  }, [selectedRoom, messages])

  const handleSelectRoom = async room => {
    setSelectedRoom(room)
    await loadMessages(room.id)
  }

  return (
    <div className="flex h-[calc(100vh-64px)] bg-white dark:!bg-gray-900">
      <ChatRoomList
        rooms={rooms}
        setRooms={setRooms}
        selectedRoom={selectedRoom}
        onSelectRoom={handleSelectRoom}
        onNewChat={() => setShowNewChatModal(true)}
        loading={loading}
        currentUser={currentUser}
      />

      <div className="flex-1 flex flex-col">
        {selectedRoom ? (
          <>
            <div className="p-4 border-b border-border dark:!border-gray-600 bg-white dark:!bg-gray-800">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <h2 className="text-lg font-semibold dark:!text-gray-100">
                    {selectedRoom.type === "private"
                      ? selectedRoom.other_participant?.name
                      : selectedRoom.name}
                  </h2>
                  <div className="text-sm text-gray-500 dark:!text-gray-400">
                    {selectedRoom.type === "group" && (
                      <span className="flex items-center gap-1">
                        <i className="bx bx-group" />
                        {selectedRoom.participants_count} members
                      </span>
                    )}
                  </div>
                </div>
                {!isConnected && (
                  <span className="text-sm text-red-500 dark:!text-red-400">
                    <i className="bx bx-wifi-off mr-1" />
                    კავშირი გაწყვეტილია...
                  </span>
                )}
              </div>
            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50 dark:!bg-gray-900 scrollbar-thin scrollbar-thumb-gray-300 dark:!scrollbar-thumb-gray-600 scrollbar-track-transparent">
              {messages.map(msg => (
                <Message
                  key={msg.id}
                  message={msg}
                  currentUser={currentUser}
                  formatTime={formatTime}
                />
              ))}
              <div ref={messagesEndRef} />
            </div>

            <MessageInput onSendMessage={handleSendMessage} />
          </>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center text-gray-500 dark:!text-gray-400">
            <i className="bx bx-message-rounded-dots text-6xl mb-4" />
            <p className="text-lg">აირჩიეთ ჩატი დასაწყებად</p>
          </div>
        )}
      </div>

      {showNewChatModal && (
        <NewChatModal
          onClose={() => setShowNewChatModal(false)}
          onCreateRoom={handleCreateRoom}
        />
      )}
    </div>
  )
}

export default ChatRoom
