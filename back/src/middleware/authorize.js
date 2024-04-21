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
    group: req.groupParam,
    user: req.user,
  }).exec();

  if (req.method === "POST") return res.sendStatus(403); // forbidden

  if (selfRef === null) req.isGroupMember = false;
  else req.isGroupMember = true;

  next();
});

module.exports = {
  userid,
  ownedGroupid,
  joinedGroupid,
};
