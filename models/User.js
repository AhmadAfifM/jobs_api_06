require("dotenv").config();
const mongoose = require("mongoose");
const bycrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const {UnauthenticatedError} = require('../errors')

const UserSchema = new mongoose.Schema({
  username: {
    type: String,
    required: [true, "Please provide the username!"],
    minLength: 3,
    maxLength: 50,
  },
  email: {
    type: String,
    required: [true, "Please provide the email!"],
    minLength: 3,
    maxLength: 50,
    match: [
      /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
      `Please provide a valid email!`,
    ],
    unique: true,
  },
  password: {
    type: String,
    required: [true, "Please provide the password!"],
    minLength: 6,
  },
  password2: {
    type: String,
    required: [true, "Please provide the password2!"],
    minLength: 6,
  },
});

// THIS IS MONGOOSE MIDDLEWARE
// this code is avoid us to write the code to hashing the password in controller
UserSchema.pre("save", async function (next) {
  const salt = await bycrypt.genSalt(10);
  this.password = await bycrypt.hash(this.password, salt);
});

UserSchema.methods.createJWT = function () {
  // return jwt.sign(
  //   { userId: user._id, username: user.username },
  //   process.env.JWT_SECRET,
  //   { expiresIn: "30d" }
  // );
  return jwt.sign(
    { userId: this._id, username: this.username },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRESIN }
  );
};

UserSchema.methods.comparePass = async function(candidatePassword){
  // WAY 2 to check empty
  // if(!candidatePassword){
  //   throw new UnauthenticatedError('No Credential Password!')
  // }
  const isMatch = await bycrypt.compare(candidatePassword, this.password)
  return isMatch
};

module.exports = mongoose.model("User", UserSchema);
