const asyncHandler = require('express-async-handler');
const User = require("../models/usermodel");
const Jwt = require("jsonwebtoken");

const protect = asyncHandler(async (req, res, next) => {
let token;
if(
    req.headers.authorization && 
    req.headers.authorization.startsWith("Bearer")
){
    try{
        token= req.headers.authorization.split(" ")[1];

        //decode token id
        const decoded = Jwt.verify(token,process.env.JWT_SECRET);
        req.user = await User.findById(decoded.id).select("-password");
        next();
    }catch{
        res.status(401);
        throw new Error("not authorized , token failed");
    }
}
if(!token){
    res.status(401);
    throw new Error("not authorized , no token");
}
});

module.exports = {protect};