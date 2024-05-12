/**
 * Environments variables declared here.
 */

/* eslint-disable node/no-process-env */

const dotenv = require("dotenv");
dotenv.config();

// Make every debug the same
const debug = require("./debug");

const EnvVar = {
  Salt: process.env.SALT ?? "",
  Port: process.env.PORT ?? 3000,
  Secret: process.env.SECRET ?? "",
  NodeEnv: process.env.NODE_ENV ?? "",
  DummyPassword: process.env.PASSWORD ?? "",
  MongoString:
    process.env.PRODUCTION_MONGO || process.env.DEVELOPMENT_MONGO || "",
};

// debug(EnvVar);

module.exports = EnvVar;
