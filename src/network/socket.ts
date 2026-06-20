import { io } from "socket.io-client";

export const socket = io(
  "https://tcg-server-u085.onrender.com",
  {
    transports: ["websocket"],
  }
);

export let currentRoomId: string | null =
  null;

export let isHost = false;

export function setRoomId(
  roomId: string
) {
  currentRoomId = roomId;
}

export function setHost(
  value: boolean
) {
  isHost = value;
}