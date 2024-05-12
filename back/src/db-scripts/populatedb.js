const escape = require("escape-html");

// environment variables
const EnvVar = require("./../constants/envvar");

// Make every debug the same
const debug = require("./../constants/debug");

// fake database documents
const { faker } = require("@faker-js/faker");

// add default data in database
const bcrypt = require("bcrypt");

// clear database
const Post = require("./../models/post");
const User = require("./../models/user");
const Group = require("./../models/group");
const Follow = require("./../models/follow");
const Message = require("./../models/message");
const Comment = require("./../models/comment");
const LikePost = require("./../models/likePost");
const GroupMember = require("./../models/groupMember");
const LikeComment = require("./../models/likeComment");

const MONGODB = process.argv.slice(2)[0] || EnvVar.MongoString;

debug(MONGODB);

const mongoose = require("mongoose");
mongoose.set("strictQuery", false);

main().catch((err) => debug(err));

async function main() {
  debug("about to connect to database");
  await mongoose.connect(MONGODB);
  debug("about to insert some documents");

  await createUsers(25, "asd"); // number of users
  // await createUsers(5, "messing"); // number of users
  await createGroups(30); // number of groups
  await createMessages(1500); // number of messages, to other users and groups
  // base on users send messages to groups
  // 50% messages will be sent to groups
  await createGroupMembers();

  // await createUsers(5, "fakebook"); // number of users
  await createFollows(0.5); // chance that a user will follow other
  await createPosts(7, 0.5); // max number of posts/user, chance
  await createComments(3, 0.5); // max number of comments/user/post, chance
  await createLikePosts(0.3); // chance that a user will like a post
  await createLikeComments(0.95); // chance that a user will like a comment

  const numComment = await Comment.countDocuments({}).exec();
  debug(`Comment models is having: ${numComment} documents`);
  const numFollow = await Follow.countDocuments({}).exec();
  debug(`Follow models is having: ${numFollow} documents`);
  const numGroup = await Group.countDocuments({}).exec();
  debug(`Group models is having: ${numGroup} documents`);
  const numGroupMember = await GroupMember.countDocuments({}).exec();
  debug(`GroupMember models is having: ${numGroupMember} documents`);
  const numLikeComment = await LikeComment.countDocuments({}).exec();
  debug(`LikeComment models is having: ${numLikeComment} documents`);
  const numLikePost = await LikePost.countDocuments({}).exec();
  debug(`LikePost models is having: ${numLikePost} documents`);
  const numMessage = await Message.countDocuments({}).exec();
  debug(`Message models is having: ${numMessage} documents`);
  const numPost = await Post.countDocuments({}).exec();
  debug(`Post models is having: ${numPost} documents`);
  const numUser = await User.countDocuments({}).exec();
  debug(`User models is having: ${numUser} documents`);

  debug("finishes insert documents");
  await mongoose.connection.close();
  debug("connection closed");
}

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

const PASSWORD = EnvVar.DummyPassword;
const SALT = Number(EnvVar.Salt);

async function createUsers(number, username = "asd") {
  debug(PASSWORD); // asd
  try {
    // create number of users
    for (let i = 0; i < number; i++) {
      // script to create my account
      let userDetail;
      if (i === 0) {
        const password = await bcrypt.hash("Bruh0!0!", 13); // TODO: hide this before pushing code to github
        userDetail = {
          // https://avatars.githubusercontent.com/u/107298518?v=4
          username: "minhhoccode111@gmail.com",
          password,
          fullname: "minhhoccode111",
          dateOfBirth: new Date("2001-01-01"),
          bio: `I write code (sometimes)`,
          status: "online",
          avatarLink: "https://avatars.githubusercontent.com/u/107298518?v=4",
          createdAt: Date.now(),
          updatedAt: Date.now(),
        };
      } else {
        // password still get hashed
        const password = await bcrypt.hash(PASSWORD, SALT);
        userDetail = {
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
          avatarLink: escape(faker.image.avatar()),
          createdAt: faker.date.recent(),
          updatedAt: faker.date.recent(),
        };
      }

      const user = new User(userDetail);
      await user.save();

      users.push(user);
      debug(`adding user: ${user.fullname} at index: ${users.length - 1}`);
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

      groups.push(group);
      debug(`adding group: ${group.name} at index: ${groups.length - 1}`);
    }
  } catch (error) {
    debug(`the error is: `, error);
    throw error;
  }
}

async function messageCreate(
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

  messages.push(message);

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

  debug(
    `adding message: ${message.content ? message.content : message.imageLink} at index: ${messages.length - 1}`,
  );
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

        groupMembers.push(groupMember);

        debug(
          `add ${sender.fullname} to ${key.name} at index: ${groupMembers.length - 1}`,
        );
      }
    }
  } catch (err) {
    debug(`the error is: `, err);
    throw err;
  }
}

async function createFollows(chanceSkip = 0) {
  try {
    // loop through each user
    for (let i = 0, len = users.length; i < len; i++) {
      if (i === 0) continue; // i don't follow any one
      // loop through other user
      for (let j = 0, len = users.length; j < len; j++) {
        // follow me (at index 1)
        const followMe = new Follow({
          follower: users[i],
          following: users[0],
          createdAt: faker.date.recent(),
        });
        await followMe.save();
        follows.push(followMe);

        if (i === j) continue; // skip user-self
        if (faker.datatype.boolean(chanceSkip)) continue; // 50% skip

        // else follow the user
        const follow = new Follow({
          follower: users[i],
          following: users[j],
          createdAt: faker.date.recent(),
        });

        await follow.save();

        follows.push(follow);
        debug(
          `${users[i].fullname} is following ${users[j].fullname} at index ${follows.length - 1}`,
        );
      }
    }
  } catch (err) {
    debug(`the error belike: `, err);
    throw err;
  }
}

async function createPosts(number, chanceSkip = 0) {
  try {
    // each user will create maximun number of posts
    for (let i = 0, len = users.length; i < len; i++) {
      for (let j = 0; j < number; j++) {
        if (faker.datatype.boolean(chanceSkip)) continue;

        const post = new Post({
          creator: users[i],
          content: faker.lorem.paragraphs({ min: 1, max: 3 }),
          createdAt: faker.date.recent(),
        });

        await post.save();

        posts.push(post);
        debug(
          `${users[i].fullname} created a post at index: ${posts.length - 1}`,
        );
      }
    }
  } catch (err) {
    debug(`the error belike: `, err);
    throw err;
  }
}

async function createComments(number, chanceSkip = 0) {
  try {
    // each user
    for (let i = 0, len = users.length; i < len; i++) {
      // each post
      for (let j = 0; j < posts.length; j++) {
        // create maximum number of comments
        for (let k = 0; k < number; k++) {
          if (faker.datatype.boolean(chanceSkip)) continue;

          const comment = new Comment({
            creator: users[i],
            post: posts[j],
            content: faker.lorem.paragraph({ min: 1, max: 3 }),
            createdAt: faker.date.recent(),
          });

          await comment.save();

          comments.push(comment);
          debug(
            `${users[i].fullname} commented on ${posts[j].creator.fullname} post at index: ${comments.length - 1}`,
          );
        }
      }
    }
  } catch (err) {
    debug(`the error belike: `, err);
    throw err;
  }
}

async function createLikePosts(chanceSkip = 0) {
  try {
    // each user
    for (let i = 0, len = users.length; i < len; i++) {
      // each post
      for (let j = 0; j < posts.length; j++) {
        if (faker.datatype.boolean(chanceSkip)) continue;

        const likePost = new LikePost({
          creator: users[i],
          post: posts[j],
        });

        await likePost.save();
        likePosts.push(likePost);

        debug(
          `${users[i].fullname} liked on ${posts[j].creator.fullname} post at index: ${likePosts.length - 1}`,
        );
      }
    }
  } catch (err) {
    debug(`the error belike: `, err);
    throw err;
  }
}

async function createLikeComments(chanceSkip = 0) {
  try {
    // each user
    for (let i = 0, userLen = users.length; i < userLen; i++) {
      // each comment
      for (let j = 0, commentLen = comments.length; j < commentLen; j++) {
        if (faker.datatype.boolean(chanceSkip)) continue;

        const likeComment = new LikeComment({
          creator: users[i],
          comment: comments[j],
        });

        await likeComment.save();
        likeComments.push(likeComment);

        debug(
          `${users[i].fullname} liked on ${comments[j].creator.fullname} comment at index: ${likeComments.length - 1}`,
        );
      }
    }
  } catch (err) {
    debug(`the error belike: `, err);
    throw err;
  }
}
