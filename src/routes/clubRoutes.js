// 
// Purpose
//    Defines all club routes including CRUD and membership, join/leave. All routes require auth.
//
// Routes
//    POST   /clubs          — create a new club
//    GET    /clubs          — get all clubs
//    GET    /clubs/:id      — get one club with members
//    PUT    /clubs/:id      — update a club (owner only)
//    DELETE /clubs/:id      — delete a club (owner only)
//    POST   /clubs/:id/join  — join a club
//    POST   /clubs/:id/leave — leave a club
//

import { Router } from "express";
import clubController from "../controllers/clubController.js";
import authenticate from "../middleware/authenticate.js";

const router = Router();

router.use(authenticate);

/**
 * @swagger
 * /clubs:
 *   post:
 *     summary: Create a new club
 *     tags: [Clubs]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *             properties:
 *               name:
 *                 type: string
 *                 example: Sci-Fi Readers
 *               description:
 *                 type: string
 *                 example: A club for sci-fi fans
 *               isPrivate:
 *                 type: boolean
 *                 example: false
 *   
 *     responses:
 *       201:
 *         description: Club created
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: string
 *                   example: "660e8400-e29b-41d4-a716-446655440000"
 *                 name:
 *                   type: string
 *                   example: "Sci-Fi Readers"
 *                 description:
 *                   type: string
 *                   example: "A club for sci-fi fans"
 *                 isPrivate:
 *                   type: boolean
 *                   example: false
 *                 ownerId:
 *                   type: string
 *                   example: "550e8400-e29b-41d4-a716-446655440000"
 *                 createdAt:
 *                   type: string
 *                   format: date-time
 *                   example: "2026-04-28T10:30:00.000Z"
 *       400:
 *         description: Missing club name
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Club name is required."
 *       401:
 *         description: Not authenticated
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "No token provided. Please log in."
 */
router.post("/", clubController.create);

/**
 * @swagger
 * /clubs:
 *   get:
 *     summary: Get all clubs
 *     tags: [Clubs]
 *     security:
 *       - bearerAuth: []
 *
 *     responses:
 *       200:
 *         description: List of all clubs with owner info and member counts
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: string
 *                     example: "660e8400-e29b-41d4-a716-446655440000"
 *                   name:
 *                     type: string
 *                     example: "Sci-Fi Enthusiasts"
 *                   description:
 *                     type: string
 *                     example: "We read sci-fi and talk about it."
 *                   isPrivate:
 *                     type: boolean
 *                     example: false
 *                   ownerId:
 *                     type: string
 *                     example: "550e8400-e29b-41d4-a716-446655440000"
 *                   createdAt:
 *                     type: string
 *                     format: date-time
 *                     example: "2026-04-28T10:30:00.000Z"
 *       401:
 *         description: Not authenticated
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "No token provided. Please log in."
 */
router.get("/", clubController.getAll);

/**
 * @swagger
 * /clubs/{id}:
 *   get:
 *     summary: Get a single club with its members
 *     tags: [Clubs]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *
 *     responses:
 *       200:
 *         description: Club details with member list
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: string
 *                   example: "660e8400-e29b-41d4-a716-446655440000"
 *                 name:
 *                   type: string
 *                   example: "Sci-Fi Enthusiasts"
 *                 description:
 *                   type: string
 *                   example: "We read sci-fi and talk about it."
 *                 isPrivate:
 *                   type: boolean
 *                   example: false
 *                 ownerId:
 *                   type: string
 *                   example: "550e8400-e29b-41d4-a716-446655440000"
 *                 createdAt:
 *                   type: string
 *                   format: date-time
 *                   example: "2026-04-28T10:30:00.000Z"
 *       404:
 *         description: Club not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Club not found."
 *       401:
 *         description: Not authenticated
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "No token provided. Please log in."
 */
router.get("/:id", clubController.getById);

/**
 * @swagger
 * /clubs/{id}:
 *   put:
 *     summary: Update a club (owner only)
 *     tags: [Clubs]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               description:
 *                 type: string
 *               isPrivate:
 *                 type: boolean
 * 
 *     responses:
 *       200:
 *         description: Club updated
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: string
 *                   example: "660e8400-e29b-41d4-a716-446655440000"
 *                 name:
 *                   type: string
 *                   example: "Sci-Fi Enthusiasts (Updated)"
 *                 description:
 *                   type: string
 *                   example: "Now also reading fantasy"
 *                 isPrivate:
 *                   type: boolean
 *                   example: true
 *                 ownerId:
 *                   type: string
 *                   example: "550e8400-e29b-41d4-a716-446655440000"
 *                 createdAt:
 *                   type: string
 *                   format: date-time
 *                   example: "2026-04-28T10:30:00.000Z"
 *       403:
 *         description: Not the club owner
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Only the club owner can update this club."
 *       404:
 *         description: Club not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Club not found."
 *       401:
 *         description: Not authenticated
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "No token provided. Please log in."
 */
router.put("/:id", clubController.update);

/**
 * @swagger
 * /clubs/{id}:
 *   delete:
 *     summary: Delete a club (owner only)
 *     tags: [Clubs]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 * 
 *     responses:
 *       204:
 *         description: Club deleted
 *       403:
 *         description: Not the club owner
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Only the club owner can delete this club."
 *       404:
 *         description: Club not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Club not found."
 *       401:
 *         description: Not authenticated
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "No token provided. Please log in."
 */
router.delete("/:id", clubController.remove);

/**
 * @swagger
 * /clubs/{id}/join:
 *   post:
 *     summary: Join a club
 *     tags: [Clubs]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 * 
 *     responses:
 *       201:
 *         description: Joined the club
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: string
 *                   example: "770e8400-e29b-41d4-a716-446655440000"
 *                 clubId:
 *                   type: string
 *                   example: "660e8400-e29b-41d4-a716-446655440000"
 *                 userId:
 *                   type: string
 *                   example: "550e8400-e29b-41d4-a716-446655440000"
 *                 role:
 *                   type: string
 *                   example: "member"
 *                 joinedAt:
 *                   type: string
 *                   format: date-time
 *                   example: "2026-04-28T10:30:00.000Z"
 *       409:
 *         description: Already a member
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "You are already a member of this club."
 *       404:
 *         description: Club not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Club not found."
 *       401:
 *         description: Not authenticated
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "No token provided. Please log in."
 */
router.post("/:id/join", clubController.join);

/**
 * @swagger
 * /clubs/{id}/leave:
 *   post:
 *     summary: Leave a club
 *     tags: [Clubs]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 * 
 *     responses:
 *       204:
 *         description: Left the club
 *       403:
 *         description: Cannot leave (owner or not a member)
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Club owners cannot leave. Delete the club instead."
 *       404:
 *         description: Club not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Club not found."
 *       401:
 *         description: Not authenticated
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "No token provided. Please log in."
 */
router.post("/:id/leave", clubController.leave);

export default router;
