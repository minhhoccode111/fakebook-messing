const express = require("express");
const router = express.Router();

const GroupsController = require("./../controllers/group.controller");

router.get("/", GroupsController.getAllGroups);

router.post("/", GroupsController.postAllGroups);

router.get("/:groupid", GroupsController.getGroup);

router.put("/:groupid", GroupsController.putGroup);

router.delete("/:groupid", GroupsController.deleteGroup);

router.get("/:groupid/messages", GroupsController.getGroupMessages);

router.post("/:groupid/messages", GroupsController.postGroupMessages);

router.get("/:groupid/members", GroupsController.getGroupMembers);

router.post("/:groupid/members", GroupsController.postGroupMembers);

router.delete(
  "/:groupid/members/:memberid",
  GroupsController.deleteGroupMember,
);

module.exports = router;
