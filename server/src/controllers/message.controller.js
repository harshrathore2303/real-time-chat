import { User } from "../models/user.model.js";
import { Message } from "../models/message.model.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import cloudinary from "../utils/cloudinary.js";
import { getReceiverSocketId, io } from "../utils/socket.js";

const getUsersForSidebar = asyncHandler(async (req, res) => {
  const loggedInUserId = req.user._id;
  const filteredUsers = await User.find({ _id: { $ne: loggedInUserId } }).select(
    "-password"
  );

  res.status(200).json(new ApiResponse(200, filteredUsers));
});

const getMessages = asyncHandler(async (req, res) => {
  const { id: userToChatId } = req.params;
  const myId = req.user._id;

  const messages = await Message.find({
    $or: [
      { senderId: myId, receiverId: userToChatId },
      { senderId: userToChatId, receiverId: myId },
    ],
  });

  res.status(200).json(messages);
});

const sendMessage = asyncHandler(async (req, res) => {
  // console.log("req");
  const { text, image } = req.body;
  const { id: receiverId } = req.params;
  const senderId = req.user._id;

  let imageUrl;
  if (image){
    const uploadResponse = await cloudinary.uploader.upload(image);;
    imageUrl = uploadResponse.secure_url;
  }
  
  const newMessage = await Message.create({
    senderId,
    receiverId,
    text,
    image: imageUrl
  })

  const receiverSocketId = getReceiverSocketId(receiverId);
  if (receiverSocketId){
    io.to(receiverSocketId).emit("newMessage", newMessage);
  }

  res.status(201).json(newMessage)
});

export { getUsersForSidebar, getMessages, sendMessage };
