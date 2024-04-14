// no need for try...catch block
const asyncHandler = require("express-async-handler");

// sanitize and validate data
const { body, validationResult } = require("express-validator");

// environment variables
const EnvVar = require("./../constants/envvar");

// manually logging
const debug = require("./../constants/debug");

// mongoose models
const mongoose = require("mongoose");
const User = require("./../models/user");
const Follow = require("./../models/follow");

// bcrypt to secure password
const bcrypt = require("bcrypt");

// will be call jwt.sign() to create a object, and secret and option like algorithm and time expire
const jwt = require("jsonwebtoken");

// work with date and time
const { formatDate } = require("./../method");

// relationship with current user
const getAllUsers = asyncHandler(async (req, res) => {
  // all users have connection with self
  const connections = await Follow.find(
    {
      $or: [
        // self is follower
        { follower: req.user.id },
        // self is following
        { following: req.user.id },
      ],
    },
    "follower following",
  )
    .populate("follower", "-password -username -__v")
    .populate("following", "-password -username -__v")
    .exec();

  const followers = [];
  const followings = [];

  for (let i = 0, len = connections.length; i < len; i++) {
    if (connections[i].follower.id === req.user.id) {
      // if self is follower
      followings.push(connections[i].following);
    } else {
      // else self is following
      followers.push(connections[i].followers);
    }
  }

  // then mayknow will be the ones with no connection
  const mayknows = await User.find({
    $and: [
      {
        _id: {
          $not: { $eq: req.user.id }, // not self
        },
      },
      {
        _id: {
          $nin: followers, // not followers
        },
      },
      {
        _id: {
          $nin: followings, // not followings
        },
      },
    ],
  }).exec();

  // debug(`mayknows belike: `, mayknows);
  // debug(`followers belike: `, followers);
  // debug(`followings belike: `, followings);

  return res.send({ followers, followings, mayknows });
});

// a specific user
const getUser = asyncHandler(async (req, res) => {
  // TODO: validation request, ObjectId, etc...
  const user = await User.findById(
    req.params.userid,
    "-__v -password -username", // security
  ).exec();
  return res.json(user);
});

// update current user
const putUser = [
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
  asyncHandler(async (req, res) => {
    // first check valid ObjectId
    const isValidId = mongoose.isValidObjectId(req.params.userid);
    if (!isValidId) return res.sendStatus(404);

    // then check user existance
    const oldUser = await User.findById(req.params.userid).exec();
    if (!oldUser) return res.sendStatus(404);

    // then check authorization to update project
    if (req.params.userid !== req.user.id) return res.sendStatus(403);

    const errors = validationResult(req).array();
    // Date of birth not valid
    if (errors.length !== 0) {
      req.body.dateOfBirth = undefined;
    }

    // Merge update user
    const newUser = Object.assign(
      { _id: req.params.userid }, // target obj, keep the _id
      req.body, // careful, req.body must go first
      oldUser.toJSON(),
    );

    await User.findByIdAndUpdate(newUser);

    // debug(`newUser belike: `, newUser);
    // security
    const { password, username, __v, ...user } = newUser;

    // then update profile
    res.json(user);
  }),
];

// follow another user
const postUserFollows = asyncHandler(async (req, res) => {
  res.json(`postUserFollow - user id: ${req.params.userid} - not yet`);
});

// get all messages with a user
const getUserMessages = asyncHandler(async (req, res) => {
  res.json(`getUserMessages - user id: ${req.params.userid} - not yet`);
});

// send a message to a user
const postUserMessages = asyncHandler(async (req, res) => {
  res.json(`postUserMessages - user id: ${req.params.userid} - not yet`);
});

// get all user's posts
const getUserPosts = asyncHandler(async (req, res) => {
  res.json(`getUserPosts - user id: ${req.params.userid} - not yet`);
});

// post a post
const postUserPosts = asyncHandler(async (req, res) => {
  res.json(`postUserPosts - user id: ${req.params.userid} - not yet`);
});

// delete a post
const deleteUserPost = asyncHandler(async (req, res) => {
  res.json(
    `deleteUserPost - user id: ${req.params.userid} - post id: ${req.params.postid} - not yet`,
  );
});

// like a post
const postUserPostLikes = asyncHandler(async (req, res) => {
  res.json(
    `postUserPostLikes - user id: ${req.params.userid} - post id: ${req.params.postid} - not yet`,
  );
});

// like a comment
const postUserCommentLikes = asyncHandler(async (req, res) => {
  res.json(
    `postUserCommentLikes - user id: ${req.params.userid} - comment id: ${req.params.commentid} - not yet`,
  );
});

// comment on a post
const postUserPostComments = asyncHandler(async (req, res) => {
  res.json(
    `postUserPostComments - user id: ${req.params.userid} - post id: ${req.params.postid} - not yet`,
  );
});

module.exports = {
  getAllUsers,
  getUser,
  putUser,
  // deleteUser,
  postUserFollows,
  getUserMessages,
  postUserMessages,
  getUserPosts,
  postUserPosts,
  deleteUserPost,
  postUserPostLikes,
  postUserPostComments,
  postUserCommentLikes,
};
