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

async function create(req, res) {
  try {
    const entry = await readingListService.addEntry(
      req.params.clubId,
      req.body,
      req.user.id,
    );
    res.status(201).json(entry);
  } catch (err) {
    if (err.status) {
      return res.status(err.status).json({ error: err.message });
    }
    // Prisma throws this when the unique constraint is violated
    // (same book added to the same club twice)
    if (err.code === "P2002") {
      return res
        .status(409)
        .json({ error: "This book is already on the club's reading list." });
    }
    res.status(500).json({ error: "Failed to add reading list entry." });
  }
}

async function getByClub(req, res) {
  try {
    const entries = await readingListService.getEntriesByClub(
      req.params.clubId,
    );
    res.json(entries);
  } catch (err) {
    if (err.status) {
      return res.status(err.status).json({ error: err.message });
    }
    res.status(500).json({ error: "Failed to fetch reading list." });
  }
}

async function getById(req, res) {
  try {
    const entry = await readingListService.getEntryById(req.params.id);
    res.json(entry);
  } catch (err) {
    if (err.status) {
      return res.status(err.status).json({ error: err.message });
    }
    res.status(500).json({ error: "Failed to fetch reading list entry." });
  }
}

async function update(req, res) {
  try {
    const entry = await readingListService.updateEntry(
      req.params.id,
      req.body,
      req.user.id,
    );
    res.json(entry);
  } catch (err) {
    if (err.status) {
      return res.status(err.status).json({ error: err.message });
    }
    res.status(500).json({ error: "Failed to update reading list entry." });
  }
}

async function remove(req, res) {
  try {
    await readingListService.deleteEntry(req.params.id, req.user.id);
    res.status(204).send();
  } catch (err) {
    if (err.status) {
      return res.status(err.status).json({ error: err.message });
    }
    res.status(500).json({ error: "Failed to delete reading list entry." });
  }
}

export default { create, getByClub, getById, update, remove };