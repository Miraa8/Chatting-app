import express from "express";
import { Server } from "socket.io";

const app = express();
const port = 3000;
const server = app.listen(port, () => {
  console.log("app listening");
});
const io = new Server(server, { cors: "*" });
io.on("connection", (socket) => {
  socket.on("sentMsg", (data) => {
    const { senderName, message } = data;
    io.emit("reply", { senderName, message });
  });
  socket.on("typing", () => {
    socket.broadcast.emit("userTyping");
  });
  socket.on("stoppedTyping", () => {
    socket.broadcast.emit("userStoppedTyping");
  });
});
