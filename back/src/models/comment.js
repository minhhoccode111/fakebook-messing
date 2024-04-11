const mongoose = require("mongoose");

const { formatDate } = require("./../methods");

const Schema = mongoose.Schema;

const CommentSchema = new Schema(
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

    // 1 must be null between content and imageLink
    content: {
      type: String,
      length: {
        max: 10000,
      },
    },

    createdAt: {
      type: Date,
      default: () => new Date(Date.now()),
    },
  },
  { toJSON: { virtuals: true } },
);

CommentSchema.virtual("createdAtFormatted").get(function () {
  if (this.createdAt) return formatDate(this.createdAt);
});

CommentSchema.virtual("createdAtUnix").get(function () {
  if (this.createdAt) return this.createdAt.getTime();
});

module.exports = mongoose.model("Comment", CommentSchema);
