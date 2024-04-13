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

debug(`the MONGODB string belike: `, MONGODB);

const mongoose = require("mongoose");
mongoose.set("strictQuery", false);

main().catch((err) => debug(err));

async function main() {
  debug("about to connect to database");
  await mongoose.connect(MONGODB);
  debug("connect formed!");

  debug("about to clear database");

  await Comment.deleteMany({});
  await Follow.deleteMany({});
  await Group.deleteMany({});
  await GroupMember.deleteMany({});
  await LikeComment.deleteMany({});
  await LikePost.deleteMany({});
  await Message.deleteMany({});
  await Post.deleteMany({});
  await User.deleteMany({});

  debug("database cleared");

  debug("about to disconnect to database");
  await mongoose.connection.close();
  debug("connection closed!");
}
