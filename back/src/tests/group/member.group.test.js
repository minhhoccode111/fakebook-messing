const request = require("supertest");
const { describe, test, expect, beforeAll } = require("bun:test");

const app = require("./../setup/app.setup");

const method = require("./../setup/method.setup");

// manually logging
const debug = require("./../../constants/debug");

describe(`Group Member Testing`, () => {
  describe(`GET /groups/:groupid/members`, () => {
    test(`something`, async () => {
      //
    });
  });

  describe(`POST /groups/:groupid/memebers`, () => {
    test(`something`, async () => {
      //
    });
  });

  describe(`DELETE /groups/:groupid/memebers/:memberid`, () => {
    test(`something`, async () => {
      //
    });
  });
});
