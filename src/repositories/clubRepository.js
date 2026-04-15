// 
// Purpose
//    Handles all database operations for the clubs and
//    club_members tables. Full CRUD for clubs, plus
//    join and leave logic for membership.
//
// Functions
//    - createClub: inserts a new club and auto-adds the owner as a member with role "owner"
//    - findAll: returns all clubs with their owner info
//    - findById: returns one club with owner + members
//    - updateClub: updates a club's editable fields
//    - deleteClub: removes a club, cascades to members and reading lists thanks to the schema
//    - addMember: adds a user to a club
//    - removeMember: removes a user from a club
//    - findMembership: checks if a user is already in a club
//

import prisma from "../config/prisma.js";

async function createClub(data) {
  // used a transaction, so that creating the club
  // and adding the owner as a member either both succeed
  // or both fail. No orphaned clubs without an owner member.
  const club = await prisma.$transaction(async (tx) => {
    const newClub = await tx.club.create({
      data: {
        name: data.name,
        description: data.description || null,
        isPrivate: data.isPrivate || false,
        ownerId: data.ownerId,
      },
    });

    // Automatically make the creator a member with "owner" role
    await tx.clubMember.create({
      data: {
        clubId: newClub.id,
        userId: data.ownerId,
        role: "owner",
      },
    });

    return newClub;
  });

  return club;
}

async function findAll() {
  const clubs = await prisma.club.findMany({
    include: {
      owner: {
        select: { id: true, username: true },
      },
      _count: {
        select: { members: true },
      },
    },
    orderBy: { createdAt: "desc" },
  });
  return clubs;
}

async function findById(id) {
  const club = await prisma.club.findUnique({
    where: { id },
    include: {
      owner: {
        select: { id: true, username: true },
      },
      members: {
        include: {
          user: {
            select: { id: true, username: true },
          },
        },
      },
    },
  });
  return club;
}

async function updateClub(id, data) {
  const club = await prisma.club.update({
    where: { id },
    data,
  });
  return club;
}

async function deleteClub(id) {
  await prisma.club.delete({
    where: { id },
  });
}

async function addMember(clubId, userId) {
  const member = await prisma.clubMember.create({
    data: {
      clubId,
      userId,
      role: "member",
    },
  });
  return member;
}

async function removeMember(clubId, userId) {
  await prisma.clubMember.deleteMany({
    where: { clubId, userId },
  });
}

// Check if a user already belongs to a club
async function findMembership(clubId, userId) {
  const membership = await prisma.clubMember.findUnique({
    where: {
      clubId_userId: { clubId, userId },
    },
  });
  return membership;
}

export default {
  createClub,
  findAll,
  findById,
  updateClub,
  deleteClub,
  addMember,
  removeMember,
  findMembership,
};