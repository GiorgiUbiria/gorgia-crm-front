import Echo from "laravel-echo"
import Pusher from "pusher-js"

window.Pusher = Pusher

const echo = new Echo({
  broadcaster: "reverb",
  key: "ivsix8qulowu2ol2a2a2", // This should match REVERB_APP_KEY in your .env
  wsHost: "localhost",
  wsPort: 8080, // This should match REVERB_PORT in your .env
  forceTLS: false,
  encrypted: false,
  disableStats: true,
  enabledTransports: ["ws", "wss"],
  auth: {
    headers: {
      Authorization: `Bearer ${localStorage.getItem("token")}`,
      Accept: "application/json",
    },
  },
  debug: true,
})

export default echo
