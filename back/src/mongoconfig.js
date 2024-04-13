// environment variables
const EnvVar = require("./constants/envvar");

// manually logging
const debug = require("./constants/debug");

// connect database
const mongoose = require("mongoose");
// not throw an error when we try to query the property that not explicitly defined on Schema
mongoose.set("strictQuery", false);

main()
  .then(() => debug("connected to database"))
  .catch((err) => debug("an error occur: ", err));

async function main() {
  await mongoose.connect(EnvVar.MongoString);
  const db = mongoose.connection;
  db.on("error", console.error.bind(console, "mongoose connection error"));
}
