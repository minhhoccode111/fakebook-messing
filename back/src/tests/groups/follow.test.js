const request = require("supertest");
const bcrypt = require("bcrypt");
const { describe, expect, test, beforeAll, afterAll } = require("bun:test");
const { faker } = require("@faker-js/faker");
/*
// models
const Group = require ( "./../../models/group" );
const GroupMember = require ( "./../../models/groupMember" );
const User = require ( "./../../models/user" );
const Message = require ( "./../../models/message" );
*/

import app from "./../setup";
describe(`setup test new project`, () => {
  test(`this is sync test`, () => {
    expect(true).toBe(true);
  });

  test(`this is async test`, async () => {
    expect(true).toBe(true);
  });

  test(`this is async test`, async () => {
    expect(true).toBe(true);
  });

  test.skip(`this is skip test`, () => {
    expect(true).toBe(true);
  });
});