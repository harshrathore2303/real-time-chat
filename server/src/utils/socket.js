import { Server } from "socket.io";
import http from "http";
import express from "express";

const app = express();
const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: "*",
  },
});


const userSocketMap = {};

export function getReceiverSocketId (userId){
  return userSocketMap[userId];
}

io.on("connection", (socket) => {
  // console.log("User Connected with id: ", socket.id);
  const userId = socket.handshake.query.userId;
  if (userId){
    userSocketMap[userId] = socket.id;
  }

  io.emit("getOnlineUsers", Object.keys(userSocketMap));
  socket.on("disconnect", ()=>{
    console.log("User disconnected: ", socket.id);
    delete userSocketMap[userId];
    io.emit("getOnlineUsers", Object.keys(userSocketMap));
  })
});

export { server, app, io };
