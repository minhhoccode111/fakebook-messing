// no need for try...catch block
const asyncHandler = require("express-async-handler");

// sanitize and validate data
const { body, validationResult } = require("express-validator");

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

      debug(`the public user info after logging in: `, publicUserInfo);

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
  body("fullname")
    .trim()
    .notEmpty()
    .withMessage(`Fullname cannot be empty.`)
    .isLength({ max: 50 })
    .withMessage(`Fullname must be between 1 and 50 characters`)
    .escape(),
  body("username")
    .trim()
    .isLength({ min: 8 })
    .withMessage(`Username must be at least 8 characters.`)
    .isEmail()
    .withMessage(`Username must be a valid email address.`)
    .escape(),
  body("password")
    .trim()
    .isLength({ min: 8, max: 32 })
    .withMessage(`Password must be between 8 and 32 characters.`)
    .isStrongPassword()
    .withMessage(
      `Password must contain at least: 1 uppercase, 1 lowercase, 1 number, 1 special character.`,
    )
    .escape(),
  body("confirm-password", `Confirm password does not match.`).custom(
    (value, { req }) => req.body.password === value,
  ),

  asyncHandler(async (req, res) => {
    let errors = validationResult(req).array();

    const checkExistedUsername = await User.findOne(
      { username: req.body.username },
      "username",
    ).exec();

    // destruct to send back when needed
    const { fullname, username, password } = req.body;

    const user = {
      fullname,
      username,
    };

    // check existence of username
    if (checkExistedUsername !== null) {
      return res.sendStatus(409); // conflict
    }

    // data valid
    if (errors.length === 0) {
      const hashedPassword = await bcrypt.hash(password, Number(EnvVar.Secret)); // encode password

      const newUser = new User({
        ...user,
        password: hashedPassword,
        isCreator: false,
      });

      await newUser.save();

      debug(`the created user is: `, newUser);

      return res.sendStatus(200);
    }

    debug(`The error result is: `, errors);

    // data invalid
    return res.sendStatus(400);
  }),
];

module.exports = {
  login_post,
  signup_post,
};
