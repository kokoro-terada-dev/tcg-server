import express from "express";
import { createServer } from "http";
import { Server } from "socket.io";
import {
    createRoom,
    joinRoom,
    setReady
} from "./roomManager";

const app = express();

app.get("/", (_, res) => {
    res.send("Server Running");
});

const httpServer = createServer(app);

const io = new Server(httpServer, {
    cors: {
        origin: "*",
    },
});

io.on("connection", (socket) => {
    console.log("connected:", socket.id);

    socket.emit("welcome", {
        socketId: socket.id,
    });

    socket.on("disconnect", () => {
        console.log("disconnected:", socket.id);
    });

    socket.on("create-room", () => {
        const roomId =
            createRoom(socket.id);

        socket.join(roomId);

        socket.emit(
            "room-created",
            roomId
        );
    });

    socket.on("disconnect", () => {
        console.log("disconnected:", socket.id);
    });

    socket.on(
        "join-room",
        (roomId) => {
            const success =
                joinRoom(
                    roomId,
                    socket.id
                );

            if (!success) {
                socket.emit(
                    "join-failed"
                );

                return;
            }

            socket.join(roomId);

            io.to(roomId).emit(
                "room-joined",
                roomId
            );
        }
    );

    socket.on(
        "join-room",
        (roomId: string) => {
            const success =
                joinRoom(
                    roomId,
                    socket.id
                );

            if (!success) {
                socket.emit(
                    "join-failed"
                );

                return;
            }

            socket.join(roomId);

            io.to(roomId).emit(
                "room-joined",
                roomId
            );
        }
    );

    socket.on(
        "ready",
        (roomId: string) => {
            const state =
                setReady(
                    roomId,
                    socket.id
                );

            if (!state) {
                return;
            }

            io.to(roomId).emit(
                "ready-state",
                state
            );

            if (
                state.player1Ready &&
                state.player2Ready
            ) {
                io.to(roomId).emit(
                    "game-start"
                );
            }
        }
    );
});

const PORT = process.env.PORT || 3000;

httpServer.listen(PORT, () => {
    console.log(`server start ${PORT}`);
});