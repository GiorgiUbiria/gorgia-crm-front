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
          "max-w-[70%] rounded-2xl p-3 break-words relative transition-all duration-200",
          {
            "bg-[#0095F6] text-white": isMyMessage,
            "bg-[#262626] dark:!bg-[#363636] text-white": !isMyMessage,
          }
        )}
      >
        {message.type === "text" && (
          <p className="text-sm leading-relaxed">{message.message}</p>
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
            className="text-blue-400 hover:text-blue-500 flex items-center gap-1"
          >
            <i className="bx bx-file" />
            {message.file_name}
          </a>
        )}
        <div className="text-xs opacity-70 mt-1">
          {formatTime(message.created_at)}
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
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto"
      textareaRef.current.style.height = `${Math.min(
        textareaRef.current.scrollHeight,
        200
      )}px`
    }
  }

  return (
    <div className="p-4 border-t border-[#262626] dark:!border-[#363636] bg-white dark:!bg-gray-800 rounded-r-md">
      <form onSubmit={handleSubmit} className="flex items-center gap-2">
        <div className="flex-1 relative">
          <textarea
            ref={textareaRef}
            value={message}
            onChange={handleInputChange}
            placeholder="შეიყვანეთ შეტყობინება..."
            rows={1}
            className="w-full min-h-[48px] max-h-[200px] rounded-full border border-[#262626] dark:!border-[#363636] p-3 pl-4 pr-20 bg-white dark:!bg-[#121212] text-[#262626] dark:!text-white resize-none overflow-y-auto transition-all duration-200 focus:ring-1 focus:ring-[#0095F6] focus:border-[#0095F6] scrollbar-thin scrollbar-thumb-gray-300 dark:!scrollbar-thumb-gray-600 scrollbar-track-transparent"
          />
          <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-2">
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="p-1.5 text-[#262626] dark:!text-white hover:text-[#0095F6] dark:!hover:text-[#0095F6] transition-colors"
              title="ფაილის მიმაგრება"
            >
              <i className="bx bx-paperclip text-xl" />
            </button>
          </div>
          <input
            type="file"
            onChange={e => setFile(e.target.files[0])}
            ref={fileInputRef}
            className="hidden"
          />
        </div>
        <button
          type="submit"
          className="h-12 w-12 flex items-center justify-center bg-[#0095F6] text-white rounded-full hover:bg-[#0095F6]/90 transition-all duration-200"
          title="გაგზავნა"
        >
          <i className="bx bx-send text-xl" />
        </button>
      </form>
      {file && (
        <div className="mt-2 text-sm text-[#262626] dark:!text-white flex items-center justify-between bg-[#F5F5F5] dark:!bg-[#262626] rounded-lg p-2">
          <span>{file.name}</span>
          <button
            onClick={() => {
              setFile(null)
              if (fileInputRef.current) {
                fileInputRef.current.value = ""
              }
            }}
            className="text-red-500 hover:text-red-600"
            title="ფაილის წაშლა"
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
  onSearch,
  isOpen,
  onClose,
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
              "bx-check-double text-blue-600 dark:!text-blue-400": isRead,
            })}
          />
        )}
        <span className="truncate text-gray-500 dark:!text-gray-400">
          {room.last_message.type === "text" && room.last_message.message}
          {room.last_message.type === "image" && "📷 სურათი"}
          {room.last_message.type === "file" && "📄 ფაილი"}
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

  const listContent = (
    <div className="h-full flex flex-col bg-white dark:!bg-gray-800 rounded-l-md">
      <div className="p-4">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-medium text-gray-900 dark:!text-gray-100">
            CRM ჩათი
          </h2>
          <div className="flex items-center gap-2">
            <DialogButton actionType="add" size="sm" onClick={onNewChat} />
            <button
              className="lg:hidden p-2 text-gray-500 hover:text-gray-700 dark:!text-gray-400 dark:!hover:text-gray-300"
              onClick={onClose}
            >
              <i className="bx bx-x text-xl" />
            </button>
          </div>
        </div>
        <div className="mb-4">
          <div className="relative">
            <input
              type="text"
              placeholder="მოძებნეთ მიმოწერა..."
              className="w-full h-10 pl-10 pr-4 rounded-lg border border-gray-200 dark:!border-gray-700 bg-white dark:!bg-gray-800 text-gray-900 dark:!text-gray-100 placeholder-gray-500 dark:!placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              onChange={e => onSearch(e.target.value)}
            />
            <i className="bx bx-search absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 dark:!text-gray-500" />
          </div>
        </div>
        <div className="mb-4">
          <h3 className="text-sm font-medium text-gray-500 dark:!text-gray-400 uppercase tracking-wider mb-2">
            მიმოწერები
          </h3>
        </div>
        <div className="space-y-1">
          {loading ? (
            <div className="text-center p-4 text-gray-500 dark:!text-gray-400">
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
                        "bg-blue-50 dark:!bg-blue-900/20":
                          selectedRoom?.id === room.id,
                        "hover:bg-gray-50 dark:!hover:bg-gray-700/50":
                          selectedRoom?.id !== room.id,
                      }
                    )}
                    onClick={() => {
                      onSelectRoom(room)
                      onClose?.()
                    }}
                  >
                    <div className="flex items-center gap-3">
                      <div className="relative">
                        <div className="w-12 h-12 rounded-full bg-gray-100 dark:!bg-gray-700 overflow-hidden">
                          {/* Add avatar image here if available */}
                        </div>
                        <div className="absolute bottom-0 right-0 w-3 h-3 rounded-full bg-green-400 border-2 border-white dark:!border-gray-800" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <h3 className="font-medium text-gray-900 dark:!text-gray-100 truncate">
                            {room.type === "private"
                              ? `${room.other_participant?.name} ${room.other_participant?.sur_name}`
                              : room.name}
                          </h3>
                          {room.type === "group" && (
                            <span className="text-xs text-gray-500 dark:!text-gray-400">
                              · {(room.other_participants?.length || 0) + 1}{" "}
                              წევრი
                            </span>
                          )}
                        </div>
                        <div className="text-sm">{renderLastMessage(room)}</div>
                      </div>
                      <div className="text-xs text-gray-500 dark:!text-gray-400">
                        {room.last_message &&
                          formatDistanceToNow(
                            new Date(room.last_message.created_at),
                            {
                              addSuffix: false,
                              locale: ka,
                            }
                          )}
                      </div>
                    </div>
                  </div>
                )
            )
          )}
        </div>
      </div>
    </div>
  )

  return (
    <>
      {/* Desktop view */}
      <div className="hidden lg:block w-[360px] border-r border-gray-200 dark:!border-gray-700 overflow-y-auto rounded-l-md">
        {listContent}
      </div>

      {/* Mobile view */}
      <div
        className={classNames(
          "lg:hidden fixed inset-0 bg-black bg-opacity-50 z-40 transition-opacity",
          {
            "opacity-100 pointer-events-auto": isOpen,
            "opacity-0 pointer-events-none": !isOpen,
          }
        )}
        onClick={onClose}
      >
        <div
          className={classNames(
            "absolute left-0 top-0 bottom-0 w-[320px] transition-transform transform",
            {
              "translate-x-0": isOpen,
              "-translate-x-full": !isOpen,
            }
          )}
          onClick={e => e.stopPropagation()}
        >
          {listContent}
        </div>
      </div>
    </>
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

// SearchInConversation component
const SearchInConversation = ({ messages, searchQuery, onClose }) => {
  const filteredMessages = messages.filter(msg =>
    msg.message?.toLowerCase().includes(searchQuery.toLowerCase())
  )

  return (
    <div className="absolute inset-y-0 right-0 w-80 bg-white dark:!bg-[#121212] border-l border-[#262626] dark:!border-[#363636] shadow-lg">
      <div className="p-4 border-b border-[#262626] dark:!border-[#363636] flex items-center justify-between">
        <h3 className="text-lg font-semibold text-[#262626] dark:!text-white">
          მიმოწერაში ძიება
        </h3>
        <button
          onClick={onClose}
          className="p-2 text-[#262626] dark:!text-white hover:text-[#0095F6] dark:!hover:text-[#0095F6] transition-colors"
        >
          <i className="bx bx-x text-xl" />
        </button>
      </div>
      <div className="p-4 space-y-4 overflow-y-auto max-h-[calc(100vh-200px)]">
        {filteredMessages.length > 0 ? (
          filteredMessages.map(msg => (
            <div
              key={msg.id}
              className="p-3 rounded-lg bg-[#F5F5F5] dark:!bg-[#262626]"
            >
              <div className="flex items-center gap-2 mb-2">
                <span className="font-medium text-[#262626] dark:!text-white">
                  {msg.user?.name} {msg.user?.sur_name}
                </span>
                <span className="text-xs text-[#737373] dark:!text-[#A8A8A8]">
                  {new Date(msg.created_at).toLocaleString("ka-GE")}
                </span>
              </div>
              <p className="text-sm text-[#262626] dark:!text-white">
                {msg.message}
              </p>
            </div>
          ))
        ) : (
          <div className="text-center text-[#737373] dark:!text-[#A8A8A8]">
            შეტყობინებები ვერ მოიძებნა
          </div>
        )}
      </div>
    </div>
  )
}

// MembersList component
const MembersList = ({ room, onClose }) => {
  const members = [
    // Include the current room owner/admin
    {
      ...room.pivot,
      id: room.created_by,
      role: "admin",
    },
    // Add other participants
    ...(room.other_participants || []).map(member => ({
      ...member,
      role: member.pivot?.role || "member",
    })),
  ]

  return (
    <div className="absolute inset-y-0 right-0 w-80 bg-white dark:!bg-[#121212] border-l border-[#262626] dark:!border-[#363636] shadow-lg">
      <div className="p-4 border-b border-[#262626] dark:!border-[#363636] flex items-center justify-between">
        <h3 className="text-lg font-semibold text-[#262626] dark:!text-white">
          მონაწილეების სია ({members.length})
        </h3>
        <button
          onClick={onClose}
          className="p-2 text-[#262626] dark:!text-white hover:text-[#0095F6] dark:!hover:text-[#0095F6] transition-colors"
        >
          <i className="bx bx-x text-xl" />
        </button>
      </div>
      <div className="p-4 space-y-4 overflow-y-auto max-h-[calc(100vh-200px)]">
        {members.map(member => (
          <div
            key={member.id}
            className="flex items-center gap-3 p-3 rounded-lg hover:bg-[#F5F5F5] dark:!hover:bg-[#262626] transition-colors"
          >
            <div className="w-10 h-10 rounded-full bg-[#F5F5F5] dark:!bg-[#363636] overflow-hidden">
              {/* Add avatar image here if available */}
            </div>
            <div className="flex-1 min-w-0">
              <h4 className="font-medium text-[#262626] dark:!text-white">
                {member.name} {member.sur_name}
              </h4>
              <p className="text-sm text-[#737373] dark:!text-[#A8A8A8] truncate">
                {member.position}
              </p>
            </div>
            <div className="ml-auto">
              {member.role === "admin" && (
                <span className="text-xs px-2 py-1 rounded-full bg-[#0095F6]/10 text-[#0095F6]">
                  ადმინი
                </span>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
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
  const [showDropdown, setShowDropdown] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const [showSearch, setShowSearch] = useState(false)
  const [showMembers, setShowMembers] = useState(false)
  const messagesEndRef = useRef(null)
  const dropdownRef = useRef(null)
  const [isMobileListOpen, setIsMobileListOpen] = useState(false)

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

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = event => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowDropdown(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
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

  // Show members list
  const showMembersList = () => {
    if (!selectedRoom || selectedRoom.type !== "group") return
    setShowMembers(true)
    setShowDropdown(false)
  }

  const handleSearch = query => {
    setSearchQuery(query)
    // Filter rooms based on the search query
    if (query.trim()) {
      const filteredRooms = rooms.filter(room => {
        const roomName =
          room.type === "private"
            ? `${room.other_participant?.name} ${room.other_participant?.sur_name}`
            : room.name
        return (
          roomName.toLowerCase().includes(query.toLowerCase()) ||
          room.last_message?.message
            ?.toLowerCase()
            .includes(query.toLowerCase())
        )
      })
      setRooms(filteredRooms)
    } else {
      // If search query is empty, reload original rooms
      loadRooms()
    }
  }

  // Add search functionality for messages within a conversation
  const searchInConversation = () => {
    if (!selectedRoom || !searchQuery.trim()) return
    setShowSearch(true)
    setShowDropdown(false)
  }

  return (
    <div className="flex h-[calc(100vh-64px)] bg-white dark:!bg-gray-900 rounded-md">
      <ChatRoomList
        rooms={rooms}
        setRooms={setRooms}
        selectedRoom={selectedRoom}
        onSelectRoom={handleSelectRoom}
        onNewChat={() => setShowNewChatModal(true)}
        loading={loading}
        currentUser={currentUser}
        onSearch={handleSearch}
        isOpen={isMobileListOpen}
        onClose={() => setIsMobileListOpen(false)}
      />

      <div className="flex-1 flex flex-col relative">
        {selectedRoom ? (
          <>
            <div className="p-4 border-b border-gray-200 dark:!border-gray-700 bg-white dark:!bg-gray-800 rounded-t-md">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <button
                    className="lg:hidden p-2 text-gray-500 hover:text-gray-700 dark:!text-gray-400 dark:!hover:text-gray-300"
                    onClick={() => setIsMobileListOpen(true)}
                  >
                    <i className="bx bx-menu text-xl" />
                  </button>
                  <div className="w-10 h-10 rounded-full bg-gray-100 dark:!bg-gray-700 overflow-hidden">
                    {/* Add avatar image here if available */}
                  </div>
                  <div>
                    <h2 className="text-lg font-medium text-gray-900 dark:!text-gray-100">
                      {selectedRoom.type === "private"
                        ? `${selectedRoom.other_participant?.name} ${selectedRoom.other_participant?.sur_name}`
                        : selectedRoom.name}
                    </h2>
                    <div className="text-sm text-gray-500 dark:!text-gray-400 flex items-center gap-2">
                      {isConnected ? (
                        <>
                          <span className="w-2 h-2 rounded-full bg-green-400" />
                          <span>აქტიური</span>
                        </>
                      ) : (
                        <>
                          <span className="w-2 h-2 rounded-full bg-red-400" />
                          <span>კავშირი გაწყვეტილია</span>
                        </>
                      )}
                    </div>
                  </div>
                </div>
                <div className="relative" ref={dropdownRef}>
                  <button
                    className="p-2 text-gray-500 hover:text-gray-700 dark:!text-gray-400 dark:!hover:text-gray-300 transition-colors"
                    onClick={() => setShowDropdown(!showDropdown)}
                    title="მეტი ოპცია"
                  >
                    <i className="bx bx-dots-vertical-rounded text-xl" />
                  </button>
                  {showDropdown && (
                    <div className="absolute right-0 mt-2 w-48 rounded-md shadow-lg bg-white dark:!bg-gray-800 ring-1 ring-black ring-opacity-5 z-50">
                      <div className="py-1">
                        <button
                          className="w-full text-left px-4 py-2 text-sm text-gray-700 dark:!text-gray-200 hover:bg-gray-100 dark:!hover:bg-gray-700"
                          onClick={searchInConversation}
                        >
                          მიმოწერაში ძიება
                        </button>
                        {selectedRoom.type === "group" && (
                          <button
                            className="w-full text-left px-4 py-2 text-sm text-gray-700 dark:!text-gray-200 hover:bg-gray-100 dark:!hover:bg-gray-700"
                            onClick={showMembersList}
                          >
                            მონაწილეების სია
                          </button>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-white dark:!bg-gray-800 scrollbar-thin scrollbar-thumb-gray-300 dark:!scrollbar-thumb-gray-600 scrollbar-track-transparent">
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

            {showSearch && (
              <SearchInConversation
                messages={messages}
                searchQuery={searchQuery}
                onClose={() => setShowSearch(false)}
              />
            )}

            {showMembers && (
              <MembersList
                room={selectedRoom}
                onClose={() => setShowMembers(false)}
              />
            )}
          </>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center">
            <div className="lg:hidden mb-4">
              <button
                className="p-2 text-gray-500 hover:text-gray-700 dark:!text-gray-400 dark:!hover:text-gray-300"
                onClick={() => setIsMobileListOpen(true)}
              >
                <i className="bx bx-menu text-xl" />
              </button>
            </div>
            <i className="bx bx-message-rounded-dots text-6xl mb-4 text-gray-400 dark:!text-gray-600" />
            <p className="text-lg text-gray-500 dark:!text-gray-400">
              აირჩიეთ ჩატი დასაწყებად
            </p>
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
