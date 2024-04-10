const mongoose = require('mongoose');

const { formatDate } = require('./../methods');

const Schema = mongoose.Schema;

const MessageSchema = new Schema(
  {
    sender: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },

    // 1 must be null between userReceive and groupReceive
    userReceive: {
      type: Schema.Types.ObjectId,
      ref: 'User',
    },

    groupReceive: {
      type: Schema.Types.ObjectId,
      ref: 'Group',
    },

    // 1 must be null between content and imageLink
    content: {
      type: String,
      length: {
        max: 10000,
      },
    },

    imageLink: {
      type: String,
    },

    createdAt: {
      type: Date,
      default: () => new Date(Date.now()),
    },
  },
  { toJSON: { virtuals: true } }
);

MessageSchema.virtual('createdAtFormatted').get(function () {
  if (this.createdAt) return formatDate(this.createdAt);
});

MessageSchema.virtual('createdAtUnix').get(function () {
  if (this.createdAt) return this.createdAt.getTime();
});

module.exports = mongoose.model('Message', MessageSchema);
