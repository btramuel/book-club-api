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

async function register(req, res) {
  try {
    const { username, email, password } = req.body;

    // Quick sanity check before calling the service
    if (!username || !email || !password) {
      return res
        .status(400)
        .json({ error: "Username, email, and password are required." });
    }

    const result = await userService.register({ username, email, password });
    res.status(201).json(result);
  } catch (err) {
    if (err.status) {
      return res.status(err.status).json({ error: err.message });
    }
    res.status(500).json({ error: "Something went wrong during registration." });
  }
}

async function login(req, res) {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res
        .status(400)
        .json({ error: "Email and password are required." });
    }

    const result = await userService.login({ email, password });
    res.json(result);
  } catch (err) {
    if (err.status) {
      return res.status(err.status).json({ error: err.message });
    }
    res.status(500).json({ error: "Something went wrong during login." });
  }
}

export default { register, login };