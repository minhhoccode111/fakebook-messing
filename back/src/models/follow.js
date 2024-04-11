const mongoose = require("mongoose");

const { formatDate } = require("./../methods");

const Schema = mongoose.Schema;

const FollowSchema = new Schema(
  {
    follower: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    following: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
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
