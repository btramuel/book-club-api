// 
// Purpose
//    Business logic for user authentication. Sits between
//    the controller and the repository. Handles password
//    hashing and JWT token creation, the controller doesn't
//    need to know about any of that.
//
// Functions
//    - register: hashes password, creates user, returns token
//    - login: checks email + password, returns token if valid
//
// Why passwords are hashed
//    Storing plain text passwords is a terrible idea. If the
//    database ever gets leaked, bcrypt hashing means the actual
//    passwords are still protected. 
//

import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import userRepository from "../repositories/userRepository.js";
import { AuthError, ConflictError } from "../errors/index.js";

const JWT_SECRET = process.env.JWT_SECRET;
const SALT_ROUNDS = 10;

// Helper to create a JWT with the user's inside.
// Expires in 24 hours so users don't stay logged in forever.
function generateToken(user) {
  return jwt.sign({ id: user.id }, JWT_SECRET, { expiresIn: "24h" });
}

async function register(data) {
  // Check if someone already registered with this email
  const existing = await userRepository.findByEmail(data.email);
  if (existing) {
    throw new ConflictError("A user with this email already exists.");
  }

  // Hash the password before storing it
  const passwordHash = await bcrypt.hash(data.password, SALT_ROUNDS);

  const user = await userRepository.createUser({
    username: data.username,
    email: data.email,
    passwordHash,
  });

  const token = generateToken(user);

  // Return user info without the password hash — never send that back
  return {
    user: { id: user.id, username: user.username, email: user.email },
    token,
  };
}

async function login(data) {
  const user = await userRepository.findByEmail(data.email);
  if (!user) {
    throw new AuthError("Invalid email or password.");
  }

  const passwordMatch = await bcrypt.compare(data.password, user.passwordHash);
  if (!passwordMatch) {
    throw new AuthError("Invalid email or password.");
  }

  const token = generateToken(user);

  return {
    user: { id: user.id, username: user.username, email: user.email },
    token,
  };
}
export default { register, login };