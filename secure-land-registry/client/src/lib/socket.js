import { io } from "socket.io-client";

const socket = io("https://land-registry-backend-h86i.onrender.com", {
  transports: ["websocket"],
  withCredentials: true,
});

export default socket;
