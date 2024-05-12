// mongoose
const User = require("./../models/user");
const Post = require("./../models/post");
const Group = require("./../models/group");
const Comment = require("./../models/comment");
const GroupMember = require("./../models/groupMember");

const asyncHandler = require("express-async-handler");

// check userid existed, mark on req.userParam
const userid = asyncHandler(async (req, res, next) => {
  const user = await User.findById(
    req.params.userid,
    "-__v -password -username", // security
  ).exec();
  if (!user) return res.sendStatus(404);
  req.userParam = user.toJSON(); // mark on req
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
  req.postParam = post.toJSON();
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
  req.commentParam = comment.toJSON();
  next();
});

const groupid = asyncHandler(async (req, res, next) => {
  const group = await Group.findOne(
    {
      _id: req.params.groupid,
    },
    "-__v",
  )
    .populate("creator", "_id fullname status avatarLink")
    .exec();
  if (!group) return res.sendStatus(404);
  req.groupParam = group.toJSON();
  next();
});

const memberid = asyncHandler(async (req, res, next) => {
  const member = await GroupMember.findOne(
    {
      user: req.params.memberid,
      group: req.params.groupid,
    },
    "-__v",
  )
    .populate("user", "-__v -password -username") // security
    .exec();
  if (!member) return res.sendStatus(404);
  req.memberParam = member.user.toJSON();
  next();
});

module.exports = {
  userid,
  postid,
  groupid,
  memberid,
  commentid,
};
