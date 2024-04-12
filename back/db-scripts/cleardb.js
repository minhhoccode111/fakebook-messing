// to access environment variables
// this line cause me 30 mins to deBUG
// and don't know why we have to place this and debug at the top
// for so that it can run
require("dotenv").config();

// debug
const debug = require("debug")(
  "============================================================",
);

// clear database
const Comment = require("./../src/models/comment");
const Follow = require("./../src/models/follow");
const Group = require("./../src/models/group");
const GroupMember = require("./../src/models/groupMember");
const LikeComment = require("./../src/models/likeComment");
const LikePost = require("./../src/models/likePost");
const Message = require("./../src/models/message");
const Post = require("./../src/models/post");
const User = require("./../src/models/user");

const MONGODB = process.argv.slice(2)[0] || process.env.DEVELOPMENT_MONGO;

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
