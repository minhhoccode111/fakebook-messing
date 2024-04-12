const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const LikeCommentSchema = new Schema(
  {
    creator: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    comment: {
      type: Schema.Types.ObjectId,
      ref: "Comment",
      required: true,
    },
  },
  { toJSON: { virtuals: true } },
);

module.exports = mongoose.model("LikeComment", LikeCommentSchema);

// SHOULD WE IMPLEMENT THIS?
