const request = require("supertest");
const { describe, test, expect, beforeAll } = require("bun:test");

const app = require("./../setup/app.setup");

const method = require("./../setup/method.setup");

// manually logging
const debug = require("./../../constants/debug");

describe(`User Info Testing`, () => {
  describe(`GET /users`, () => {
    test(`something`, async () => {
      //
    });
  });

  describe(`GET /users/:userid`, () => {
    test(`something`, async () => {
      //
    });
  });

  describe(`PUT /users/:userid`, () => {
    test(`something`, async () => {
      //
    });
  });
});
