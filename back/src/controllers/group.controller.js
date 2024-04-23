// no need for try...catch block
const asyncHandler = require("express-async-handler");

// validation middlewares
const valid = require("./../middleware/valid");
const param = require("./../middleware/param");
const mongo = require("./../middleware/mongo");
const authorize = require("./../middleware/authorize");

// mongoose models
const Message = require("./../models/message");
const Group = require("./../models/group");
const GroupMember = require("./../models/groupMember");

// manually logging
const debug = require("./../constants/debug");

// GET /groups
const getAllGroups = asyncHandler(async (req, res) => {
  // first get all current logged in user joined group references
  let joinedGroups = await GroupMember.find({ user: req.user })
    .sort({ isCreator: -1 })
    .populate("group", "name public avatarLink")
    .exec();

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

  // find every groups left that not exists in joinedGroups
  const notJoinedGroups = await Group.find(
    { _id: { $nin: joinedGroups } },
    "name public avatarLink",
  ).exec();

  const publicGroups = notJoinedGroups.filter((gr) => gr.public);
  const privateGroups = notJoinedGroups.filter((gr) => !gr.public);

  res.json({
    self: req.user,
    joinedGroups,
    publicGroups,
    privateGroups,
  });
});

// POST /groups
const postAllGroups = [
  valid.groupInfo,
  valid.groupNamePost,
  asyncHandler(async (req, _, next) => {
    // WARN: don't destructuring `public` field
    // since it's not a valid name in jsj
    const { name, bio, avatarLink } = req.body;

    // debug(`the req.body belike: `, req.body);

    const group = new Group({
      name,
      // bio and avatarLink can use default if provide empty string
      bio: bio || undefined,
      avatarLink: avatarLink || undefined,
      public: req.body.public === "true",
      creator: req.user,
    });
    await group.save();

    // ref of group's creator
    await new GroupMember({ user: req.user, group, isCreator: true }).save();
    next();
  }),

  getAllGroups,
];

// GET /groups/:groupid
const getGroup = [
  mongo.groupid,
  param.groupid,

  asyncHandler(async (req, res) => {
    return res.json(req.groupParam);
  }),
];

// PUT /groups/:groupid
const putGroup = [
  mongo.groupid,
  param.groupid,
  valid.groupInfo,
  valid.groupNamePut,
  authorize.ownedGroupid,
  asyncHandler(async (req, _, next) => {
    const oldGroup = req.groupParam;

    // debug(`oldGroup belike: `, oldGroup);

    // Object.assign "target will be overwritten by source if have the same key"
    const newGroup = new Group(
      Object.assign(oldGroup, {
        ...req.body,
        public: req.body.public === "true",
        updatedAt: new Date(),
      }),
    );

    // debug(`newGroup belike: `, newGroup);

    // update the group
    await Group.findByIdAndUpdate(req.params.groupid, newGroup);

    next();
  }),

  getAllGroups,
];

// DELETE /groups/:groupid
const deleteGroup = [
  mongo.groupid,
  param.groupid,
  authorize.ownedGroupid,
  asyncHandler(async (req, _, next) => {
    await Group.findByIdAndDelete(req.params.groupid);
    await GroupMember.deleteMany({ group: req.params.groupid });
    next();
  }),
  getAllGroups,
];

// GET /groups/:groupid/messages
const getGroupMessages = [
  mongo.groupid,
  param.groupid,
  authorize.joinedGroupid,
  asyncHandler(async (req, res) => {
    const group = req.groupParam;

    const isMember = req.isGroupMember;

    if (!isMember)
      return res.json({
        messages: null,
        isMember,
      });

    // find all messages are being sent to this group
    const messagesInGroup = await Message.find({ groupReceive: group }, "-__v")
      .populate("sender", "_id avatarLink")
      .sort({ createdAt: 1 })
      .exec();

    // mark owned messages to display properly
    const messages = messagesInGroup.map((mess) => {
      let owned;
      if (mess.sender.id === req.user.id) owned = true;
      else owned = false;
      return { ...mess.toJSON(), owned };
    });

    return res.json({
      // NOTE: no need to know isCreator
      isMember,
      messages,
    });
  }),
];

// POST /groups/:groupid/messages
const postGroupMessages = [
  mongo.groupid,
  param.groupid,
  authorize.joinedGroupid,
  valid.messageCreate,
  asyncHandler(async (req, _, next) => {
    const group = req.groupParam;

    await new Message(
      Object.assign(
        {
          sender: req.user,
          userReceive: null,
          groupReceive: group,
        },
        req.body,
      ),
    ).save();

    next();
  }),

  getGroupMessages[3],
];

// GET /groups/:groupid/members
const getGroupMembers = [
  mongo.groupid,
  param.groupid,
  asyncHandler(async (req, res) => {
    // find all members' references in this group
    const groupMembersRef = await GroupMember.find(
      { group: req.groupParam },
      "user isCreator",
    )
      .populate("user", "_id fullname avatarLink status")
      .exec();

    // extract data
    const groupMembers = [];
    for (let i = 0, len = groupMembersRef.length; i < len; i++) {
      const ref = groupMembersRef[i];
      groupMembers.push({ ...ref.toJSON().user, isCreator: ref.isCreator });
    }

    res.json({ self: req.user, groupMembers });
  }),
];

// POST /groups/:groupid/members
const postGroupMembers = [
  mongo.groupid,
  param.groupid,
  asyncHandler(async (req, res, next) => {
    const group = req.groupParam;

    //  check if self is already joined the group
    const selfRef = await GroupMember.findOne(
      { group, user: req.user },
      "_id",
    ).exec();

    // forbidden if self already in group or group not public
    if (selfRef !== null || !req.groupParam.public) return res.sendStatus(403);

    // add self to group
    await new GroupMember({
      group,
      user: req.user,
      isCreator: false,
    }).save();

    next();
  }),

  // return array group members
  getGroupMembers[2],
];

// DELETE /groups/:groupid/members/:memberid
const deleteGroupMember = [
  mongo.groupid,
  mongo.memberid,
  param.groupid,
  param.memberid,
  asyncHandler(async (req, res) => {
    const group = req.groupParam;

    // find all members' references in this group
    const groupRefs = await GroupMember.find({ group }, "user isCreator")
      .populate("user", "_id fullname avatarLink status")
      .exec();

    // find self and memberid in group members
    const memberidIndex = groupRefs.findIndex(
      (ref) => ref.user.id === req.params.memberid,
    );
    const selfIndex = groupRefs.findIndex((ref) => ref.user.id === req.user.id);
    const memberidRef = groupRefs[memberidIndex];
    const selfRef = groupRefs[selfIndex];

    // try to delete other member but current logged in user is not a group creator
    // or the creator try to leave the group (delete the group instead)
    if (
      (!selfRef?.isCreator && selfRef?.user?.id !== memberidRef?.user?.id) ||
      memberidRef?.isCreator
    )
      return res.sendStatus(403);

    // delete reference between the target user vs the group
    await GroupMember.deleteOne({ group, user: req.params.memberid });

    const groupMembers = [];

    for (let i = 0, len = groupRefs.length; i < len; i++) {
      const ref = groupRefs[i];
      if (ref.user.id === memberidRef.user.id) continue; // deleted
      groupMembers.push({ isCreator: ref.isCreator, ...ref.toJSON().user });
    }

    return res.json({ self: req.user, groupMembers });
  }),
];

module.exports = {
  getAllGroups,
  postAllGroups,
  getGroup,
  putGroup,
  deleteGroup,
  getGroupMessages,
  postGroupMessages,
  getGroupMembers,
  postGroupMembers,
  deleteGroupMember,
};
