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
    // expect(users.length).toBe(2);
    // expect(posts.length).toBe(4); // 2 posts/user
    // expect(comments.length).toBe(16); // 2 comments/user/post
    // expect(likePosts.length).toBe(0); // 0 like/user/post
    // expect(likeComments.length).toBe(0); // 0 like/user/comment
  });

  describe(`POST /users/:userid/posts/:postid/likes`, () => {
    describe(`INVALID CASES`, () => {
      // TODO: add some invalid cases
    });

    describe(`VALID CASES`, () => {
      test(`asd POST /users/:userid/posts/:postid/likes`, async () => {
        // 4 comments, 0 post like, 0 comment likes
        const asdPost = await Post.findOne({ creator: asdBody.self.id }).exec();
        const qwePost = await Post.findOne({ creator: qweBody.self.id }).exec();

        const cases = [
          // add likes
          [asdBody.token, asdBody.self.id, asdPost.id, 1],
          [qweBody.token, asdBody.self.id, asdPost.id, 2],
          [asdBody.token, qweBody.self.id, qwePost.id, 1],
          [qweBody.token, qweBody.self.id, qwePost.id, 2],
          // remove likes
          [asdBody.token, asdBody.self.id, asdPost.id, 1],
          [qweBody.token, asdBody.self.id, asdPost.id, 0],
          [asdBody.token, qweBody.self.id, qwePost.id, 1],
          [qweBody.token, qweBody.self.id, qwePost.id, 0],
          // [qweBody.token, "somerandomstring", qwePost.id, 0],
        ];

        for (const [token, userid, postid, likes] of cases) {
          const res = await request(app)
            .post(`/api/v1/users/${userid}/posts/${postid}/likes`)
            .set("Authorization", `Bearer ${token}`);

          expect(res.body.likes).toBe(likes);
        }
      });
    });
  });

  describe(`POST /users/:userid/posts/:postid/comments`, () => {
    describe(`INVALID CASES`, () => {
      // TODO: add some invalid cases
      // invalid userid
      // invalid postid
      // invalid data
    });

    describe(`VALID CASES`, () => {
      test(`asd comment on all posts`, async () => {
        // Get all posts
        // each has 4 comments, 0 post like, 0 comment like
        // above reset likes to 0
        const posts = await Post.find({}).populate("creator", "_id").exec();
        const token = asdBody.token;

        for (let i = 0, len = posts.length; i < len; i++) {
          const post = posts[i];
          const content = `This is dummy comment ${i}`;
          const res = await request(app)
            .post(`/api/v1/users/${post.creator.id}/posts/${post.id}/comments`)
            .set("Authorization", `Bearer ${token}`)
            .type("form")
            .send({
              content,
            });

          expect(res.status).toBe(200);
          // keep
          expect(res.body.content).toBe(post.content);
          expect(res.body.likes).toBe(0);
          // change
          expect(res.body.comments.length).toBe(5);
          expect(
            res.body.comments.some((comment) => comment.content === content),
          ).toBe(true);
        }
      });
    });
  });

  describe(`POST /users/:userid/posts/:postid/comments/:commentid/likes`, () => {
    describe(`INVALID CASES`, () => {
      // TODO: add some invalid cases
    });

    describe(`VALID CASES`, () => {});
    test(`asd POST /users/:userid/posts/:postid/comments/:commentid/likes`, async () => {
      // 1 asd post, 4 comments, 0 post like, 0 comment likes
      const asdPost = await Post.findOne({ creator: asdBody.self.id }).exec();

      // 1 asd comment
      const asdComment = await Comment.findOne({
        creator: asdBody.self.id,
        post: asdPost.id,
      }).exec();
      // 1 qwe comment
      const qweComment = await Comment.findOne({
        creator: qweBody.self.id,
        post: asdPost.id,
      }).exec();

      const cases = [
        // increase on asdComment
        {
          token: asdBody.token,
          userid: asdBody.self.id,
          postid: asdPost.id,
          commentid: asdComment.id,
          likes: 1,
        },
        {
          token: qweBody.token,
          userid: asdBody.self.id,
          postid: asdPost.id,
          commentid: asdComment.id,
          likes: 2,
        },
        // decrease on asdComment
        {
          token: asdBody.token,
          userid: asdBody.self.id,
          postid: asdPost.id,
          commentid: asdComment.id,
          likes: 1,
        },
        {
          token: qweBody.token,
          userid: asdBody.self.id,
          postid: asdPost.id,
          commentid: asdComment.id,
          likes: 0,
        },
        // increase on qweComment
        {
          token: asdBody.token,
          userid: asdBody.self.id,
          postid: asdPost.id,
          commentid: qweComment.id,
          likes: 1,
        },
        {
          token: qweBody.token,
          userid: asdBody.self.id,
          postid: asdPost.id,
          commentid: qweComment.id,
          likes: 2,
        },
        // decrease on qweComment
        {
          token: asdBody.token,
          userid: asdBody.self.id,
          postid: asdPost.id,
          commentid: qweComment.id,
          likes: 1,
        },
        {
          token: qweBody.token,
          userid: asdBody.self.id,
          postid: asdPost.id,
          commentid: qweComment.id,
          likes: 0,
        },
      ];

      for (const c of cases) {
        const res = await request(app)
          .post(
            `/api/v1/users/${c.userid}/posts/${c.postid}/comments/${c.commentid}/likes`,
          )
          .set("Authorization", `Bearer ${c.token}`);

        // debug(`the likes belike: `, c.likes);
        expect(
          res.body.comments.some(
            (comment) =>
              comment.id === c.commentid && comment.likes === c.likes,
          ),
        ).toBe(true);
      }
    });
  });
});
