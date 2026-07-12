const express = require("express");
const controller = require("./../controllers/reaction");
const router = express.Router();

router.route("/add-reaction").post(controller.create);
router.route("/update-reaction").put(controller.update);
router.route("/delete-reaction").delete(controller.delete);

module.exports = router;
