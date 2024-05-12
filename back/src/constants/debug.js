/*
 * Every debug in our app is the same
 */

const dotenv = require("dotenv");
dotenv.config();

// because writing that '=' 60 times is not a good idea so ...
const debug = require("debug")(
  "============================================================",
);

module.exports = debug;
