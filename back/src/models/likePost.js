const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const LikePostSchema = new Schema(
  {
    creator: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    post: {
      type: Schema.Types.ObjectId,
      ref: "Post",
      required: true,
    },
  },
  { toJSON: { virtuals: true } },
);

module.exports = mongoose.model("LikePost", LikePostSchema);
