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

async function create(req, res) {
  try {
    const club = await clubService.createClub(req.body, req.user.id);
    res.status(201).json(club);
  } catch (err) {
    if (err.status) {
      return res.status(err.status).json({ error: err.message });
    }
    res.status(500).json({ error: "Failed to create club." });
  }
}

async function getAll(req, res) {
  try {
    const clubs = await clubService.getAllClubs();
    res.json(clubs);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch clubs." });
  }
}

async function getById(req, res) {
  try {
    const club = await clubService.getClubById(req.params.id);
    res.json(club);
  } catch (err) {
    if (err.status) {
      return res.status(err.status).json({ error: err.message });
    }
    res.status(500).json({ error: "Failed to fetch club." });
  }
}

async function update(req, res) {
  try {
    const club = await clubService.updateClub(
      req.params.id,
      req.body,
      req.user.id,
    );
    res.json(club);
  } catch (err) {
    if (err.status) {
      return res.status(err.status).json({ error: err.message });
    }
    res.status(500).json({ error: "Failed to update club." });
  }
}

async function remove(req, res) {
  try {
    await clubService.deleteClub(req.params.id, req.user.id);
    res.status(204).send();
  } catch (err) {
    if (err.status) {
      return res.status(err.status).json({ error: err.message });
    }
    res.status(500).json({ error: "Failed to delete club." });
  }
}

async function join(req, res) {
  try {
    const member = await clubService.joinClub(req.params.id, req.user.id);
    res.status(201).json(member);
  } catch (err) {
    if (err.status) {
      return res.status(err.status).json({ error: err.message });
    }
    res.status(500).json({ error: "Failed to join club." });
  }
}

async function leave(req, res) {
  try {
    await clubService.leaveClub(req.params.id, req.user.id);
    res.status(204).send();
  } catch (err) {
    if (err.status) {
      return res.status(err.status).json({ error: err.message });
    }
    res.status(500).json({ error: "Failed to leave club." });
  }
}

export default { create, getAll, getById, update, remove, join, leave };
