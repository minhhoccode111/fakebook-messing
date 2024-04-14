/* Contains some middlewares to re-use
 * */

// no need for try...catch block
const asyncHandler = require("express-async-handler");

// mongoose
const mongoose = require("mongoose");
const User = require("./models/user");

// sanitize and validate data
const { body, validationResult } = require("express-validator");

// Before doind any database retrieve
module.exports.validMongoId = (req, res, next) => {
  const isValidId = mongoose.isValidObjectId(req.params.userid);
  if (!isValidId) return res.sendStatus(404);
  next();
};

// Make sure the user existed and mark on req
module.exports.validUser = asyncHandler(async (req, res, next) => {
  const user = await User.findById(req.params.userid).exec();
  if (!user) return res.sendStatus(404);
  req.userParam = user; // mark on req
  next();
});

// Make sure req.params.userid is self
module.exports.validAuthUser = (req, res, next) => {
  if (req.params.userid !== req.user.id) return res.sendStatus(404);
  next();
};

// Sanitize and validate update user data
module.exports.validPutUserData = [
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

module.exports.validPostSignup = [
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

  asyncHandler(async (req, res, next) => {
    const errors = validationResult(req).array();
    if (errors.length !== 0) return res.sendStatus(400);
    next();
  }),
];

module.exports.validUsername = asyncHandler(async (req, res, next) => {
  const checkExistedUsername = await User.findOne(
    { username: req.body.username },
    "username",
  ).exec();
  // check existence of username
  if (checkExistedUsername !== null) {
    return res.sendStatus(409); // conflict
  }
  next();
});

// TODO: more models validate, etc.
