const mongoose = require('mongoose');

const { formatDate } = require('./../methods');

const Schema = mongoose.Schema;

const GroupSchema = new Schema(
  {
    creator: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },

    name: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      length: {
        max: 50,
      },
    },

    public: {
      type: Boolean,
      default: () => true,
    },

    bio: {
      type: String,
      length: {
        min: 1,
        max: 250,
      },
      default: () => `Some contents are created automatically, please consider update profile.`,
    },

    avatarLink: {
      type: String,
      default: () => `https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSX12hdq7FMZRu7mtAqwmzmgHjR8rQ8qa0FEfWRbqsxfB2FG7jB688i&usqp=CAE&s`,
    },

    createdAt: {
      type: Date,
      default: () => new Date(Date.now()),
    },

    updatedAt: {
      type: Date,
      default: () => new Date(Date.now()),
    },

  },
  { toJSON: { virtuals: true } }
);

GroupSchema.virtual('createdAtFormatted').get(function () {
	if (this.createdAt) return formatDate(this.createdAt);
});

GroupSchema.virtual('createdAtUnix').get(function () {
  if (this.createdAt) return this.createdAt.getTime();
});

GroupSchema.virtual('updatedAtFormatted').get(function () {
  if (this.updatedAt) return formatDate(this.updatedAt);
});

GroupSchema.virtual('updatedAtUnix').get(function () {
  if (this.updatedAt) return this.updatedAt.getTime();
});

module.exports = mongoose.model('Group', GroupSchema);

