const debug = require('debug')('xxxxxxxxxxxxxxxxxxxx-debug-xxxxxxxxxxxxxxxxxxxx');

// connect database
const mongoose = require('mongoose');
// not throw an error when we try to query the property that not explicitly defined on Schema
mongoose.set('strictQuery', false);
// development database string

// if production db is not defined then use the development
const mongoDB = process.env.PRODUCTION_MONGO || process.env.DEVELOPMENT_MONGO;

main()
  .then(() => debug('connected to database'))
  .catch((err) => debug('an error occur: ', err));

async function main() {
  await mongoose.connect(mongoDB);
  const db = mongoose.connection;
  db.on('error', console.error.bind(console, 'mongoose connection error'));
}
