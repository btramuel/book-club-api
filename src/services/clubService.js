// 
// Purpose
//  Business logic for clubs. This is where ownership checks
//  happen, only the club owner can update or delete their
//  club. Also handles join and leave membership logic.
//
// Functions
//    - createClub: creates a club with the logged-in user as owner
//    - getAllClubs: returns all clubs
//    - getClubById: returns one club or throws if not found
//    - updateClub: only the owner can update
//    - deleteClub: only the owner can delete
//    - joinClub: adds the logged-in user as a member
//    - leaveClub: removes the logged-in user from a club
//

import clubRepository from "../repositories/clubRepository.js";
import {
  ValidationError,
  ForbiddenError,
  NotFoundError,
  ConflictError,
} from "../errors/index.js";

async function createClub(data, userId) {
  if (!data.name) {
    throw new ValidationError("Club name is required.");
  }

  const club = await clubRepository.createClub({
    ...data,
    ownerId: userId,
  });
  return club;
}

async function getAllClubs() {
  const clubs = await clubRepository.findAll();
  return clubs;
}

async function getClubById(id) {
  const club = await clubRepository.findById(id);
  if (!club) {
    throw new NotFoundError("Club not found.");
  }
  return club;
}

async function updateClub(id, data, userId) {
  const club = await clubRepository.findById(id);
  if (!club) {
    throw new NotFoundError("Club not found.");
  }

  // Only the person who created the club can edit it
  if (club.ownerId !== userId) {
    throw new ForbiddenError("Only the club owner can update this club.");
  }

  const updated = await clubRepository.updateClub(id, data);
  return updated;
}

async function deleteClub(id, userId) {
  const club = await clubRepository.findById(id);
  if (!club) {
    throw new NotFoundError("Club not found.");
  }

  if (club.ownerId !== userId) {
    throw new ForbiddenError("Only the club owner can delete this club.");
  }

  await clubRepository.deleteClub(id);
}

async function joinClub(clubId, userId) {
  const club = await clubRepository.findById(clubId);
  if (!club) {
    throw new NotFoundError("Club not found.");
  }

  // Check if they're already a member
  const existing = await clubRepository.findMembership(clubId, userId);
  if (existing) {
    throw new ConflictError("You are already a member of this club.");
  }

  const member = await clubRepository.addMember(clubId, userId);
  return member;
}

async function leaveClub(clubId, userId) {
  const club = await clubRepository.findById(clubId);
  if (!club) {
    throw new NotFoundError("Club not found.");
  }

  // Don't let the owner leave their own club, they should delete it instead
  if (club.ownerId === userId) {
    throw new ForbiddenError(
      "Club owners cannot leave. Delete the club instead.",
    );
  }

  const membership = await clubRepository.findMembership(clubId, userId);
  if (!membership) {
    throw new ForbiddenError("You are not a member of this club.");
  }

  await clubRepository.removeMember(clubId, userId);
}

export default {
  createClub,
  getAllClubs,
  getClubById,
  updateClub,
  deleteClub,
  joinClub,
  leaveClub,
};
