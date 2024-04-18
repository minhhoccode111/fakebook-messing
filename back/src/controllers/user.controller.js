// no need for try...catch block
const asyncHandler = require("express-async-handler");

//
const valid = require("./../middleware/valid");
const param = require("./../middleware/param");
const mongoid = require("./../middleware/mongoid");
const authorize = require("./../middleware/authorize");

// environment variables
const EnvVar = require("./../constants/envvar");

// manually logging
const debug = require("./../constants/debug");

// mongoose models
const User = require("./../models/user");
const Follow = require("./../models/follow");
const Post = require("./../models/post");
const Comment = require("./../models/comment");
const LikePost = require("./../models/likePost");
const LikeComment = require("./../models/likeComment");

const Message = require("./../models/message");
const Group = require("./../models/group");
const GroupMember = require("./../models/groupMember");

// GET /users
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
      // BUG: connections[i].followers
      followers.push(connections[i].follower);
    }
  }

  // then mayknow will be the ones with no connection
  const mayknows = await User.find({
    $and: [
      {
        _id: {
          $ne: req.user.id, // not self
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

// GET /users/:userid
const getUser = [
  mongoid.userid,
  param.userid,
  async (req, res) => {
    return res.json(req.userParam);
  },
];

// PUT /users/:userid
const putUser = [
  authorize.userid,
  valid.userUpdate,
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

// POST /users/:userid/follows
const postUserFollows = [
  mongoid.userid,
  param.userid,
  asyncHandler(async (req, res, next) => {
    const follower = req.user;
    const following = req.userParam;

    // check already followed
    const followRef = await Follow.findOne({ follower, following }).exec();

    // unfollow
    if (followRef !== null) {
      await Follow.deleteOne({ follower, following });
    }
    // follow
    else {
      await new Follow({ follower, following }).save();
    }

    next();
  }),

  // Return self GET /users
  getAllUsers,
];

// GET /users/:userid/messages
const getUserMessages = [
  mongoid.userid,
  param.userid,
  asyncHandler(async (req, res) => {
    let messages = await Message.find(
      {
        $or: [
          { sender: req.user, userReceive: req.userParam },
          { sender: req.userParam, userReceive: req.user },
        ],
      },
      "-__v",
    )
      // TODO: check to remove this and use the req.userParam instead
      .populate("sender", "_id avatarLink")
      .sort({ createdAt: 1 })
      .exec();

    // mark owned messages to display properly
    messages = messages.map((mess) => {
      let owned;
      if (mess.sender.id === req.user.id) owned = true;
      else owned = false;
      return { ...mess.toJSON(), owned };
    });

    // debug(`the messages belike: `, messages);

    res.json({
      requestedUser: req.user,
      receivedUser: req.userParam,
      messages,
    });
  }),
];

// POST /users/:userid/messages
const postUserMessages = [
  mongoid.userid,
  param.userid,
  valid.message,
  asyncHandler(async (req, res, next) => {
    const { imageLink, content } = req.body;

    const message = new Message({
      sender: req.user,
      userReceive: req.userParam,
      group: null,
      content,
      imageLink,
    });

    await message.save();
    next();
  }),

  getUserMessages[2],
];

/*
TODO: design response data
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
// GET /users/:userid/posts
const getUserPosts = [
  mongoid.userid,
  param.userid,
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

// POST /users/:userid/posts
const postUserPosts = [
  authorize.userid,
  valid.post,
  asyncHandler(async (req, res, next) => {
    const creator = req.user;
    const content = req.body.content;

    await new Post({ content, creator }).save();

    // instead of calling validUserParam for GET /users/:userid/posts
    req.userParam = req.user;

    next();
  }),
  // no validation needed, just the handler implementation
  getUserPosts[2],
];

// DELETE /users/:userid/posts/:postid
const deleteUserPost = [
  authorize.userid,
  mongoid.postid,
  param.postid,
  asyncHandler(async (req, res, next) => {
    await Post.findByIdAndDelete(req.params.postid);

    // instead of calling validUserParam for GET /users/:userid/posts
    req.userParam = req.user;
    next();
  }),
  // no validation needed, just the handler implementation
  getUserPosts[2],
];

// we don't implement GET a specific post route handling
// we just want to reuse this after interaction with a post
const getUserPostHelper = asyncHandler(async (req, res) => {
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

// POST /users/:userid/posts/:postid/likes
const postUserPostLikes = [
  mongoid.userid,
  mongoid.postid,
  param.postid,
  asyncHandler(async (req, res, next) => {
    const creator = req.user;
    const post = req.postParam;

    // check existence
    const likePost = await LikePost.findOne({ creator, post }, "_id").exec();

    if (likePost === null) {
      // add like
      await new LikePost({ creator, post }).save();
    } else {
      // delete like
      await LikePost.deleteOne({ creator, post });
    }

    next();
  }),

  getUserPostHelper,
];

// POST /users/:userid/posts/:postid/comments
const postUserPostComments = [
  mongoid.userid,
  mongoid.postid,
  param.postid,
  valid.comment,
  asyncHandler(async (req, res, next) => {
    const content = req.body.content;
    const post = req.postParam;
    const creator = req.user;

    await new Comment({ content, post, creator }).save();
    next();
  }),

  getUserPostHelper,
];

// POST /users/:userid/posts/:postid/comments/:commentid/likes
const postUserCommentLikes = [
  mongoid.userid,
  mongoid.postid,
  mongoid.commentid,
  param.postid,
  param.commentid,
  asyncHandler(async (req, res, next) => {
    const creator = req.user;
    const comment = req.commentParam;

    const likeComment = await LikeComment.findOne(
      {
        creator,
        comment,
      },
      "_id",
    ).exec();

    if (likeComment === null) {
      // create like
      await new LikeComment({ creator, comment }).save();
    } else {
      // delete like
      await LikeComment.deleteOne({ creator, comment });
    }

    next();
  }),

  getUserPostHelper,
];

module.exports = {
  getAllUsers,
  getUser,
  putUser,
  // deleteUser,
  postUserFollows,
  getUserMessages,
  postUserMessages,
  // putUserMessage
  // deleteUserMessage
  getUserPosts,
  postUserPosts,
  deleteUserPost,
  // putUserPost
  postUserPostLikes,
  postUserPostComments,
  // putUserPostComment
  // deleteUserPostComment
  postUserCommentLikes,
};
