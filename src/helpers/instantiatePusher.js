import Echo from "laravel-echo";
import Pusher from "pusher-js";
import axios from "../plugins/axios";

export default async function instantiatePusher() {
  window.Pusher = Pusher;

  window.Echo = new Echo({
    authEndpoint: `https://back.gorgia.ge/broadcasting/auth`,
    broadcaster: "pusher",
    key: "56b2b5806dcd4fff50f4",
    forceTLS: true,
    cluster: ["ap2"],
    encrypted: true,
    authorizer: (channel) => {
      return {
        authorize: (socketId, callback) => {
          axios
            .post(
              `https://back.gorgia.ge/broadcasting/auth`,
              {
                socket_id: socketId,
                channel_name: channel.name,
              },
              { withCredentials: true }
            )
            .then((response) => {
                console.log('Pusher auth success:', response.data);
              callback(null, response.data);
            })
            .catch((error) => {
                console.error('Pusher auth error:', error);
              callback(error);
            });
        },
      };
    },
  });

  return true;
}