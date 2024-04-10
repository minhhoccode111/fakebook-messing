const mongoose = require('mongoose');

const { formatDate, formatDateIso } = require('./../methods');

const Schema = mongoose.Schema;

const statusEnum = ['online', 'offline', 'busy', 'afk'];

const UserSchema = new Schema(
  {
    fullname: {
      type: String,
      required: true,
      trim: true,
      length: {
        min: 1,
        max: 50,
      },
    },

    username: {
      type: String,
      required: true,
      trim: true,
      unique: true,
      length: {
        min: 8,
      },
    },

    password: {
      type: String,
      required: true,
      length: {
        min: 8,
        max: 32,
      },
    },

    status: {
      type: String,
      enum: statusEnum,
      default: () => 'online',
    },

    bio: {
      type: String,
      maxLength: 250,
      default: () => `Some contents are created automatically, please consider update profile.`,
    },

    avatarLink: {
      type: String,
      default: () => `https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSX12hdq7FMZRu7mtAqwmzmgHjR8rQ8qa0FEfWRbqsxfB2FG7jB688i&usqp=CAE&s`,
    },

    dateOfBirth: {
      type: Date,
      default: () => new Date('2001-01-01'),
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

UserSchema.virtual('createdAtFormatted').get(function () {
  if (this.createdAt) return formatDate(this.createdAt);
});

UserSchema.virtual('createdAtUnix').get(function () {
  if (this.createdAt) return this.createdAt.getTime();
});

UserSchema.virtual('updatedAtFormatted').get(function () {
  if (this.updatedAt) return formatDate(this.updatedAt);
});

UserSchema.virtual('updatedAtUnix').get(function () {
  if (this.updatedAt) return this.updatedAt.getTime();
});

UserSchema.virtual('dateOfBirthFormatted').get(function () {
  if (this.dateOfBirth) return formatDate(this.dateOfBirth);
});

UserSchema.virtual('dateOfBirthUnix').get(function () {
  if (this.dateOfBirth) return this.dateOfBirth.getTime();
});

UserSchema.virtual('dateOfBirthIso').get(function () {
  if (this.dateOfBirth) return formatDateIso(this.dateOfBirth);
});

module.exports = mongoose.model('User', UserSchema);
