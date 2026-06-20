import {
  socket,
  setHost,
  setRoomId,
  currentRoomId
} from "./socket";

import type { ShuffledDeckOrder } from "../store/gameStore";

export function createRoom() {
  setHost(true);

  socket.emit("create-room");
}

export function joinRoom(
  roomId: string
) {
  setHost(false);

  setRoomId(roomId);

  socket.emit(
    "join-room",
    roomId
  );
}

export function ready() {
  if (!currentRoomId) {
    return;
  }

  socket.emit(
    "ready",
    currentRoomId
  );
}

export function sendShuffleOrder(
  deckOrder: ShuffledDeckOrder
) {
  if (!currentRoomId) {
    return;
  }

  socket.emit(
    "sync-shuffle",
    {
      roomId: currentRoomId,
      deckOrder,
    }
  );
}

export function onShuffleOrderReceived(
  handler: (deckOrder: ShuffledDeckOrder) => void
) {
  socket.on(
    "shuffle-synced",
    handler
  );

  return () => {
    socket.off(
      "shuffle-synced",
      handler
    );
  };
}

socket.on(
  "room-created",
  (roomId: string) => {
    setRoomId(roomId);

    console.log(
      "ROOM CREATED",
      roomId
    );
  }
);

socket.on(
  "room-joined",
  (roomId: string) => {
    setRoomId(roomId);

    console.log(
      "ROOM JOINED",
      roomId
    );
  }
);
