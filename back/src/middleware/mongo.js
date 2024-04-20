const mongoose = require("mongoose");

// Check valid mongoose id
const userid = (req, res, next) => {
  const isValidId = mongoose.isValidObjectId(req.params.userid);
  if (!isValidId) return res.sendStatus(404);
  next();
};

// Check valid mongoose id
const postid = (req, res, next) => {
  const isValidId = mongoose.isValidObjectId(req.params.postid);
  if (!isValidId) return res.sendStatus(404);
  next();
};

// Check valid mongoose id
const commentid = (req, res, next) => {
  const isValidId = mongoose.isValidObjectId(req.params.commentid);
  if (!isValidId) return res.sendStatus(404);
  next();
};

// Check valid mongoose id
const groupid = (req, res, next) => {
  const isValidId = mongoose.isValidObjectId(req.params.groupid);
  if (!isValidId) return res.sendStatus(404);
  next();
};

module.exports = {
  userid,
  postid,
  commentid,
  groupid,
};
