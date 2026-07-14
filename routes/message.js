const express = require("express");
const controller = require("./../controllers/message");
const authGuard = require("./../middlewares/authGuard");

const uploader = require("./../middlewares/uploader");

const uploadPost = uploader(
  "posts",
  /jpeg|jpg|png|webp|gif|mp4|avi|mov|webm/,
  5,
);

const router = express.Router();

router
  .route("/send")
  .post(authGuard, uploadPost.array("image", 3), controller.create);

router.route("/get/:pv").get(authGuard, controller.getAll);
router.route("/get-contact").get(authGuard, controller.getContacts);
router.route("/:messageId").delete(authGuard, controller.remove);
router.route("/:messageId").put(authGuard, controller.edit);
router.route("/deletePv/:pv").delete(authGuard, controller.deletePv);

module.exports = router;
