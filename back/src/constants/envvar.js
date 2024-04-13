/**
 * Environments variables declared here.
 */

/* eslint-disable node/no-process-env */

const dotenv = require("dotenv");
dotenv.config();

// Make every debug the same
const debug = require("./debug");

const EnvVar = {
  NodeEnv: process.env.NODE_ENV ?? "",
  Port: process.env.PORT ?? 3000,
  MongoString:
    process.env.PRODUCTION_MONGO || process.env.DEVELOPMENT_MONGO || "",
  Salt: process.env.SALT ?? "",
  Secret: process.env.SECRET ?? "",
  DummyPassword: process.env.DUMMY_PASSWORD ?? "",
};

debug(EnvVar);

module.exports = EnvVar;
