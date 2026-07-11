const express = require("express");
const controller = require("./../controllers/auth");
const { validation } = require("../middlewares/validation");
const { userSchema } = require("../validation/user");

const uploader = require("./../middlewares/uploader");

const uploadProfile = uploader("profiles", /jpeg|jpg|png|webp/, 2); // ۲ مگابایت

const router = express.Router();

router
  .route("/register")
  .post(
    uploadProfile.single("image"),
    validation(userSchema),
    controller.register,
  );

router.route("/login").post(validation(userSchema), controller.login);

module.exports = router;
