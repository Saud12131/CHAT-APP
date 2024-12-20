const express = require("express");
const router = express.Router();
const { registerUser, authUser, allUser } = require("../contoller/userController");
const {protect } = require("../middelwares/authmiddelware");

// Signup route
router.route('/signup').post(registerUser);

// Login route
router.route('/login').post(authUser);

//all users
router.route('/allusers').get(protect,allUser);

module.exports = router;    