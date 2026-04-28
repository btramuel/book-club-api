// 
// Purpose
//    Business logic for reading list entries. Reading lists are
//    under clubs, you add a book to a club's reading list
//    with a status of planned, reading, or finished. This service
//    validates the status values, checks that the club exists,
//    and enforces membership authorization. Only members
//    of a club can add to, modify, or delete from that club's
//    reading list. Anyone who's logged in can view a club's list.
//
// Functions
//    - addEntry: adds a book to a club's reading list (members only)
//    - getEntriesByClub: returns all entries for a club (any logged in user)
//    - getEntryById: returns one entry (any logged in user)
//    - updateEntry: updates status/dates on an entry (members only)
//    - deleteEntry: removes an entry (members only)
//
// Authorization
//    Write operations (add, update, delete) check that the
//    logged-in user is a member of the club. This prevents
//    random users from messing with a club's reading list.
//    Read operations are open to any authenticated user.
//

import readingListRepository from "../repositories/readingListRepository.js";
import clubRepository from "../repositories/clubRepository.js";
import bookRepository from "../repositories/bookRepository.js";
import {
  ValidationError,
  ForbiddenError,
  NotFoundError,
  ConflictError,
} from "../errors/index.js";

// Only these three values are allowed for status
const VALID_STATUSES = ["planned", "reading", "finished"];

// Helper that checks if a user belongs to a club.
// We call this before any write operation so random
// people can't add or change stuff on a club they're not in.
async function requireMembership(clubId, userId) {
  const membership = await clubRepository.findMembership(clubId, userId);
  if (!membership) {
    throw new ForbiddenError("You must be a member of this club to do that.");
  }
}

async function addEntry(clubId, data, userId) {
  // Make sure the club actually exists
  const club = await clubRepository.findById(clubId);
  if (!club) {
    throw new NotFoundError("Club not found.");
  }

  // Only club members can add books to the reading list
  await requireMembership(clubId, userId);

  // Make sure the book exists too
  const book = await bookRepository.findById(data.bookId);
  if (!book) {
    throw new NotFoundError("Book not found.");
  }

  // Validate status if one was provided
  if (data.status && !VALID_STATUSES.includes(data.status)) {
    throw new ValidationError(
      "Status must be planned, reading, or finished.",
    );
  }

  //prismas throws a error if you try to add the same book twice 
  // to the same club's reading list, so we don't need to check for that here
  try {
  const entry = await readingListRepository.createEntry({
    clubId,
    bookId: data.bookId,
    status: data.status || "planned",
    startedAt: data.startedAt || null,
    finishedAt: data.finishedAt || null,
  });
  return entry;
} catch (err) {
  if (err.code === "P2002") {
    throw new ConflictError (
      "This book is already on the club's reading list.",
    );
  }
  throw err;
 }
} 


async function getEntriesByClub(clubId) {
  // Verify the club exists before querying its reading list
  const club = await clubRepository.findById(clubId);
  if (!club) {
    throw new NotFoundError("Club not found.");
  }

  const entries = await readingListRepository.findByClub(clubId);
  return entries;
}

async function getEntryById(id) {
  const entry = await readingListRepository.findById(id);
  if (!entry) {
    throw new NotFoundError("Reading list entry not found.");
  }
  return entry;
}

async function updateEntry(id, data, userId) {
  const existing = await readingListRepository.findById(id);
  if (!existing) {
    throw new NotFoundError("Reading list entry not found.");
  }

  // Only club members can update entries on their club's list
  await requireMembership(existing.clubId, userId);

  // Validate status if they're trying to change it
  if (data.status && !VALID_STATUSES.includes(data.status)) {
    throw new ValidationError(
      "Status must be planned, reading, or finished.",
    );
  }

  const entry = await readingListRepository.updateEntry(id, data);
  return entry;
}

async function deleteEntry(id, userId) {
  const existing = await readingListRepository.findById(id);
  if (!existing) {
    throw new NotFoundError("Reading list entry not found.");
  }

  // Only club members can remove entries
  await requireMembership(existing.clubId, userId);

  await readingListRepository.deleteEntry(id);
}

export default {
  addEntry,
  getEntriesByClub,
  getEntryById,
  updateEntry,
  deleteEntry,
};
