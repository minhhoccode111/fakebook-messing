// no need for try...catch block
const asyncHandler = require('express-async-handler');

// sanitize and validate data
const { body, validationResult } = require('express-validator');

// mongoose models
const User = require('./../models/user');
const Message = require('./../models/message');
const Group = require('./../models/group');
const GroupMember = require('./../models/groupMember');

// debug
const debug = require('debug')('xxxxxxxxxxxxxxxxxxxx-debug-xxxxxxxxxxxxxxxxxxxx');

// mongoose to check valid req.params.postid
const mongoose = require('mongoose');

// get all groups that current logged in user can see
module.exports.chat_all_group_get = asyncHandler(async (req, res) => {
  // first get all current logged in user joined group references
  let joinedGroups = await GroupMember.find({ user: req.user }).sort({ isCreator: -1 }).populate('group', 'name public avatarLink').exec();

  joinedGroups = joinedGroups.map((ref) => ({
    // extract needed fields from populated group field
    _id: ref?.group?._id,
    id: ref?.group?.id,
    name: ref?.group?.name,
    public: ref?.group?.public,
    avatarLink: ref?.group?.avatarLink,
    // createdAt: ref?.group?.createdAt,
    isCreator: ref.isCreator,
    // joinedAt:
  }));

  // console.log(joinedGroups);

  // find every groups left that not exists in joinedGroups
  const notJoinedGroups = await Group.find({ _id: { $nin: joinedGroups } }, 'name public avatarLink').exec();

  // console.log(`notJoinedGroups belike: `, notJoinedGroups);

  const publicGroups = notJoinedGroups.filter((gr) => gr.public);
  const privateGroups = notJoinedGroups.filter((gr) => !gr.public);

  // console.log(`publicGroups belike: `, publicGroups);
  // console.log(`privateGroups belike: `, privateGroups);

  res.json({ requestedUser: req.user, joinedGroups, publicGroups, privateGroups });
});

// current logged in user create a new group (and be group's creator)
module.exports.chat_all_group_post = [
  body(`name`, `Group name should be between 1 and 50 characters.`).isLength({ min: 1, max: 50 }).trim().escape(),
  body(`bio`, `Group bio should be less than 250 characters.`).isLength({ max: 250 }).trim().escape(),
  body(`avatarLink`).trim().escape(),
  asyncHandler(async (req, res) => {
    let errors = validationResult(req).array();

    const { name, bio, avatarLink } = req.body;

    // in case group name exists
    const countGroupName = await Group.countDocuments({ name }).exec();

    if (countGroupName > 0) {
      errors.push({ msg: `Group name exists.` });
    }

    if (!errors.length) {
      const group = new Group({
        name,
        // bio and avatarLink can use default if provide empty string
        bio: bio || undefined,
        avatarLink: avatarLink || undefined,
        public: req.body.public === 'true',
        creator: req.user,
      });

      group.save();

      // BUG
      // create a reference between create and the group (first member)
      const creatorReference = new GroupMember({
        user: req.user,
        group,
        isCreator: true,
      });
      await creatorReference.save();

      return res.json({ requestedUser: req.user, createdGroup: group });
    }

    errors = errors.reduce((total, current) => [...total, current.msg], []);

    return res.status(400).json({ errors });
  }),
];

// get conversation with a specific group
module.exports.chat_group_get = asyncHandler(async (req, res) => {
  // check valid mongoose objectid before retrieve db
  const isValidId = mongoose.isValidObjectId(req.params.groupid);
  if (!isValidId) return res.sendStatus(404);

  // check if group we want really exists, populate all fields of group's creator
  const group = await Group.findById(req.params.groupid, '-__v').populate('creator').exec();
  if (group === null) return res.sendStatus(404);

  // current logged in user reference with group
  const currentUserInGroup = await GroupMember.findOne({ group, user: req.user }).exec();

  // console.log(`currentUserInGroup belike: `, currentUserInGroup);

  // authorization of current logged in user vs the group
  const isMember = currentUserInGroup === null ? false : true;
  const isCreator = currentUserInGroup?.isCreator ?? false;

  let messages;

  // current logged in user can read group's messages
  if (isMember) {
    // find all messages are being sent to this group
    messages = await Message.find({ groupReceive: group }, '-__v').populate('sender', '_id avatarLink').sort({ createdAt: 1 }).exec();

    // mark owned messages to display properly
    messages = messages.map((mess) => {
      let owned;
      if (mess.sender.id === req.user.id) owned = true;
      else owned = false;
      // debug(`does current logged in user send the message? `, mess.sender.id === req.user.id);
      // debug(`the message's sender belike: `, mess.sender.id);
      // debug(`the req.user.id belike: `, req.user.id);
      return { ...mess.toJSON(), owned };
    });
  }
  // null to determine that current logged in user is not joined
  else {
    messages = null;
  }

  return (
    res
      // base on user joined group or not
      // .status(isMember ? 200 : 403)
      .json({
        requestedUser: req.user,
        receivedGroup: { ...group.toJSON(), isCreator, isMember },
        messages,
      })
  );
});

// post a message to a specific group
module.exports.chat_group_post = [
  body('content', `Content cannot be over 10000 characters`).trim().isLength({ max: 10000 }).escape(),
  body('imageLink')
    .trim()
    .escape()
    .custom((value, { req }) => {
      if (req.body.content && value) throw new Error(`Content and imageLink cannot be both existed`);
      if (!req.body.content && !value) throw new Error(`Content and imageLink cannot be both undefined`);
      return true;
    }),
  asyncHandler(async (req, res) => {
    // check valid mongoose objectid before retrieve db
    const isValidId = mongoose.isValidObjectId(req.params.groupid);
    if (!isValidId) return res.sendStatus(404);

    // check if group we want really exists
    const group = await Group.findById(req.params.groupid, '_id name').exec();
    if (group === null) return res.sendStatus(404);

    // check if current logged in user can send message to this group
    const groupMember = await GroupMember.findOne({ group, user: req.user }).exec();
    if (groupMember === null) return res.sendStatus(403);

    const errors = validationResult(req).array();

    // console.log(errors);
    // console.log(`the imageLink belike: `, req.body.imageLink);
    // console.log(`the content belike: `, req.body.content);

    if (!errors.length) {
      const { imageLink, content } = req.body;

      const message = new Message({
        sender: req.user,
        userReceive: null,
        groupReceive: group,
        content,
        imageLink,
      });

      await message.save();

      // find all messages are being sent to this group
      let messages = await Message.find({ groupReceive: group }, '-__v').populate('sender', '_id avatarLink').sort({ createdAt: 1 }).exec();

      // mark owned messages to display properly
      messages = messages.map((mess) => {
        let owned;
        if (mess.sender.id === req.user.id) owned = true;
        else owned = false;
        // debug(`does current logged in user send the message? `, mess.sender.id === req.user.id);
        // debug(`the message's sender belike: `, mess.sender.id);
        // debug(`the req.user.id belike: `, req.user.id);
        return { ...mess.toJSON(), owned };
      });

      return res.json({
        requestedUser: req.user,
        receivedGroup: group,
        messages,
      });
    }

    // invalid data
    return res.sendStatus(400);
  }),
];

// delete a specific group (current logged in user is group's creator)
module.exports.chat_group_delete = asyncHandler(async (req, res) => {
  // check valid mongoose objectid before retrieve db
  const isValidId = mongoose.isValidObjectId(req.params.groupid);
  if (!isValidId) return res.sendStatus(404);

  // check if group we want really exists
  const group = await Group.findById(req.params.groupid, '_id').populate('creator', '_id').exec();
  if (group === null) return res.sendStatus(404);

  // console.log(`the group's creator belike: `, group.creator.id);
  // console.log(`the req.user.id belike: `, req.user.id);
  // console.log(`compare both belike: `, req.user.id === group.creator.id);
  // console.log(`the group belike: `, group);

  // delete group that current logged in user not own
  if (req.user.id !== group?.creator?.id) return res.sendStatus(403);

  // first delete every references of the Group in GroupMember
  await GroupMember.deleteMany({ group: req.params.groupid });

  // then create the Group itself
  await Group.findByIdAndDelete(req.params.groupid);

  res.sendStatus(200);
});

// update a specific group (current logged in user is group's creator)
module.exports.chat_group_put = [
  body(`name`, `Group name should be between 1 and 50 characters.`).isLength({ min: 1, max: 50 }).trim().escape(),
  body(`bio`, `Group bio should be less than 250 characters.`).isLength({ max: 250 }).trim().escape(),
  body(`avatarLink`).trim().escape(),
  asyncHandler(async (req, res) => {
    // check valid mongoose objectid before retrieve db
    const isValidId = mongoose.isValidObjectId(req.params.groupid);
    if (!isValidId) return res.sendStatus(404);

    // check if group we want really exists
    const oldGroup = await Group.findById(req.params.groupid, '_id name createdAt').populate('creator', '_id').exec();
    if (oldGroup === null) return res.sendStatus(404);

    let errors = validationResult(req).array();

    const { name, bio, avatarLink } = req.body;

    // in case group name exists and not belong to oldGroup
    const countGroupName = await Group.countDocuments({ name }).exec();
    if (countGroupName > 0 && oldGroup.name !== name) errors.push({ msg: `Group name exists.` });

    // forbidden current logged in user try to update group not owned
    if (oldGroup.creator.id !== req.user.id) return res.sendStatus(403);

    if (!errors.length) {
      const newGroup = new Group({
        name,
        bio: bio || undefined,
        avatarLink: avatarLink || undefined,
        public: req.body.public === 'true',
        creator: req.user,
        updatedAt: new Date(),
        createdAt: oldGroup.createdAt, // keep
        _id: oldGroup._id, // keep
      });

      // update the group
      await Group.findByIdAndUpdate(req.params.groupid, newGroup);

      return res.json({ requestedUser: req.user, updatedGroup: newGroup });
    }

    // turn to array of string
    errors = errors.reduce((total, current) => [...total, current.msg], []);

    return res.status(400).json({ errors });
  }),
];

// get all group's members
module.exports.chat_group_all_members_get = asyncHandler(async (req, res) => {
  // check valid mongoose objectid before retrieve db
  const isValidId = mongoose.isValidObjectId(req.params.groupid);
  if (!isValidId) return res.sendStatus(404);

  // check if group we want really exists, minimal cause we don't return this
  const group = await Group.findById(req.params.groupid, '_id').exec();
  if (group === null) return res.sendStatus(404);

  // find all members' references in this group
  const groupMembersRef = await GroupMember.find({ group }, 'user isCreator').populate('user', '_id fullname avatarLink status').exec();

  // extract data
  const groupMembers = groupMembersRef.map((ref) => ({ ...ref.toJSON().user, isCreator: ref.isCreator }));

  res.json({ requestedUser: req.user, groupMembers });
});

// post a member to a group
module.exports.chat_group_all_members_post = asyncHandler(async (req, res) => {
  // check valid mongoose objectid before retrieve db
  const isValidId = mongoose.isValidObjectId(req.params.groupid);
  if (!isValidId) return res.sendStatus(404);

  // check if group we want really exists, minimal cause we don't return this
  const group = await Group.findById(req.params.groupid, '_id public').exec();
  if (group === null) return res.sendStatus(404);

  // check if current logged in user is already existed in this group
  const currentUserInGroup = await GroupMember.findOne({ group, user: req.user }, '_id').exec();

  // console.log(currentUserInGroup);

  // bad request if existed or group not public to be joined
  if (currentUserInGroup !== null || !group.public) return res.sendStatus(400);

  // add current logged in user to group
  const member = new GroupMember({
    group,
    user: req.user,
    isCreator: false,
  });

  await member.save();

  // return new members array
  // find all members' references in this group
  const groupMembersRef = await GroupMember.find({ group }, 'user isCreator').populate('user', '_id fullname avatarLink status').exec();

  // extract user from ref
  const groupMembers = groupMembersRef.map((ref) => ({ ...ref.toJSON().user, isCreator: ref.isCreator }));

  res.json(groupMembers);
});

// delete a member from a group (leave or get kicked)
module.exports.chat_group_member_delete = asyncHandler(async (req, res) => {
  // check valid mongoose objectid before retrieve db of both group and user to delete
  const isValidId = mongoose.isValidObjectId(req.params.groupid) && mongoose.isValidObjectId(req.params.userid);
  if (!isValidId) return res.sendStatus(404);

  // check if group we want really exists, minimal cause we don't return this
  const group = await Group.findById(req.params.groupid, '_id').exec();
  if (group === null) return res.sendStatus(404);

  // find all members' references in this group
  const groupMembersRef = await GroupMember.find({ group }, 'user isCreator').populate('user', '_id fullname avatarLink status').exec();

  // references of current logged in user and user to be deleted with the group
  const userToDeleteRefInGroupIndex = groupMembersRef.findIndex((ref) => ref.user.id === req.params.userid);
  const loggedInUserRefInGroupIndex = groupMembersRef.findIndex((ref) => ref.user.id === req.user.id);

  // console.log(`userToDeleteRefInGroup belike: `, userToDeleteRefInGroupIndex);
  // console.log(`loggedInUserRefInGroup belike: `, loggedInUserRefInGroupIndex);

  // index of user to delete not in group
  if (userToDeleteRefInGroupIndex < 0) return res.sendStatus(404);

  const userToDeleteRefInGroup = groupMembersRef[userToDeleteRefInGroupIndex];
  const loggedInUserRefInGroup = groupMembersRef[loggedInUserRefInGroupIndex];

  // try to delete other member but current logged in user is not a group creator
  // or the creator try to leave the group (delete the group instead)
  if ((!loggedInUserRefInGroup.isCreator && loggedInUserRefInGroup?.user?.id !== userToDeleteRefInGroup?.user?.id) || userToDeleteRefInGroup.isCreator) return res.sendStatus(400);

  // delete reference between the target user vs the group
  await GroupMember.deleteOne({ group, user: req.params.userid });

  // modify data
  const groupMembers = groupMembersRef
    // first remove the deleted ref
    .filter((ref) => ref.user.id !== userToDeleteRefInGroup.user.id)
    // extract the populated ref.user
    .map((ref) => ({ ...ref.toJSON().user, isCreator: ref.isCreator }));

  return res.json(groupMembers);
});
