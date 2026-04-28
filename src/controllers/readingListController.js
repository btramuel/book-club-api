// 
// Purpose
//    Handles incoming HTTP requests for reading list CRUD.
//    Reading lists are nested under clubs, so most endpoints
//    include the clubId from the URL params.
//
// Functions
//    - create: POST /api/clubs/:clubId/reading-list
//    - getByClub: GET /api/clubs/:clubId/reading-list
//    - getById: GET /api/clubs/:clubId/reading-list/:id
//    - update: PUT /api/clubs/:clubId/reading-list/:id
//    - remove: DELETE /api/clubs/:clubId/reading-list/:id
//
// Error handling
//    Services throw typed errors with a status property.
//    Plus we still catch Prisma's P2002, unique constraint
//    violation directly here, since that's a DB level error
//    the service layer can't predict cleanly.
//

import readingListService from "../services/readingListService.js";
import asyncHandler from "../middleware/asyncHandler.js";

async function create(req, res) {
  const entry = await readingListService.addEntry(
    req.params.clubId,
    req.body,
    req.user.id,
  );
  res.status(201).json(entry);
}

async function getByClub(req, res) {
  const entries = await readingListService.getEntriesByClub(req.params.clubId);
  res.json(entries);
}

async function getById(req, res) {
  const entry = await readingListService.getEntryById(req.params.id);
  res.json(entry);
}

async function update(req, res) {
  const entry = await readingListService.updateEntry(
    req.params.id,
    req.body,
    req.user.id,
  );
  res.json(entry);
}

async function remove(req, res) {
  await readingListService.deleteEntry(req.params.id, req.user.id);
  res.status(204).send();
}

export default {
  create: asyncHandler(create),
  getByClub: asyncHandler(getByClub),
  getById: asyncHandler(getById),
  update: asyncHandler(update),
  remove: asyncHandler(remove),
};