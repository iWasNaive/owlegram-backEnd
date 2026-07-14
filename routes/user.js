const express = require("express");

const authGuard = require("./../middlewares/authGuard");
const controller = require("./../controllers/user");
const { validation } = require("./../middlewares/validation");
const { usernameSchema } = require("../validation/user");
const createUploader = require("./../middlewares/uploader");

const profileUploader = createUploader("profiles", /jpeg|png|jpg|webp/, 2);

const router = express.Router();

router.route("/profile/:username").get(authGuard, controller.findUser);
router.route("/profile").get(authGuard, controller.userProfile);

router
  .route("/update-username")
  .put(authGuard, validation(usernameSchema), controller.updateUsername);
router
  .route("/update-profile")
  .put(authGuard, profileUploader.single("image"), controller.updateProfile);

router.route("/remove-profile").delete(authGuard, controller.removeProfile);

module.exports = router;
