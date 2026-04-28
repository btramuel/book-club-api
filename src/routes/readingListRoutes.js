// 
// Purpose
//    Defines reading list routes, nested under clubs. These let
//    you add books to a club's reading list, view what the club
//    is reading, update statuses, etc. All routes need auth.
//
//    mergeParams you  mount these directly so we just use
//    the clubId in our own path. 
//
// Routes
//    POST   /clubs/:clubId/reading-list      — add a book
//    GET    /clubs/:clubId/reading-list       — get all entries
//    GET    /clubs/:clubId/reading-list/:id   — get one entry
//    PUT    /clubs/:clubId/reading-list/:id   — update an entry
//    DELETE /clubs/:clubId/reading-list/:id   — remove an entry
//

import { Router } from "express";
import readingListController from "../controllers/readingListController.js";
import authenticate from "../middleware/authenticate.js";

const router = Router();

router.use(authenticate);

/**
 * @swagger
 * /clubs/{clubId}/reading-list:
 *   post:
 *     summary: Add a book to a club's reading list
 *     tags: [Reading List]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: clubId
 *         required: true
 *         schema:
 *           type: string
 *         description: The club's UUID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - bookId
 *             properties:
 *               bookId:
 *                 type: string
 *                 description: UUID of the book to add
 *               status:
 *                 type: string
 *                 enum: [planned, reading, finished]
 *                 default: planned
 *               startedAt:
 *                 type: string
 *                 format: date-time
 *               finishedAt:
 *                 type: string
 *                 format: date-time
 * 
 *     responses:
 *       201:
 *         description: Book added to reading list
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: string
 *                   example: "880e8400-e29b-41d4-a716-446655440000"
 *                 clubId:
 *                   type: string
 *                   example: "660e8400-e29b-41d4-a716-446655440000"
 *                 bookId:
 *                   type: string
 *                   example: "550e8400-e29b-41d4-a716-446655440000"
 *                 status:
 *                   type: string
 *                   example: "planned"
 *                 startedAt:
 *                   type: string
 *                   format: date-time
 *                   nullable: true
 *                   example: null
 *                 finishedAt:
 *                   type: string
 *                   format: date-time
 *                   nullable: true
 *                   example: null
 *                 createdAt:
 *                   type: string
 *                   format: date-time
 *                   example: "2026-04-28T10:30:00.000Z"
 *       400:
 *         description: Invalid status value
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Status must be planned, reading, or finished."
 *       403:
 *         description: Not a member of this club
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "You must be a member of this club to do that."
 *       404:
 *         description: Club or book not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Club not found."
 *       409:
 *         description: Book already on this club's list
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "This book is already on the club's reading list."
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
router.post("/clubs/:clubId/reading-list", readingListController.create);

/**
 * @swagger
 * /clubs/{clubId}/reading-list:
 *   get:
 *     summary: Get all reading list entries for a club
 *     tags: [Reading List]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: clubId
 *         required: true
 *         schema:
 *           type: string
 * 
 *     responses:
 *       200:
 *         description: List of reading list entries with book details
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: string
 *                     example: "880e8400-e29b-41d4-a716-446655440000"
 *                   clubId:
 *                     type: string
 *                     example: "660e8400-e29b-41d4-a716-446655440000"
 *                   bookId:
 *                     type: string
 *                     example: "550e8400-e29b-41d4-a716-446655440000"
 *                   status:
 *                     type: string
 *                     example: "reading"
 *                   startedAt:
 *                     type: string
 *                     format: date-time
 *                     nullable: true
 *                     example: "2026-03-01T00:00:00.000Z"
 *                   finishedAt:
 *                     type: string
 *                     format: date-time
 *                     nullable: true
 *                     example: null
 *                   createdAt:
 *                     type: string
 *                     format: date-time
 *                     example: "2026-04-28T10:30:00.000Z"
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
router.get("/clubs/:clubId/reading-list", readingListController.getByClub);

/**
 * @swagger
 * /clubs/{clubId}/reading-list/{id}:
 *   get:
 *     summary: Get a single reading list entry
 *     tags: [Reading List]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: clubId
 *         required: true
 *         schema:
 *           type: string
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The reading list entry's UUID
 * 
 *     responses:
 *       200:
 *         description: The reading list entry
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: string
 *                   example: "880e8400-e29b-41d4-a716-446655440000"
 *                 clubId:
 *                   type: string
 *                   example: "660e8400-e29b-41d4-a716-446655440000"
 *                 bookId:
 *                   type: string
 *                   example: "550e8400-e29b-41d4-a716-446655440000"
 *                 status:
 *                   type: string
 *                   example: "finished"
 *                 startedAt:
 *                   type: string
 *                   format: date-time
 *                   nullable: true
 *                   example: "2026-01-15T00:00:00.000Z"
 *                 finishedAt:
 *                   type: string
 *                   format: date-time
 *                   nullable: true
 *                   example: "2026-02-28T00:00:00.000Z"
 *                 createdAt:
 *                   type: string
 *                   format: date-time
 *                   example: "2026-04-28T10:30:00.000Z"
 *       404:
 *         description: Entry not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Reading list entry not found."
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
router.get("/clubs/:clubId/reading-list/:id", readingListController.getById);

/**
 * @swagger
 * /clubs/{clubId}/reading-list/{id}:
 *   put:
 *     summary: Update a reading list entry (status, dates)
 *     tags: [Reading List]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: clubId
 *         required: true
 *         schema:
 *           type: string
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
 *               status:
 *                 type: string
 *                 enum: [planned, reading, finished]
 *               startedAt:
 *                 type: string
 *                 format: date-time
 *               finishedAt:
 *                 type: string
 *                 format: date-time
 * 
 *     responses:
 *       200:
 *         description: Entry updated
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: string
 *                   example: "880e8400-e29b-41d4-a716-446655440000"
 *                 clubId:
 *                   type: string
 *                   example: "660e8400-e29b-41d4-a716-446655440000"
 *                 bookId:
 *                   type: string
 *                   example: "550e8400-e29b-41d4-a716-446655440000"
 *                 status:
 *                   type: string
 *                   example: "reading"
 *                 startedAt:
 *                   type: string
 *                   format: date-time
 *                   nullable: true
 *                   example: "2026-04-28T00:00:00.000Z"
 *                 finishedAt:
 *                   type: string
 *                   format: date-time
 *                   nullable: true
 *                   example: null
 *                 createdAt:
 *                   type: string
 *                   format: date-time
 *                   example: "2026-04-28T10:30:00.000Z"
 *       400:
 *         description: Invalid status value
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Status must be planned, reading, or finished."
 *       403:
 *         description: Not a member of this club
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "You must be a member of this club to do that."
 *       404:
 *         description: Entry not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Reading list entry not found."
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
router.put("/clubs/:clubId/reading-list/:id", readingListController.update);

/**
 * @swagger
 * /clubs/{clubId}/reading-list/{id}:
 *   delete:
 *     summary: Remove a book from a club's reading list
 *     tags: [Reading List]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: clubId
 *         required: true
 *         schema:
 *           type: string
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 * 
 *     responses:
 *       204:
 *         description: Entry removed
 *       403:
 *         description: Not a member of this club
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "You must be a member of this club to do that."
 *       404:
 *         description: Entry not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Reading list entry not found."
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
router.delete("/clubs/:clubId/reading-list/:id", readingListController.remove);

export default router;
