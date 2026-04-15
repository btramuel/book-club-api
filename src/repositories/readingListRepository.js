// ==
// Purpose
//    Handles all database operations for the reading_lists table.
//    Reading lists are nested under clubs — every entry ties a
//    book to a specific club with a status - planned,reading,finished.
//
// 2. Functions
//    - createEntry: adds a book to a club's reading list
//    - findByClub: gets all reading list entries for a club
//    - findById: gets a single entry by its UUID
//    - updateEntry: updates status or dates on an entry
//    - deleteEntry: removes an entry from the list
//

import prisma from "../config/prisma.js";

async function createEntry(data) {
  const entry = await prisma.readingList.create({
    data: {
      clubId: data.clubId,
      bookId: data.bookId,
      status: data.status || "planned",
      startedAt: data.startedAt || null,
      finishedAt: data.finishedAt || null,
    },
    include: {
      book: true,
    },
  });
  return entry;
}

// Get every reading list entry for a specific club
async function findByClub(clubId) {
  const entries = await prisma.readingList.findMany({
    where: { clubId },
    include: {
      book: true,
    },
    orderBy: { createdAt: "desc" },
  });
  return entries;
}

async function findById(id) {
  const entry = await prisma.readingList.findUnique({
    where: { id },
    include: {
      book: true,
      club: true,
    },
  });
  return entry;
}

async function updateEntry(id, data) {
  const entry = await prisma.readingList.update({
    where: { id },
    data,
    include: {
      book: true,
    },
  });
  return entry;
}

async function deleteEntry(id) {
  await prisma.readingList.delete({
    where: { id },
  });
}

export default { createEntry, findByClub, findById, updateEntry, deleteEntry };