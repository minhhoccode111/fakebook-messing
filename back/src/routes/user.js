import express from "express";
const router = express.Router();

import UserController from "./../controllers/userController";

// get info of current logged usesr
router.get("/", UserController.user_get);

// update info of current logged user
router.put("/", UserController.user_put);

// not implemented
// router.delete('/', UserController.user_delete);

export default router;
