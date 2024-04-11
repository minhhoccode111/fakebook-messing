import express from "express";
const router = express.Router();

import UsersController from "./../controllers/usersController";

router.get("/", UsersController.getAllUsers);

router.get("/:userid", UsersController.getUser);

router.put("/:userid", UsersController.putUser);

// not implemented
// router.delete('/', deleteUser);

router.get("/:userid/messages", UsersController.getUserMessages);

router.post("/:userid/messages", UsersController.postUserMessages);

router.get("/:userid/posts", UsersController.getUserPosts); // remember to get likes and comments all posts too

router.post("/:userid/posts", UsersController.postUserPosts);

router.delete("/:userid/posts/:postid", UsersController.deleteUserPost);

router.post("/:userid/posts/:postid/likes", UsersController.postUserPostLikes);

router.post(
  "/:userid/posts/:postid/comments",
  UsersController.postUserPostComments,
);

// // not implement like a comment
// router.post("/:userid/posts/:postid/comments/:commentid/likes", postUserPostCommentLikes);

export default router;
