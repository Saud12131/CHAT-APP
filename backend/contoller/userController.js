const asyncHandler = require('express-async-handler');
const User = require("../models/usermodel");
const genreateToken = require("../config/genreateToken.js");

const registerUser = asyncHandler(async (req, res) => {
  const { name, email, password, pic } = req.body;

  if (!name || !email || !password) {
    res.status(400);
    throw new Error("please enter all these feilds");

  }

  const userExists = await User.findOne({ email });
  if (userExists) {
    res.status(400);
    throw new Error("user already exists");


  }
  const user = await User.create({
    name,
    email,
    password,
    pic,
  });
  try{
    if (user) {
      res.status(201).json({
        success: true,  // Indicate a successful login
        _id: user._id,
        name: user.name,
        password: user.password,
        pic: user.pic,
        token: genreateToken(user._id),
      });
    } else {
      res.status(401).json({
        success: false,  // if email/password is wrong
        message: 'Invalid email or password',
      });
    }
  }catch(err){
    res.status(401).json({
      success: false,  //something broke
      message: `error :- ${err.message}`,
    });
  }
 
});

const authUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });

    if (user && (await user.matchpassword(password))) {
      res.json({
        success: true,  // Indicate a successful login
        _id: user._id,
        name: user.name,
        email: user.email,
        pic: user.pic,
        token: genreateToken(user._id),
      });
    } else {
      res.status(401).json({
        success: false,  // if email/password is wrong
        message: 'Invalid email or password',
      });
    }
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || 'Server Error',
    });
  }
};


module.exports = { registerUser, authUser };
