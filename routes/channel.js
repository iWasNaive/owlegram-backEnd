const express = require("express");
const router = express.Router();
const controller = require("./../controllers/channel");
const authGuard = require("./../middlewares/authGuard");
const { validation } = require("./../middlewares/validation");
const {
  createChannelSchema,
  sendChannelMessageSchema,
  joinChannelSchema,
} = require("./../validation/channel");
const uploader = require("./../middlewares/uploader");

const channelUploader = uploader("profiles", /png|jpg|jpeg|webp/, 2);
const channelMessageUploader = uploader("posts", /png|jpg|jpeg|webp/, 5);

/**
 * @openapi
 * /channel/create:
 *   post:
 *     tags:
 *       - Channel
 *     summary: Create a new channel
 *     security:
 *       - cookieAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               username:
 *                 type: string
 *               is_private:
 *                 type: boolean
 *               bio:
 *                 type: string
 *               image:
 *                 type: string
 *                 format: binary
 *     responses:
 *       201:
 *         description: Channel created successfully
 *       400:
 *         description: Invalid input or username already exists
 */
router
  .route("/create")
  .post(
    authGuard,
    channelUploader.single("image"),
    validation(createChannelSchema),
    controller.create,
  );

/**
 * @openapi
 * /channel/message/send:
 *   post:
 *     tags:
 *       - Channel
 *     summary: Send a message to a channel
 *     security:
 *       - cookieAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               channel_id:
 *                 type: integer
 *               text:
 *                 type: string
 *               parent_id:
 *                 type: integer
 *               is_free:
 *                 type: boolean
 *               image:
 *                 type: array
 *                 items:
 *                   type: string
 *                   format: binary
 *     responses:
 *       201:
 *         description: Message sent successfully
 *       403:
 *         description: Only channel admins can send messages
 */
router
  .route("/message/send")
  .post(
    authGuard,
    channelMessageUploader.array("image", 5),
    validation(sendChannelMessageSchema),
    controller.sendMessage,
  );

/**
 * @openapi
 * /channel/get-admin-channels:
 *   get:
 *     tags:
 *       - Channel
 *     summary: Get channels where user is admin
 *     security:
 *       - cookieAuth: []
 *     responses:
 *       200:
 *         description: List of admin channels
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/AdminChannel'
 */
router.route("/get-admin-channels").get(authGuard, controller.getAdminChannels);

/**
 * @openapi
 * /channel/get-user-channels:
 *   get:
 *     tags:
 *       - Channel
 *     summary: Get all channels user is member of
 *     security:
 *       - cookieAuth: []
 *     responses:
 *       200:
 *         description: List of user channels with roles
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/ChannelMember'
 */
router.route("/get-user-channels").get(authGuard, controller.getUserChannels);

/**
 * @openapi
 * /channel/join:
 *   post:
 *     tags:
 *       - Channel
 *     summary: Join a channel
 *     security:
 *       - cookieAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               channel_id:
 *                 type: integer
 *               private_link:
 *                 type: string
 *     responses:
 *       201:
 *         description: Joined channel successfully
 *       403:
 *         description: Invalid private link
 *       404:
 *         description: Channel not found
 */
router
  .route("/join")
  .post(authGuard, validation(joinChannelSchema), controller.joinChannel);

router.route("/message/:channelId").get(authGuard, controller.getMessages);

/**
 * @openapi
 * /channel/search/{identifier}:
 *   get:
 *     tags:
 *       - Channel
 *     summary: Search channel by username or private_link
 *     security:
 *       - cookieAuth: []
 *     parameters:
 *       - in: path
 *         name: identifier
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Channel found
 */
router.route("/search/:identifier").get(authGuard, controller.searchChannel);

router.get("/info/:id", authGuard, controller.getChannelInfo);

module.exports = router;
