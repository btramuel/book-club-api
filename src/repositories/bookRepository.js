// 
// Purpose
//    Handles all database operations for the books table.
//    Full CRUD — create, read, update, delete.
//
// Functions
//    - createBook: inserts a new book
//    - findAll: returns every book in the table
//    - findById: returns one book by its UUID
//    - updateBook: updates a book's fields
//    - deleteBook: removes a book from the table
//

import prisma from "../config/prisma.js";

async function createBook(data) {
  const book = await prisma.book.create({
    data: {
      title: data.title,
      author: data.author,
      isbn: data.isbn || null,
      genre: data.genre || null,
      pageCount: data.pageCount || null,
    },
  });
  return book;
}

async function findAll() {
  const books = await prisma.book.findMany({
    orderBy: { createdAt: "desc" },
  });
  return books;
}

async function findById(id) {
  const book = await prisma.book.findUnique({
    where: { id },
  });
  return book;
}

async function updateBook(id, data) {
  const book = await prisma.book.update({
    where: { id },
    data,
  });
  return book;
}

async function deleteBook(id) {
  await prisma.book.delete({
    where: { id },
  });
}

export default { createBook, findAll, findById, updateBook, deleteBook };