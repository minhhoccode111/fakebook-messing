// no need for try...catch block
import asyncHandler from "express-async-handler";

// sanitize and validate data
import { body, validationResult } from "express-validator";

// mongoose models
import User from "./../models/user";

// debug
// import  debug from ("debug")(
//   "============================================================",
// );

// relationship with current user
const getAllUsers = asyncHandler(async (req, res) => {
  res.json(`getAllUsers - not yet`);
});

// a specific user
const getUser = asyncHandler(async (req, res) => {
  res.json(`getUser - user id: ${req.params.userid} - not yet`);
});

// update current user
const putUser = asyncHandler(async (req, res) => {
  res.json(`putUser - not yet`);
});

// get all messages with a user
const getUserMessages = asyncHandler(async (req, res) => {
  res.json(`getUserMessages - user id: ${req.params.userid} - not yet`);
});

// send a message to a user
const postUserMessages = asyncHandler(async (req, res) => {
  res.json(`postUserMessages - user id: ${req.params.userid} - not yet`);
});

// get all user's posts
const getUserPosts = asyncHandler(async (req, res) => {
  res.json(`getUserPosts - user id: ${req.params.userid} - not yet`);
});

// post a post
const postUserPosts = asyncHandler(async (req, res) => {
  res.json(`postUserPosts - user id: ${req.params.userid} - not yet`);
});

// delete a post
const deleteUserPost = asyncHandler(async (req, res) => {
  res.json(
    `deleteUserPost - user id: ${req.params.userid} - post id: ${req.params.postid} - not yet`,
  );
});

// like a post
const postUserPostLikes = asyncHandler(async (req, res) => {
  res.json(
    `postUserPostLikes - user id: ${req.params.userid} - post id: ${req.params.postid} - not yet`,
  );
});

// comment on a post
const postUserPostComments = asyncHandler(async (req, res) => {
  res.json(
    `postUserPostComments - user id: ${req.params.userid} - post id: ${req.params.postid} - not yet`,
  );
});

const UsersController = {
  getAllUsers,
  getUser,
  putUser,
  // deleteUser,
  getUserMessages,
  postUserMessages,
  getUserPosts,
  postUserPosts,
  deleteUserPost,
  postUserPostLikes,
  postUserPostComments,
  // postUserPostCommentLikes,
};

export default UsersController;
