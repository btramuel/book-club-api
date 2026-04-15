// 
// Purpose
//    Handles all database operations for the users table. this is the only layer that touches 
//    Prisma directly for user data. Services call these functions instead
//    of writing queries themselves.
//
// Functions
//    - createUser: inserts a new user row
//    - findByEmail: looks up a user by email (for login)
//    - findById: looks up a user by their UUID (for profile stuff)
//
// 

import prisma from "../config/prisma.js";

// Create a new user row in the database
async function createUser(data) {
  const user = await prisma.user.create({
    data: {
      username: data.username,
      email: data.email,
      passwordHash: data.passwordHash,
    },
  });
  return user;
}

// Find a user by email, used during login to check credentials
async function findByEmail(email) {
  const user = await prisma.user.findUnique({
    where: { email },
  });
  return user;
}

// Find a user by their id, used when you need profile info
async function findById(id) {
  const user = await prisma.user.findUnique({
    where: { id },
  });
  return user;
}

export default { createUser, findByEmail, findById };