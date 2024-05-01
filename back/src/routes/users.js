const express = require("express");
const router = express.Router();

const UsersController = require("./../controllers/user.controller");

// console.log(UsersController.getAllUsers());

router.get("/", UsersController.selfGetAllUsers);

// get all posts of users that self is following
router.get("/feed", UsersController.getFeed);

router.get("/:userid", UsersController.getUser);

router.put("/:userid", UsersController.putUser);

// not implemented
// router.delete('/', deleteUser);

router.get("/:userid/connections", UsersController.userGetAllUsers);

router.post("/:userid/follows", UsersController.postUserFollows);

router.get("/:userid/messages", UsersController.getUserMessages);

router.post("/:userid/messages", UsersController.postUserMessages);

// remember to get likes and comments all posts too
router.get("/:userid/posts", UsersController.getUserPosts);

router.post("/:userid/posts", UsersController.postUserPosts);

router.get("/:userid/posts/:postid", UsersController.getUserPost);

router.delete("/:userid/posts/:postid", UsersController.deleteUserPost);

router.post("/:userid/posts/:postid/likes", UsersController.postUserPostLikes);

router.post(
  "/:userid/posts/:postid/comments",
  UsersController.postUserPostComments,
);

// not implement like a comment
router.post(
  "/:userid/posts/:postid/comments/:commentid/likes",
  UsersController.postUserCommentLikes,
);

module.exports = router;
