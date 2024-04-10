// connect database
const mongoose = require('mongoose');

// fake database on ram
const { MongoMemoryServer } = require('mongodb-memory-server');

async function initializeMongoServer() {
  const mongoServer = await MongoMemoryServer.create();
  const mongoUri = mongoServer.getUri();

  mongoose.connect(mongoUri);

  mongoose.connection.on('error', (e) => {
    if (e.message.code === 'ETIMEDOUT') {
      console.log(`the database mongoose connection belike: `, e);
      mongoose.connect(mongoUri);
    }

    console.log(`the database mongoose connection belike: `, e);
  });

  mongoose.connection.once('open', () => {
    // console.log(`mongodb successfully connected to ${mongoUri}`);
  });
}

module.exports = initializeMongoServer;
