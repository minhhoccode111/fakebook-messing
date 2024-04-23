// no need for try...catch block
const asyncHandler = require("express-async-handler");

//
const valid = require("./../middleware/valid");

// environment variables
const EnvVar = require("./../constants/envvar");

// manually logging
const debug = require("./../constants/debug");

// mongoose models
const User = require("./../models/user");

// bcrypt to secure password
const bcrypt = require("bcrypt");

// will be call jwt.sign() to create a object, and secret and option like algorithm and time expire
const jwt = require("jsonwebtoken");

// work with date and time
const { formatDate } = require("./../method");

const loginPost = [
  valid.login,
  asyncHandler(async (req, res) => {
    // extract data from form
    const { username, password } = req.body;
    // check username existed
    const user = await User.findOne({ username }, "-__v").exec();
    if (user === null) {
      return res.sendStatus(401);
    } else {
      // check password match
      const valid = await bcrypt.compare(password, user.password);

      if (!valid) {
        return res.sendStatus(401);
      }

      const expiresIn = 60 * 60 * 24 * 7; // 7 days

      // * 1000 for milliseconds
      const expiresInDate = new Date(Date.now() + expiresIn * 1000);

      const expiresInDateFormatted = formatDate(expiresInDate);

      // valid username and password
      // token is created using username only
      // NOTE: do we have to convert to number
      const token = jwt.sign({ username }, EnvVar.Secret, {
        expiresIn,
      });

      // remove password and username
      const userInfo = user.toJSON();
      delete userInfo.password;
      delete userInfo.username;

      // debug(`the public user info after logging in: `, publicUserInfo);

      // return info for client to store on their localStorage and check of expire
      return res.json({
        token,
        self: userInfo,
        expiresIn,
        expiresInDate,
        expiresInDateFormatted,
      });
    }
  }),
];

const signupPost = [
  valid.signup,
  valid.signupUsername,
  asyncHandler(async (req, res) => {
    const { fullname, username, password } = req.body;

    // encode password
    const hashedPassword = await bcrypt.hash(password, Number(EnvVar.Secret));

    await new User({
      fullname,
      username,
      password: hashedPassword,
      isCreator: false,
    }).save();

    // debug(`the created user is: `, newUser);

    return res.sendStatus(200);
  }),
];

module.exports = {
  loginPost,
  signupPost,
};
