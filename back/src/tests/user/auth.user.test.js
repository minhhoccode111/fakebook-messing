const request = require("supertest");
const { describe, test, expect, beforeAll, afterAll } = require("bun:test");

const app = require("./../setup/app.setup");
const User = require("./../../models/user");

// manually logging
const debug = require("./../../constants/debug");

describe(`POST /signup`, () => {
  test(`valid signup`, async () => {
    const res = await request(app)
      .post("/api/v1/auth/signup")
      .type("form")
      .send({
        fullname: "khong dieu kien",
        username: "cahoihoang@gmail.com",
        password: "Bruh0!0!",
        "confirm-password": "Bruh0!0!",
      });

    expect(res.status).toEqual(200);
  });

  test(`invalid signup - username already existed`, async () => {
    const res = await request(app)
      .post("/api/v1/auth/signup")
      .type("form")
      .send({
        fullname: "some different fullname",
        username: "cahoihoang@gmail.com", // the same with above
        password: "Bruh0!0!",
        "confirm-password": "Bruh0!0!",
      });

    expect(res.status).toEqual(409); // conflict
  });

  test(`invalid username - short`, async () => {
    const res = await request(app)
      .post("/api/v1/auth/signup")
      .type("form")
      .send({
        fullname: "khong dieu kien",
        username: "a@g.com", // short
        password: "Bruh0!0!",
        "confirm-password": "Bruh0!0!",
      });
    expect(res.status).toBe(400);
  });

  test(`invalid username - not email`, async () => {
    const res = await request(app)
      .post("/api/v1/auth/signup")
      .type("form")
      .send({
        fullname: "khong dieu kien",
        username: "asdasdasd.gmail.com", // not email
        password: "Bruh0!0!",
        "confirm-password": "Bruh0!0!",
      });
    expect(res.status).toBe(400);
  });

  test(`invalid fullname`, async () => {
    const res = await request(app)
      .post("/api/v1/auth/signup")
      .type("form")
      .send({
        fullname: "", // invalid
        username: "asdasd@gmail.com",
        password: "Bruh0!0!",
        "confirm-password": "Bruh0!0!",
      });
    expect(res.status).toBe(400);
  });

  test(`invalid password - too short`, async () => {
    const res = await request(app)
      .post("/api/v1/auth/signup")
      .type("form")
      .send({
        fullname: "khong dieu kien",
        username: "asdasd@gmail.com",
        password: "Bruh0!", // short
        "confirm-password": "Bruh0!0!",
      });
    expect(res.status).toBe(400);
  });

  test(`invalid password - not strong`, async () => {
    const res = await request(app)
      .post("/api/v1/auth/signup")
      .type("form")
      .send({
        fullname: "khong dieu kien",
        username: "asdasd@gmail.com",
        password: "asdasdasd", // weak
        "confirm-password": "Bruh0!0!",
      });
    expect(res.status).toBe(400);
  });

  test(`invalid confirm-password - not match`, async () => {
    const res = await request(app)
      .post("/api/v1/auth/signup")
      .type("form")
      .send({
        fullname: "khong dieu kien",
        username: "asdasd@gmail.com",
        password: "Bruh0!0!", // not match
        "confirm-password": "asd",
      });
    expect(res.status).toBe(400);
  });
});

describe(`POST /login`, () => {
  beforeAll(async () => {
    // Create account before tests
    const res = await request(app)
      .post("/api/v1/auth/signup")
      .type("form")
      .send({
        fullname: "ngot band",
        username: "ngotband@gmail.com",
        password: "Bruh0!0!",
        "confirm-password": "Bruh0!0!",
      });
  });

  test(`valid login`, async () => {
    const res = await request(app)
      .post("/api/v1/auth/login")
      .type("form")
      .send({ username: "ngotband@gmail.com", password: "Bruh0!0!" });

    debug(`the res.body belike: 138`, res.body);

    expect(res.headers["content-type"]).toMatch(/json/);
    expect(res.status).toBe(200);
    expect(res.body.user.fullname).toMatch(/ngot\s?band/);

    // then use the returned token to get authenticated route
    const token = res.body.token;
    // console.log(token);

    const resGetUsers = await request(app)
      .get("/api/v1/users")
      .set("Authorization", `Bearer ${token}`);
    expect(resGetUsers.status).toBe(200);
    expect(resGetUsers.headers["content-type"]).toMatch(/json/);

    const resGetGroups = await request(app)
      .get("/api/v1/users")
      .set("Authorization", `Bearer ${token}`);
    expect(resGetGroups.status).toBe(200);
    expect(resGetGroups.headers["content-type"]).toMatch(/json/);
  });

  test(`GET /users need authentication`, async () => {
    const res = await request(app).get("/api/v1/users");
    expect(res.status).toBe(401);
  });

  test(`GET /groups need authentication`, async () => {
    const res = await request(app).get("/api/v1/groups");
    expect(res.status).toBe(401);
  });

  test(`wrong username`, async () => {
    const resLogin = await request(app)
      .post("/api/v1/auth/login")
      .type("form")
      .send({ username: "asdasdasd", password: "Bruh0!0!" });
    expect(resLogin.status).toBe(401);
  });

  test(`wrong password`, async () => {
    const resLogin = await request(app)
      .post("/api/v1/auth/login")
      .type("form")
      .send({ username: "asdasdasd@gmail.com", password: "ruh0!0!" });
    expect(resLogin.status).toBe(401);
  });
});
