const express = require("express");
const router = express.Router();
const controller = require("./../controllers/auth");
const { validation } = require("../middlewares/validation");
const { userSchema } = require("../validation/user");

const uploader = require("./../middlewares/uploader");

const uploadProfile = uploader("profiles", /jpeg|jpg|png|webp/, 2);

/**
 * @openapi
 * /auth/register:
 *   post:
 *     tags:
 *       - Auth
 *     summary: Register a new user
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               username:
 *                 type: string
 *               password:
 *                 type: string
 *               image:
 *                 type: string
 *                 format: binary
 *     responses:
 *       201:
 *         description: User created successfully
 *       400:
 *         description: User already exists or invalid input
 */
router
  .route("/register")
  .post(
    uploadProfile.single("image"),
    validation(userSchema),
    controller.register,
  );

/**
 * @openapi
 * /auth/login:
 *   post:
 *     tags:
 *       - Auth
 *     summary: Login user
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               username:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: Login successful
 *       401:
 *         description: Invalid credentials
 */
router.route("/login").post(validation(userSchema), controller.login);

module.exports = router;
