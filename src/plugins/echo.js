import Echo from "laravel-echo"
import Pusher from "pusher-js"

window.Pusher = Pusher

const token = sessionStorage.getItem("token")

// const echo = new Echo({
//   broadcaster: "reverb",
//   key: "ivsix8qulowu2ol2a2a2",
//   wsHost: "localhost",
//   wsPort: 8080,
//   forceTLS: false,
//   encrypted: true,
//   disableStats: true,
//   enabledTransports: ["ws", "wss"],
//   authEndpoint: `${process.env.REACT_APP_API_URL}/api/broadcasting/auth`,
//   auth: {
//     headers: {
//       Authorization: `Bearer ${token}`,
//       Accept: "application/json",
//     },
//   },
// })

const echo = new Echo({
  broadcaster: "reverb",
  key: "ivsix8qulowu2ol2a2a2",
  wsHost: "back.gorgia.ge",
  wsPort: 8080,
  forceTLS: true,
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
