import express from "express";
import { createServer } from "http";
import { Server } from "socket.io";

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
});

const PORT = process.env.PORT || 3000;

httpServer.listen(PORT, () => {
  console.log(`server start ${PORT}`);
});