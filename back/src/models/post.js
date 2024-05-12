const mongoose = require("mongoose");

const { formatDate } = require("./../method");

const Schema = mongoose.Schema;

const PostSchema = new Schema(
  {
    creator: {
      ref: "User",
      required: true,
      type: Schema.Types.ObjectId,
    },

    // 1 must be null between content and imageLink
    content: {
      type: String,
      length: {
        max: 10000,
      },
      default: () => `Default post content`,
    },

    createdAt: {
      type: Date,
      default: () => new Date(Date.now()),
    },
  },
  { toJSON: { virtuals: true } },
);

PostSchema.virtual("createdAtFormatted").get(function () {
  if (this.createdAt) return formatDate(this.createdAt);
});

PostSchema.virtual("createdAtUnix").get(function () {
  if (this.createdAt) return this.createdAt.getTime();
});

module.exports = mongoose.model("Post", PostSchema);
