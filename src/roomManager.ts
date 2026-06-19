const rooms = new Map<string, string[]>();

export function createRoom(
  socketId: string
) {
  const roomId = Math.random()
    .toString(36)
    .substring(2, 6)
    .toUpperCase();

  rooms.set(roomId, [socketId]);

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