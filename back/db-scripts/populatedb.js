// to access environment variables
require("dotenv").config(); // this line cause me 30 mins to deBUG

// debug
const debug = require("debug")(
  "============================================================",
);

const MONGODB = process.argv.slice(2)[0] || process.env.DEVELOPMENT_MONGO;

debug(MONGODB);

const mongoose = require("mongoose");
mongoose.set("strictQuery", false);

main().catch((err) => debug(err));

async function main() {
  debug("about to connect to database");
  await mongoose.connect(MONGODB);
  debug("about to insert some documents");

  await createUsers(20, "asd"); // 20 users
  // await createGroups(40); // 40 groups
  // await createMessages(2000); // 2000 messages
  // await createGroupMembers();

  // await createFollows();
  // await createPosts(30);
  // await createComments(6000);
  // await createLikePosts(16000);
  // await createLikeComments(6000);

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
const membersEveryGroups = new Map(); // store messages being sent to each group
const groupMembers = [];
const likeComments = [];
const likePosts = [];
const messages = [];
const posts = [];
const users = [];

const PASSWORD = process.env.USERS_PASSWORD; // asd
const SALT = Number(process.env.SALT); // 10

async function createUsers(number, username = "asd") {
  debug(PASSWORD); // asd
  try {
    // create number of users
    for (let i = 0; i < number; i++) {
      // password still get hashed
      const password = await bcrypt.hash(PASSWORD, SALT);
      const userDetail = {
        // username and password are something that we can control
        username: username + i,
        password,
        fullname: faker.person.fullName(),
        dateOfBirth: faker.date.past(),
        bio: faker.lorem.paragraph(),
        status: faker.helpers.arrayElement([
          "online",
          "offline",
          "busy",
          "afk",
        ]),
        avatarLink: faker.image.avatar(),
        createdAt: faker.date.recent(),
        updatedAt: faker.date.recent(),
      };

      const user = new User(userDetail);
      await user.save();

      users[i] = user;
      debug(
        `adding user: ${user.fullname} with raw password: ${password} at index: ${i}`,
      );
    }
  } catch (error) {
    debug(`the error is: `, error);
    throw error;
  }
}

async function createGroups(number) {
  try {
    // create number of groups
    for (let i = 0; i < number; i++) {
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

      groups[i] = group;
      debug(`adding group: ${group}`);
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

  // group receive the message is not null
  if (groupReceive) {
    // check Map doesn't have this group as a key
    if (!membersEveryGroups.has(groupReceive)) {
      // create new Set to store group's members with that group is the key
      membersEveryGroups.set(groupReceive, new Set());
    }

    // then add the sender to be the group's member Set
    membersEveryGroups.get(groupReceive).add(sender);
  }
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

async function createGroupMembers() {
  try {
    // loop through the Map, key is the group, value is a Set of members
    for (const [key, value] of membersEveryGroups) {
      // the group's creator
      const creator = key.creator;

      // loop through every sender of the senders Set
      for (const sender of value) {
        const groupMemberDetail = {
          user: sender,
          group: key,
          isCreator: sender._id === creator._id,
          createdAt: faker.date.recent(),
        };

        const groupMember = new GroupMember(groupMemberDetail);
        await groupMember.save();

        debug(`adding group member: ${groupMember}`);
      }
    }
  } catch (err) {
    debug(`the error is: `, err);
    throw err;
  }
}

async function createFollows() {
  //
}

async function createPosts() {
  //
}

async function createComments() {
  //
}

async function createLikePosts() {
  //
}

async function createLikeComments() {
  //
}
