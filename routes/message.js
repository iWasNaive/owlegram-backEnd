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

/**
 * @openapi
 * /message/send:
 *   post:
 *     tags:
 *       - Message
 *     summary: Send a message
 *     security:
 *       - cookieAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               pv:
 *                 type: string
 *               text:
 *                 type: string
 *               image:
 *                 type: array
 *                 items:
 *                   type: string
 *                   format: binary
 *     responses:
 *       201:
 *         description: Message sent
 */
router
  .route("/send")
  .post(authGuard, uploadPost.array("image", 3), controller.create);

/**
 * @openapi
 * /message/get/{pv}:
 *   get:
 *     tags:
 *       - Message
 *     summary: Get messages for a conversation
 *     security:
 *       - cookieAuth: []
 *     parameters:
 *       - in: path
 *         name: pv
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Messages list
 */
router.route("/get/:pv").get(authGuard, controller.getAll);

/**
 * @openapi
 * /message/get-contact:
 *   get:
 *     tags:
 *       - Message
 *     summary: Get contacts
 *     security:
 *       - cookieAuth: []
 *     responses:
 *       200:
 *         description: Contacts list
 */
router.route("/get-contact").get(authGuard, controller.getContacts);

/**
 * @openapi
 * /message/{messageId}:
 *   delete:
 *     tags:
 *       - Message
 *     summary: Delete a message
 *     security:
 *       - cookieAuth: []
 *     parameters:
 *       - in: path
 *         name: messageId
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Message deleted
 *   put:
 *     tags:
 *       - Message
 *     summary: Edit a message
 *     security:
 *       - cookieAuth: []
 *     parameters:
 *       - in: path
 *         name: messageId
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               text:
 *                 type: string
 *     responses:
 *       200:
 *         description: Message updated
 */
router.route("/:messageId").delete(authGuard, controller.remove);
router.route("/:messageId").put(authGuard, controller.edit);

/**
 * @openapi
 * /message/deletePv/{pv}:
 *   delete:
 *     tags:
 *       - Message
 *     summary: Delete entire conversation
 *     security:
 *       - cookieAuth: []
 *     parameters:
 *       - in: path
 *         name: pv
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Conversation deleted
 */
router.route("/deletePv/:pv").delete(authGuard, controller.deletePv);

module.exports = router;
