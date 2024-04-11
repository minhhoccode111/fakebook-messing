import request from "supertest";
import { describe, expect, test, beforeAll, afterAll } from "bun:test";
import { faker } from "@faker-js/faker";
import bcrypt from "bcrypt";

// models
import Group from "./../../models/group";
import GroupMember from "./../../models/groupMember";
import User from "./../../models/user";
import Message from "./../../models/message";

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
