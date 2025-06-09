import { Server } from "socket.io";
import http from "http";
import express from "express";
import cloudinary from "./cloudinary.js";
import { Message } from "../models/message.model.js";

const app = express();
const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: "*",
  },
});

const userSocketMap = {};
const waitingQueue = [];
const activePartners = new Map();

export function getReceiverSocketId(userId) {
  return userSocketMap[userId];
}

const pairUsers = (socketA, socketB) => {
  if (!socketA || !socketB || socketA === socketB) {
    return;
  }

  socketA.partnerId = socketB.id;
  socketB.partnerId = socketA.id;

  activePartners.set(socketA.id, socketB.id);
  activePartners.set(socketB.id, socketA.id);

  socketA.emit("matchFound", { partnerSocketId: socketB.id });
  socketB.emit("matchFound", { partnerSocketId: socketA.id });
};

const removeFromQueue = (socket) => {
  const index = waitingQueue.findIndex((s) => s.id === socket.id);
  if (index !== -1) {
    waitingQueue.splice(index, 1);
  }
};

io.on("connection", (socket) => {
  // console.log("User Connected with id: ", socket.id);
  const userId = socket.handshake.query.userId;
  if (userId) {
    userSocketMap[userId] = socket.id;
  }

  io.emit("getOnlineUsers", Object.keys(userSocketMap));

  socket.on("joinQueue", () => {
    if (waitingQueue.length > 0) {
      const partner = waitingQueue.shift();
      pairUsers(socket, partner);
    } else {
      waitingQueue.push(socket);
    }
  });

  socket.on("sendMessage", async ({ text, image }) => {
    const partnerId = socket.partnerId;
    if (!partnerId) return;

    let imageUrl;
    if (image) {
      try {
        const uploadResponse = await cloudinary.uploader.upload(image);
        imageUrl = uploadResponse.secure_url;
      } catch (error) {
        console.log("Error", error.messaage);
        return;
      }
    }

    const newMessage = await Message.create({
      senderId: socket.id,
      receiverId: partnerId,
      text,
      image: imageUrl,
    });

    io.to(partnerId).emit("receiveMessage", newMessage);
    io.to(socket.id).emit("receiveMessage", newMessage);
  });

  socket.on("next", () => {
    const partnerId = socket.partnerId;
    if (partnerId) {
      io.to(partnerId).emit("partnerLeft");

      const partnerSocket = io.sockets.sockets.get(partnerId);
      if (partnerSocket) {
        partnerSocket.partnerId = null;
        activePartners.delete(partnerSocket.id);
        waitingQueue.push(partnerSocket);
      }
    }

    socket.partnerId = null;
    activePartners.delete(socket.id);

    socket.emit("joinQueue");
  });

  socket.on("stop", () => {
    const partnerId = socket.partnerId;
    if (partnerId) {
      io.to(partnerId).emit("partnerLeft");

      const partnerSocket = io.sockets.sockets.get(partnerId);
      if (partnerSocket) partnerSocket.partnerId = null;

      activePartners.delete(partnerId);
    }

    socket.partnerId = null;
    activePartners.delete(socket.id);
    removeFromQueue(socket);
  });

  socket.on("disconnect", () => {
    const partnerId = socket.partnerId;
    if (partnerId) {
      io.to(partnerId).emit("partnerLeft");

      const partnerSocket = io.sockets.sockets.get(partnerId);
      if (partnerSocket) partnerSocket.partnerId = null;

      activePartners.delete(partnerId);
    }

    socket.partnerId = null;
    activePartners.delete(socket.id);
    removeFromQueue(socket);

    console.log("User disconnected: ", socket.id);
    delete userSocketMap[userId];
    io.emit("getOnlineUsers", Object.keys(userSocketMap));
  });
});

export { server, app, io };
