const express = require("express");
const router = express.Router();

const AuthController = require("./../controllers/auth.controller");

router.post("/login", AuthController.login_post);

router.post("/signup", AuthController.signup_post);

module.exports = router;
