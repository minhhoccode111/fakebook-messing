const request = require("supertest");
const {
  afterAll,
  // afterEach,
  beforeAll,
  // beforeEach,
  describe,
  expect,
  test,
} = require("bun:test");

const app = require("./../setup/app.setup");

const method = require("./../setup/method.setup");

// environment variables
const EnvVar = require("./../../constants/envvar");

// manually logging
const debug = require("./../../constants/debug");

const User = require("./../../models/user");
const Post = require("./../../models/post");
const Comment = require("./../../models/comment");
const LikePost = require("./../../models/likePost");
const LikeComment = require("./../../models/likeComment");

// WARN: ISOLATE AND RUN EACH TEST FILE
// SO THAT THE DATABASE DON'T POPULATE EACH OTHERS

describe(`User Post Testing`, () => {
  let asdBody;
  let qweBody;
  beforeAll(async () => {
    await method.createUsers(1, "asd");
    await method.createUsers(1, "qwe");
    await method.createPosts(3, 0); // 3 posts/user
    await method.createComments(2, 0); // 2 comments/user/post
    await method.createLikePosts(0); // 1 like/user/post
    await method.createLikeComments(0); // 1 like/user/comment

    // Auth is being tested already
    const asdRes = await request(app)
      .post("/api/v1/auth/login")
      .type("form")
      .send({ username: "asd0", password: EnvVar.DummyPassword });
    asdBody = asdRes.body; // store logged user

    const qweRes = await request(app)
      .post("/api/v1/auth/login")
      .type("form")
      .send({ username: "qwe0", password: EnvVar.DummyPassword });
    qweBody = qweRes.body; // store logged user
  });

  afterAll(async () => {
    // clear db, many don't need since this is in-memory db
    await User.deleteMany({});
  });

  test(`Setup db work like expect`, async () => {
    const users = await User.find({}).exec();
    const posts = await Post.find({}).exec();
    const comments = await Comment.find({}).exec();
    const likePosts = await LikePost.find({}).exec();
    const likeComments = await LikeComment.find({}).exec();

    // debug(`users belike: `, users);
    // debug(`posts belike: `, posts);

    expect(users.length).toBe(2);
    expect(posts.length).toBe(6); // 3 posts/user
    expect(comments.length).toBe(24); // 2 comments/user/post
    expect(likePosts.length).toBe(12); // 1 like/user/post
    expect(likeComments.length).toBe(48); // 1 like/user/comment
  });

  describe(`GET /users/:userid/posts`, () => {
    test(`something`, async () => {
      //
    });
  });

  describe(`POST /users/:userid/posts`, () => {
    test(`something`, async () => {
      //
    });
  });

  describe(`DELETE /users/:userid/posts/:postid`, () => {
    test(`something`, async () => {
      //
    });
  });
});
