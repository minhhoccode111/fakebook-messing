// no need for try...catch block
import asyncHandler from "express-async-handler";

// sanitize and validate data
import { body, validationResult } from "express-validator";

// mongoose models
import User from "./../models/user";
import Group from "./../models/group";
import Message from "./../models/message";
import GroupMember from "./../models/groupMember";

// debug
// import  debug from ("debug")(
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

const GroupsController = {
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

export default GroupsController;
