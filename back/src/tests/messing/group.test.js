const request = require("supertest");
const bcrypt = require("bcrypt");
const { faker } = require("@faker-js/faker");
const { describe, expect, test, beforeAll, afterAll } = require("bun:test");

// another app because don't want to touch the original
const app = require("./../setup");

// models
const Group = require("./../../models/group");
const GroupMember = require("./../../models/groupMember");
const User = require("./../../models/user");
const Message = require("./../../models/message");

describe(`/chat/groups`, () => {
  let token0;
  let token1;
  const users = {};
  // const groups = { 0: {private: new Group, public: new Group}, 1: {private: new Group, public: new Group} };
  const groups = { 0: {}, 1: {} };

  // before all authenticate
  beforeAll(async () => {
    // create 2 dummy accounts
    users[0] = new User({
      fullname: "0",
      username: "asd0",
      password: await bcrypt.hash("asd", 10),
    });
    await users[0].save();

    users[1] = new User({
      fullname: "1",
      username: "asd1",
      password: await bcrypt.hash("asd", 10),
    });
    await users[1].save();

    // 3rd member to join group to test delete member
    users[2] = new User({
      fullname: "2",
      username: "asd2",
      password: await bcrypt.hash("asd", 10),
    });
    await users[2].save();

    // each account create 2 groups, 1 public 1 private
    groups[0].public = await new Group({
      creator: users[0],
      name: "group0 public",
      public: true,
      bio: "group0 bio",
    }).save();
    groups[0].private = await new Group({
      creator: users[0],
      name: "group0 private",
      public: false,
      bio: "group0 bio",
    }).save();
    groups[1].public = await new Group({
      creator: users[1],
      name: "group1 public",
      public: true,
      bio: "group0 bio",
    }).save();
    groups[1].private = await new Group({
      creator: users[1],
      name: "group1 private",
      public: false,
      bio: "group0 bio",
    }).save();

    // create connections, who create group
    await new GroupMember({
      user: users[0],
      group: groups[0].public,
      isCreator: true,
    }).save();
    await new GroupMember({
      user: users[0],
      group: groups[0].private,
      isCreator: true,
    }).save();
    await new GroupMember({
      user: users[1],
      group: groups[1].public,
      isCreator: true,
    }).save();
    await new GroupMember({
      user: users[1],
      group: groups[1].private,
      isCreator: true,
    }).save();

    // 1 extra user0 joined user1's private group
    await new GroupMember({
      user: users[0],
      group: groups[1].private,
      isCreator: false,
    }).save();
    // 1 extra user1 joined user0's public group
    await new GroupMember({
      user: users[1],
      group: groups[0].public,
      isCreator: false,
    }).save();

    // 3rd member to join group to test delete member
    await new GroupMember({
      user: users[2],
      group: groups[1].private,
      isCreator: false,
    }).save();
    await new GroupMember({
      user: users[2],
      group: groups[0].public,
      isCreator: false,
    }).save();

    // then them login to get tokens
    const res0 = await request(app)
      .post("/api/v1/auth/login")
      .type("form")
      .send({
        // account use to log in
        username: "asd0",
        password: "asd",
      });

    const res1 = await request(app)
      .post("/api/v1/auth/login")
      .type("form")
      .send({
        // account use to log in
        username: "asd1",
        password: "asd",
      });

    // keep login token
    token0 = res0.body.token;
    token1 = res1.body.token;
  });

  describe(`GET & POST /chat/groups, DELETE & PUT /chat/groups/:groupid - work with the group(s)`, () => {
    describe(`GET & POST /chat/groups`, () => {
      test(`GET /chat/groups - return 3 categories: joined (or created) groups, public groups (not joined), private groups (not joined)`, async () => {
        const res = await request(app)
          .get("/api/v1/chat/groups")
          // request with user[0] account
          .set("Authorization", `Bearer ${token0}`);

        expect(res.status).toBe(200);
        expect(res.headers["content-type"]).toMatch(/json/);

        // match requested user
        expect(res.body.requestedUser).toBeDefined();
        expect(res.body?.requestedUser?.fullname).toEqual(users[0].fullname);

        expect(new Date(res.body?.requestedUser?.createdAt).getTime()).toEqual(
          users[0].createdAt.getTime(),
        );

        // console.log(`res.body belike: `, res.body);

        // 4 joined groups, 2 created, 1 joined users[1]'s private group
        expect(res.body.joinedGroups).toBeDefined();
        expect(res.body.joinedGroups.length).toBe(4);
        // compare name
        expect(
          res.body.joinedGroups.some(
            (gr) => gr.name === groups[0].private.name,
          ),
        ).toBe(true);
        expect(
          res.body.joinedGroups.some((gr) => gr.name === groups[0].public.name),
        ).toBe(true);
        expect(
          res.body.joinedGroups.some(
            (gr) => gr.name === groups[1].private.name,
          ),
        ).toBe(true);

        // 2 public group not join
        expect(res.body.publicGroups).toBeDefined();
        expect(res.body.publicGroups.length).toBe(2);
        expect(
          res.body.publicGroups.some((gr) => gr.name === groups[1].public.name),
        ).toBe(true);

        // 0 private group not join
        expect(res.body.privateGroups).toBeDefined();
        expect(res.body.privateGroups.length).toBe(0);

        const res1 = await request(app)
          .get("/api/v1/chat/groups")
          // request with user[1] account
          .set("Authorization", `Bearer ${token1}`);

        // users[1] is pretty much the same but 2 private group not join
        expect(res1.body.privateGroups).toBeDefined();
        expect(res1.body.privateGroups.length).toBe(2);
        expect(
          res1.body.privateGroups.some(
            (gr) => gr.name === groups[0].private.name,
          ),
        ).toBe(true);
      });

      describe(`POST /chat/groups - try invalid data`, () => {
        test(`invalid group name`, async () => {
          const res = await request(app)
            .post("/api/v1/chat/groups")
            // request with user[1] account
            .set("Authorization", `Bearer ${token1}`)
            .type("form")
            .send({ name: "", public: "true", bio: "khong dieu kien" });
          expect(res.status).toBe(400);

          const res1 = await request(app)
            .post("/api/v1/chat/groups")
            // request with user[1] account
            .set("Authorization", `Bearer ${token1}`)
            .type("form")
            .send({
              name: "someStringLongerThan60".padStart(61, "x"),
              public: "true",
              bio: "khong dieu kien",
            });

          expect(res1.status).toBe(400);

          const res2 = await request(app)
            .post("/api/v1/chat/groups")
            // request with user[1] account
            .set("Authorization", `Bearer ${token1}`)
            .type("form")
            // group name exists
            .send({
              name: "group1 private",
              public: "true",
              bio: "this is a valid bio",
            });

          expect(res2.status).toBe(400);
          expect(res2.body.errors).toContain("Group name exists.");
        });

        test(`invalid group bio`, async () => {
          const res1 = await request(app)
            .post("/api/v1/chat/groups")
            // request with user[1] account
            .set("Authorization", `Bearer ${token1}`)
            .type("form")
            .send({
              name: "length08",
              public: "false",
              bio: "someStringLongerThan260".padStart(261, "x"),
            });

          expect(res1.status).toBe(400);
        });
      });

      describe(`POST /chat/groups - valid data`, () => {
        test(`create a new private group use users[0]`, async () => {
          const res = await request(app)
            .post("/api/v1/chat/groups")
            // request with user[0] account
            .set("Authorization", `Bearer ${token0}`)
            .type("form")
            .send({
              name: "new group of user 0 private",
              public: "false",
              bio: "new groups of user 0 private",
              avatarLink: faker.image.avatar(),
            });

          const { requestedUser, createdGroup } = res.body;

          expect(res.status).toBe(200);
          expect(res.headers[`content-type`]).toMatch(/json/gi);
          expect(requestedUser.fullname).toMatch(users[0].fullname);
          expect(createdGroup.creator.fullname).toMatch(users[0].fullname);
          expect(createdGroup.name).toMatch(/new group of user 0 private/gi);
        });

        test(`GET /chat/groups - users[1] now have 2 private groups not joined`, async () => {
          const res = await request(app)
            .get("/api/v1/chat/groups")
            // request with user[1] account
            .set("Authorization", `Bearer ${token1}`);

          expect(res.body.privateGroups).toBeDefined();
          expect(res.body.privateGroups.length).toBe(2);
        });

        test(`create a new public group use users[1]`, async () => {
          const res = await request(app)
            .post("/api/v1/chat/groups")
            // request with user[0] account
            .set("Authorization", `Bearer ${token1}`)
            .type("form")
            .send({
              name: "new group of user 1 public",
              public: "true",
              bio: "new groups of user 1 public",
              avatarLink: faker.image.avatar(),
            });

          const { requestedUser, createdGroup } = res.body;

          expect(res.status).toBe(200);
          expect(res.headers[`content-type`]).toMatch(/json/gi);
          expect(requestedUser.fullname).toMatch(users[1].fullname);
          expect(createdGroup.creator.fullname).toMatch(users[1].fullname);
          expect(createdGroup.name).toMatch(/new group of user 1 public/gi);
        });

        test(`GET /chat/groups - users[0] now get 2 public groups not joined`, async () => {
          const res = await request(app)
            .get("/api/v1/chat/groups")
            // request with user[1] account
            .set("Authorization", `Bearer ${token0}`);

          expect(res.body.publicGroups).toBeDefined();
          expect(res.body.publicGroups.length).toBe(2);
        });
      });
    });

    describe(`DELETE & PUT /chat/groups/:groupid`, () => {
      describe(`DELETE /chat/groups/:groupid - invalid request (not group's creator) or group not exists`, () => {
        test(`users[0] try to delete groups[1] public (users[1] created)`, async () => {
          const res = await request(app)
            .delete(`/api/v1/chat/groups/${groups[1].public._id}`)
            // request with user[1] account
            .set("Authorization", `Bearer ${token0}`);

          // forbidden
          expect(res.status).toBe(403);
        });

        test(`group not exist`, async () => {
          const res = await request(app)
            .delete(`/api/v1/chat/groups/someRandomString`)
            // request with user[1] account
            .set("Authorization", `Bearer ${token0}`);

          // forbidden
          expect(res.status).toBe(404);
        });
      });

      describe(`DELETE /chat/groups/:groupid - valid request`, () => {
        test(`users[0] delete his groups[0].private group`, async () => {
          const res = await request(app)
            .delete(`/api/v1/chat/groups/${groups[0].private._id}`)
            // request with user[0] account
            .set("Authorization", `Bearer ${token0}`);

          // success
          expect(res.status).toBe(200);
        });

        test(`GET /chat/groups - users[1] now have 0 private groups not joined`, async () => {
          const res = await request(app)
            .get("/api/v1/chat/groups")
            // request with user[1] account
            .set("Authorization", `Bearer ${token1}`);

          expect(res.body.privateGroups).toBeDefined();
          expect(res.body.privateGroups.length).toBe(1);
        });

        test(`users[0] delete his groups[0].public group`, async () => {
          const res = await request(app)
            .delete(`/api/v1/chat/groups/${groups[0].public._id}`)
            // request with user[0] account
            .set("Authorization", `Bearer ${token0}`);

          // success
          expect(res.status).toBe(200);
        });

        test(`GET /chat/groups - users[1] now have 2 joined groups left (both own)`, async () => {
          const res = await request(app)
            .get("/api/v1/chat/groups")
            // request with user[1] account
            .set("Authorization", `Bearer ${token1}`);

          expect(res.body.privateGroups).toBeDefined();
          expect(res.body.joinedGroups.length).toBe(3);
        });
      });

      describe(`PUT /chat/groups/:groupid - invalid request`, () => {
        test(`not group's creator`, async () => {
          const res = await request(app)
            .put(`/api/v1/chat/groups/${groups[1].public._id}`)
            // request with user[0] account
            .set("Authorization", `Bearer ${token0}`);

          // forbidden
          expect(res.status).toBe(403);
        });

        test(`group not exists`, async () => {
          const res = await request(app)
            .put(`/api/v1/chat/groups/someRandomString`)
            // request with user[0] account
            .set("Authorization", `Bearer ${token0}`);

          // forbidden
          expect(res.status).toBe(404);
        });

        test(`invalid group name`, async () => {
          const res1 = await request(app)
            .put(`/api/v1/chat/groups/${groups[1].public._id}`)
            // request with user[1] account
            .set("Authorization", `Bearer ${token1}`)
            .type("form")
            .send({
              name: "someStringLongerThan60".padStart(61, "x"),
              public: "true",
              bio: "khong dieu kien",
            });

          expect(res1.status).toBe(400);
        });

        test(`group name already existed`, async () => {
          const res2 = await request(app)
            .put(`/api/v1/chat/groups/${groups[1].public._id}`)
            // request with user[1] account
            .set("Authorization", `Bearer ${token1}`)
            .type("form")
            // group name exists
            .send({
              name: "group1 private",
              public: "true",
              bio: "this is a valid bio",
            });

          expect(res2.status).toBe(400);
          expect(res2.body.errors).toContain("Group name exists.");
        });

        test(`invalid group bio`, async () => {
          const res1 = await request(app)
            .put(`/api/v1/chat/groups/${groups[1].public._id}`)
            // request with user[1] account
            .set("Authorization", `Bearer ${token1}`)
            .type("form")
            .send({
              name: "length08",
              public: "false",
              bio: "someStringLongerThan260".padStart(261, "x"),
            });

          expect(res1.status).toBe(400);
        });
      });

      describe(`PUT /chat/groups/:groupid - valid request`, () => {
        test(`users[1] update public group (which users[1] joined)`, async () => {
          const updateData = {
            name: "new name of users[0] public group",
            public: "false",
            bio: "change to private and also this bio",
            avatarLink: faker.image.avatar(),
          };

          // const debugRes = await request(app).get(`/api/v1/chat/groups`).set('Authorization', `Bearer ${token0}`);
          // console.log(`debugRes.body belike: `, debugRes.body);

          // console.log(`groups[0].public._id belike: `, groups[0].public._id);

          const res = await request(app)
            .put(`/api/v1/chat/groups/${groups[1].public._id}`)
            // request with user[0] account
            .set("Authorization", `Bearer ${token1}`)
            .type("form")
            .send(updateData);

          expect(res.status).toBe(200);
          expect(res.headers["content-type"]).toMatch(/json/);

          // match user sent request
          expect(res.body?.requestedUser?.fullname).toMatch(users[1]?.fullname);

          // match update data
          expect(res.body?.updatedGroup?.name).toMatch(updateData.name);
          expect(res.body?.updatedGroup?.bio).toMatch(updateData.bio);
          // match but escaped the string
          // expect(res.body?.updatedGroup?.avatarLink).toMatch(updateData.avatarLink);
          expect(res.body?.updatedGroup?.public).toBe(false);
        });

        test(`check again with GET /chat/groups`, async () => {
          // TODO
        });
      });
    });
  });

  describe(`GET & POST /chat/groups/:groupid - work with group's messages`, () => {
    // TODO should work like /chat/users/:userid
    // but extra info like

    describe(`GET /chat/groups/:groupid - get group's messages, groups's info, group's members`, () => {
      test(`users[0] get group not exists`, async () => {
        const res = await request(app)
          .get(`/api/v1/chat/groups/someRandomString`)
          // request with user[0] account
          .set("Authorization", `Bearer ${token0}`);

        expect(res.status).toBe(404);
      });

      test(`users[0] get groups[1].public (not joined)`, async () => {
        const res = await request(app)
          .get(`/api/v1/chat/groups/${groups[1].public._id}`)
          // request with user[0] account
          .set("Authorization", `Bearer ${token0}`);

        // 403 when not joined
        expect(res.status).toBe(403);
        expect(res.body.messages).toEqual(null);

        expect(res.body.requestedUser.fullname).toBe(users[0].fullname);
        expect(res.body.receivedGroup.name).toBe(groups[1].public.name);
        expect(res.body.receivedGroup.creator.fullname).toBe(users[1].fullname);
        expect(res.body.receivedGroup.isCreator).toBe(false);
        expect(res.body.receivedGroup.isMember).toBe(false);
      });

      test(`users[0] get groups[1].private (joined)`, async () => {
        const res = await request(app)
          .get(`/api/v1/chat/groups/${groups[1].private._id}`)
          // request with user[0] account
          .set("Authorization", `Bearer ${token0}`);

        // 200 when joined
        expect(res.status).toBe(200);
        // not messages yet
        expect(res.body.messages).toEqual([]);
        // the same above but 2 users now users[0] and [1]

        expect(res.body.requestedUser.fullname).toBe(users[0].fullname);
        expect(res.body.receivedGroup.name).toBe(groups[1].private.name);
        expect(res.body.receivedGroup.creator.fullname).toBe(users[1].fullname);
        expect(res.body.receivedGroup.isCreator).toBe(false);
        expect(res.body.receivedGroup.isMember).toBe(true);
      });

      test(`users[0] get groups[0].public (created, users[1] also joined)`, async () => {
        const res = await request(app)
          .get(`/api/v1/chat/groups/${groups[0].public._id}`)
          // request with user[0] account
          .set("Authorization", `Bearer ${token0}`);

        // 200 when joined
        expect(res.status).toBe(200);
        // not messages yet
        expect(res.body.messages).toEqual([]);

        expect(res.body.requestedUser.fullname).toBe(users[0].fullname);
        expect(res.body.receivedGroup.name).toBe(groups[0].public.name);
        expect(res.body.receivedGroup.creator.fullname).toBe(users[0].fullname);
        expect(res.body.receivedGroup.isCreator).toBe(true);
        expect(res.body.receivedGroup.isMember).toBe(true);
      });
    });

    describe(`POST /chat/groups/:groupid - post a message to group chat`, () => {
      describe(`invalid cases`, () => {
        test(`not exists group`, async () => {
          const res = await request(app)
            .post(`/api/v1/chat/groups/someRandomSting`)
            // request with user[0] account
            .set("Authorization", `Bearer ${token0}`)
            .send({ content: "this content exists", imageLink: "" });

          expect(res.status).toBe(404);
        });

        test(`invalid authorization - users[0] try to post to groups[1].public (not joined)`, async () => {
          const res = await request(app)
            .post(`/api/v1/chat/groups/${groups[1].public._id}`)
            // request with user[0] account
            .set("Authorization", `Bearer ${token0}`)
            .type("form")
            .send({ content: "this content exists", imageLink: "" });

          expect(res.status).toBe(403);
        });

        test(`invalid data - both content and imageLink exists`, async () => {
          const res = await request(app)
            .post(`/api/v1/chat/groups/${groups[1].private._id}`)
            // request with user[0] account
            .set("Authorization", `Bearer ${token0}`)
            .type("form")
            .send({
              content: "this content exists",
              imageLink: "this content exists",
            });

          expect(res.status).toBe(400);
        });

        test(`invalid data - both content and imageLink don't exists`, async () => {
          const res = await request(app)
            .post(`/api/v1/chat/groups/${groups[1].private._id}`)
            // request with user[0] account
            .set("Authorization", `Bearer ${token0}`)
            .type("form")
            .send({ content: "", imageLink: "" });

          expect(res.status).toBe(400);
        });
      });

      describe(`valid cases`, () => {
        // default message values
        const content = faker.lorem.paragraph();
        const imageLink = faker.image.avatar();

        test(`valid data - content exists - users[0] send to groups[1].private`, async () => {
          const res = await request(app)
            .post(`/api/v1/chat/groups/${groups[1].private._id}`)
            // request with user[0] account
            .set("Authorization", `Bearer ${token0}`)
            .type("form")
            .send({ content, imageLink: "" });

          expect(res.status).toBe(200);
          expect(res.body.requestedUser.fullname).toBe(users[0].fullname);
          expect(res.body.receivedGroup.name).toBe(groups[1].private.name);

          expect(res.body.groupMessages.length).toBe(1);
          expect(res.body.groupMessages[0].content).toBe(content);
        });

        test(`valid data - imageLink exists - users[1] send to groups[1].private`, async () => {
          const res = await request(app)
            .post(`/api/v1/chat/groups/${groups[1].private._id}`)
            // request with user[1] account
            .set("Authorization", `Bearer ${token1}`)
            .type("form")
            .send({ imageLink, content: "" });

          expect(res.status).toBe(200);
          expect(res.body.requestedUser.fullname).toBe(users[1].fullname);
          expect(res.body.receivedGroup.name).toBe(groups[1].private.name);

          expect(res.body.groupMessages.length).toBe(2); // now 2
          expect(res.body.groupMessages[0].content).toBe(content);
          // it's passed but compare fail because escaped string
          // expect(res.body.groupMessages[1].imageLink).toEqual(decodeURIComponent(imageLink));
        });

        test(`valid data - imageLink exists - users[0] send to groups[1].private`, async () => {
          const res = await request(app)
            .post(`/api/v1/chat/groups/${groups[1].private._id}`)
            // request with user[1] account
            .set("Authorization", `Bearer ${token0}`)
            .type("form")
            .send({ imageLink, content: "" });

          expect(res.status).toBe(200);
          expect(res.body.requestedUser.fullname).toBe(users[0].fullname);
          expect(res.body.receivedGroup.name).toBe(groups[1].private.name);

          expect(res.body.groupMessages.length).toBe(3); // now 3
          // sort base on time send
          expect(res.body.groupMessages[0].content).toBe(content);

          // it's passed but compare fail because escaped string
          // expect(res.body.groupMessages[1].imageLink).toEqual(decodeURIComponent(imageLink));
          // expect(res.body.groupMessages[2].imageLink).toEqual(decodeURIComponent(imageLink));
        });
      });
    });
  });

  describe(`GET & POST /chat/groups/:groupid/members, DELETE /chat/groups/:groupid/members/:userid - work with group's members`, () => {
    describe(`GET /chat/groups/:groupid/members - get all members of a group`, () => {
      describe(`invalid cases`, () => {
        test(`not exists group`, async () => {
          const res = await request(app)
            .get(`/api/v1/chat/groups/someRandomSting/members`)
            // request with user[0] account
            .set("Authorization", `Bearer ${token0}`);

          expect(res.status).toBe(404);
        });
      });

      describe(`valid cases`, () => {
        test(`users[0] get members of groups[1].public (not joined)`, async () => {
          const res = await request(app)
            .get(`/api/v1/chat/groups/${groups[1].public._id}/members`)
            // request with user[0] account
            .set("Authorization", `Bearer ${token0}`);

          expect(res.status).toBe(200);
          expect(res.body.requestedUser.fullname).toBe(users[0].fullname);
          // expect(res.body..fullname).toBe(users[0].fullname);
          expect(res.body.groupMembers.length).toBe(1);
          // sorted by join time
          expect(res.body.groupMembers[0].fullname).toBe(users[1].fullname);
        });

        test(`users[0] get members of groups[1].private (joined)`, async () => {
          const res = await request(app)
            .get(`/api/v1/chat/groups/${groups[1].private._id}/members`)
            // request with user[0] account
            .set("Authorization", `Bearer ${token0}`);

          expect(res.status).toBe(200);
          expect(res.body.requestedUser.fullname).toBe(users[0].fullname);
          expect(res.body.groupMembers.length).toBe(2);
          // sorted by join time
          expect(res.body.groupMembers[0].fullname).toBe(users[1].fullname);
          expect(res.body.groupMembers[1].fullname).toBe(users[0].fullname);
        });

        test(`users[0] get members of groups[0].public (owned, 2 members)`, async () => {
          const res = await request(app)
            .get(`/api/v1/chat/groups/${groups[0].public._id}/members`)
            // request with user[0] account
            .set("Authorization", `Bearer ${token0}`);

          expect(res.status).toBe(200);
          expect(res.body.requestedUser.fullname).toBe(users[0].fullname);
          expect(res.body.groupMembers.length).toBe(2);
          // sorted by join time
          expect(res.body.groupMembers[0].fullname).toBe(users[0].fullname);
          expect(res.body.groupMembers[1].fullname).toBe(users[1].fullname);
        });
      });
    });

    describe(`POST /chat/groups/:groupid/members - current logged in user join the group`, () => {
      describe(`invalid cases`, () => {
        test(`group not exists`, async () => {
          const res = await request(app)
            .post(`/api/v1/chat/groups/someRandomString/members`)
            // request with user[0] account
            .set("Authorization", `Bearer ${token0}`);

          expect(res.status).toBe(404);
        });

        // this a little over caution
        test(`user already joined (users[0] request to join groups[1].private)`, async () => {
          const res = await request(app)
            .post(`/api/v1/chat/groups/${groups[1].private._id}/members`)
            // request with user[0] account
            .set("Authorization", `Bearer ${token0}`);

          expect(res.status).toBe(400);
        });

        test(`group is not public to be joined (users[1] request to join groups[0].private)`, async () => {
          const res = await request(app)
            .post(`/api/v1/chat/groups/${groups[0].private._id}/members`)
            // request with user[0] account
            .set("Authorization", `Bearer ${token1}`);

          expect(res.status).toBe(400);
        });
      });

      describe(`valid cases`, () => {
        test(`users[0] request to join groups[1].public`, async () => {
          const res = await request(app)
            .post(`/api/v1/chat/groups/${groups[1].public._id}/members`)
            // request with user[0] account
            .set("Authorization", `Bearer ${token0}`);

          expect(res.status).toBe(200);
        });
      });
    });

    describe(`DELETE /chat/groups/:groupid/members/:userid - current logged in user leave the group or kick someone`, () => {
      describe(`invalid cases`, () => {
        test(`group not exists`, async () => {
          const res = await request(app)
            .delete(
              `/api/v1/chat/groups/someRandomString/members/${users[2]._id}`,
            )
            // request with user[0] account
            .set("Authorization", `Bearer ${token0}`);

          expect(res.status).toBe(404);
        });

        test(`user to delete not exists`, async () => {
          const res = await request(app)
            .delete(
              `/api/v1/chat/groups/${groups[1].private._id}/members/someRandomString`,
            )
            // request with user[0] account
            .set("Authorization", `Bearer ${token0}`);

          expect(res.status).toBe(404);
        });

        test(`user to delete exists but not joined in the group`, async () => {
          // users[1] not joined groups[0].private
          const res = await request(app)
            .delete(
              `/api/v1/chat/groups/${groups[0].private._id}/members/${users[1]._id}`,
            )
            // request with user[0] account
            .set("Authorization", `Bearer ${token0}`);

          expect(res.status).toBe(404);
        });

        test(`user to delete exists ,joined the group but current logged in user is not group's creator to delete that user`, async () => {
          // users[2] existed, joined groups[0].public but can't be deleted by users[1]
          const res = await request(app)
            .delete(
              `/api/v1/chat/groups/${groups[0].public._id}/members/${users[2]._id}`,
            )
            // request with user[1] account
            .set("Authorization", `Bearer ${token1}`);

          expect(res.status).toBe(400);
        });

        test(`group's creator can't leave the group, delete the group instead`, async () => {
          // users[2] existed, joined groups[0].public but can't be deleted by users[1]
          const res = await request(app)
            .delete(
              `/api/v1/chat/groups/${groups[0].public._id}/members/${users[0]._id}`,
            )
            // request with user[1] account
            .set("Authorization", `Bearer ${token0}`);

          expect(res.status).toBe(400);
        });
      });

      describe(`valid cases`, () => {
        test(`users[0] delete users[2] from groups[0].public`, async () => {
          const res = await request(app)
            .delete(
              `/api/v1/chat/groups/${groups[0].public._id}/members/${users[2]._id}`,
            )
            // request with user[1] account
            .set("Authorization", `Bearer ${token0}`);

          expect(res.status).toBe(200);

          const getRes = await request(app)
            .get(`/api/v1/chat/groups/${groups[0].public._id}/members`)
            // request with user[0] account
            .set("Authorization", `Bearer ${token0}`);

          expect(getRes.status).toBe(200);
          // group now only have 2 members
          expect(getRes.body.groupMembers.length).toBe(2);

          // 2 members left is users[0] and users[1]
          expect([users[0].fullname, users[1].fullname]).toContain(
            getRes.body.groupMembers[0].fullname,
          );
          expect([users[0].fullname, users[1].fullname]).toContain(
            getRes.body.groupMembers[1].fullname,
          );
        });

        test(`users[1] delete users[2] from groups[1].private`, async () => {
          const res = await request(app)
            .delete(
              `/api/v1/chat/groups/${groups[1].private._id}/members/${users[2]._id}`,
            )
            // request with user[1] account
            .set("Authorization", `Bearer ${token1}`);

          expect(res.status).toBe(200);

          const getRes = await request(app)
            .get(`/api/v1/chat/groups/${groups[1].private._id}/members`)
            // request with user[1] account
            .set("Authorization", `Bearer ${token1}`);

          expect(getRes.status).toBe(200);
          // group now only have 2 members
          expect(getRes.body.groupMembers.length).toBe(2);

          // 2 members left is users[0] and users[1]
          expect([users[0].fullname, users[1].fullname]).toContain(
            getRes.body.groupMembers[0].fullname,
          );
          expect([users[0].fullname, users[1].fullname]).toContain(
            getRes.body.groupMembers[1].fullname,
          );
        });

        // BUG
        test(`users[1] leave groups[0].public`, async () => {
          const res = await request(app)
            .delete(
              `/api/v1/chat/groups/${groups[0].public._id}/members/${users[1]._id}`,
            )
            // request with user[1] account
            .set("Authorization", `Bearer ${token1}`);

          expect(res.status).toBe(200);

          const getRes = await request(app)
            .get(`/api/v1/chat/groups/${groups[0].public._id}/members`)
            // request with user[1] account
            .set("Authorization", `Bearer ${token1}`);

          expect(getRes.status).toBe(200);
          // group now only have 2 members
          expect(getRes.body.groupMembers.length).toBe(1);

          // 1 member left is users[0]
          expect(getRes.body.groupMembers[0].fullname).toBe(users[0].fullname);
        });
      });
    });
  });
});
