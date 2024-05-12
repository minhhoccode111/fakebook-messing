const mongoose = require("mongoose");

const { formatDate } = require("./../method");

const Schema = mongoose.Schema;

const FollowSchema = new Schema(
  {
    follower: {
      ref: "User",
      required: true,
      type: Schema.Types.ObjectId,
    },

    following: {
      ref: "User",
      required: true,
      type: Schema.Types.ObjectId,
    },

    createdAt: {
      type: Date,
      default: () => new Date(Date.now()),
    },
  },
  { toJSON: { virtuals: true } },
);

FollowSchema.virtual("createdAtFormatted").get(function () {
  if (this.createdAt) return formatDate(this.createdAt);
});

FollowSchema.virtual("createdAtUnix").get(function () {
  if (this.createdAt) return this.createdAt.getTime();
});

module.exports = mongoose.model("Follow", FollowSchema);
