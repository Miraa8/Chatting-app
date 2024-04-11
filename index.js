import express from "express";
import { connectDB } from "./DB/connection.js";
import { Server } from "socket.io";
const app = express();
const port = 3000;

connectDB();
const server = app.listen(process.env.PORT || port, () => {
  console.log("app listening");
});
let io = new Server(server, { cors: "*" });
io.on("connection", (socket) => {
  socket.on("sentMsg", (data) => {
    io.emit("reply", data);
  });
  socket.on("typing",()=>{
    socket.broadcast.emit("userTyping")
  })
  socket.on("stoppedTyping",()=>{
    socket.broadcast.emit("userStoppedTyping")
  })
});
