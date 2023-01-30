const User = require("../models/User");
const { StatusCodes } = require("http-status-codes");
const { BadRequestError, UnauthenticatedError } = require("../errors");
// const bycrypt = require("bcryptjs");

const register = async (req, res) => {
  const { username, email, password, password2 } = req.body;

  // if (!username || !email || !password || !password2) {
  //   throw new BadRequestError("Please provide name, email and password");
  // }
  if (password !== password2) {
    throw new BadRequestError("The password doesn't match");
  }
  /*
    this code was handled by model User.js with UserSchema.pre('save')
    const salt = await bcrypt.genSalt(10);
    const hashPass = await bcrypt.hash(password, salt);

    const tempUser = { username, email, password: hashPass };
  */

  // const user = await User.create({ ...tempUser });

  const user = await User.create({ ...req.body });
  const token = user.createJWT();
  res
    .status(StatusCodes.CREATED)
    .json({ user: { username: user.username }, token });
  // res.status(StatusCodes.CREATED).json({
  //   msg: `username: ${req.body.username}, has been created successfully!`,
  //   user: {user : user.username}, token
  // });
};

const login = async (req, res) => {
  const { email, password } = req.body;

  // WAY 1 to check empty
    if (!email || !password) {
      throw new BadRequestError(`Please provide email and password!`);
    }

    const user = await User.findOne({ email });

    // compare password
    if (!user) {
      throw new UnauthenticatedError(`No Credential User!`);
    }

    /*
      WAY 1 to compare Pass in Controller
      const matchPass = await bycrypt.compare(password, user.password)
  
      if(!matchPass){
        throw new UnauthenticatedError(`No Credential Password!`);
      }
    */

    /* WAY 2 invoke from User Model*/
    const matchPass = await user.comparePass(password);
    console.log("this match => ", matchPass);
    if (!matchPass) {
      throw new UnauthenticatedError(`No Credential Password!`);
    }
    // create token
    const token = user.createJWT();
    res.status(StatusCodes.OK).json({
      user: { name: user.username },
      token,
    });
};

const getUsers = async (req, res) => {
  const user = await User.find({});
  res.status(StatusCodes.OK).json({ msg: `this is all users you have`, user });
};

const getUser = async (req, res) => {
  const { idUser } = req.query;
  try {
    const findOneUser = await User.findOne({ _id: idUser });
    console.log(findOneUser);
    if (findOneUser === null) {
      return res
        .status(StatusCodes.BAD_REQUEST)
        .json({ msg: `user with id ${idUser} is not found!` });
    }
    const user = await User.findById({ _id: idUser });
    res
      .status(StatusCodes.OK)
      .json({ msg: `this is user ${user.username}`, user });
  } catch (error) {
    console.log(error);
  }
};

const deleteUser = async (req, res) => {
  const { idUser } = req.query;
  try {
    const findOneandDelete = await User.findOne({ _id: idUser });

    if (findOneandDelete === null) {
      return res
        .status(StatusCodes.BAD_REQUEST)
        .json({ msg: `user with id ${idUser} is not found!` });
    } else {
      const deleteUser = await User.findOneAndDelete(idUser);
      res
        .status(StatusCodes.OK)
        .json({ msg: `username ${idUser} deleted!`, deleteUser });
    }
  } catch (error) {
    console.log(error);
  }
};


module.exports = { login, register, deleteUser, getUsers, getUser };
