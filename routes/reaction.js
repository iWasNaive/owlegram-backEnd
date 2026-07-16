const express = require("express");
const controller = require("./../controllers/reaction");
const router = express.Router();

/**
 * @openapi
 * /reaction/add-reaction:
 *   post:
 *     tags:
 *       - Reaction
 *     summary: Add reaction to a message
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               message_id:
 *                 type: integer
 *               emoji:
 *                 type: string
 *     responses:
 *       201:
 *         description: Reaction added
 */
router.route("/add-reaction").post(controller.create);

/**
 * @openapi
 * /reaction/update-reaction:
 *   put:
 *     tags:
 *       - Reaction
 *     summary: Update reaction
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               message_id:
 *                 type: integer
 *               emoji:
 *                 type: string
 *     responses:
 *       200:
 *         description: Reaction updated
 */
router.route("/update-reaction").put(controller.update);

/**
 * @openapi
 * /reaction/delete-reaction:
 *   delete:
 *     tags:
 *       - Reaction
 *     summary: Delete reaction
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               message_id:
 *                 type: integer
 *               emoji:
 *                 type: string
 *     responses:
 *       200:
 *         description: Reaction deleted
 */
router.route("/delete-reaction").delete(controller.delete);

module.exports = router;
