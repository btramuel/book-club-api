// 
// Purpose
//    Defines the auth routes, register and login. 
//    These are the only public endpoints, no JWT required. 
//    The Swagger comments above each route tell swagger-jsdoc 
//    how to document them in the /api-docs page.
//
//  Routes
//    POST /auth/register — create a new account
//    POST /auth/login    — log in and get a JWT token
//

import { Router } from "express";
import rateLimit from "express-rate-limit";
import userController from "../controllers/userController.js";

const router = Router();
// stop people from spamming login attempts
// 10 tries per 15 minutes per IP, that should be enough for normal use
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  message: { error: "Too many login attempts. Try again in a bit." },
});

router.use(authLimiter);


/**
 * @swagger
 * /auth/signup:
 *   post:
 *     summary: Create a new user account
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - username
 *               - email
 *               - password
 *             properties:
 *               username:
 *                 type: string
 *                 example: janedoe
 *               email:
 *                 type: string
 *                 example: jane@example.com
 *               password:
 *                 type: string
 *                 example: mypassword123
*     responses:
 *       201:
 *         description: Account created, returns user info and JWT token
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 user:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: string
 *                       example: "550e8400-e29b-41d4-a716-446655440000"
 *                     username:
 *                       type: string
 *                       example: "janedoe"
 *                     email:
 *                       type: string
 *                       example: "jane@example.com"
 *                 token:
 *                   type: string
 *                   example: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
 *       400:
 *         description: Missing required fields
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Username, email, and password are required."
 *       409:
 *         description: Email already in use
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "A user with this email already exists."
 */
router.post("/signup", userController.register);

/**
 * @swagger
 * /auth/login:
 *   post:
 *     summary: Log in with email and password
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *                 example: jane@example.com
 *               password:
 *                 type: string
 *                 example: mypassword123
*     responses:
 *       200:
 *         description: Login successful, returns user info and JWT token
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 user:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: string
 *                       example: "550e8400-e29b-41d4-a716-446655440000"
 *                     username:
 *                       type: string
 *                       example: "alice"
 *                     email:
 *                       type: string
 *                       example: "alice@example.com"
 *                 token:
 *                   type: string
 *                   example: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
 *       400:
 *         description: Missing required fields
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Email and password are required."
 *       401:
 *         description: Invalid email or password
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Invalid email or password."
 */
router.post("/login", userController.login);

export default router;