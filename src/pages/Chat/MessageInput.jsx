import React, { useState } from "react"
import messageService from "../../services/messageService" // New import

const MessageInput = () => {
  const [message, setMessage] = useState("")

  const sendMessage = async e => {
    e.preventDefault()
    if (message.trim() === "") {
      alert("Please enter a message!")
      return
    }

    try {
      await messageService.sendMessage(message) // Using the messageService
      setMessage("")
    } catch (err) {
      console.log(err.message)
    }
  }

  return (
    <div className="input-group">
      <input
        onChange={e => setMessage(e.target.value)}
        autoComplete="off"
        type="text"
        className="form-control"
        placeholder="Message..."
        value={message}
      />
      <div className="input-group-append">
        <button
          onClick={sendMessage} // Simplified event handler
          className="btn btn-primary"
          type="button"
        >
          Send
        </button>
      </div>
    </div>
  )
}

export default MessageInput
