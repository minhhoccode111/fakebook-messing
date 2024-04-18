const express = require("express");
const router = express.Router();

const AuthController = require("./../controllers/auth.controller");

router.post("/login", AuthController.loginPost);

router.post("/signup", AuthController.signupPost);

module.exports = router;
