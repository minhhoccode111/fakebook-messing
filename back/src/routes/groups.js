import express from "express";
const router = express.Router();

import GroupsController from "./../controllers/groupsController";

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

export default router;
