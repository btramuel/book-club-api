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
 *     responses:
 *       201:
 *         description: Club created
 *       400:
 *         description: Missing club name
 *       401:
 *         description: Not authenticated
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
 *     responses:
 *       200:
 *         description: List of all clubs with owner info and member counts
 *       401:
 *         description: Not authenticated
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
 *     responses:
 *       200:
 *         description: Club details with member list
 *       404:
 *         description: Club not found
 *       401:
 *         description: Not authenticated
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
 *     responses:
 *       200:
 *         description: Club updated
 *       403:
 *         description: Not the club owner
 *       404:
 *         description: Club not found
 *       401:
 *         description: Not authenticated
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
 *     responses:
 *       204:
 *         description: Club deleted
 *       403:
 *         description: Not the club owner
 *       404:
 *         description: Club not found
 *       401:
 *         description: Not authenticated
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
 *     responses:
 *       201:
 *         description: Joined the club
 *       409:
 *         description: Already a member
 *       404:
 *         description: Club not found
 *       401:
 *         description: Not authenticated
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
 *     responses:
 *       204:
 *         description: Left the club
 *       403:
 *         description: Cannot leave (owner or not a member)
 *       404:
 *         description: Club not found
 *       401:
 *         description: Not authenticated
 */
router.post("/:id/leave", clubController.leave);

export default router;
