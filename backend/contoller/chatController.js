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

const fetchChat = asyncHandler(async (req, res) => {
   try {
      Chat.find({ users: { $elemMatch: { $eq: req.user._id } } })
         .populate("users", "-passowrd")
         .populate("groupAdmin", "-password")
         .populate("latestMessage")
         .sort({ updatedAt: -1 })
         .then(async (results) => {
            results = await User.populate(results, {
               path: "latestMessage.sender",
               select: "name pic email",
            });
            res.status(200).send(results);
         });
   } catch (err) {
      res.send(err);
   }
});
const CreateGroup = async (req, res) => {
   try {

      if (!req.body || !req.body.users) {
         return res.status(400).send("Please fill all the fields");
      }

      var users = JSON.parse(req.body.users);

      if (users.length < 2) {
         return res.status(400).send("Please add more than 1 member");
      }

      users.push(req.user);

      const groupChat = await Chat.create({
         chatname: req.body.chatname,
         isGroupchat: true,
         users: users,
         groupAdmin: req.user,
      });

      const fullgroupchat  = await Chat.findOne({_id:groupChat._id})
      .populate('users','-password')
      .populate('groupAdmin','-password');

      return res.status(201).json(fullgroupchat);
   } catch (err) {
      // Handle errors
      return res.status(500).send(err.message);
   }
};

const RenameGroup = async (req, res) => {

   const { chatId, chatName } = req.body;
   if (!chatId || !chatName) {
      return res.status(400).json({ success: false, message: "chatId and chatName are required" });
   }
   try {
      const updatedchat = await Chat.findByIdAndUpdate(
         chatId,
         {
            chatName,
         },
         {
            new: true,
         }
      )
         .populate('users', '-password')
         .populate('groupAdmin', '-password');

      if (!updatedchat) {
         return res.status(401).send("chat not found");
      } else {
         return res.json({
            success: true,
            updatedchat,
         })
      }
   } catch (err) {
      return res.json({
         success: false,
         message: err.message,
      })
   }


}
   ;

const RemoveGroup = asyncHandler((req, res) => {

})

const AddtoGroup = asyncHandler((req, res) => {

})


module.exports = { accessChats, fetchChat, CreateGroup, RenameGroup, RemoveGroup, AddtoGroup };