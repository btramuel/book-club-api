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
 *     responses:
 *       201:
 *         description: Book added to reading list
 *       400:
 *         description: Invalid status value
 *       403:
 *         description: Not a member of this club
 *       404:
 *         description: Club or book not found
 *       409:
 *         description: Book already on this club's list
 *       401:
 *         description: Not authenticated
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
 *     responses:
 *       200:
 *         description: List of reading list entries with book details
 *       404:
 *         description: Club not found
 *       401:
 *         description: Not authenticated
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
 *     responses:
 *       200:
 *         description: The reading list entry
 *       404:
 *         description: Entry not found
 *       401:
 *         description: Not authenticated
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
 *     responses:
 *       200:
 *         description: Entry updated
 *       400:
 *         description: Invalid status value
 *       403:
 *         description: Not a member of this club
 *       404:
 *         description: Entry not found
 *       401:
 *         description: Not authenticated
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
 *     responses:
 *       204:
 *         description: Entry removed
 *       403:
 *         description: Not a member of this club
 *       404:
 *         description: Entry not found
 *       401:
 *         description: Not authenticated
 */
router.delete("/clubs/:clubId/reading-list/:id", readingListController.remove);

export default router;
