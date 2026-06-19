import { RoomState } from "./types";

const rooms = new Map<string, string[]>();

const roomStates =
  new Map<string, RoomState>();

export function createRoom(
  socketId: string
) {
  const roomId = Math.random()
    .toString(36)
    .substring(2, 6)
    .toUpperCase();

  rooms.set(roomId, [socketId]);

  roomStates.set(roomId, {
    player1Ready: false,
    player2Ready: false
  });

  return roomId;
}

export function joinRoom(
  roomId: string,
  socketId: string
) {
  const room = rooms.get(roomId);

  if (!room) {
    return false;
  }

  if (room.length >= 2) {
    return false;
  }

  room.push(socketId);

  return true;
}

export function setReady(
  roomId: string,
  socketId: string
) {
  const room = rooms.get(roomId);

  const state =
    roomStates.get(roomId);

  if (!room || !state) {
    return null;
  }

  if (room[0] === socketId) {
    state.player1Ready = true;
  }

  if (room[1] === socketId) {
    state.player2Ready = true;
  }

  return state;
}