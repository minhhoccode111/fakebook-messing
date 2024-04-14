// no need for try...catch block
const asyncHandler = require("express-async-handler");

// sanitize and validate data
const { body, validationResult } = require("express-validator");

const { validPostSignup, validUsername } = require("./../middleware");

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

const login_post = [
  body("username").trim().escape(),
  body("password").trim().escape(),
  asyncHandler(async (req, res) => {
    // extract data from form
    const formUsername = req.body.username;
    const formPassword = req.body.password;
    // check username existed
    const user = await User.findOne({ username: formUsername }, "-__v").exec();
    if (user === null) {
      return res.sendStatus(401);
    } else {
      // check password match
      const valid = await bcrypt.compare(formPassword, user.password);

      if (!valid) {
        return res.sendStatus(401);
      }

      const expiresIn = 60 * 60 * 24 * 7; // 7 days

      // * 1000 for milliseconds
      const expiresInDate = new Date(Date.now() + expiresIn * 1000);

      const expiresInDateFormatted = formatDate(expiresInDate);

      // valid username and password
      // token is created using username only
      const token = jwt.sign({ username: formUsername }, process.env.SECRET, {
        expiresIn,
      });

      // debug(`the user found in database belike: `, user);
      // debug(`expire time belike: `, 60 * 60 * 24 * 7, ` seconds`);
      // debug(`expire time formatted belike: `, expiresInDateFormatted);

      // remove password and username
      const { password, username, ...publicUserInfo } = user.toJSON();

      // debug(`the public user info after logging in: `, publicUserInfo);

      // return info for client to store on their localStorage and check of expire
      return res.status(200).json({
        token,
        user: publicUserInfo,
        expiresIn,
        expiresInDate,
        expiresInDateFormatted,
      });
    }
  }),
];

const signup_post = [
  validPostSignup,
  validUsername,
  asyncHandler(async (req, res) => {
    let errors = validationResult(req).array();

    const { fullname, username, password } = req.body;

    // encode password
    const hashedPassword = await bcrypt.hash(password, Number(EnvVar.Secret));

    const newUser = new User({
      fullname,
      username,
      password: hashedPassword,
      isCreator: false,
    });

    await newUser.save();

    // debug(`the created user is: `, newUser);

    return res.sendStatus(200);
  }),
];

module.exports = {
  login_post,
  signup_post,
};
