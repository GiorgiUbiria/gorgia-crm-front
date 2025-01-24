import Echo from "laravel-echo"
import Pusher from "pusher-js"

window.Pusher = Pusher

console.log(process.env.REACT_APP_WS_HOST, process.env.REACT_APP_WS_PORT, process.env.REACT_APP_FORCE_TLS)

const token = sessionStorage.getItem("token")

const echo = new Echo({
  broadcaster: "reverb",
  key: "ivsix8qulowu2ol2a2a2",
  wsHost: process.env.REACT_APP_WS_HOST,
  wsPort: process.env.REACT_APP_WS_PORT,
  forceTLS: process.env.REACT_APP_FORCE_TLS === "true",
  encrypted: true,
  disableStats: true,
  enabledTransports: ["ws", "wss"],
  authEndpoint: `${process.env.REACT_APP_API_URL}/api/broadcasting/auth`,
  auth: {
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: "application/json",
    },
  },
})

export default echo
