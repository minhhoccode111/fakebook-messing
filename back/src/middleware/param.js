// mongoose
const User = require("./../models/user");
const Post = require("./../models/post");
const Comment = require("./../models/comment");

const asyncHandler = require("express-async-handler");

// check userid existed, mark on req.userParam
const userid = asyncHandler(async (req, res, next) => {
  const user = await User.findById(
    req.params.userid,
    "-__v -password -username", // security
  ).exec();
  if (!user) return res.sendStatus(404);
  req.userParam = user; // mark on req
  next();
});

// check postid existed and belong to userid
// then mark on req.postParam
const postid = asyncHandler(async (req, res, next) => {
  const post = await Post.findOne(
    {
      _id: req.params.postid,
      creator: req.params.userid,
    },
    "-__v -creator",
  ).exec();
  if (!post) return res.sendStatus(404);
  req.postParam = post;
  next();
});

// check commentid existed and belong to postid
// then mark on req.commentParam
const commentid = asyncHandler(async (req, res, next) => {
  const comment = await Comment.findOne(
    {
      _id: req.params.commentid,
      post: req.params.postid,
    },
    "-__v",
  )
    .populate("creator", "_id fullname status avatarLink")
    .exec();
  if (!comment) return res.sendStatus(404);
  req.commentParam = comment;
  next();
});

module.exports = {
  userid,
  postid,
  commentid,
};
