// 
// Purpose
//    Handles incoming HTTP requests for club CRUD and membership.
//    Uses req.user.id, set by the auth middleware for ownership
//    and membership checks.
//
// Functions
//    - create: POST /api/clubs
//    - getAll: GET /api/clubs
//    - getById: GET /api/clubs/:id
//    - update: PUT /api/clubs/:id
//    - remove: DELETE /api/clubs/:id
//    - join: POST /api/clubs/:id/join
//    - leave: POST /api/clubs/:id/leave
//
// Error handling
//    Services throw typed errors with a `status` property.
//    The controller forwards that status directly.
//

import clubService from "../services/clubService.js";
import asyncHandler from "../middleware/asyncHandler.js";

async function create(req, res) {
  const club = await clubService.createClub(req.body, req.user.id);
  res.status(201).json(club);
}

async function getAll(req, res) {
  const clubs = await clubService.getAllClubs();
  res.json(clubs);
}

async function getById(req, res) {
  const club = await clubService.getClubById(req.params.id);
  res.json(club);
}

async function update(req, res) {
  const club = await clubService.updateClub(
    req.params.id,
    req.body,
    req.user.id,
  );
  res.json(club);
}

async function remove(req, res) {
  await clubService.deleteClub(req.params.id, req.user.id);
  res.status(204).send();
}

async function join(req, res) {
  const member = await clubService.joinClub(req.params.id, req.user.id);
  res.status(201).json(member);
}

async function leave(req, res) {
  await clubService.leaveClub(req.params.id, req.user.id);
  res.status(204).send();
}

// wrap them all so errors go to the error handler
export default {
  create: asyncHandler(create),
  getAll: asyncHandler(getAll),
  getById: asyncHandler(getById),
  update: asyncHandler(update),
  remove: asyncHandler(remove),
  join: asyncHandler(join),
  leave: asyncHandler(leave),
};