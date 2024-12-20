const mongoose = require('mongoose');

const chatModel = mongoose.Schema(
    {
        chatname: { type: String, trim: true },
        isGroupchat: { type: Boolean, default: false },
        users: [{
            type: mongoose.Schema.Types.ObjectId,
            ref: "User"
        }],
        latestMessage: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Message",
        },
        groupAdmin: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
        },

    },
    {
        timestamps: true,
    }
);

const Chat = mongoose.model("Chats", chatModel);
module.exports = Chat;