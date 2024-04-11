import debug from ("debug")(
  "============================================================",
);

// connect database
import  mongoose from "mongoose";
// not throw an error when we try to query the property that not explicitly defined on Schema
mongoose.set("strictQuery", false);

const MONGODB = process.env.PRODUCTION_MONGO || process.env.DEVELOPMENT_MONGO;

main()
  .then(() => debug("connected to database"))
  .catch((err) => debug("an error occur: ", err));

async function main() {
  await mongoose.connect(MONGODB);
  const db = mongoose.connection;
  db.on("error", console.error.bind(console, "mongoose connection error"));
}
