/**
 * Environments variables declared here.
 */

/* eslint-disable node/no-process-env */

module.exports = {
  NodeEnv: process.env.NODE_ENV ?? "",
  Port: process.env.PORT ?? 3000,
  Mongo: process.env.PRODUCTION_MONGO ?? process.env.DEVELOPMENT_MONGO ?? "",
  Salt: process.env.SALT ?? "",
  Secret: process.env.SECRET ?? "",
  // TODO: work on this and refactor structure
};
