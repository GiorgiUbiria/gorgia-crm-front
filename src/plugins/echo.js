import Echo from "laravel-echo"
import Pusher from "pusher-js"

window.Pusher = Pusher

const token = sessionStorage.getItem("token")
const authorization = "Bearer " + token
console.log("Authorization", authorization)

const echo = new Echo({
  broadcaster: "reverb",
  cluster: "eu",
  key: process.env.REACT_APP_REVERB_KEY || "ivsix8qulowu2ol2a2a2",
  wsHost: process.env.REACT_APP_REVERB_HOST || "localhost",
  wsPort: process.env.REACT_APP_REVERB_PORT || 8080,
  forceTLS: false,
  encrypted: true,
  disableStats: true,
  enabledTransports: ["ws", "wss"],
  auth: {
    headers: {
      Authorization: "Bearer " + token,
    },
  },
  authEndpoint: `${process.env.REACT_APP_API_URL}/api/broadcasting/auth`,
})

console.log("Echo setup", echo)

// const echo = new Echo({
//   broadcaster: "reverb",
//   key: "ivsix8qulowu2ol2a2a2",
//   wsHost: "back.gorgia.ge",
//   wsPort: 443,
//   wssPort: 443,
//   forceTLS: true,
//   encrypted: true,
//   disableStats: true,
//   enabledTransports: ["ws", "wss"],
//   auth: {
//     headers: {
//       Authorization: `Bearer ${localStorage.getItem("token")}`,
//       Accept: "application/json",
//     },
//   },
// })

export default echo
