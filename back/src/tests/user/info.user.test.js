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

describe(`User Info Testing`, () => {
  // These will be use global for every tests
  // Because some how Bun test runner don't run
  // beforeAll and afterAll in separated scope
  // Even when I isolated beforeAll and afterAll
  // in each describe block scope, somehow every
  // test still have the same database state
  let asdBody;
  let qweBody;
  beforeAll(async () => {
    // 2 users 'asd0' and 'asd1'
    await method.createUsers(2, "asd");
    // 0% chance skip createFollow
    await method.createFollows(0);

    // 1 user 'qwe0'
    await method.createUsers(1, "qwe");

    // Auth is being tested first
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

    // debug(`users belike: `, users);
    // debug(`both asdToken belike: `, asdToken);
    // debug(`both qweToken belike: `, qweToken);

    expect(users.length).toBe(3);
  });

  describe(`GET /users`, () => {
    describe(`INVALID CASES`, () => {
      // TODO: Add some edge cases
    });

    describe(`VALID CASES`, () => {
      test(`asd GET /users`, async () => {
        const res = await request(app)
          .get("/api/v1/users")
          .set("Authorization", `Bearer ${asdBody.token}`);
        expect(res.status).toBe(200);
        expect(res.headers["content-type"]).toMatch(/json/);

        expect(res.body.followers.length).toBe(1); // asd1
        expect(res.body.followings.length).toBe(1); // asd1
        expect(res.body.mayknows.length).toBe(1); // qwe0
      });

      test(`qwe GET /users`, async () => {
        const res = await request(app)
          .get("/api/v1/users")
          .set("Authorization", `Bearer ${qweBody.token}`);
        expect(res.status).toBe(200);
        expect(res.headers["content-type"]).toMatch(/json/);

        expect(res.body.followers.length).toBe(0); //
        expect(res.body.followings.length).toBe(0); //
        expect(res.body.mayknows.length).toBe(2); // asd0, asd1
      });
    });
  });

  describe(`GET /users/:userid`, () => {
    // debug(`user asd: `, asd);
    // debug(`user qwe: `, qwe);
    describe(`INVALID CASES`, () => {
      const invalidCases = [
        ["asd", 404],
        [asdBody.user.id.replace("6", "0"), 404],
      ];

      test(`Some invalid cases run at once`, async () => {
        for (const [id, code] of invalidCases) {
          const res = await request(app)
            .put(`/api/v1/users/${id}`)
            .set("Authorization", `Bearer ${asdBody.token}`);

          // debug(`search id belike: `, id);
          // debug(`code belike: `, code);

          expect(res.status).toBe(code);
        }
      });
    });

    describe(`VALID CASES`, () => {
      test(`asd GET /users/:qwe.id`, async () => {
        const res = await request(app)
          .get(`/api/v1/users/${qweBody.user.id}`)
          .set("Authorization", `Bearer ${asdBody.token}`);
        expect(res.status).toBe(200);
        expect(res.headers["content-type"]).toMatch(/json/);
        expect(res.body).toEqual(qweBody.user);
      });

      test(`qwe GET /users/:asd.id`, async () => {
        const res = await request(app)
          .get(`/api/v1/users/${asdBody.user.id}`)
          .set("Authorization", `Bearer ${qweBody.token}`);
        expect(res.status).toBe(200);
        expect(res.headers["content-type"]).toMatch(/json/);
        expect(res.body).toEqual(asdBody.user);
      });
    });
  });

  describe(`PUT /users/:userid`, () => {
    const newAsdUser = {
      fullname: "Troi Dat Oi",
      status: "online",
      bio: "Co toi thi khong co nang, dua voi toi o trong tam tri nang chuyen gi ma do dang",
      avatarLink: "Troi Dat Oi khong le anh ke mot cau chuyen chang den dau",
      dateOfBirth: "2001-01-01",
    };

    describe(`INVALID CASES`, () => {
      const invalidCases = [
        [{ id: "asd", data: newAsdUser }, 404],
        [{ id: qweBody.user.id, data: newAsdUser }, 404],
        [{ id: qweBody.user.id.replace("6", "0"), data: newAsdUser }, 404],
      ];

      test(`Some invalid cases run at once`, async () => {
        for (const [update, code] of invalidCases) {
          const res = await request(app)
            .put(`/api/v1/users/${update.id}`)
            .set("Authorization", `Bearer ${asdBody.token}`)
            .type("form")
            .send(update.data);

          expect(res.status).toBe(code);
        }
      });
    });

    describe(`VALID CASES`, () => {
      test(`asd PUT /users/:asd.id`, async () => {
        const res = await request(app)
          .put(`/api/v1/users/${asdBody.user.id}`)
          .set("Authorization", `Bearer ${asdBody.token}`)
          .type("form")
          .send(newAsdUser);

        expect(res.status).toBe(200);
        expect(res.body).toEqual(Object.assign(newAsdUser, asdBody.user));

        const resGet = await request(app)
          .get(`/api/v1/users/${asdBody.user.id}`)
          .set("Authorization", `Bearer ${asdBody.token}`);

        expect(resGet.status).toBe(200);
        expect(resGet.body).toEqual(newAsdUser);
      });
    });
  });

  describe(`POST /users/:userid/follows`, () => {
    describe(`INVALID CASES`, () => {
      const invalidCases = [
        [{ id: "asd" }, 404],
        [{ id: qweBody.user.id.replace("6", "0") }, 404],
      ];

      test(`Some invalid cases run at once`, async () => {
        for (const [update, code] of invalidCases) {
          const res = await request(app)
            .post(`/api/v1/users/${update.id}/follows`)
            .set("Authorization", `Bearer ${asdBody.token}`);

          expect(res.status).toBe(code);
        }
      });
    });

    describe(`VALID CASES`, () => {
      // NOTE: asd0, asd1 follow each other and qwe0 has no connections
      test(`something`, async () => {
        //
      });
    });
  });
});
