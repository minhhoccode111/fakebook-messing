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
const Message = require("./../../models/message");

// WARN: ISOLATE AND RUN EACH TEST FILE
// SO THAT THE DATABASE DON'T POPULATE EACH OTHERS

describe(`User Message Testing`, () => {
  let asdBody;
  let qweBody;
  beforeAll(async () => {
    await method.createUsers(1, "asd");
    await method.createUsers(1, "qwe");

    // 2 users
    const asdUser = await User.findOne({ username: "asd" }).exec();
    const qweUser = await User.findOne({ username: "qwe" }).exec();

    // Two messages to be tested
    await new Message({
      sender: asdUser,
      userReceive: qweUser,
      content: "asd send a message to qwe",
    }).save();
    await new Message({
      sender: qweUser,
      userReceive: asdUser,
      content: "qwe send a message to asd",
    }).save();

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

  test(`Setup db work like expect`, async () => {
    const users = await User.find({}).exec();
    const messages = await Message.find({}).exec();

    // WARN:
    // This could be fail because the test runner run every `request(app)`
    // before running any `test()` or `expect()` which make the database's
    // states change?

    expect(users.length).toBe(2);
    expect(messages.length).toBe(2);
  });
  describe(`GET /users/:userid/messages`, () => {
    describe(`INVALID CASES`, () => {
      // TODO:
    });

    describe(`VALID CASES`, () => {
      test(`asd get 2 messages`, async () => {
        const res = await request(app)
          .post(`/api/v1/users/${qweBody.user.id}/messages`)
          .set("Authorization", `Bearer ${asdBody.token}`);
      });
    });
  });

  describe(`POST /users/:userid/messages`, () => {
    test(`something`, async () => {
      //
    });
  });
});
