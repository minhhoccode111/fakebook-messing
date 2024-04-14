// no need for try...catch block
const asyncHandler = require("express-async-handler");

// sanitize and validate data
const { body, validationResult } = require("express-validator");

// custom validate middleware
const {
  validMongoId,
  validUser,
  validAuthUser,
  validPutUserData,
} = require("./../middleware");

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

// a specific user, include self
const getUser = asyncHandler(async (req, res) => {
  // debug(`req.params.userid`, req.params.userid);
  const user = await User.findById(
    req.params.userid,
    "-__v -password -username", // security
  ).exec();

  return res.json(user);
});

// update current user
const customPutValidate = [
  validMongoId,
  validUser,
  validAuthUser,
  ...validPutUserData,
];
const putUser = [
  ...customPutValidate,
  asyncHandler(async (req, res) => {
    const errors = validationResult(req).array();
    // Date of birth not valid
    if (errors.length !== 0) {
      req.body.dateOfBirth = undefined;
    }

    // Merge update user
    const newUser = Object.assign(
      { _id: req.params.userid }, // target obj, keep the _id
      req.body, // req.body must go first
      req.user.toJSON(), // must make this js obj
    );

    await User.findByIdAndUpdate(newUser);

    // debug(`newUser belike: `, newUser);

    // security
    const { password, username, __v, ...user } = newUser;

    // then update profile
    return res.json(user);
  }),
];

const customFollowValidate = [validMongoId, validUser];
// follow another user
const postUserFollows = [
  ...customFollowValidate,
  asyncHandler(async (req, res) => {
    res.json(`postUserFollow - user id: ${req.params.userid} - not yet`);
  }),
];
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
