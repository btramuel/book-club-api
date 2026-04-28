// 
// Purpose
//    Handles incoming HTTP requests for book CRUD operations.
//    Each function maps to one endpoint. Pulls data from the
//    request, hands it to the service, and sends back JSON.
//
// Functions
//    - create: POST /api/books
//    - getAll: GET /api/books
//    - getById: GET /api/books/:id
//    - update: PUT /api/books/:id
//    - remove: DELETE /api/books/:id
//
// Error handling
//    Services throw typed errors with a status property.
//    The controller forwards that status directly.
//

import bookService from "../services/bookService.js";
import asyncHandler from "../middleware/asyncHandler.js";

async function create(req, res) {
  const book = await bookService.createBook(req.body);
  res.status(201).json(book);
}

async function getAll(req, res) {
  const books = await bookService.getAllBooks();
  res.json(books);
}

async function getById(req, res) {
  const book = await bookService.getBookById(req.params.id);
  res.json(book);
}

async function update(req, res) {
  const book = await bookService.updateBook(req.params.id, req.body);
  res.json(book);
}

async function remove(req, res) {
  await bookService.deleteBook(req.params.id);
  res.status(204).send();
}

// wrap them all so errors go to the error handler
export default {
  create: asyncHandler(create),
  getAll: asyncHandler(getAll),
  getById: asyncHandler(getById),
  update: asyncHandler(update),
  remove: asyncHandler(remove),
};