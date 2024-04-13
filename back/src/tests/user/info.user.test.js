const request = require("supertest");
const {
  afterAll,
  afterEach,
  beforeAll,
  beforeEach,
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

//
const User = require("./../../models/user");

describe(`User Info Testing`, () => {
  describe(`INVALID CASES`, () => {
    // TODO: Add some edge cases
  });

  describe(`VALID CASES`, () => {
    describe(`GET /users`, () => {
      let asdToken;
      let qweToken;
      beforeAll(async () => {
        await method.createUsers(2, "asd"); // 2 users 'asd0' and 'asd1'
        await method.createFollows(1); // 100% chance follow each other

        await method.createUsers(1, "qwe"); // 1 user 'qwe0'

        // Auth is being tested first
        const asdRes = await request(app)
          .post("/api/v1/auth/login")
          .type("form")
          .send({ username: "asd0", password: EnvVar.DummyPassword });
        asdToken = asdRes.body.token;

        const qweRes = await request(app)
          .post("/api/v1/auth/login")
          .type("form")
          .send({ username: "qwe0", password: EnvVar.DummyPassword });
        qweToken = qweRes.body.token;
      });

      afterAll(async () => {
        // clear db
        await User.deleteMany({});
      });

      test(`Setup db work like expect`, async () => {
        const users = await User.find({}).exec();
        debug(`users belike: `, users);

        expect(users.length).toBe(3);

        // debug(`both asdToken belike: `, asdToken);
        // debug(`both qweToken belike: `, qweToken);
      });

      test(`asd0 GET /users`, async () => {
        const res = await request(app)
          .get("/api/v1/users")
          .set("Authorization", `Bearer ${asdToken}`);
        expect(res.status).toBe(200);
        expect(res.headers["content-type"]).toMatch(/json/);

        expect(res.body.followers.length).toBe(1); // asd1
        expect(res.body.followings.length).toBe(1); // asd1
        expect(res.body.mayknows.length).toBe(1); // qwe0
      });

      test(`qwe0 GET /users`, async () => {
        const res = await request(app)
          .get("/api/v1/users")
          .set("Authorization", `Bearer ${qweToken}`);
        expect(res.status).toBe(200);
        expect(res.headers["content-type"]).toMatch(/json/);

        expect(res.body.followers.length).toBe(0); //
        expect(res.body.followings.length).toBe(0); //
        expect(res.body.mayknows.length).toBe(2); // asd0, asd1
      });
    });

    describe(`GET /users/:userid`, () => {
      test(`something`, async () => {
        //
      });
    });

    describe(`PUT /users/:userid`, () => {
      test(`something`, async () => {
        //
      });
    });

    describe(`POST /users/:userid/follows`, () => {
      test(`something`, async () => {
        //
      });
    });
  });
});
