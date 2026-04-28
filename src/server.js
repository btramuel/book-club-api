// 
// Purpose
//    The entry point for the whole API. This file creates the
//    Express app, plugs in middleware, mounts all the route
//    files under /api, sets up Swagger docs at /api-docs, and
//    starts listening on the configured port.
//
// How it works
//    - express.json() parses incoming JSON request bodies
//    - cors() restricts which origins can call the API
//    - Each route file gets mounted at its own path
//    - Swagger UI is served at /api-docs
//    - A simple health check at the root so we can verify
//      the server is running on Render
//
// CORS configuration
//    ALLOWED_ORIGINS env var is a comma-separated list of
//    origins allowed to call the API, the fronend should set this to its URL
//    If it's not set, we default to allowing localhost on common
//    dev ports plus same-origin requests (no Origin header), so
//    Swagger UI served from /api-docs works out of the box.
//
// Environment variables
//    PORT             — which port to listen on, default 3000
//    JWT_SECRET       — secret key for signing JWTs
//    DATABASE_URL     — PostgreSQL connection string (Prisma reads this)
//    ALLOWED_ORIGINS  — comma-separated list of allowed CORS origins
//

import express from "express";
import cors from "cors";
import swaggerUi from "swagger-ui-express";
import swaggerSpec from "./config/swagger.js";

// Route imports
import authRoutes from "./routes/authRoutes.js";
import bookRoutes from "./routes/bookRoutes.js";
import clubRoutes from "./routes/clubRoutes.js";
import readingListRoutes from "./routes/readingListRoutes.js";

const app = express();
const PORT = process.env.PORT || 3000;

// --- CORS setup ---

// Build the allow-list from the env var if present, otherwise fall
// back to common localhost ports for dev. Same-origin requests
// (no Origin header) are always allowed so /api-docs works.
const defaultDevOrigins = [
  "http://localhost:3000",
  "http://localhost:5173",
  "http://localhost:8080",
];

const allowedOrigins = process.env.ALLOWED_ORIGINS
  ? process.env.ALLOWED_ORIGINS.split(",").map((o) => o.trim())
  : defaultDevOrigins;

const corsOptions = {
  origin(origin, callback) {
    // No Origin header means same-origin or a tool like curl/Swagger UI
    if (!origin) return callback(null, true);
    if (allowedOrigins.includes(origin)) return callback(null, true);
    return callback(new Error(`Origin ${origin} not allowed by CORS`));
  },
};

// --- Middleware ---

// Parse JSON bodies on every request
app.use(express.json());

// Apply CORS with the rules above
app.use(cors(corsOptions));

// --- Routes ---

// Health check — just confirms the server is alive
app.get("/", (req, res) => {
  res.json({
    message: "Book Club API is running",
    docs: "/api-docs",
  });
});

// Mount the route files under /api
app.use("/api/auth", authRoutes);
app.use("/api/books", bookRoutes);
app.use("/api/clubs", clubRoutes);

// Reading list routes are mounted at /api because the route
// file already includes /clubs/:clubId/reading-list in the paths
app.use("/api", readingListRoutes);

// error handler middleware
// catches errors from the controllers so I don't have to
// write try/catch everywhere
app.use((err, req, res, next) => {
  if (err.status) {
    return res.status(err.status).json({ error: err.message });
  }
  // unknown error, log it and send a generic 500
  console.log("Unexpected error:", err);
  res.status(500).json({ error: "Something went wrong" });
});

// Swagger documentation page
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// --- Start server ---

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`API docs available at http://localhost:${PORT}/api-docs`);
});