// to access environment variables
require('dotenv').config(); // this line cause me 30 mins to deBUG

const mongoDB = process.argv.slice(2)[0] || process.env.DEVELOPMENT_MONGO;

// const custom = require('debug')('debug-custom');
const custom = (...str) => {
  for (const s of str) {
    console.log(s);
  }
};

custom(mongoDB);

const mongoose = require('mongoose');
mongoose.set('strictQuery', false);

main().catch((err) => custom(err));

async function main() {
  custom('about to connect to database');
  await mongoose.connect(mongoDB);
  custom('about to insert some documents');
  // first create 20 users
  await createUsers(20, 'asd');
  // then create 40 groups, a random user will be group's creator
  await createGroups(40);
  // then create 200 messages, a random user send to another user or group
  await createMessages(200);
  // then add every message's sender to a group
  await createGroupMembers();
  custom('finishes insert documents');
  await mongoose.connection.close();
  custom('connection closed');
}

// fake database documents
const { faker } = require('@faker-js/faker');

// add default data in database
const bcrypt = require('bcrypt');

// to access environment variables
require('dotenv').config(); // this line cause me 30 mins to deBUG

const User = require('./../src/models/user');
const Message = require('./../src/models/message');
const Group = require('./../src/models/group');
const GroupMember = require('./../src/models/groupMember');

const users = [];
const messages = [];
const groups = [];
const groupMembers = [];

const PASSWORD = process.env.USERS_PASSWORD; // asd
const SALT = Number(process.env.SALT); // 10

async function userCreate(index, username, pw) {
  // password still get hashed
  const password = await bcrypt.hash(pw, SALT);
  const userDetail = {
    // username and password are something that we can control
    username,
    password,
    fullname: faker.person.fullName(),
    dateOfBirth: faker.date.past(),
    bio: faker.lorem.paragraph(),
    status: faker.helpers.arrayElement(['online', 'offline', 'busy', 'afk']),
    avatarLink: faker.image.avatar(),
    createdAt: faker.date.recent(),
    updatedAt: faker.date.recent(),
  };

  const user = new User(userDetail);
  await user.save();

  users[index] = user;
  custom(`adding user: ${user} with raw password: ${pw} at index: ${index}`);
}

async function createUsers(number, username = 'asd') {
  custom(PASSWORD); // asd
  try {
    // create 20 users
    for (let i = 0; i < number; i++) {
      await userCreate(i, username + i, PASSWORD);
    }

    const count = await User.countDocuments({}).exec();
    custom(`User models is having: ${count} documents`);
  } catch (error) {
    custom(`the error is: `, error);
    throw error;
  }
}

async function messageCreate(index, sender, userReceive, groupReceive, content, imageLink) {
  const messageDetail = {
    sender,
    userReceive,
    groupReceive,
    content,
    imageLink,
    createdAt: faker.date.recent(),
  };

  const message = new Message(messageDetail);
  await message.save();

  messages[index] = message;
  custom(`adding message: ${message}`);
}

async function createMessages(number) {
  try {
    // create 200 random messages
    for (var i = 0; i < number; i++) {
      // get two different users in case sender is the same userReceive
      const twoUsers = faker.helpers.arrayElements(users, 2);
      const groupReceive = faker.helpers.arrayElement(groups);
      const randomReceiver = faker.datatype.boolean(0.5);

      // random content or image
      const content = faker.lorem.paragraph();
      const image = faker.image.avatar();
      const randomContent = faker.datatype.boolean(0.5);

      // sender will always first user
      await messageCreate(
        i,
        twoUsers[0],
        // will send to another user or group
        randomReceiver ? twoUsers[1] : null,
        randomReceiver ? null : groupReceive,
        // will be text content or image link
        randomContent ? content : null,
        randomContent ? null : image
      );
    }

    // loop through every group to make the creator of that group send a message to it
    // to make sure when create groupMember
    // continue from where i left
    for (let j = i, jLen = groups.length + i; j < jLen; j++) {
      // random content or image
      const content = faker.lorem.paragraph();
      const image = faker.image.avatar();
      const randomContent = faker.datatype.boolean(0.5);

      await messageCreate(
        j,
        // sender will be group's creator
        groups[j - i].creator,
        // null userReceive
        null,
        //  groupReceive is the current group
        groups[j - i],
        // will be text content or image link
        randomContent ? content : null,
        randomContent ? null : image
      );
    }

    const count = await Message.countDocuments({}).exec();
    custom(`Message models is having: ${count} documents`);
  } catch (error) {
    custom(`the error is: `, error);
    throw error;
  }
}

async function groupCreate(index) {
  const groupDetail = {
    // pick random a user to be group's creator
    creator: faker.helpers.arrayElement(users),
    name: faker.person.jobTitle(),
    public: faker.datatype.boolean(0.5),
    bio: faker.lorem.paragraph(),
    avatarLink: faker.image.avatar(),
    createdAt: faker.date.recent(),
    updatedAt: faker.date.recent(),
  };

  const group = new Group(groupDetail);
  await group.save();

  groups[index] = group;
  custom(`adding group: ${group}`);
}

async function createGroups(number) {
  try {
    // create 40 groups
    for (let i = 0; i < number; i++) {
      await groupCreate(i);
    }

    const count = await Group.countDocuments({}).exec();
    custom(`Group models is having: ${count} documents`);
  } catch (error) {
    custom(`the error is: `, error);
    throw error;
  }
}

async function groupMemberCreate(index, user, group, isCreator) {
  const groupMemberDetail = {
    user,
    group,
    isCreator,
    createdAt: faker.date.recent(),
  };

  const groupMember = new GroupMember(groupMemberDetail);
  await groupMember.save();

  groupMembers[index] = groupMember;
  custom(`adding group member: ${groupMember}`);
}

async function createGroupMembers() {
  try {
    // loop through each group to add members to it
    for (let i = 0; i < groups.length; i++) {
      // and creator store when group's created is also member
      const creator = groups[i].creator;

      // a Set to store current group's member
      const members = new Set();

      // members that sent messages to this group will be a member
      for (let j = 0, len = messages.length; j < len; j++) {
        // current group is message's groupReceive, and not added yet
        if (groups[i] === messages[j].groupReceive && !members.has(messages[j].sender)) {
          // add sender to members Set, so we don't add anyone twice
          members.add(messages[j].sender);

          // create group member with the sender
          await groupMemberCreate(
            // index of this don't matter
            i + j,
            // user will be the one who sent message
            messages[j].sender,
            // group will be current group
            groups[i],
            // if current user is the group's creator
            messages[j].sender._id === creator._id
          );
        }
      }
    }

    const count = await GroupMember.countDocuments({}).exec();
    custom(`GroupMember models is having: ${count} documents`);
  } catch (error) {
    custom(`the error is: `, error);
    throw error;
  }
}
