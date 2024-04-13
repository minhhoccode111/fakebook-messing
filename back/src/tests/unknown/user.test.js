const request = require("supertest");
const { describe, expect, test, beforeAll, afterAll } = require("bun:test");
const { faker } = require("@faker-js/faker");
const bcrypt = require("bcrypt");

// model
const User = require("./../../models/user");

async function userCreate(username, pw) {
  // password still get hashed
  const password = await bcrypt.hash(pw, 10);
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
}

async function createUsers(number, username = "asd") {
  try {
    for (let i = 0; i < number; i++) {
      await userCreate(username + i, "asd");
    }
  } catch (error) {
    console.log(`the error is: `, error);
    throw error;
  }
}

// another app because don't want to touch the original
const app = require("./../setup");

describe(`GET PUT /user`, () => {
  let token;

  // before all authenticate
  beforeAll(async () => {
    // create an account
    await request(app).post("/api/v1/auth/signup").type("form").send({
      fullname: "khong dieu kien",
      username: "khongdieukien@gmail.com",
      password: "Bruh0!0!",
      "confirm-password": "Bruh0!0!",
    });

    // then login to get token
    const res = await request(app)
      .post("/api/v1/auth/login")
      .type("form")
      .send({ username: "khongdieukien@gmail.com", password: "Bruh0!0!" });

    // keep token
    token = res.body.token;
  });

  // new data
  const fullname = faker.person.fullName();
  const dateOfBirth = faker.date.past();
  const bio = faker.lorem.paragraph();
  const status = faker.helpers.arrayElement([
    "online",
    "offline",
    "busy",
    "afk",
  ]);
  const avatarLink = faker.image.avatar();

  test(`GET /user valid token`, async () => {
    const res = await request(app)
      .get("/api/v1/user")
      .set("Authorization", `Bearer ${token}`);
    expect(res.status).toBe(200);
    expect(res.headers["content-type"]).toMatch(/json/);
    expect(res.body.fullname).toMatch(/khong dieu kien/gi); // only fullname exists now
    expect(res.body.dateOfBirth).toBeDefined();
    expect(res.body.bio).toBeDefined();
    expect(res.body.status).toBeDefined();
    expect(res.body.avatarLink).toBeDefined();
    expect(res.body.updatedAt).toBeDefined();
    // console.log(res.body.user);
  });

  test(`GET /user invalid token`, async () => {
    const res = await request(app).get("/api/v1/user");
    // .set('Authorization', `Bearer ${token}`);
    expect(res.status).toBe(401);
  });

  test(`PUT /user invalid data type`, async () => {
    // status not valid string
    const invalidStatus = await request(app)
      .put("/api/v1/user")
      .set("Authorization", `Bearer ${token}`)
      .type("form")
      .send({
        status: "some string",
        fullname,
      });
    expect(invalidStatus.status).toBe(400);

    // status not being sent
    const invalidStatusEmpty = await request(app)
      .put("/api/v1/user")
      .set("Authorization", `Bearer ${token}`)
      .type("form")
      .send({
        status: "",
        fullname,
      });
    expect(invalidStatusEmpty.status).toBe(400);

    // invalid fullname
    const invalidFullname = await request(app)
      .put("/api/v1/user")
      .set("Authorization", `Bearer ${token}`)
      .type("form")
      .send({
        status: "online",
        fullname: "",
      });
    expect(invalidFullname.status).toBe(400);
  });

  test(`PUT /user valid data`, async () => {
    const res = await request(app)
      .put("/api/v1/user")
      .set("Authorization", `Bearer ${token}`)
      .type("form")
      .send({
        fullname,
        dateOfBirth,
        bio,
        status,
        avatarLink,
      });

    // console.log(`fullname belike: `, fullname)
    // console.log(`dateOfBirth belike: `, dateOfBirth)
    // console.log(`bio belike: `, bio)
    // console.log(`status belike: `, status)
    // console.log(`avatarLink belike: `, avatarLink)

    expect(res.status).toBe(200);
    expect(res.headers["content-type"]).toMatch(/json/);

    // console.log(`res.body belike: `, res.body);

    expect(res.body.newUser.fullname).toBe(fullname);
    expect(new Date(res.body.newUser.dateOfBirth).getTime()).toBe(
      dateOfBirth.getTime(),
    );
    expect(res.body.newUser.bio).toBe(bio);
    expect(res.body.newUser.status).toBe(status);
    expect(res.body.newUser.avatarLink).toBe(avatarLink);
  });

  test(`GET /user after being updated`, async () => {
    const res = await request(app)
      .get("/api/v1/user")
      .set("Authorization", `Bearer ${token}`);
    expect(res.status).toBe(200);
    expect(res.headers["content-type"]).toMatch(/json/);
    expect(res.body.fullname).toBe(fullname);
    // expect(new Date(res.body.dateOfBirth).getTime()).toBe(dateOfBirth.getTime());
    expect(res.body.bio).toBe(bio);
    expect(res.body.status).toBe(status);
    expect(res.body.avatarLink).toBe(avatarLink);
  });
});

describe(`/chat/users`, () => {
  let token;
  let user;
  let users;

  // before all authenticate
  beforeAll(async () => {
    // create an account
    await request(app).post("/api/v1/auth/signup").type("form").send({
      fullname: "khong dieu kien",
      username: "khongdieukien@gmail.com",
      password: "Bruh0!0!",
      "confirm-password": "Bruh0!0!",
    });

    // then login to get token
    const res = await request(app)
      .post("/api/v1/auth/login")
      .type("form")
      .send({
        // account use to log in
        username: "khongdieukien@gmail.com",
        password: "Bruh0!0!",
      });

    // keep requested user's info
    user = res.body.user;

    // keep token
    token = res.body.token;

    // create dummy user with username from asd0 ... asd4
    await createUsers(3, "asd");
  });

  describe(`GET /chat/users - get users current user can chat with`, () => {
    test(`GET /chat/users - return 3 dummy accounts, exclude account requested`, async () => {
      const res = await request(app)
        .get("/api/v1/chat/users")
        // request with khongdieukien account
        .set("Authorization", `Bearer ${token}`);

      // save users for test messages routes
      users = res.body.users;

      expect(res.status).toBe(200);
      expect(res.headers["content-type"]).toMatch(/json/);
      // console.log(res.body);
      expect(users.length).toBe(4); // 4 accounts
      // security
      expect(users.every((acc) => acc.username)).toBe(false);
      expect(users.every((acc) => acc.password)).toBe(false);
      // necessary info required
      expect(users.every((acc) => acc.fullname)).toBe(true);
      expect(users.every((acc) => acc._id)).toBe(true);
      expect(users.every((acc) => acc.id)).toBe(true);
      expect(users.every((acc) => acc.createdAt)).toBe(false);
    });
  });

  describe(`/chat/users/:userid`, () => {
    test(`GET /chat/users/:userid - wrong id return 404`, async () => {
      const res = await request(app)
        .get(`/api/v1/chat/users/someRandomString`)
        // request with khongdieukien account
        .set("Authorization", `Bearer ${token}`);

      expect(res.status).toBe(404);
    });

    test(`GET /chat/users/:userid - current user get all messages with another user`, async () => {
      const res = await request(app)
        .get(`/api/v1/chat/users/${users[0].id}`)
        // request with khongdieukien account
        .set("Authorization", `Bearer ${token}`);

      expect(res.status).toBe(200);
      expect(res.headers["content-type"]).toMatch(/json/);

      // match sender and receiver
      expect(res.body.messages.length).toBe(0);
      expect(res.body.requestedUser).toEqual(user);
      // too strict since some default content is being inject to the user in user creation
      // expect(res.body.receivedUser).toEqual(users[0]);
    });

    const content = faker.lorem.paragraph();
    const imageLink = faker.image.avatar();

    // console.log(`imageLink belike: `, imageLink);
    // console.log(`content belike: `, content);

    test(`POST /chat/users/:userid - 400 Bad request content and imageLink both empty`, async () => {
      const res = await request(app)
        .post(`/api/v1/chat/users/${users[0].id}`)
        // request with khongdieukien account
        .set("Authorization", `Bearer ${token}`)
        .type("form")
        .send({});

      expect(res.status).toBe(400);
    });

    test(`POST /chat/users/:userid - 400 Bad request content and imageLink both exist`, async () => {
      const res = await request(app)
        .post(`/api/v1/chat/users/${users[0].id}`)
        // request with khongdieukien account
        .set("Authorization", `Bearer ${token}`)
        .type("form")
        .send({ imageLink, content });

      expect(res.status).toBe(400);
    });

    test(`POST /chat/users/:userid - 404 Not found user`, async () => {
      const res = await request(app)
        .post(`/api/v1/chat/users/someRandomString`)
        // request with khongdieukien account
        .set("Authorization", `Bearer ${token}`)
        .type("form")
        .send({ imageLink });

      expect(res.status).toBe(404);
    });

    test(`POST /chat/users/:userid - send two message`, async () => {
      const resImage = await request(app)
        .post(`/api/v1/chat/users/${users[0].id}`)
        // request with khongdieukien account
        .set("Authorization", `Bearer ${token}`)
        .type("form")
        .send({ imageLink });

      const resContent = await request(app)
        .post(`/api/v1/chat/users/${users[0].id}`)
        // request with khongdieukien account
        .set("Authorization", `Bearer ${token}`)
        .type("form")
        .send({ content });

      // console.log(resImage);

      expect(resImage.status).toBe(200);
      expect(resImage.headers["content-type"]).toMatch(/json/);
      expect(resContent.status).toBe(200);
      expect(resContent.headers["content-type"]).toMatch(/json/);

      // match sender and receiver
      expect(resImage.body.requestedUser).toEqual(user);
      expect(resContent.body.requestedUser).toEqual(user);
      // too strict since some default content is being inject to the user in user creation
      // expect(res.body.receivedUser).toEqual(users[0]);
      // expect(resContent.body.receivedUser).toEqual(users[0]);

      // messages being sent back to client to display, sort by time
      expect(resImage.body.messages.length).toBe(1);
      expect(resContent.body.messages.length).toBe(2);

      expect(resContent.body.messages[0].imageLink).toBeTruthy();
      expect(resContent.body.messages[0].content).toBeFalsy();
      expect(resContent.body.messages[1].imageLink).toBeFalsy();
      expect(resContent.body.messages[1].content).toBeTruthy();
    });

    test(`GET /chat/users/:userid - get all messages with users[0] now return 2 messages`, async () => {
      const res = await request(app)
        .get(`/api/v1/chat/users/${users[0].id}`)
        // request with khongdieukien account
        .set("Authorization", `Bearer ${token}`);

      expect(res.status).toBe(200);
      expect(res.headers["content-type"]).toMatch(/json/);

      // match sender and receiver
      expect(res.body.messages.length).toBe(2);
      expect(res.body.requestedUser).toEqual(user);
      // expect(res.body.receivedUser).toEqual(users[0]);

      const messages = res.body.messages;
      expect(messages[0].userReceive === users[0].id).toBeTruthy();
      expect(messages[1].userReceive === users[0].id).toBeTruthy();

      expect(messages[0].sender === user.id).toBeFalsy();
      expect(messages[1].sender === user.id).toBeFalsy();

      // 1 content message and 1 image message, sort by time
      expect(messages[0].imageLink).toBeTruthy();
      expect(messages[0].content).toBeFalsy();
      expect(messages[1].imageLink).toBeFalsy();
      expect(messages[1].content).toBeTruthy();
    });
  });
});
