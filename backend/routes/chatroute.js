const express = require("express");
const { protect } = require("../middelwares/authmiddelware");
const { accessChats } = require("../contoller/chatController");
const router = express.Router();


router.route("/allchats").post(protect,accessChats);

module.exports = router;