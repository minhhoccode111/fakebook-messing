// no need for try...catch block
const asyncHandler = require('express-async-handler');

// sanitize and validate data
const { body, validationResult } = require('express-validator');

// mongoose models
const User = require('./../models/user');

// debug
const debug = require('debug')('xxxxxxxxxxxxxxxxxxxx-debug-xxxxxxxxxxxxxxxxxxxx');

// get info of current logged user (retrieve db to log in already)
module.exports.user_get = asyncHandler(async (req, res) => {
  res.json(req.user);
});

// update info of current logged user
module.exports.user_put = [
  body('fullname').trim().notEmpty().withMessage(`Fullname cannot be empty.`).isLength({ max: 50 }).withMessage(`Fullname must be between 1 and 50 characters.`).escape(),
  body('bio', `Bio must be between 1 and 250 characters.`).trim().isLength({ max: 250 }).escape(),
  body('avatar').trim().escape(),
  body('status', 'Invalid status').custom((value) => {
    const array = ['online', 'offline', 'busy', 'afk'];
    if (array.includes(value)) return true;
    throw new Error('Invalid status');
  }),
  asyncHandler(async (req, res) => {
    const errors = validationResult(req)
      .array()
      .map((e) => e.msg);

    const oldUser = req.user;

    const { fullname, bio, avatarLink, status, dateOfBirth } = req.body;

    if (!errors.length) {
      const newUser = new User({
        ...oldUser.toJSON(),
        fullname: fullname ?? oldUser.fullname,
        bio: bio ?? oldUser.bio,
        avatarLink: avatarLink ?? oldUser.avatarLink,
        status: status ?? oldUser.status,
        dateOfBirth: dateOfBirth ?? oldUser.dateOfBirth,
        _id: oldUser._id,
        updatedAt: new Date(),
      });

      // debug(`the user after updating belike: `, newUser);

      await User.findByIdAndUpdate(oldUser._id, newUser);

      return res.json({ newUser });
    }

    // invalid data
    return res.status(400).json({ errors });
  }),
];
