const express = require('express');
const router = express.Router();

const UserController = require('./../controllers/userController');

// get info of current logged usesr
router.get('/', UserController.user_get);

// update info of current logged user
router.put('/', UserController.user_put);

// not implemented
// router.delete('/', UserController.user_delete);

module.exports = router;
