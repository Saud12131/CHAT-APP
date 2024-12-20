const express = require("express");
const { protect } = require("../middelwares/authmiddelware");
const { accessChats, fetchChat, CreateGroup, RenameGroup, RemoveGroup, AddtoGroup } = require("../contoller/chatController");
const router = express.Router();


router.route("/").post(protect, accessChats);
router.route("/").get(protect, fetchChat);
router.route("/group").post(protect, CreateGroup);
router.route("/rename").put(protect, RenameGroup);
router.route("/groupremove").put(protect, RemoveGroup);
router.route("/groupadd").put(protect, AddtoGroup);

module.exports = router;