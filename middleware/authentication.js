require("dotenv").config()
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const { UnauthenticatedError } = require("../errors");

const auth = async (req, res, next) => {
  // check header
  const authheader = req.headers.authorization;

  if (!authheader || !authheader.startsWith("Bearer ")) {
    throw new UnauthenticatedError("Invalid Credential");
  }

  const token = authheader.split(" ")[1];

  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET) 
    
    // dont forget to avoid the password appeared
    const user = User.findById(payload.id).select('-password')
    req.user = user

    req.user = {userId : payload.userId, username: payload.username}
    next()
  } catch (error) {
    throw new UnauthenticatedError('Authentication invalid')
  }
};

module.exports = auth;
