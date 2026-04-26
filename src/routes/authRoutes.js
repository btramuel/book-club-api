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
import userController from "../controllers/userController.js";

const router = Router();

/**
 * @swagger
 * /auth/register:
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
 *       400:
 *         description: Missing required fields
 *       409:
 *         description: Email already in use
 */
router.post("/register", userController.register);

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
 *       400:
 *         description: Missing required fields
 *       401:
 *         description: Invalid email or password
 */
router.post("/login", userController.login);

export default router;