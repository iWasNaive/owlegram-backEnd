const express = require("express");

const authGuard = require("./../middlewares/authGuard");
const controller = require("./../controllers/user");

const router = express.Router();

router.route("/profile/:username").get(authGuard, controller.findUser);

module.exports = router;
