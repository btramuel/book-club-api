//
// Purpose
//    Handles incoming HTTP requests for user auth, register
//    and login. Pulls data from req.body, passes it to the
//    service layer, and sends back the response. Error handling
//    catches anything the service throws and returns the right
//    status code based on the error type.
//
// Functions
//    - register: POST /api/auth/register
//    - login: POST /api/auth/login
//
// Error handling
//    Services throw typed errors (ValidationError, AuthError,
//    ConflictError, etc.) from src/errors. Each one carries a
//    `status` property, so we just forward it instead of
//    matching on error message strings.
//

import userService from "../services/userService.js";
import asyncHandler from "../middleware/asyncHandler.js";
import { ValidationError } from "../errors/index.js";

async function register(req, res) {
  const { username, email, password } = req.body;

  // Quick sanity check before calling the service
  if (!username || !email || !password) {
    throw new ValidationError("Username, email, and password are required.");
  }

  const result = await userService.register({ username, email, password });
  res.status(201).json(result);
}

async function login(req, res) {
  const { email, password } = req.body;

  if (!email || !password) {
    throw new ValidationError("Email and password are required.");
  }

  const result = await userService.login({ email, password });
  res.json(result);
}

export default {
  register: asyncHandler(register),
  login: asyncHandler(login),
};