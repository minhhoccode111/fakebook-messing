import express from "express";
const router = express.Router();

import {
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
} from "./../controllers/usersController";

router.get("/", getAllUsers);

router.get("/:userid", getUser);

router.put("/:userid", putUser);

// not implemented
// router.delete('/', deleteUser);

router.get("/:userid/messages", getUserMessages);

router.post("/:userid/messages", postUserMessages);

router.get("/:userid/posts", getUserPosts); // remember to get likes and comments all posts too

router.post("/:userid/posts", postUserPosts);

router.delete("/:userid/posts/:postid", deleteUserPost);

router.post("/:userid/posts/:postid/likes", postUserPostLikes);

router.post("/:userid/posts/:postid/comments", postUserPostComments);

// // not implement like a comment
// router.post("/:userid/posts/:postid/comments/:commentid/likes", postUserPostCommentLikes);

export default router;
