/*
 * Every debug in our app is the same
 */

const dotenv = require("dotenv");
dotenv.config();

const debug = require("debug")(
  "============================================================",
);

module.exports = debug;
