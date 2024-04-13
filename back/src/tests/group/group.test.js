const request = require("supertest");
const { describe, test, expect, beforeAll } = require("bun:test");

const app = require("./../setup/app.setup");

const method = require("./../setup/method.setup");

// manually logging
const debug = require("./../../constants/debug");

describe(`Group Testing`, () => {
  describe(`GET /groups`, () => {
    test(`something`, async () => {
      //
    });
  });

  describe(`POST /groups`, () => {
    test(`something`, async () => {
      //
    });
  });
});
