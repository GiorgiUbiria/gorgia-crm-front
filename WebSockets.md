# WebSocket კომუნიკაცია

რეალურ დროში კომუნიკაცია ხორციელდება Laravel Echo-ს და Laravel Reverb-ის გამოყენებით.

### კონფიგურაცია (src/plugins/echo.js)
```js
const echo = new Echo({
  broadcaster: "reverb",
  key: process.env.REACT_APP_WS_KEY,
  wsHost: process.env.REACT_APP_WS_HOST,
  wsPort: process.env.REACT_APP_WS_PORT,
  forceTLS: process.env.REACT_APP_FORCE_TLS === "true",
  // ...
})
```

### მაგალითი: შეტყობინებების მიღება (useNotifications.js)
```js
useEffect(() => {
  if (user?.id) {
    echo
      .private(`user.${user.id}`)
      .listen(".new.chat.message", handleNewMessage)
  }
  
  return () => {
    echo.private(`user.${user.id}`).stopListening(".new.chat.message")
  }
}, [user?.id])
```

### მაგალითი: ჩატის მესიჯების მიღება (ChatRoom/index.jsx)
```js
useEffect(() => {
  if (selectedRoom) {
    const channel = echo
      .join(`presence.chat.room.${selectedRoom.id}`)
      .listen(".new.chat.message", handleNewMessage)

    return () => channel.stopListening(".new.chat.message")
  }
}, [selectedRoom])
```
