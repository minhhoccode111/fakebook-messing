// no need for try...catch block
const asyncHandler = require("express-async-handler");

//
const valid = require("./../middleware/valid");
const param = require("./../middleware/param");
const mongo = require("./../middleware/mongo");
const authorize = require("./../middleware/authorize");

// environment variables
const EnvVar = require("./../constants/envvar");

// manually logging
const debug = require("./../constants/debug");

// mongoose models
const User = require("./../models/user");
const Follow = require("./../models/follow");
const Post = require("./../models/post");
const Comment = require("./../models/comment");
const LikePost = require("./../models/likePost");
const LikeComment = require("./../models/likeComment");

const Message = require("./../models/message");
const Group = require("./../models/group");
const GroupMember = require("./../models/groupMember");

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
    selfUser: req.user,
    joinedGroups,
    publicGroups,
    privateGroups,
  });
});

// POST /groups
const postAllGroups = [
  valid.groupInfo,
  valid.groupNamePost,
  asyncHandler(async (req, res, next) => {
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
  authorize.groupid,
  asyncHandler(async (req, res, next) => {
    const oldGroup = req.groupParam;
    const { name, bio, avatarLink } = req.body;

    // debug(`oldGroup belike: `, oldGroup);

    const newGroup = new Group(
      Object.assign(
        {
          _id: req.params.groupid,
          updatedAt: new Date(),
          public: req.body.public === "true",
        },
        req.body,
        oldGroup,
      ),
    );

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
  authorize.groupid,
  asyncHandler(async (req, res) => {
    await Group.findByIdAndDelete(req.params.groupid);
    return res.sendStatus(200);
  }),
];

// get all messages with a group
const getGroupMessages = asyncHandler(async (req, res) => {
  res.json(`getGroupMessages - group id: ${req.params.groupid} - not yet`);
});

// send a message to a group
const postGroupMessages = asyncHandler(async (req, res) => {
  res.json(`postGroupMessages - group id: ${req.params.groupid} - not yet`);
});

// send a message to a group
const getGroupMembers = asyncHandler(async (req, res) => {
  res.json(`getGroupMembers - group id: ${req.params.groupid} - not yet`);
});

// send a message to a group
const postGroupMembers = asyncHandler(async (req, res) => {
  res.json(`postGroupMembers - group id: ${req.params.groupid} - not yet`);
});

// send a message to a group
const deleteGroupMember = asyncHandler(async (req, res) => {
  res.json(
    `deleteGroupMember - group id: ${req.params.groupid} - member id: ${req.params.memberid} - not yet`,
  );
});

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
