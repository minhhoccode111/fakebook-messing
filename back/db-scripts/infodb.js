// get database info
import User from "./../src/models/user";
import Message from "./../src/models/message";
import Group from "./../src/models/group";
import GroupMember from "./../src/models/groupMember";

// to access environment variables
import("dotenv").config(); // this line cause me 30 mins to deBUG

// const debug = require('debug')('custom-debug');
import debug from ("debug")(
  "============================================================",
);
// const debug = (...str) => {
//   for (const s of str) {
//     console.log(s);
//   }
// };

const mongoDB = process.argv.slice(2)[0] || process.env.DEVELOPMENT_MONGO;

const mongoose = require("mongoose");
mongoose.set("strictQuery", false);

main().catch((err) => debug("some errors occur", err));

async function main() {
  debug("about to connect to database");
  await mongoose.connect(mongoDB);
  const userNum = await User.countDocuments({}).exec();
  const messageNum = await Message.countDocuments({}).exec();
  const groupNum = await Group.countDocuments({}).exec();
  const groupMemberNum = await GroupMember.countDocuments({}).exec();
  const users = await User.find({}).exec();
  const messages = await Message.find({}).exec();
  const groups = await Group.find({}).exec();
  const groupMembers = await GroupMember.find({}).exec();

  debug(`users belike: `, users);
  debug(`messages belike: `, messages);
  debug(`groups belike: `, groups);
  debug(`groupMembers belike: `, groupMembers);
  debug(`number of user currently in database: ${userNum}`);
  debug(`number of message currently in database: ${messageNum}`);
  debug(`number of group currently in database: ${groupNum}`);
  debug(`number of groupMember currently in database: ${groupMemberNum}`);
  debug("connected");
  debug("about to disconnect to database");
  await mongoose.connection.close();
}
