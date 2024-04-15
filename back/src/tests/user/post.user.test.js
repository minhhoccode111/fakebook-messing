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

    // WARN:
    // This could be fail because the test runner run every `request(app)`
    // before running any `test()` or `expect()` which make the database's
    // states change
    // expect(users.length).toBe(2);
    // expect(posts.length).toBe(6); // 3 posts/user
    // expect(comments.length).toBe(24); // 2 comments/user/post
    // expect(likePosts.length).toBe(12); // 1 like/user/post
    // expect(likeComments.length).toBe(48); // 1 like/user/comment
  });

  describe(`GET /users/:userid/posts`, () => {
    /*
     * {
     * creator: don't need since req.userParam can be used
     * posts: [
     *  Post{
     *    content: ...,
     *    likes: ...,
     *    comments: [
     *      Comment{
     *        author: User{
     *          fullname: ...,
     *          id: ...,
     *          status: ...,
     *          avatarLink: ...,
     *        }
     *        content: ...,
     *        likes: ...
     *      },
     *    ]
     *  },
     *  Post{...},
     *  ...
     *  ]
     * }
     */

    describe(`INVALID CASES`, () => {
      // TODO:Already test the middlewares validate for :userid
    });

    describe(`VALID CASES`, () => {
      test(`asd GET /users/:qwe.id/posts`, async () => {
        const res = await request(app)
          .get(`/api/v1/users/${qweBody.user.id}/posts`)
          .set("Authorization", `Bearer ${asdBody.token}`);

        expect(res.status).toBe(200);
        expect(res.body.creator).toEqual(qweBody.user);
        // 3 posts/user
        expect(res.body.posts.length).toEqual(3);

        // debug(`the res.body.posts belike: `, res.body.posts);

        for await (const post of res.body.posts) {
          // 1 like/user/post
          // debug(`the post in for...of test`, post);
          expect(post.likes).toEqual(2);
          // 2 comments/user/post
          expect(post.comments.length).toEqual(4);

          // 1 like/user/comment
          // debug(post.comments);
          expect(post.comments.every((comment) => comment.likes === 2)).toBe(
            true,
          );

          //
          // debug(post.comments);
          expect(
            post.comments.some(
              (comment) => comment.creator.fullname === qweBody.user.fullname,
            ),
          ).toBe(true);

          expect(post.content).toBeDefined();

          post.comments.forEach((comment) =>
            expect(comment.content).toBeDefined(),
          );
        }
      });
    });
  });

  describe(`POST /users/:userid/posts`, () => {
    describe(`INVALID CASES`, () => {
      const cases = [
        [{ id: asdBody.user.id, content: "" }, 400],
        [{ id: qweBody.user.id, content: "Some dummy data" }, 404],
      ];

      test(`some invalid cases`, async () => {
        for (const [update, code] of cases) {
          const res = await request(app)
            .post(`/api/v1/users/${update.id}/posts`)
            .set("Authorization", `Bearer ${asdBody.token}`)
            .type("form")
            .send({ content: update.content });

          expect(res.status).toBe(code);
        }
      });
    });

    describe(`VALID CASES`, () => {
      const content = "This is a dummy post content";
      test(`asd POST /users`, async () => {
        const res = await request(app)
          .post(`/api/v1/users/${asdBody.user.id}/posts`)
          .set("Authorization", `Bearer ${asdBody.token}`)
          .type("form")
          .send({ content });

        expect(res.status).toBe(200);
        // no need to test the res.body returned because
        // it will reuse GET /users/:userid/posts

        const { posts, creator } = res.body;
        expect(posts.length).toBe(4);
        expect(posts.some((post) => post.content === content)).toBe(true);
        expect(creator.fullname).toBe(asdBody.user.fullname);
      });
    });
  });

  describe(`DELETE /users/:userid/posts/:postid`, () => {
    describe(`INVALID CASES`, () => {
      test(`some invalid cases`, async () => {
        const asdPost = await Post.findOne(
          { creator: asdBody.user.id },
          "_id",
        ).exec();
        const qwePost = await Post.findOne(
          { creator: qweBody.user.id },
          "_id",
        ).exec();

        // debug(asdPost, qwePost);

        const cases = [
          [{ userid: asdBody.user.id, postid: "somerandomstring" }, 404],
          [{ userid: asdBody.user.id, postid: qwePost.id }, 404],
          [{ userid: qweBody.user.id, postid: qwePost.id }, 404],
          // TODO: this should not be 404
          [{ userid: asdBody.user.id, postid: asdPost.id }, 200],
        ];

        // debug(`cases belike: `, cases);

        for (const [info, code] of cases) {
          const res = await request(app)
            .delete(`/api/v1/users/${info.id}/posts/${info.postid}`)
            .set("Authorization", `Bearer ${asdBody.token}`);

          expect(res.status).toBe(code);
        }
      });
    });

    describe(`VALID CASES`, () => {
      test(`something`, async () => {
        //
      });
    });
  });
});
