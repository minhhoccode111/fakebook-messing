// to access environment variables
require("dotenv").config(); // this line cause me 30 mins to deBUG

const MONGODB = process.argv.slice(2)[0] || process.env.DEVELOPMENT_MONGO;

const debug = (...str) => {
  for (const s of str) {
    console.log(s);
  }
};

debug(MONGODB);

const mongoose = require("mongoose");
mongoose.set("strictQuery", false);

main().catch((err) => debug(err));

async function main() {
  debug("about to connect to database");
  await mongoose.connect(MONGODB);
  debug("about to insert some documents");

  // how to populate database messing
  // first create 20 users with random detaild and save indexes
  await createUsers(20, "asd");
  // then create 40 groups with random detail
  // and pick a random user to be group's creator
  await createGroups(40);
  // then create 2000 messages with random sender
  // and pick random between userReceived and group received
  // and pick random between content and imageLink
  // loop through every group created and force the group's creator to send
  // at least one message to the group
  await createMessages(2000);
  // loop through every group and check every messages being sent to the group
  // then make every sender to be group's member
  await createGroupMembers();

  // TODO: how to populate database fakebook
  // first create random connection between users (follower, following, none)
  // then each user will have a number of random posts created
  // then each user will have a number of random comments on others' posts
  // then each user will have a number of random like on others' posts
  // then each user will have a number of random like on others' comments

  // const numComment = await Comment.countDocuments({}).exec();
  // debug(`Comment models is having: ${numComment} documents`);
  // const numFollow = await Follow.countDocuments({}).exec();
  // debug(`Follow models is having: ${numFollow} documents`);
  // const numGroup = await Group.countDocuments({}).exec();
  // debug(`Group models is having: ${numGroup} documents`);
  // const numGroupMember = await GroupMember.countDocuments({}).exec();
  // debug(`GroupMember models is having: ${numGroupMember} documents`);
  // const numLikeComment = await LikeComment.countDocuments({}).exec();
  // debug(`LikeComment models is having: ${numLikeComment} documents`);
  // const numLikePost = await LikePost.countDocuments({}).exec();
  // debug(`LikePost models is having: ${numLikePost} documents`);
  // const numMessage = await Message.countDocuments({}).exec();
  // debug(`Message models is having: ${numMessage} documents`);
  // const numPost = await Post.countDocuments({}).exec();
  // debug(`Post models is having: ${numPost} documents`);
  // const numUser = await User.countDocuments({}).exec();
  // debug(`User models is having: ${numUser} documents`);

  debug("finishes insert documents");
  await mongoose.connection.close();
  debug("connection closed");
}

// fake database documents
const { faker } = require("@faker-js/faker");

// add default data in database
const bcrypt = require("bcrypt");

// to access environment variables
require("dotenv").config(); // this line cause me 30 mins to deBUG

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

const comments = [];
const follows = [];
const groups = [];
const groupMembers = [];
const likeComments = [];
const likePosts = [];
const messages = [];
const posts = [];
const users = [];

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
    status: faker.helpers.arrayElement(["online", "offline", "busy", "afk"]),
    avatarLink: faker.image.avatar(),
    createdAt: faker.date.recent(),
    updatedAt: faker.date.recent(),
  };

  const user = new User(userDetail);
  await user.save();

  users[index] = user;
  debug(
    `adding user: ${user.fullname} with raw password: ${pw} at index: ${index}`,
  );
}

async function createUsers(number, username = "asd") {
  debug(PASSWORD); // asd
  try {
    // create number of users
    for (let i = 0; i < number; i++) {
      await userCreate(i, username + i, PASSWORD);
    }
  } catch (error) {
    debug(`the error is: `, error);
    throw error;
  }
}

async function messageCreate(
  index,
  sender,
  userReceive,
  groupReceive,
  content,
  imageLink,
) {
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
  debug(`adding message: ${message}`);
}

async function createMessages(number) {
  try {
    // create number of random messages
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
        randomContent ? null : image,
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
        randomContent ? null : image,
      );
    }
  } catch (error) {
    debug(`the error is: `, error);
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
  debug(`adding group: ${group}`);
}

async function createGroups(number) {
  try {
    // create number of groups
    for (let i = 0; i < number; i++) {
      await groupCreate(i);
    }
  } catch (error) {
    debug(`the error is: `, error);
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
  debug(`adding group member: ${groupMember}`);
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
        if (
          groups[i] === messages[j].groupReceive &&
          !members.has(messages[j].sender)
        ) {
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
            messages[j].sender._id === creator._id,
          );
        }
      }
    }
  } catch (error) {
    debug(`the error is: `, error);
    throw error;
  }
}
