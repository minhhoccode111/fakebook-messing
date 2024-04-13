// connect database
const mongoose = require("mongoose");

// manually logging
const debug = require("./../../constants/debug");

// fake database on ram
const { MongoMemoryServer } = require("mongodb-memory-server");

async function initializeMongoServer() {
  const mongoServer = await MongoMemoryServer.create();
  const mongoUri = mongoServer.getUri();

  // debug(`the mongoUri belike: `, mongoUri);

  mongoose.connect(mongoUri);

  mongoose.connection.on("error", (e) => {
    if (e.message.code === "ETIMEDOUT") {
      debug(`the database mongoose connection belike: `, e);
      mongoose.connect(mongoUri);
    }

    debug(`the database mongoose connection belike: `, e);
  });

  mongoose.connection.once("open", () => {
    // debug(`mongodb successfully connected to ${mongoUri}`);
  });
}

module.exports = initializeMongoServer;
