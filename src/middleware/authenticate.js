//
//  1. Purpose
//    Protects routes that require a logged-in user. If the
//    request doesn't have a valid JWT token, it gets rejected
//    before it ever reaches the controller.
//
// 2. How it works
//    - Grab the Authorization header from the request
//    - Check that it starts with "Bearer "
//    - Pull out the token part after "Bearer "
//    - Verify it with the same secret we used to sign it
//    - If valid, attach the user's id to req.user so
//      controllers can use it downstream
//    - If anything goes wrong, send back a 401
//
// 3. Usage
//    Import this and stick it in any route that needs auth:
//    router.get("/profile", authenticate, controller.getProfile)
//

import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "dev-secret-change-me";

function authenticate(req, res, next) {
  const header = req.headers.authorization;

  // No header at all, wont be logged in.
  if (!header || !header.startsWith("Bearer ")) {
    return res.status(401).json({ error: "No token provided. Please log in." });
  }

  // Slice off "Bearer " to get just the token string
  const token = header.slice(7);

  try {
    const decoded = jwt.verify(token, JWT_SECRET);

    // Attach the user info so controllers can access it
    req.user = { id: decoded.id };

    next();
  } catch (err) {
    return res.status(401).json({ error: "Invalid or expired token." });
  }
}

export default authenticate;
