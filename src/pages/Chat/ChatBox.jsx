import React, { useEffect, useRef, useState } from "react"
import Message from "./Message.jsx"
import MessageInput from "./MessageInput.jsx"
import { useSelector } from "react-redux"
import Echo from "../../plugins/echo"
import messageService from "../../services/messageService"

const ChatBox = ({ rootUrl }) => {
  const user = useSelector(state => state.authUser)

  const webSocketChannel = `channel_for_everyone`

  const [messages, setMessages] = useState([])
  const scroll = useRef()

  const scrollToBottom = () => {
    scroll.current.scrollIntoView({ behavior: "smooth" })
  }

  const connectWebSocket = () => {
    Echo.private(webSocketChannel).listen("GotMessage", () => {
      getMessages()
    })
  }

  const getMessages = async () => {
    try {
      const response = await messageService.getMessages()
      setMessages(response.data)
      setTimeout(scrollToBottom, 0)
    } catch (err) {
      console.log(err.message)
    }
  }

  useEffect(() => {
    getMessages()
    connectWebSocket()

    return () => {
      Echo.leave(webSocketChannel)
    }
  }, [])

  return (
    <div className="row justify-content-center">
      <div className="col-md-8">
        <div className="card">
          <div className="card-header">Chat Box</div>
          <div
            className="card-body"
            style={{ height: "500px", overflowY: "auto" }}
          >
            {messages?.map(message => (
              <Message key={message.id} userId={user.id} message={message} />
            ))}
            <span ref={scroll}></span>
          </div>
          <div className="card-footer">
            <MessageInput rootUrl={rootUrl} />
          </div>
        </div>
      </div>
    </div>
  )
}

export default ChatBox
