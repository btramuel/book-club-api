# Book Club API

A backend for book club apps. Users can sign up, create or join clubs, and track what their club is reading.

Built for ITIS-4166, Spring 2026.

## Try it

- API: https://book-club-api-3268.onrender.com
- Docs: https://book-club-api-3268.onrender.com/api-docs

It's hosted on Render's free tier, so the first request might take 30 seconds to wake up.

## What it's built with

Node, Express, Postgres, and Prisma. JWTs for auth, bcrypt for passwords. Swagger for the docs.

## What's in it

- **Users** — sign up and log in
- **Books** — anyone can add or edit books in the system
- **Clubs** — anyone can make one, but only the owner can update or delete it. People can join or leave
- **Reading list** — each club tracks what it's planned, reading, or finished

## Running it locally

You'll need Node 20+ and Postgres on your machine.

```bash
npm install
```

Make a `.env` file at the project root:
DATABASE_URL="postgresql://USER:PASSWORD@localhost:5432/bookclub"
JWT_SECRET="any-long-random-string"
PORT=3000

Then set up the database:

```bash
npx prisma migrate dev --name init
npm run seed
```

And start it:

```bash
npm run dev
```

You'll find the API at http://localhost:3000 and the docs at http://localhost:3000/api-docs.

## Test accounts

Three users get created when the database is seeded. Password for all of them is `password123`.

- `alice@example.com` — owns the Sci-Fi Enthusiasts club
- `bob@example.com` — owns the Classic Literature Club
- `charlie@example.com` — just a member, doesn't own anything

## Folder layout
src/
config/         Prisma and Swagger setup
controllers/    Handle the request, hand off to a service
services/       The actual logic
repositories/   Talk to the database
routes/         Express routes with the Swagger comments
middleware/     JWT check and an async error wrapper
errors/         Custom error classes
server.js       Entry point
prisma/
schema.prisma   The data model
seed.js         Sample data, runs on deploy
migrations/     Prisma migrations
