import express from "express";
const router = express.Router();

import AuthController from "./../controllers/authController";

router.post("/login", AuthController.login_post);

router.post("/signup", AuthController.signup_post);

export default router;
