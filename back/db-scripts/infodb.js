// info database
const Comment = require("./../src/models/comment");
const Follow = require("./../src/models/follow");
const Group = require("./../src/models/group");
const GroupMember = require("./../src/models/groupMember");
const LikeComment = require("./../src/models/likeComment");
const LikePost = require("./../src/models/likePost");
const Message = require("./../src/models/message");
const Post = require("./../src/models/post");
const User = require("./../src/models/user");

// to access environment variables
require("dotenv").config(); // this line cause me 30 mins to deBUG

const debug = (...str) => {
  for (const s of str) {
    console.log(s);
  }
};

const MONGODB = process.argv.slice(2)[0] || process.env.DEVELOPMENT_MONGO;

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
