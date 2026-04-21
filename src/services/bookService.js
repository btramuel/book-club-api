//
// Purpose
//    Business logic for books. Pretty thin right now since
//    books don't have rules mostly just passes things through to the repository. 
//    But having this layer means we can add extra logic later without
//    touching the controller or repository.
//
// Functions
//    - createBook: validates required fields, then creates
//    - getAllBooks: returns all books
//    - getBookById: returns one book or throws if not found
//    - updateBook: updates a book, throws NotFoundError if missing
//    - deleteBook: deletes a book, throws NotFoundError if missing
//
// Note on update/delete
//    Prisma throws a "record not found" error when you try to
//    update or delete a row that doesn't exist. Catching that
//    means we don't have to do an extra findById query first.
//

import bookRepository from "../repositories/bookRepository.js";
import { ValidationError, NotFoundError } from "../errors/index.js";

async function createBook(data) {
  // Title and author are required, catch it here before
  // it hits the database and throws a cryptic Prisma error
  if (!data.title || !data.author) {
    throw new ValidationError("Title and author are required.");
  }

  const book = await bookRepository.createBook(data);
  return book;
}

async function getAllBooks() {
  const books = await bookRepository.findAll();
  return books;
}

async function getBookById(id) {
  const book = await bookRepository.findById(id);
  if (!book) {
    throw new NotFoundError("Book not found.");
  }
  return book;
}

async function updateBook(id, data) {
  try {
    const book = await bookRepository.updateBook(id, data);
    return book;
  } catch (err) {
    // Prisma's "record to update not found" error
    if (err.code === "P2025") {
      throw new NotFoundError("Book not found.");
    }
    throw err;
  }
}

async function deleteBook(id) {
  try {
    await bookRepository.deleteBook(id);
  } catch (err) {
    if (err.code === "P2025") {
      throw new NotFoundError("Book not found.");
    }
    throw err;
  }
}

export default { createBook, getAllBooks, getBookById, updateBook, deleteBook };
