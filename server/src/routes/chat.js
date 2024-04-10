const express = require('express');
const router = express.Router();

const ChatUserController = require('../controllers/chatUserController');
const ChatGroupController = require('../controllers/chatGroupController');

// we are in /api/v1/chat/

////////// chat vs user \\\\\\\\\\

// all users that current logged in user can chat with 
router.get('/users', ChatUserController.chat_all_user_get);

// get conversation with a specific user
router.get('/users/:userid', ChatUserController.chat_user_get);

// post a message with a specific user
router.post('/users/:userid', ChatUserController.chat_user_post);

// not implement edit or delete user's messages
// router.put('/users/:userid/:messageid', ChatUserController.chat_user_message_put);
// router.delete('/users/:userid/:messageid', ChatUserController.chat_user_message_delete);

////////// chat vs group \\\\\\\\\\

// get all group that visible to current logged in user (joined, public)
router.get('/groups', ChatGroupController.chat_all_group_get);

// current logged in user create a new group (and be group's creator)
router.post('/groups', ChatGroupController.chat_all_group_post);

// get conversation with a specific group
router.get('/groups/:groupid', ChatGroupController.chat_group_get);

// post a message with a specific group
router.post('/groups/:groupid', ChatGroupController.chat_group_post);

// delete a specific group (current logged in user is group's creator)
router.delete('/groups/:groupid', ChatGroupController.chat_group_delete);

// update a specific group (current logged in user is group's creator)
router.put('/groups/:groupid', ChatGroupController.chat_group_put);

// not implement edit or delete group's messages
// router.put('/groups/:groupid/:messageid', ChatGroupController.chat_group_message_put);
// router.delete('/groups/:groupid/:messageid', ChatGroupController.chat_group_message_delete);

// get all group's members
router.get('/groups/:groupid/members', ChatGroupController.chat_group_all_members_get);

// post a member to a group
router.post('/groups/:groupid/members', ChatGroupController.chat_group_all_members_post);

// delete a member from a group (leave or get kicked)
router.delete('/groups/:groupid/members/:userid', ChatGroupController.chat_group_member_delete);

// not implement edit a member in a group (authorization in group)
// router.put('/groups/:groupid/members/:userid', ChatGroupController.chat_group_member_put);

module.exports = router;
