const mongoose = require("mongoose");

const { formatDate } = require("./../method");

const Schema = mongoose.Schema;

const CommentSchema = new Schema(
  {
    creator: {
      ref: "User",
      required: true,
      type: Schema.Types.ObjectId,
    },

    post: {
      ref: "Post",
      required: true,
      type: Schema.Types.ObjectId,
    },

    // 1 must be null between content and imageLink
    content: {
      type: String,
      length: {
        max: 10000,
      },
      default: () => `This is default comment`,
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
