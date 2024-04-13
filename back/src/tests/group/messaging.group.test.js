const request = require("supertest");
const { describe, test, expect, beforeAll } = require("bun:test");

const app = require("./../setup/app.setup");

const method = require("./../setup/method.setup");

// manually logging
const debug = require("./../../constants/debug");

describe(`Group Message Testing`, () => {
  describe(`GET /groups/:groupid/messages`, () => {
    test(`something`, async () => {
      //
    });
  });

  describe(`POST /groups/:groupid/messages`, () => {
    test(`something`, async () => {
      //
    });
  });
});
