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

describe(`User Post Interaction Testing`, () => {
  let asdBody;
  let qweBody;
  beforeAll(async () => {
    await method.createUsers(1, "asd");
    await method.createUsers(1, "qwe");
    await method.createPosts(2, 0); // 2 posts/user
    await method.createComments(2, 0); // 2 comments/user/post
    await method.createLikePosts(1); // 0 like/user/post
    await method.createLikeComments(1); // 0 like/user/comment

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

    // WARN:
    // This could be fail because the test runner run every `request(app)`
    // before running any `test()` or `expect()` which make the database's
    // states change?
    expect(users.length).toBe(2);
    expect(posts.length).toBe(4); // 2 posts/user
    expect(comments.length).toBe(16); // 2 comments/user/post
    expect(likePosts.length).toBe(0); // 0 like/user/post
    expect(likeComments.length).toBe(0); // 0 like/user/comment
  });

  describe(`POST /users/:userid/posts/:postid/likes`, () => {
    describe(`INVALID CASES`, () => {
      // TODO: add some invalid cases
    });

    describe(`VALID CASES`, () => {
      test(`asd POST /users/:userid/posts/:postid/likes`, async () => {
        // 4 comments, 0 post like, 0 comment likes
        const post = await Post.findOne({}).exec();

        const res = await request(app)
          .post(`/api/v1/users/${asdBody.user.id}/posts/${post.id}/likes`)
          .set("Authorization", `Bearer ${asdBody.token}`);

        // kept
        expect(res.body.content).toBe(post.content);
        expect(res.body.comments.length).toBe(4);
        expect(res.body.likes).toBe(1);
      });
    });
  });

  describe.skip(`POST /users/:userid/posts/:postid/comments`, () => {
    describe(`INVALID CASES`, () => {
      // TODO: add some invalid cases
      // authorization
      // data

      test(`some invalid cases`, async () => {
        const post = await Post.findOne({})
          .populate("creator", "_id fullname")
          .exec();

        const res = await request(app)
          .post(`/api/v1/users/${asdBody.user.id}/posts/${post.id}/comments`)
          .set("Authorization", `Bearer ${asdBody.token}`)
          .type("form")
          .send({
            content: "Hey this pretty good",
          });
      });
    });

    describe(`VALID CASES`, () => {
      test(`asd comment on all posts`, async () => {
        // Get any post
        // 4 comments, 0 post like, 0 comment like

        const post = await Post.findOne({})
          .populate("creator", "_id fullname")
          .exec();

        const res = await request(app)
          .post(`/api/v1/users/${asdBody.user.id}/posts/${post.id}/comments`)
          .set("Authorization", `Bearer ${asdBody.token}`)
          .type("form")
          .send({
            content: "Hey this pretty good",
          });
      });
    });
  });

  describe(`POST /users/:userid/posts/:postid/comments/:commentid/likes`, () => {
    describe(`INVALID CASES`, () => {
      // TODO: add some invalid cases
    });

    describe(`VALID CASES`, () => {});
    test(`something`, async () => {
      //
    });
  });
});
