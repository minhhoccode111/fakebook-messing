// environment variables
const EnvVar = require("./../constants/envvar");

// Make every debug the same
const debug = require("./../constants/debug");

// clear database
const Comment = require("./../models/comment");
const Follow = require("./../models/follow");
const Group = require("./../models/group");
const GroupMember = require("./../models/groupMember");
const LikeComment = require("./../models/likeComment");
const LikePost = require("./../models/likePost");
const Message = require("./../models/message");
const Post = require("./../models/post");
const User = require("./../models/user");

const MONGODB = process.argv.slice(2)[0] || EnvVar.MongoString;

const mongoose = require("mongoose");
mongoose.set("strictQuery", false);

main().catch((err) => debug("some errors occur", err));

async function main() {
  debug("about to connect to database");
  await mongoose.connect(MONGODB);
  debug("connect formed!");

  const numComment = await Comment.countDocuments({}).exec();
  const numFollow = await Follow.countDocuments({}).exec();
  const numGroup = await Group.countDocuments({}).exec();
  const numGroupMember = await GroupMember.countDocuments({}).exec();
  const numLikeComment = await LikeComment.countDocuments({}).exec();
  const numLikePost = await LikePost.countDocuments({}).exec();
  const numMessage = await Message.countDocuments({}).exec();
  const numPost = await Post.countDocuments({}).exec();
  const numUser = await User.countDocuments({}).exec();

  const allComment = await Comment.find({}).exec();
  const allFollow = await Follow.find({}).exec();
  const allGroup = await Group.find({}).exec();
  const allGroupMember = await GroupMember.find({}).exec();
  const allLikeComment = await LikeComment.find({}).exec();
  const allLikePost = await LikePost.find({}).exec();
  const allMessage = await Message.find({}).exec();
  const allPost = await Post.find({}).exec();
  const allUser = await User.find({}).exec();

  debug(`There is ${numComment} comments: `, allComment);
  debug(`There is ${numFollow} follows: `, allFollow);
  debug(`There is ${numGroup} groups: `, allGroup);
  debug(`There is ${numGroupMember} groupMembers: `, allGroupMember);
  debug(`There is ${numLikeComment} likeComments: `, allLikeComment);
  debug(`There is ${numLikePost} posts: `, allLikePost);
  debug(`There is ${numMessage} messages: `, allMessage);
  debug(`There is ${numPost} posts: `, allPost);
  debug(`There is ${numUser} users: `, allUser);

  debug("about to disconnect to database");
  await mongoose.connection.close();
  debug("connection closed!");
}
