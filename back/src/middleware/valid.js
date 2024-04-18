// sanitize and validate data
const { body, validationResult } = require("express-validator");

const User = require("./../models/user");

// no need for try...catch block
const asyncHandler = require("express-async-handler");

// Used to send a 400 str8 back to client
const validResult = async (req, res, next) => {
  const errors = validationResult(req).array();
  if (errors.length !== 0) return res.sendStatus(400);
  next();
};

// Validation data login
const login = [
  body(`username`).trim().notEmpty().escape(),
  body(`password`).trim().notEmpty().escape(),

  validResult,
];

// validation data signup
const signup = [
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
    (value, { req }) => {
      if (req.body.password === value) return true;
      else throw new Error(`password and confirm-password does not match`);
    },
  ),

  validResult,
];

// validation signup username
const signupUsername = asyncHandler(async (req, res, next) => {
  const user = await User.findOne(
    { username: req.body.username },
    "username",
  ).exec();

  // check existence of username
  if (user !== null) return res.sendStatus(409); // conflict

  next();
});

// validation update user info
const userUpdate = [
  body("fullname").trim().escape(),
  body("bio").trim().escape(),
  body("status")
    .trim()
    .escape()
    .custom((val, { req }) => {
      // invalid status get default value
      const valid = ["online", "offline", "afk", "busy"];
      if (!valid.includes(val)) req.body.status = "online";
    }),
  body("avatarLink").trim().escape(),
  body("dateOfBirth", "Invalid Date Of Birth").trim().escape().isDate(),
];

// validation message data
const message = [
  body("content", `Content cannot be over 10000 characters`)
    .trim()
    .isLength({ max: 10000 })
    .escape(),
  body("imageLink")
    .trim()
    .escape()
    .custom((value, { req }) => {
      if (req.body.content && value)
        throw new Error(`Content and imageLink cannot be both existed`);
      if (!req.body.content && !value)
        throw new Error(`Content and imageLink cannot be both undefined`);
      return true;
    }),

  validResult,
];

// Sanitize and validate posts data
const post = [
  body(`content`, `Post content cannot be empty.`).trim().notEmpty().escape(),

  validResult,
];

// validation comment data
const comment = [
  body(`content`, `Comment content cannot be empty.`)
    .trim()
    .notEmpty()
    .escape(),

  validResult,
];

module.exports = {
  login,
  signup,
  signupUsername,
  userUpdate,
  message,
  comment,
  post,
};
