// no need for try...catch block
const asyncHandler = require("express-async-handler");

// sanitize and validate data
const { body, validationResult } = require("express-validator");

// mongoose models
const User = require("./../models/user");
const Group = require("./../models/group");
const Message = require("./../models/message");
const GroupMember = require("./../models/groupMember");

// debug
// const  debug = require ("debug")(
//   "============================================================",
// );

// relationship with current group
const getAllGroups = asyncHandler(async (req, res) => {
  res.json(`getAllGroups - not yet`);
});

// relationship with current group
const postAllGroups = asyncHandler(async (req, res) => {
  res.json(`postAllGroups - not yet`);
});

// a specific group
const getGroup = asyncHandler(async (req, res) => {
  res.json(`getGroup - group id: ${req.params.groupid} - not yet`);
});

// update current group
const putGroup = asyncHandler(async (req, res) => {
  res.json(`putGroup - group id: ${req.params.groupid} - not yet`);
});

// update current group
const deleteGroup = asyncHandler(async (req, res) => {
  res.json(`deleteGroup - group id: ${req.params.groupid} - not yet`);
});

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
