const express = require("express");

const authGuard = require("./../middlewares/authGuard");
const controller = require("./../controllers/user");
const { validation } = require("./../middlewares/validation");
const { usernameSchema } = require("../validation/user");
const createUploader = require("./../middlewares/uploader");

const profileUploader = createUploader("profiles", /jpeg|png|jpg|webp/, 2);

const router = express.Router();

/**
 * @openapi
 * /user/profile/{username}:
 *   get:
 *     tags:
 *       - User
 *     summary: Get user profile by username
 *     security:
 *       - cookieAuth: []
 *     parameters:
 *       - in: path
 *         name: username
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: User profile found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 user:
 *                   $ref: '#/components/schemas/User'
 */
router.route("/profile/:username").get(authGuard, controller.findUser);

/**
 * @openapi
 * /user/profile:
 *   get:
 *     tags:
 *       - User
 *     summary: Get current user profile
 *     security:
 *       - cookieAuth: []
 *     responses:
 *       200:
 *         description: Current user profile
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 user:
 *                   $ref: '#/components/schemas/User'
 */
router.route("/profile").get(authGuard, controller.userProfile);

/**
 * @openapi
 * /user/update-username:
 *   put:
 *     tags:
 *       - User
 *     summary: Update username
 *     security:
 *       - cookieAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               username:
 *                 type: string
 *     responses:
 *       200:
 *         description: Username updated
 *       400:
 *         description: Invalid username or already taken
 */
router
  .route("/update-username")
  .put(authGuard, validation(usernameSchema), controller.updateUsername);

/**
 * @openapi
 * /user/update-profile:
 *   put:
 *     tags:
 *       - User
 *     summary: Update profile image
 *     security:
 *       - cookieAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               image:
 *                 type: string
 *                 format: binary
 *     responses:
 *       200:
 *         description: Profile updated
 *       400:
 *         description: No image provided
 */
router
  .route("/update-profile")
  .put(authGuard, profileUploader.single("image"), controller.updateProfile);

/**
 * @openapi
 * /user/remove-profile:
 *   delete:
 *     tags:
 *       - User
 *     summary: Remove profile image
 *     security:
 *       - cookieAuth: []
 *     responses:
 *       200:
 *         description: Profile removed
 *       401:
 *         description: Failed to remove profile
 */
router.route("/remove-profile").delete(authGuard, controller.removeProfile);

module.exports = router;
