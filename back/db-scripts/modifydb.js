// custom script to interact with database
const User = require('./../src/models/user');
const Message = require('./../src/models/message');
const Group = require('./../src/models/group');
const GroupMember = require('./../src/models/groupMember');

// to access environment variables
require('dotenv').config(); // this line cause me 30 mins to deBUG

// working with password
const bcrypt = require('bcrypt');

// const debug = require('debug')('custom-debug');
const debug = (...str) => {
  for (const s of str) {
    console.log(s);
  }
};

const mongoDB = process.argv.slice(2)[0] || process.env.DEVELOPMENT_MONGO;

const mongoose = require('mongoose');
mongoose.set('strictQuery', false);

main().catch((err) => debug('some errors occur', err));

async function main() {
  debug('about to connect to database');
  await mongoose.connect(mongoDB);
  const userNum = await User.countDocuments({}).exec();
  // const messageNum = await Message.countDocuments({}).exec();
  // const groupNum = await Group.countDocuments({}).exec();
  // const groupMemberNum = await GroupMember.find({}).exec();
  const users = await User.find({}).exec();
  // const messages = await Message.find({}).exec();
  // const groups = await Group.find({}).exec();
  // const groupMembers = await GroupMember.find({}).exec();

  // do some custom things

  // const creators = await GroupMember.find({ isCreator: true }).exec();
  // debug(`the creators be like: `, creators);

  // const count = await GroupMember.countDocuments({ isCreator: true }).exec();
  // debug(`count be like: `, count);

  // const groups = await Group.find().exec();
  // debug(`the group belike: `, groups);

  // const countGroups = await Group.countDocuments().exec();
  // debug(`count groups belike: `, countGroups);

  // do some custom things

  // debug(`users belike: `, users);
  // debug(`posts belike: `, posts);
  // debug(`comments belike: `, comments);

  debug(`users belike: `, users);
  // debug(`messages belike: `, messages);
  // debug(`groups belike: `, groups);
  // debug(`groupMembers belike: `, groupMembers);
  debug(`number of user currently in database: ${userNum}`);
  // debug(`number of message currently in database: ${messageNum}`);
  // debug(`number of group currently in database: ${groupNum}`);
  // debug(`number of groupMember currently in database: ${groupMemberNum}`);
  debug('connected');
  debug('about to disconnect to database');
  await mongoose.connection.close();
}
