// connect database
import mongoose from "mongoose";

// fake database on ram
import { MongoMemoryServer } from "mongodb-memory-server";

async function initializeMongoServer() {
  const mongoServer = await MongoMemoryServer.create();
  const mongoUri = mongoServer.getUri();

  mongoose.connect(mongoUri);

  mongoose.connection.on("error", (e) => {
    if (e.message.code === "ETIMEDOUT") {
      console.log(`the database mongoose connection belike: `, e);
      mongoose.connect(mongoUri);
    }

    console.log(`the database mongoose connection belike: `, e);
  });

  mongoose.connection.once("open", () => {
    // console.log(`mongodb successfully connected to ${mongoUri}`);
  });
}

export default initializeMongoServer;
