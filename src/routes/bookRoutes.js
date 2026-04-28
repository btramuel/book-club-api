//
// Purpose
//   Defines all book CRUD routes. Every route here requires
//   a valid JWT token, the authenticate middleware handles that.
//
// Routes
//    POST   /books     — create a new book
//    GET    /books     — get all books
//    GET    /books/:id — get one book by id
//    PUT    /books/:id — update a book
//    DELETE /books/:id — delete a book
//

import { Router } from "express";
import bookController from "../controllers/bookController.js";
import authenticate from "../middleware/authenticate.js";

const router = Router();

// All book routes need auth
router.use(authenticate);

/**
 * @swagger
 * /books:
 *   post:
 *     summary: Create a new book
 *     tags: [Books]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - title
 *               - author
 *             properties:
 *               title:
 *                 type: string
 *                 example: The Great Gatsby
 *               author:
 *                 type: string
 *                 example: F. Scott Fitzgerald
 *               isbn:
 *                 type: string
 *                 example: "9780743273565"
 *               genre:
 *                 type: string
 *                 example: Fiction
 *               pageCount:
 *                 type: integer
 *                 example: 180
 * 
 *     responses:
 *       201:
 *         description: Book created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: string
 *                   example: "550e8400-e29b-41d4-a716-446655440000"
 *                 title:
 *                   type: string
 *                   example: "The Great Gatsby"
 *                 author:
 *                   type: string
 *                   example: "F. Scott Fitzgerald"
 *                 isbn:
 *                   type: string
 *                   example: "9780743273565"
 *                 genre:
 *                   type: string
 *                   example: "Fiction"
 *                 pageCount:
 *                   type: integer
 *                   example: 180
 *                 createdAt:
 *                   type: string
 *                   format: date-time
 *                   example: "2026-04-28T10:30:00.000Z"
 *       400:
 *         description: Missing required fields
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Title and author are required."
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
router.post("/", bookController.create);

/**
 * @swagger
 * /books:
 *   get:
 *     summary: Get all books
 *     tags: [Books]
 *     security:
 *       - bearerAuth: []
 * 
 *     responses:
 *       200:
 *         description: List of all books
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: string
 *                     example: "550e8400-e29b-41d4-a716-446655440000"
 *                   title:
 *                     type: string
 *                     example: "Dune"
 *                   author:
 *                     type: string
 *                     example: "Frank Herbert"
 *                   isbn:
 *                     type: string
 *                     example: "9780441013593"
 *                   genre:
 *                     type: string
 *                     example: "Science Fiction"
 *                   pageCount:
 *                     type: integer
 *                     example: 688
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
router.get("/", bookController.getAll);

/**
 * @swagger
 * /books/{id}:
 *   get:
 *     summary: Get a single book by ID
 *     tags: [Books]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The book's UUID
 * 
 *     responses:
 *       200:
 *         description: The book
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: string
 *                   example: "550e8400-e29b-41d4-a716-446655440000"
 *                 title:
 *                   type: string
 *                   example: "Dune"
 *                 author:
 *                   type: string
 *                   example: "Frank Herbert"
 *                 isbn:
 *                   type: string
 *                   example: "9780441013593"
 *                 genre:
 *                   type: string
 *                   example: "Science Fiction"
 *                 pageCount:
 *                   type: integer
 *                   example: 688
 *                 createdAt:
 *                   type: string
 *                   format: date-time
 *                   example: "2026-04-28T10:30:00.000Z"
 *       404:
 *         description: Book not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Book not found."
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
router.get("/:id", bookController.getById);

/**
 * @swagger
 * /books/{id}:
 *   put:
 *     summary: Update a book
 *     tags: [Books]
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
 *               title:
 *                 type: string
 *               author:
 *                 type: string
 *               isbn:
 *                 type: string
 *               genre:
 *                 type: string
 *               pageCount:
 *                 type: integer
 * 
 *     responses:
 *       200:
 *         description: Book updated
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: string
 *                   example: "550e8400-e29b-41d4-a716-446655440000"
 *                 title:
 *                   type: string
 *                   example: "The Great Gatsby (Updated)"
 *                 author:
 *                   type: string
 *                   example: "F. Scott Fitzgerald"
 *                 isbn:
 *                   type: string
 *                   example: "9780743273565"
 *                 genre:
 *                   type: string
 *                   example: "Classic Fiction"
 *                 pageCount:
 *                   type: integer
 *                   example: 180
 *                 createdAt:
 *                   type: string
 *                   format: date-time
 *                   example: "2026-04-28T10:30:00.000Z"
 *       404:
 *         description: Book not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Book not found."
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
router.put("/:id", bookController.update);

/**
 * @swagger
 * /books/{id}:
 *   delete:
 *     summary: Delete a book
 *     tags: [Books]
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
 *         description: Book deleted
 *       404:
 *         description: Book not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Book not found."
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
router.delete("/:id", bookController.remove);

export default router;