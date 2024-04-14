/* Contains some middlewares to re-use
 * */

// no need for try...catch block
const asyncHandler = require("express-async-handler");

// mongoose
const mongoose = require("mongoose");
const User = require("./models/user");

// sanitize and validate data
const { body } = require("express-validator");

// Before doind any database retrieve
module.exports.validMongoId = (req, res, next) => {
  const isValidId = mongoose.isValidObjectId(req.params.userid);
  if (!isValidId) return res.sendStatus(404);
  next();
};

// Make sure the user existed
module.exports.validUser = asyncHandler(async (req, res, next) => {
  const user = await User.findById(req.params.userid).exec();
  if (!user) return res.sendStatus(404);
  next();
});

// Make sure the user is qualified
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

// TODO: more models validate, etc.
