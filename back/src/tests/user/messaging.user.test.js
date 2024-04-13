const request = require("supertest");
const { describe, test, expect, beforeAll } = require("bun:test");

const app = require("./../setup/app.setup");

const method = require("./../setup/method.setup");

// manually logging
const debug = require("./../../constants/debug");

describe(`User Message Testing`, () => {
  describe(`GET /users/:userid/messages`, () => {
    test(`something`, async () => {
      //
    });
  });

  describe(`POST /users/:userid/messages`, () => {
    test(`something`, async () => {
      //
    });
  });
});
