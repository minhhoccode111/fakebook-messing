const mongoose = require('mongoose');

const { formatDate } = require('./../methods');

const Schema = mongoose.Schema;

const GroupMemberSchema = new Schema(
  {
		// need to specify between userReceive or groupReceive (1 must be null)
    user: {
      type: Schema.Types.ObjectId,
      ref: 'User',
    },

    group: {
      type: Schema.Types.ObjectId,
      ref: 'Group',
    },

		// current user is creator of current group
    isCreator: {
      type: Boolean,
      required: true,
    },

    createdAt: {
      type: Date,
      default: () => new Date(Date.now()),
    },

  },
  { toJSON: { virtuals: true } }
);

GroupMemberSchema.virtual('createdAtFormatted').get(function () {
	if (this.createdAt) return formatDate(this.createdAt);
});

GroupMemberSchema.virtual('createdAtUnix').get(function () {
  if (this.createdAt) return this.createdAt.getTime();
});

module.exports = mongoose.model('GroupMember', GroupMemberSchema);

