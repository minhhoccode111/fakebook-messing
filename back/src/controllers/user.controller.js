// no need for try...catch block
const asyncHandler = require("express-async-handler");

// validation middlewares
const valid = require("./../middleware/valid");
const param = require("./../middleware/param");
const mongo = require("./../middleware/mongo");
const authorize = require("./../middleware/authorize");

// mongoose models
const User = require("./../models/user");
const Follow = require("./../models/follow");
const Post = require("./../models/post");
const Comment = require("./../models/comment");
const LikePost = require("./../models/likePost");
const LikeComment = require("./../models/likeComment");
const Message = require("./../models/message");

// manually logging
const debug = require("./../constants/debug");

const getAllUsersHelper = asyncHandler(async (req, res) => {
  const self = req.selfUser;

  const [selfIsFollower, selfIsBeingFollowed] = await Promise.all([
    Follow.find({ follower: self.id }, "follower following")
      .populate("following", "-password -username -__v") // security
      .exec(),
    Follow.find({ following: self.id }, "follower following")
      .populate("follower", "-password -username -__v") // security
      .exec(),
  ]);

  const allFollowerIds = {};
  for (const ref of selfIsBeingFollowed) {
    allFollowerIds[ref.follower.id] = ref.follower;
  }
  const allFollowingIds = {};
  for (const ref of selfIsFollower) {
    allFollowingIds[ref.following.id] = ref.following;
  }

  const friends = [];
  const followers = [];
  const followings = [];

  for (const id in allFollowerIds) {
    // follower intersection following
    if (allFollowingIds[id]) friends.push(allFollowerIds[id]);
    // follower difference following
    else followers.push(allFollowerIds[id]);
  }

  for (const id in allFollowingIds) {
    if (allFollowerIds[id]) continue;
    // following difference follower
    else followings.push(allFollowingIds[id]);
  }

  // then mayknow will be the ones with no connection
  const mayknows = await User.find({
    $and: [
      {
        _id: {
          $ne: self.id, // not self
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
      {
        _id: {
          $nin: friends, // not friends
        },
      },
    ],
  }).exec();

  return res.json({ self, followers, followings, mayknows, friends });
});

// GET /users
const selfGetAllUsers = [
  (req, _, next) => {
    req.selfUser = req.user;
    next();
  },
  getAllUsersHelper,
];

// GET /users/:userid/connections
const userGetAllUsers = [
  mongo.userid,
  param.userid,
  (req, _, next) => {
    req.selfUser = req.userParam;
    next();
  },
  getAllUsersHelper,
];

// GET /feed
const getFeed = asyncHandler(async (req, res) => {
  // get all users that self is following
  const selfIsFollower = await Follow.find(
    { follower: req.user.id },
    "follower following",
  )
    .populate("following", "-password -username -__v") // security
    .exec();

  // extract all users that are being followed
  const usersAreBeingFollowed = selfIsFollower.map((ref) =>
    ref.following.toJSON(),
  );

  const posts = [];

  // loop through all users
  for (let i = 0, len = usersAreBeingFollowed.length; i < len; i++) {
    // current user is creator
    const creator = usersAreBeingFollowed[i];

    // find all post of current user
    const userPosts = await Post.find({ creator }, "-creator -__v").exec();

    // loop through each post of current user
    for (let j = 0, lenJ = userPosts.length; j < lenJ; j++) {
      // current post of current user
      const post = userPosts[j];

      // only 2 comments to display preview, display number of post's comments to clickbait
      const [postCommentsPreview, postCommentsLength, postLikes] =
        await Promise.all([
          Comment.find({ post }, "-post -__v")
            .populate("creator", "_id fullname status avatarLink") // security
            .sort({ createdAt: -1 })
            .limit(2)
            .exec(),
          Comment.countDocuments({ post }).exec(),
          LikePost.countDocuments({ post }).exec(),
        ]);

      const comments = [];
      // loop through each comment of current post of current user
      for (let k = 0, lenK = postCommentsPreview.length; k < lenK; k++) {
        // current comment
        const comment = postCommentsPreview[k];

        // count comment
        const commentLikes = await LikeComment.countDocuments({
          comment,
        }).exec();

        comments.push({ ...comment.toJSON(), likes: commentLikes });
      }

      // override post's creator because it's not populated
      posts.push({
        ...post.toJSON(),
        creator,
        likes: postLikes,
        commentsLength: postCommentsLength,
        comments,
      });
    }
  }

  // manually sort because it's from multiple creators
  return res.json(posts.sort((a, b) => b.createdAt - a.createdAt));
});

// GET /users/:userid
const getUser = [
  mongo.userid,
  param.userid,
  (req, res) => {
    return res.json(req.userParam);
  },
];

// PUT /users/:userid
const putUser = [
  authorize.userid,
  valid.userUpdate,
  asyncHandler(async (req, _, next) => {
    // Merge update user
    const user = Object.assign(req.user.toJSON(), req.body, {
      updatedAt: new Date(),
    });

    await User.findByIdAndUpdate(req.params.userid, user);

    next();
  }),
  getUser,
];

// POST /users/:userid/follows
const postUserFollows = [
  mongo.userid,
  param.userid,
  asyncHandler(async (req, _, next) => {
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

  selfGetAllUsers,
];

// GET /users/:userid/messages
const getUserMessages = [
  mongo.userid,
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
      .sort({ createdAt: 1 })
      .exec();

    // mark owned messages to display properly
    messages = messages.map((mess) => {
      let owned;
      // not populate sender for performance consideration
      // self own the message
      if (mess.sender.toString() === req.user.id) owned = true;
      else owned = false;
      mess = mess.toJSON();
      return { ...mess, owned };
    });

    // debug(`the messages belike: `, messages);

    res.json({
      self: req.user,
      userParam: req.userParam,
      messages,
    });
  }),
];

// POST /users/:userid/messages
const postUserMessages = [
  mongo.userid,
  param.userid,
  valid.messageCreate,
  asyncHandler(async (req, _, next) => {
    const { imageLink, content } = req.body;

    await new Message({
      sender: req.user,
      userReceive: req.userParam,
      group: null,
      content,
      imageLink,
    }).save();

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
  mongo.userid,
  param.userid,
  asyncHandler(async (req, res) => {
    const creator = req.userParam;

    const userPosts = await Post.find({ creator }, "-creator -__v")
      .sort({ createdAt: -1 })
      .exec();

    const posts = [];
    for (let i = 0, postsLength = userPosts.length; i < postsLength; i++) {
      const post = userPosts[i];
      const [postCommentsPreview, commentsLength, postLikes] =
        await Promise.all([
          Comment.find({ post }, "-post -__v")
            .populate("creator", "_id fullname status avatarLink") // security
            .sort({ createdAt: -1 })
            .limit(2)
            .exec(),
          Comment.countDocuments({ post }),
          LikePost.countDocuments({ post }).exec(),
        ]);

      const comments = [];
      for (
        let j = 0, commentsLength = postCommentsPreview.length;
        j < commentsLength;
        j++
      ) {
        const comment = postCommentsPreview[j];
        const commentLikes = await LikeComment.countDocuments({
          comment,
        }).exec();

        comments.push({ ...comment.toJSON(), likes: commentLikes });
      }

      posts.push({
        ...post.toJSON(),
        comments,
        commentsLength,
        likes: postLikes,
      });
    }

    return res.json({ userParam: req.userParam, posts });
  }),
];

// POST /users/:userid/posts
const postUserPosts = [
  authorize.userid,
  valid.postCreate,
  asyncHandler(async (req, _, next) => {
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
  mongo.postid,
  param.postid,
  asyncHandler(async (req, _, next) => {
    await Post.findByIdAndDelete(req.params.postid);

    // instead of calling validUserParam for GET /users/:userid/posts
    req.userParam = req.user;
    next();
  }),
  // no validation needed, just the handler implementation
  getUserPosts[2],
];

// GET /users/:userid/posts/:postid
const getUserPost = [
  mongo.userid,
  mongo.postid,
  param.postid,
  asyncHandler(async (req, res) => {
    const post = req.postParam;
    const likes = await LikePost.countDocuments({ post }).exec();
    const postComments = await Comment.find(
      {
        post,
      },
      "-__v",
    )
      .populate("creator", "_id fullname status avatarLink")
      .sort({ createdAt: -1 })
      .exec();

    const comments = [];
    for (let i = 0, len = postComments.length; i < len; i++) {
      const comment = postComments[i];

      const likes = await LikeComment.countDocuments({ comment }).exec();

      comments.push({ ...comment.toJSON(), likes });
    }

    return res.json({ ...post, likes, comments });
  }),
];

// POST /users/:userid/posts/:postid/likes
const postUserPostLikes = [
  mongo.userid,
  mongo.postid,
  param.postid,
  asyncHandler(async (req, _, next) => {
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

  getUserPost[3],
];

// POST /users/:userid/posts/:postid/comments
const postUserPostComments = [
  mongo.userid,
  mongo.postid,
  param.postid,
  valid.commentCreate,
  asyncHandler(async (req, _, next) => {
    const content = req.body.content;
    const post = req.postParam;
    const creator = req.user;

    await new Comment({ content, post, creator }).save();
    next();
  }),

  getUserPost[3],
];

// POST /users/:userid/posts/:postid/comments/:commentid/likes
const postUserCommentLikes = [
  mongo.userid,
  mongo.postid,
  mongo.commentid,
  param.postid,
  param.commentid,
  asyncHandler(async (req, _, next) => {
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

  getUserPost[3],
];

module.exports = {
  getFeed,
  selfGetAllUsers,
  userGetAllUsers,
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
  getUserPost,
  deleteUserPost,
  // putUserPost
  postUserPostLikes,
  postUserPostComments,
  // putUserPostComment
  // deleteUserPostComment
  postUserCommentLikes,
};
