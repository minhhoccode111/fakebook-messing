// no need for try...catch block
const asyncHandler = require("express-async-handler");

const GroupMember = require("./../models/groupMember");

const debug = require("./../constants/debug");

// check userid === self
const userid = (req, res, next) => {
  if (req.params.userid !== req.user.id) return res.sendStatus(404);
  next();
};

// check group belong to self
const ownedGroupid = (req, res, next) => {
  if (req.user.id !== req.groupParam.creator.id) return res.sendStatus(404);
  next();
};

// check group is joined by self, for GET and POST messages
const joinedGroupid = asyncHandler(async (req, res, next) => {
  const selfRef = await GroupMember.findOne({
    group: req.params.groupid,
    user: req.user,
  }).exec();

  // self try to post to a group that not join
  if (req.method === "POST" && selfRef === null) return res.sendStatus(404);

  if (selfRef === null) req.isGroupMember = false;
  else req.isGroupMember = true;

  next();
});

// check memberid === self
const memberid = (req, res, next) => {
  if (req.params.memberis !== req.user.id) return res.sendStatus(404);
  next();
};

module.exports = {
  userid,
  ownedGroupid,
  joinedGroupid,
};
