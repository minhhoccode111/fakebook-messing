// clear database
const User = require('./../src/models/user');
const Message = require('./../src/models/message');
const Group = require('./../src/models/group');
const GroupMember = require('./../src/models/groupMember');

// to access environment variables
require('dotenv').config(); // this line cause me 30 mins to deBUG

// const debug = require('debug')('custom');
const debug = (...str) => {
  for (const s of str) {
    console.log(s);
  }
};

const mongoDB = process.argv.slice(2)[0] || process.env.DEVELOPMENT_MONGO;

debug(mongoDB);

const mongoose = require('mongoose');
mongoose.set('strictQuery', false);

main().catch((err) => debug(err));

async function main() {
  debug('about to connect to database');
  await mongoose.connect(mongoDB);
  debug('about to clear database');
  await clearUser();
  await clearMessage();
  await clearGroup();
  await clearGroupMember();
  debug('database cleared');
  debug('about to close connection');
  await mongoose.connection.close();
  debug('connection closed');
}

async function clearUser() {
  const count = await User.countDocuments({}).exec();
  debug(`User models is having: ${count} documents`);
  await User.deleteMany({}).exec();
  debug('User cleared!');
}

async function clearMessage() {
  const count = await Message.countDocuments({}).exec();
  debug(`Message models is having: ${count} documents`);
  await Message.deleteMany({}).exec();
  debug('Message cleared!');
}

async function clearGroup() {
  const count = await Group.countDocuments({}).exec();
  debug(`Group models is having: ${count} documents`);
  await Group.deleteMany({}).exec();
  debug('Group cleared!');
}

async function clearGroupMember() {
  const count = await GroupMember.countDocuments({}).exec();
  debug(`GroupMember models is having: ${count} documents`);
  await GroupMember.deleteMany({}).exec();
  debug('GroupMember cleared!');
}
