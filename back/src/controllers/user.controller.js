// no need for try...catch block
const asyncHandler = require("express-async-handler");

// sanitize and validate data
const { body, validationResult } = require("express-validator");

// custom validate middleware
const {
  validUserAuth,
  validUserParam,
  validPostParam,
  validPostAuth,
  validPutUserData,
  validPostPostData,
} = require("./../middleware");

// environment variables
const EnvVar = require("./../constants/envvar");

// manually logging
const debug = require("./../constants/debug");

// mongoose models
const mongoose = require("mongoose");
const User = require("./../models/user");
const Follow = require("./../models/follow");
const Post = require("./../models/post");
const Comment = require("./../models/comment");
const LikePost = require("./../models/likePost");
const LikeComment = require("./../models/likeComment");

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
        // self is followed
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
      followers.push(connections[i].follower);
      // BUG: connections[i].followers
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
const getUser = [
  validUserParam, // validate and mark req.params.userid on req.userParam
  async (req, res) => {
    return res.json(req.userParam);
  },
];

// update current user
const putUser = [
  validUserAuth,
  validPutUserData,
  asyncHandler(async (req, res) => {
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

// follow another user
const postUserFollows = [
  validUserParam, // validate and mark req.params.userid on req.userParam
  asyncHandler(async (req, res, next) => {
    const follower = req.user;
    const following = req.userParam;

    // check already followed
    const followRef = await Follow.findOne({ follower, following }).exec();

    // unfollow
    if (followRef !== null) {
      await Follow.deleteOne({ following, follower });
    }
    // follow
    else {
      await new Follow({ following, follower }).save();
    }

    next();
  }),

  // return GET /users data
  getAllUsers,
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
// TODO: design response data
/*
 * {
 * creator: don't need since req.userParam can be used
 * posts: [
 *  Post{
 *    content: ...,
 *    likes: ...,
 *    comments: [
 *      Comment{
 *        author: User{
 *          fullname: ...,
 *          id: ...,
 *          status: ...,
 *          avatarLink: ...,
 *        }
 *        content: ...,
 *        likes: ...
 *      },
 *    ]
 *  },
 *  Post{...},
 *  ...
 *  ]
 * }
 */

const getUserPosts = [
  validUserParam,
  asyncHandler(async (req, res) => {
    const creator = req.userParam;

    const userPosts = await Post.find({ creator }, "-creator -__v").exec();

    // debug(`the posts after retrieve database belike: `, userPosts);

    // NOTE: this could be done with a simple `for...loop`
    // but for learning purpose a reduce with promises is good
    const posts = await userPosts.reduce(async (totalPosts, post) => {
      const [postComments, postLikes] = await Promise.all([
        Comment.find({ post }, "-post -__v")
          .populate("creator", "_id fullname status avatarLink") // security
          .exec(),
        LikePost.countDocuments({ post }).exec(),
      ]);

      const comments = await postComments.reduce(
        async (totalComments, comment) => {
          const commentLikes = await LikeComment.countDocuments({
            comment,
          }).exec();

          const total = await totalComments;

          return [...total, { ...comment.toJSON(), likes: commentLikes }];
        },
        Promise.resolve([]),
      );

      const total = await totalPosts;

      return [...total, { ...post.toJSON(), comments, likes: postLikes }];
    }, Promise.resolve([]));

    // debug(`the posts after map: `, posts);

    // debug({ creator, posts });
    return res.json({ creator, posts });
  }),
];

// post a post
const postUserPosts = [
  validUserAuth,
  validPostPostData,
  asyncHandler(async (req, res, next) => {
    const post = new Post({ content: req.body.content, creator: req.user });
    await post.save();

    // for the GET /users/:userid/posts below to use
    // without calling validUserParam
    req.userParam = req.user;
    next();
  }),
  // WARN: we don't need to call validUserParam again
  // since validUserAuth already get the job done
  getUserPosts[1],
];

// delete a post
const deleteUserPost = [
  // first make sure req.params.userid match req.user.id
  validUserAuth,
  // then make sure req.params.postid existed in db and owned by req.user
  validPostAuth,
  asyncHandler(async (req, res, next) => {
    await Post.findByIdAndDelete(req.params.postid);

    // for the GET /users/:userid/posts below to use
    // without calling validUserParam
    req.userParam = req.user;
    next();
  }),

  // WARN: we don't need to call validUserParam again
  // since validUserAuth already get the job done
  getUserPosts[1],
];

// TODO: get a post detail and relation this is support middleware since
// we don't implement GET a specific post route handling
// we just want to reuse this after interaction with a post
const getUserPostHelper = asyncHandler(async (req, res, next) => {
  // No validation needed since this will be called after everything is done
  const post = req.postParam;
  const likes = await LikePost.countDocuments({ post }).exec();
  const postComments = await Comment.find(
    {
      post,
    },
    "-__v",
  )
    .populate("creator", "_id fullname status avatarLink")
    // TODO: add sorting
    .exec();

  // debug(`the postComments belike: `, postComments);
  // manually add a comment likes count
  const comments = await postComments.reduce(async (allComments, comment) => {
    const likes = await LikeComment.countDocuments({ comment }).exec();

    const total = await allComments;

    return [...total, { ...comment.toJSON(), likes }];
  }, Promise.resolve([]));

  // debug(`the comments belike: `, comments);

  return res.json({ ...post.toJSON(), likes, comments });
});

// like a post TODO:
const postUserPostLikes = [
  validPostParam, // no need to own the post for this action
  asyncHandler(async (req, res, next) => {
    const creator = req.user;
    const post = req.postParam;
    const likePost = new LikePost({ creator, post });
    await likePost.save();

    next();
  }),

  getUserPostHelper,
];

// comment on a post
const postUserPostComments = asyncHandler(async (req, res) => {
  res.json(
    `postUserPostComments - user id: ${req.params.userid} - post id: ${req.params.postid} - not yet`,
  );
});

// like a comment
const postUserCommentLikes = asyncHandler(async (req, res) => {
  res.json(
    `postUserCommentLikes - user id: ${req.params.userid} - comment id: ${req.params.commentid} - not yet`,
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
