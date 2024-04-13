const request = require("supertest");
const { describe, test, expect, beforeAll } = require("bun:test");

const app = require("./../setup/app.setup");

const method = require("./../setup/method.setup");

// manually logging
const debug = require("./../../constants/debug");

describe(`User Post Interaction Testing`, () => {
  describe(`POST /users/:userid/posts/:postid/likes`, () => {
    test(`something`, async () => {
      //
    });
  });

  describe(`POST /users/:userid/posts/:postid/comments`, () => {
    test(`something`, async () => {
      //
    });
  });

  describe(`POST /users/:userid/posts/:postid/comments/:commentid/likes`, () => {
    test(`something`, async () => {
      //
    });
  });
});
