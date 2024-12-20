const asyncHandler = require("express-async-handler");
const Chat = require('../models/chatmodel.js');
const User = require('../models/usermodel.js')
const mongoose = require('mongoose');

const accessChats = asyncHandler(async (req, res) => {
   const { userId } = req.body;
   if (!userId) {
      console.log("params not send ");
      return res.sendStatus(400);
   }
   try {
      // Search for a chat between the logged-in user and the requested user
      var isChat = await Chat.find({
         isGroupchat: false,
         $and: [
            { users: { $elemMatch: { $eq: req.user._id } } },
            { users: { $elemMatch: { $eq: new mongoose.Types.ObjectId(userId) } } },
         ],
      })
         .populate("users", "-password")
         .populate("latestMessage");

      // Populate the latestMessage's sender details
      isChat = await User.populate(isChat, {
         path: "latestMessage.sender",
         select: "name pic email",
      });

      if (isChat.length > 0) {
         res.send(isChat[0]);
      } else {
         // If no chat exists, create a new one
         var chatData = {
            chatName: "sender",
            isGroupchat: false,
            users: [req.user._id, mongoose.Types.ObjectId(userId)],
         };

         const createdChat = await Chat.create(chatData);
         const fullChat = await Chat.findOne({ _id: createdChat._id })
            .populate("users", "-password");
         res.status(200).send(fullChat);
      }
   } catch (err) {
      res.status(400);
      throw new Error(err.message);
   }
});

module.exports = { accessChats };