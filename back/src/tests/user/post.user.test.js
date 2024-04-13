const request = require("supertest");
const { describe, test, expect, beforeAll } = require("bun:test");

const app = require("./../setup/app.setup");

const method = require("./../setup/method.setup");

// manually logging
const debug = require("./../../constants/debug");

describe(`User Post Testing`, () => {
  describe(`GET /users/:userid/posts`, () => {
    test(`something`, async () => {
      //
    });
  });

  describe(`POST /users/:userid/posts`, () => {
    test(`something`, async () => {
      //
    });
  });

  describe(`DELETE /users/:userid/posts/:postid`, () => {
    test(`something`, async () => {
      //
    });
  });
});
