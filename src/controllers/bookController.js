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

async function create(req, res) {
  try {
    const book = await bookService.createBook(req.body);
    res.status(201).json(book);
  } catch (err) {
    if (err.status) {
      return res.status(err.status).json({ error: err.message });
    }
    res.status(500).json({ error: "Failed to create book." });
  }
}

async function getAll(req, res) {
  try {
    const books = await bookService.getAllBooks();
    res.json(books);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch books." });
  }
}

async function getById(req, res) {
  try {
    const book = await bookService.getBookById(req.params.id);
    res.json(book);
  } catch (err) {
    if (err.status) {
      return res.status(err.status).json({ error: err.message });
    }
    res.status(500).json({ error: "Failed to fetch book." });
  }
}

async function update(req, res) {
  try {
    const book = await bookService.updateBook(req.params.id, req.body);
    res.json(book);
  } catch (err) {
    if (err.status) {
      return res.status(err.status).json({ error: err.message });
    }
    res.status(500).json({ error: "Failed to update book." });
  }
}

async function remove(req, res) {
  try {
    await bookService.deleteBook(req.params.id);
    res.status(204).send();
  } catch (err) {
    if (err.status) {
      return res.status(err.status).json({ error: err.message });
    }
    res.status(500).json({ error: "Failed to delete book." });
  }
}

export default { create, getAll, getById, update, remove };