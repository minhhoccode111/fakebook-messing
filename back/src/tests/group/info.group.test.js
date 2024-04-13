const request = require("supertest");
const { describe, test, expect, beforeAll } = require("bun:test");

const app = require("./../setup/app.setup");

const method = require("./../setup/method.setup");

// manually logging
const debug = require("./../../constants/debug");

describe(`Group Info Testing`, () => {
  describe(`GET /groups/:groupid`, () => {
    test(`something`, async () => {
      //
    });
  });

  describe(`PUT /groups/:groupid`, () => {
    test(`something`, async () => {
      //
    });
  });

  describe(`DELETE /groups/:groupid`, () => {
    test(`something`, async () => {
      //
    });
  });
});
